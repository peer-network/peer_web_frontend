<?php
header('Access-Control-Allow-Origin: *');
include 'phpheader.php';
include 'host.php';
require_once 'auth.php';
checkAuth("unauthorized");
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Setting - Edit Profile</title>
    <link rel="stylesheet" href="fonts/font-poppins/stylesheet.css?<?php echo filemtime('fonts/font-poppins/stylesheet.css'); ?>">
    <link rel="stylesheet" href="fonts/peer-icon-font/css/peer-network.css?<?php echo filemtime('fonts/peer-icon-font/css/peer-network.css'); ?>">
    <link rel="stylesheet" href="css/password.css?<?php echo filemtime('css/password.css'); ?>">
    <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
    <link rel="stylesheet" href="css/settings.css?<?php echo filemtime('css/settings.css'); ?>" />
    <link rel="stylesheet" href="css/edit-profile.css?<?php echo filemtime('css/edit-profile.css'); ?>" />
    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/password.js?<?php echo filemtime('js/password.js'); ?>" defer></script>
    <script src="js/confirmPassword.js?<?php echo filemtime('js/confirmPassword.js'); ?>" defer></script>
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/fetchJSONFiles.js?<?php echo filemtime('js/fetchJSONFiles.js'); ?>" defer></script>
    <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
    <script src="js/settings/index.js?<?php echo filemtime('js/settings/index.js'); ?>" defer></script>
    <script src="js/settings/editProfile.js?<?php echo filemtime('js/settings/editProfile.js'); ?>" defer></script>
    <script src="js/settings/content.js?<?php echo filemtime('js/settings/content.js'); ?>" defer></script>
    <script src="js/settings/preferences.js?<?php echo filemtime('js/settings/preferences.js'); ?>" defer></script>
    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>

<body>
    <div id="config" class="none"
        data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
    <div id="edit-profile" class="site_layout">
        <header class="site-header header-profile">
            <img class="logo" src="svg/logo_sw.svg" alt="Peer Network">
            <h1 id="h1">Settings</h1>
        </header>
        <aside class="left-sidebar left-sidebar-profile">
            <div class="inner-scroll">
                <div id="profile-back-btn" class="profile-back-button hide">
                    <a href="profileSettings.php" class="button btn-transparent">Back</a>
                </div>
                <div id="main-profile-back-btn" class="profile-back-button">
                    <a href="profile.php" class="button btn-transparent">Back to Profile</a>
                </div>
            </div>
        </aside>
        <main class="site-main site-main-edit-profile">
            <div id="edit-pofile" class="setting-layout">
                <!-- left settings menu -->
                <?php require_once ('./template-parts/content-parts/settings-menu.php'); ?>
                <!-- edit profile block -->
                <?php require_once ('./template-parts/settings/editProfile.php'); ?>
                <!-- notification block -->
                <?php require_once ('./template-parts/settings/notification.php'); ?>
                <!-- content block -->
                <?php require_once ('./template-parts/settings/content.php'); ?>
                <!-- prefrences block -->
                <?php require_once ('./template-parts/settings/preferences.php'); ?>
            </div>
        </main>
        <aside class="right-sidebar right-sidebar-edit-profile">
            <div class="inner-scroll">
                <!-- Load sidebar widgets -->
                <?php require_once ('./template-parts/sidebars/widget-profile.php'); ?>
                <?php require_once ('./template-parts/sidebars/widget-main-menu.php'); ?>
                <?php require_once ('./template-parts/sidebars/widget-add-new-post.php'); ?>
                <?php require_once ('./template-parts/sidebars/widget-web-version.php'); ?>
            </div>
        </aside>
        <?php require_once ('./template-parts/footer.php'); ?>
    </div>
</body>

</html>