<?php
    header('Access-Control-Allow-Origin: *');
    include 'phpheader.php';
    include 'host.php';
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <link rel="stylesheet" href="css/dashboard.css?<?php echo filemtime('css/dashboard.css'); ?>" />
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
    <link rel="stylesheet" href="css/scrollshadow.css?<?php echo filemtime('css/scrollshadow.css'); ?>" />
    <link rel="stylesheet" href="css/chat.css">
    
    <!--<script src="./js/lib/lc_emoji_picker.min.js"></script>-->

    <?php
        $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
        include 'meta.min.php';
    ?>
    <title>Private Chat</title>

</head>

<body>
    <div id="config" class="none"
        data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>

    <!-- Header section, includes SVG symbols and icons -->
    <header> <?php require_once('./components/svg-symbols.php'); ?> </header>

    <article id="dashboard" class="dashboard">

        <!-- Sidebar section (typically for navigation) -->
        <?php require_once('./components/sidebar.php'); ?>

        <div class="main-content">
            <!-- Load the chat list component -->
            <?php require_once ('./components/chat-list.php'); ?>

            <!-- Load the chat container component (this holds individual chat windows) -->
            <?php require_once ('./components/chat-container.php'); ?>
        </div>

        <!-- Extra Content Area: A right column for profile info or other widgets -->
        <?php require_once('./components/profile.php'); ?>

        <div id="footer" class="footer">
            <!--  <img src="svg/logo_farbe.svg" alt="loading" />-->
        </div>
    </article>

    <?php require_once('./components/scripts-chat.php'); ?>
    
</body>

</html>