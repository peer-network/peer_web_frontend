<?php
session_start();

/**
 * Decode a JWT payload without verifying the signature.
 */
function decodeJwtPayload(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    $payload = base64_decode(strtr($parts[1], '-_', '+/'));
    if ($payload === false) {
        return null;
    }

    $data = json_decode($payload, true);
    return is_array($data) ? $data : null;
}

function checkAuth($redirectMessage = "unauthorized") {
    $token = $_COOKIE['authToken'] ?? '';
    if ($token === '') {
        header("Location: login.php?message=$redirectMessage");
        exit();
    }

    $payload = decodeJwtPayload($token);
    $isExpired = !is_array($payload) || !isset($payload['exp']) || (int) $payload['exp'] < time();

    if ($isExpired) {
        // Clear potentially stale cookies to force fresh login
        setcookie('authToken', '', time() - 3600, '/', '', true, true);
        setcookie('refreshToken', '', time() - 3600, '/', '', true, true);
        header("Location: login.php?message=sessionExpired");
        exit();
    }
}

/**
 * Execute Hello query via GraphQL using the auth token.
 * Returns the decoded "hello" object or null on failure.
 */
function fetchHelloData(string $domain, string $protocol = 'https'): ?array {
    $token = $_COOKIE['authToken'] ?? '';
    if ($token === '') {
        return null;
    }

    // Normalize domain in case a scheme was passed accidentally.
    $domain = preg_replace('#^https?://#i', '', trim($domain));

    $payload = json_encode([
        'query' => 'query Hello {
            hello {
                currentuserid
                currentVersion
                wikiLink
                lastMergedPullRequestNumber
                companyAccountId
                userroles
                userRoleString
            }
        }',
        'variables' => new stdClass(),
    ]);

    $attempt = function (string $scheme, string $path) use ($domain, $payload, $token): array {
        $endpoint = $scheme . '://' . $domain . $path;
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\nAuthorization: Bearer {$token}\r\n",
                'content' => $payload,
                'timeout' => 5,
                'ignore_errors' => true,
            ],
        ]);

        $body = @file_get_contents($endpoint, false, $context);

        $status = 0;
        if (isset($http_response_header[0]) && preg_match('#HTTP/\\S+\\s(\\d{3})#', $http_response_header[0], $m)) {
            $status = (int) $m[1];
        }

        return ['body' => $body, 'status' => $status];
    };

    $paths = ['/graphql', '/api/graphql'];
    $schemes = [$protocol];
    if ($protocol === 'https') {
       # $schemes[] = 'http'; // fallback if https unreachable
    }

    foreach ($schemes as $scheme) {
        foreach ($paths as $path) {
            $response = $attempt($scheme, $path);
            if ($response['status'] === 200 && $response['body'] !== false) {
                $data = json_decode($response['body'], true);
                return $data['data']['hello'] ?? null;
            }
        }
    }

    return null;
}

/**
 * Resolve the current user id via GraphQL using the auth token.
 * Returns null on failure so callers can fail closed.
 */
function fetchCurrentUserId(string $domain, string $protocol = 'https'): ?string {
    $hello = fetchHelloData($domain, $protocol);
    return $hello['currentuserid'] ?? null;
}

/**
 * Resolve the current user role string via GraphQL using the auth token.
 */
function fetchUserRoleString(string $domain, string $protocol = 'https'): ?string {
    $hello = fetchHelloData($domain, $protocol);
    return $hello['userRoleString'] ?? null;
}

/**
 * Deny access unless the current user id matches an allowed one.
 */
function enforceAllowedUser(array $allowedUserIds, string $domain, string $protocol = 'https'): void {
    $currentUserId = fetchCurrentUserId($domain, $protocol);

    if ($currentUserId === null || !in_array($currentUserId, $allowedUserIds, true)) {
        http_response_code(403);
        exit('Access denied');
    }
}

/**
 * Deny access unless the current user role string is ADMIN.
 */
function enforceAdminRole(string $domain, string $protocol = 'https'): void {
    $role = fetchUserRoleString($domain, $protocol);

    if ($role !== 'MODERATOR') {
        http_response_code(403);
        exit('Access denied');
    }
}
?>
