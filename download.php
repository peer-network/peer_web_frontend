<?php
/**
 * Hardened download proxy. Replaces the previous SSRF-vulnerable
 * `readfile($_GET['file'])` with:
 *
 *   - HTTPS-only (any other scheme rejected)
 *   - Host allow-list (env DOWNLOAD_ALLOWED_HOSTS, csv; defaults
 *     to media.peerapp.eu, cdn.peerapp.eu, media.peernetwork.eu,
 *     media.getpeer.eu)
 *   - Size cap (env DOWNLOAD_MAX_BYTES, default 256 MiB) — checked
 *     against Content-Length pre-stream and against bytes-read
 *     mid-stream
 *   - Connect + total timeout (env DOWNLOAD_TIMEOUT_SECS, default 300)
 *   - Userinfo URLs rejected
 *   - Filename sanitisation: strips `/`, `\`, `..`, control chars
 *   - Hard-codes Content-Type: application/octet-stream and
 *     X-Content-Type-Options: nosniff
 *
 * Operational note: nginx / Cloudflare must rate-limit `/download`
 * before this script — there is no application-level limiter here.
 *
 * Mirrors the Leptos SSR replacement at
 * `peer_web_frontend/src/server/download.rs` on the spike branch.
 * When that ships in production, this file can be retired.
 */

if (!isset($_GET['file'])) {
    http_response_code(400);
    exit('Missing file parameter.');
}

$fileUrl = $_GET['file'];

// ---- 1. Parse + scheme + userinfo guard ----
$parts = parse_url($fileUrl);
if ($parts === false || empty($parts['scheme']) || empty($parts['host'])) {
    http_response_code(400);
    exit('Malformed URL.');
}
if (strtolower($parts['scheme']) !== 'https') {
    http_response_code(400);
    exit('Only HTTPS URLs are permitted.');
}
if (!empty($parts['user']) || !empty($parts['pass'])) {
    http_response_code(400);
    exit('URL userinfo is not permitted.');
}

// ---- 2. Host allow-list ----
$defaultHosts = 'media.peerapp.eu,cdn.peerapp.eu,media.peernetwork.eu,media.getpeer.eu';
$allowedRaw = getenv('DOWNLOAD_ALLOWED_HOSTS');
$allowedHosts = array_filter(array_map(
    fn($h) => strtolower(trim($h)),
    explode(',', $allowedRaw !== false ? $allowedRaw : $defaultHosts)
));
$host = strtolower($parts['host']);
if (!in_array($host, $allowedHosts, true)) {
    http_response_code(403);
    exit('Host not in allow-list.');
}

// ---- 3. Size + timeout caps ----
$maxBytesRaw = getenv('DOWNLOAD_MAX_BYTES');
$maxBytes = (int)($maxBytesRaw !== false ? $maxBytesRaw : (256 * 1024 * 1024));
$timeoutRaw = getenv('DOWNLOAD_TIMEOUT_SECS');
$timeoutSecs = (int)($timeoutRaw !== false ? $timeoutRaw : 300);

// ---- 4. Filename sanitisation ----
$rawFilename = basename($parts['path'] ?? '') ?: 'download.bin';
$filename = preg_replace('/[\x00-\x1f\\\\\\/]/', '', $rawFilename);
$filename = ltrim($filename, '.');
if ($filename === '' || $filename === '.' || $filename === '..') {
    $filename = 'download.bin';
}
if (strlen($filename) > 200) {
    $filename = substr($filename, 0, 200);
}

// ---- 5. HEAD-then-GET to enforce Content-Length pre-stream. ----
$headCtx = stream_context_create([
    'http' => [
        'method' => 'HEAD',
        'timeout' => $timeoutSecs,
        'follow_location' => 0, // No redirect chasing — would bypass allow-list.
        'ignore_errors' => true,
    ],
]);
@get_headers($fileUrl, false, $headCtx); // populates $http_response_header
if (isset($http_response_header)) {
    foreach ($http_response_header as $h) {
        if (preg_match('/^content-length:\s*(\d+)/i', $h, $m)) {
            if ((int)$m[1] > $maxBytes) {
                http_response_code(413);
                exit('Content too large.');
            }
        }
    }
}

// ---- 6. Stream with byte counter. ----
$ctx = stream_context_create([
    'http' => [
        'method' => 'GET',
        'timeout' => $timeoutSecs,
        'follow_location' => 0,
        'ignore_errors' => true,
    ],
]);
$in = @fopen($fileUrl, 'rb', false, $ctx);
if ($in === false) {
    http_response_code(502);
    exit('Upstream unavailable.');
}

header('Content-Type: application/octet-stream');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-store');
header('Content-Disposition: attachment; filename="' . addcslashes($filename, '"\\') . '"');

$readSoFar = 0;
while (!feof($in)) {
    $chunk = fread($in, 8192);
    if ($chunk === false || $chunk === '') {
        break;
    }
    $readSoFar += strlen($chunk);
    if ($readSoFar > $maxBytes) {
        // Mid-stream cap exceeded — abort cleanly.
        fclose($in);
        // Headers already sent; just stop writing.
        exit;
    }
    echo $chunk;
}
fclose($in);
exit;
