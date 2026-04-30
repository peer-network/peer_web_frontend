<?php
$httpsFlag = $_SERVER['HTTPS'] ?? '';
$protocol = ($httpsFlag && $httpsFlag !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'https://getpeer.eu';
$hostName = explode(':', $host)[0]; // Strip port if present.
$localHosts = ['localhost', '127.0.0.1'];

// Basis-URL des Projekts ermitteln
$scriptName = $_SERVER['SCRIPT_NAME'] ?? '/';
$baseUrl = rtrim(dirname($scriptName), '/'); 

// Host in Teile zerlegen
$parts = explode('.', $hostName);

if (in_array($hostName, $localHosts, true)) {
  // Local dev server should still talk to production backends
  $protocol = 'https';
  $domain = 'peernetwork.eu';
  } elseif (count($parts) > 2) {
    $subdomain = implode('.', array_slice($parts, 0, count($parts) - 2));
    if ($subdomain == 'frontend') $domain = 'peernetwork.eu';
    else if ($subdomain == 'testing') $domain = 'getpeer.eu';
    else $domain = $hostName;
    } else {
      $domain = 'getpeer.eu';
    }

  $mediaDomain = $domain === 'peernetwork.eu'
    ? 'media.peernetwork.eu'
    : 'media.getpeer.eu';