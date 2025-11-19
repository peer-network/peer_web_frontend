<?php
header('Access-Control-Allow-Origin: *');
include '../phpheader.php';
include '../host.php';
require_once '../auth.php';
checkAuth("unauthorized");
?>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Peer Network - Admin</title>
    <link rel="stylesheet" href="../fonts/font-poppins/stylesheet.css?<?php echo filemtime('../fonts/font-poppins/stylesheet.css'); ?>">
    <link rel="stylesheet" href="../fonts/peer-icon-font/css/peer-network.css?<?php echo filemtime('../fonts/peer-icon-font/css/peer-network.css'); ?>">
    <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />
    <script src="../js/lib/const.js?<?php echo filemtime('../js/lib/const.js'); ?>" defer></script>
    <script src="../js/lib/cookie.js?<?php echo filemtime('../js/lib/cookie.js'); ?>" defer></script>
    <script src="js/schema.js?<?php echo filemtime('js/schema.js'); ?>" defer></script>
    <script src="js/store.js?<?php echo filemtime('js/store.js'); ?>" defer></script>
    <script src="js/helpers.js?<?php echo filemtime('js/helpers.js'); ?>" defer></script>
    <script src="js/service.js?<?php echo filemtime('js/service.js'); ?>" defer></script>
    <script src="js/fetcher.js?<?php echo filemtime('js/fetcher.js'); ?>" defer></script>
    <script src="js/view.js?<?php echo filemtime('js/view.js'); ?>" defer></script>
    <script src="js/main.js?<?php echo filemtime('js/main.js'); ?>" defer></script>
</head>