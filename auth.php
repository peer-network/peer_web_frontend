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

    if (function_exists('curl_init')) {
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: ' . 'Bearer ' . $token,
            ],
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_TIMEOUT => 5,
        ]);

        $response = curl_exec($ch);
        if ($response === false) {
            curl_close($ch);
            return null;
        }

        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($status !== 200) {
            return null;
        }
    } else {
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
    }

    $data = json_decode($response, true);
    return $data['data']['hello']['currentuserid'] ?? null;
}

/**
 * Deny access unless the current user id matches the allowed one.
 */
function enforceAllowedUser(string $allowedUserId, string $domain): void {
    $currentUserId = fetchCurrentUserId($domain);

    if ($currentUserId !== $allowedUserId) {
        http_response_code(403);
        exit('Access denied');
    }
}
?>
