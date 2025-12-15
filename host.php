<?php
$httpsFlag = $_SERVER['HTTPS'] ?? '';
$protocol = ($httpsFlag && $httpsFlag !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'https://getpeer.eu';
$hostName = explode(':', $host)[0]; // Strip port if present.

// Basis-URL des Projekts ermitteln
$scriptName = $_SERVER['SCRIPT_NAME'] ?? '/';
$baseUrl = rtrim(dirname($scriptName), '/'); 

// Host in Teile zerlegen
$parts = explode('.', $hostName);

// Hauptdomain und Subdomain bestimmen
if (count($parts) > 2) {
  $subdomain = implode('.', array_slice($parts, 0, count($parts) - 2));
  if ($subdomain == 'frontend') $domain = 'peernetwork.eu';
  else if ($subdomain == 'testing') $domain = 'getpeer.eu';
  else $domain = $hostName;
} else {
  $domain = 'getpeer.eu';
}
