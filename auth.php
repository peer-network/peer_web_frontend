<?php
session_start();
require_once 'host.php';

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

/**
 * Build a shared GraphQL request payload.
 */
function graphqlRequest(string $domain, string $protocol, string $query, array $variables = [], array $headers = []): ?array {
    $normalizedDomain = preg_replace('#^https?://#i', '', trim($domain));
    $endpoint = $protocol . '://' . $normalizedDomain . '/graphql';

    $payload = json_encode([
        'query' => $query,
        'variables' => $variables ?: new stdClass(),
    ]);

    $headerString = "Content-Type: application/json\r\n";
    foreach ($headers as $name => $value) {
        $headerString .= $name . ': ' . $value . "\r\n";
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => $headerString,
            'content' => $payload,
            'timeout' => 8,
            'ignore_errors' => true,
        ],
    ]);

    $body = @file_get_contents($endpoint, false, $context);
    if ($body === false) {
        return null;
    }

    return json_decode($body, true);
}

/**
 * Store auth and helper cookies with optional long-term expiry.
 */
function setAuthCookies(string $accessToken, string $refreshToken, bool $rememberMe, ?string $email = null, ?string $password = null): void {
    // M12 (Plan v2): three changes from the previous Phase-1 cookie code.
    //
    //   1. `httponly = true` — JS no longer reads `authToken`. Closes the
    //      XSS-takeover path; previously a single XSS exfiltrated the
    //      session token.
    //   2. Remember-me expiry math fixed. Previous `time() + (60)` was
    //      60 SECONDS, not 10 years (the comment admitted the operand
    //      tail was missing). Now `time() + (60*60*24*365)` = 1 year.
    //   3. The plaintext `userPassword` cookie is no longer written
    //      under any circumstance. Remember-me used to round-trip the
    //      password by replaying the Login mutation; that's now the
    //      `attemptTokenRefresh` path only — refresh tokens are the
    //      durable credential.
    //
    // The `$password` parameter is intentionally ignored; the signature
    // is preserved so existing call-sites compile, but every caller
    // should drop it on a follow-up cleanup.
    $expiry = $rememberMe ? time() + (60 * 60 * 24 * 365) : 0;
    $options = [
        'expires' => $expiry,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict',
    ];

    setcookie('authToken', $accessToken, $options);
    setcookie('refreshToken', $refreshToken, $options);
    setcookie('rememberMe', $rememberMe ? 'true' : 'false', $options);

    if ($email !== null) {
        setcookie('userEmail', $email, $options);
    }
    // Note: `userPassword` cookie write is intentionally removed.
    // See the comment block at the top of this function.
    unset($password); // Silence unused-param tooling.
}

/**
 * Remove all auth related cookies.
 */
function clearAuthCookies(): void {
    // Includes `userPassword` in the kill-list to scrub stale plaintext
    // cookies left over from before M12 — anyone who was logged in with
    // remember-me prior to this commit will have one in their browser.
    $names = ['authToken', 'refreshToken', 'rememberMe', 'userEmail', 'userPassword'];
    $options = [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict',
    ];
    foreach ($names as $name) {
        setcookie($name, '', $options);
    }
}

/**
 * Try to refresh tokens using the refreshToken cookie.
 */
function attemptTokenRefresh(string $refreshToken, string $domain, string $protocol = 'https'): ?array {
    $query = '
        mutation RefreshToken($refreshToken: String!) {
            refreshToken(refreshToken: $refreshToken) {
                status
                ResponseCode
                accessToken
                refreshToken
            }
        }';

    $data = graphqlRequest($domain, $protocol, $query, ['refreshToken' => $refreshToken]);
    if (!is_array($data)) {
        return null;
    }

    $result = $data['data']['refreshToken'] ?? null;

    if (!is_array($result) || $result['status'] !== 'success' || empty($result['accessToken']) || empty($result['refreshToken'])) {
        return null;
    }

    return [
        'authToken' => $result['accessToken'],
        'refreshToken' => $result['refreshToken'],
    ];
}

/**
 * Fallback login using stored email/password cookies.
 */
