<?php $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];

// Host in Teile zerlegen
$parts = explode('.', $host);

// Hauptdomain und Subdomain bestimmen
if (count($parts) > 2) {
  $subdomain = implode('.', array_slice($parts, 0, count($parts) - 2));
  $domain = implode('.', array_slice($parts, -2));
} else {
  $subdomain = ''; // Keine Subdomain vorhanden
  $domain = $host;
}
