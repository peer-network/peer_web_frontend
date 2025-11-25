<?php
session_start();

function checkAuth($redirectMessage = "unauthorized") {
    if (!isset($_COOKIE['authToken']) || empty($_COOKIE['authToken'])) {
        header("Location: login.php?message=$redirectMessage");
        exit();
    }
}

/**
 * Resolve the current user id via GraphQL using the auth token.
 * Returns null on failure so callers can fail closed.
 */
function fetchCurrentUserId(string $domain): ?string {
    $token = $_COOKIE['authToken'] ?? '';
    if ($token === '') {
        return null;
    }

    $endpoint = 'https://' . $domain . '/graphql';
    $payload = json_encode([
        'query' => 'query Hello { hello { currentuserid } }',
        'variables' => new stdClass(),
    ]);

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\nAuthorization: Bearer {$token}\r\n",
            'content' => $payload,
            'timeout' => 5,
        ],
    ]);

    $response = @file_get_contents($endpoint, false, $context);
    if ($response === false) {
        return null;
    }

    // Validate HTTP status (expects 200)
    $status = 0;
    if (isset($http_response_header[0]) && preg_match('#HTTP/\\S+\\s(\\d{3})#', $http_response_header[0], $m)) {
        $status = (int) $m[1];
    }
    if ($status !== 200) {
        return null;
    }

    $data = json_decode($response, true);
    return $data['data']['hello']['currentuserid'] ?? null;
}

/**
 * Deny access unless the current user id matches an allowed one.
 */
function enforceAllowedUser(array $allowedUserIds, string $domain): void {
    $currentUserId = fetchCurrentUserId($domain);

    if ($currentUserId === null || !in_array($currentUserId, $allowedUserIds, true)) {
        http_response_code(403);
        exit('Access denied');
    }
}
?>