function attemptPasswordLogin(string $email, string $password, string $domain, string $protocol = 'https'): ?array {
    if ($email === '' || $password === '') {
        return null;
    }

    $query =
        'mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                status
                ResponseCode
                accessToken
                refreshToken
            }
        }';

    $data = graphqlRequest($domain, $protocol, $query, ['email' => $email, 'password' => $password]);
    if (!is_array($data)) {
        return null;
    }

    $result = $data['data']['login'] ?? null;

    if (!is_array($result) || $result['status'] !== 'success' || empty($result['accessToken']) || empty($result['refreshToken'])) {
        return null;
    }

    return [
        'authToken' => $result['accessToken'],
        'refreshToken' => $result['refreshToken'],
    ];
}

function checkAuth($redirectMessage = "unauthorized") {
    global $domain, $protocol;

    $token = $_COOKIE['authToken'] ?? '';
    $payload = $token !== '' ? decodeJwtPayload($token) : null;
    $isExpired = !is_array($payload) || !isset($payload['exp']) || (int) $payload['exp'] < time();
    $temP = (int) $payload['exp'] - time();
    // Token still valid - proceed.
    if ($token !== '' && !$isExpired) {
        return;
    }

    $refreshToken = $_COOKIE['refreshToken'] ?? '';
    $rememberMe = ($_COOKIE['rememberMe'] ?? '') === 'true';
    $email = $_COOKIE['userEmail'] ?? '';
    $password = $_COOKIE['userPassword'] ?? '';

    // Attempt silent refresh first.
    if ($refreshToken !== '') {
        $refreshed = attemptTokenRefresh($refreshToken, $domain ?? ($_SERVER['HTTP_HOST'] ?? ''), $protocol ?? 'https');
        if ($refreshed !== null) {
            setAuthCookies($refreshed['authToken'], $refreshed['refreshToken'], $rememberMe, $email, $password !== '' ? $password : null);
            return;
        }
    }

    // Fallback to stored credentials when available.
    if ($rememberMe && $email !== '' && $password !== '') {
        $login = attemptPasswordLogin($email, $password, $domain ?? ($_SERVER['HTTP_HOST'] ?? ''), $protocol ?? 'https');
        if ($login !== null) {
            setAuthCookies($login['authToken'], $login['refreshToken'], true, $email, $password);
            return;
        }
    }

    clearAuthCookies();
    header("Location: login.php?message=$redirectMessage");
    exit();
}
     

/**
 * Execute Hello query via GraphQL using the auth token.
 * Returns the decoded "hello" object or null on failure.
 */
function fetchHelloData(string $domain, string $protocol = 'https'): ?array {
    
    $token = $_COOKIE['authToken'] ?? '';
    if ($token == '') {
        return null;
    }
    //$domain='getpeer.eu';

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
    

    $attempt = function (string $scheme, string $path) use ($domain, $payload, $token): ?array {
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
           
       
        $data = json_decode($body, true);

        // Check if API returned { "error": "Invalid Access Token" }
        if (!empty($data['error']) && $data['error'] === 'Invalid Access Token') {
            return null;
        }


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
            if ($response !== null && $response['status'] === 200 && $response['body'] !== false) {
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
    // M12 (Plan v2): widened to also admit ADMIN / SUPER_ADMIN /
    // SUPER_MODERATOR. The previous `!== 'MODERATOR'` check let only
    // moderators through despite the function being named `enforceAdminRole`,
    // which means real admins were locked out of the moderation panel.
    // Peergamma's `is_admin()` and `is_moderator()` both grant access to
    // moderation endpoints; mirroring that union here.
    $role = strtoupper((string)fetchUserRoleString($domain, $protocol));
    $allowed = ['MODERATOR', 'SUPER_MODERATOR', 'ADMIN', 'SUPER_ADMIN'];
    if (!in_array($role, $allowed, true)) {
        http_response_code(403);
        exit('Access denied');
    }
}

/* ---------------------------------------------------
   Initialize global role once per request
--------------------------------------------------- */
$role = fetchUserRoleString($domain);
$GLOBALS["userRole"] = strtoupper($role !== null ? $role : "GUEST");

function isModerator(): bool {
    return isset($GLOBALS["userRole"]) && $GLOBALS["userRole"] === "MODERATOR";
}

?>
