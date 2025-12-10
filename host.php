<?php $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];

// Basis-URL des Projekts ermitteln
$baseUrl = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/'); 

// Host in Teile zerlegen
$parts = explode('.', $host);

// Hauptdomain und Subdomain bestimmen
if (count($parts) > 2) {
  $subdomain = implode('.', array_slice($parts, 0, count($parts) - 2));
  if ($subdomain == 'frontend') $domain = 'peernetwork.eu';
  else if ($subdomain == 'testing') $domain = 'getpeer.eu';
} else {
  $domain = 'peer-network.eu';
}
