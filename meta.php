<?php
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$hostname = $_SERVER['HTTP_HOST'];
$fullUrl = $protocol . '://' . $hostname;
?>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="description" content="<?php echo $beschreibung; ?>">
<meta name="robots" content="all">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:title" content="Peernetwork">
<meta property="og:description" content="Peernetwork Social Media Platform">
<meta property="og:url" content="<?php echo $fullUrl; ?>/">
<meta property="og:site_name" content="Peernetwork">
<meta property="og:image" content="<?php echo $fullUrl; ?>/img/PeerLogo_SW.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Peernetwork">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:description" content="<?php echo $beschreibung; ?>">
<meta name="twitter:title" content="Peernetwork">
<link rel="icon" type="image/svg+xml" href="svg/logo_farbe.svg">
<link rel="apple-touch-icon" href="img/apple.png">
<meta name="theme-color" content="#00beff">
<link rel="manifest" href="json/webmanifest.json">
<script type="application/ld+json">
    <?php include('json/Organization.min.json'); ?>
</script>
<script type="application/ld+json">
    <?php include('json/WebPage.min.json'); ?>
</script>