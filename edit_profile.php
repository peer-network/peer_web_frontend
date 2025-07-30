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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="css/password.css?<?php echo filemtime('css/password.css'); ?>">
    <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
    <link rel="stylesheet" href="css/settings.css?<?php echo filemtime('css/settings.css'); ?>" />
    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/password.js?<?php echo filemtime('js/password.js'); ?>" defer></script>
    <script src="js/confirmPassword.js?<?php echo filemtime('js/confirmPassword.js'); ?>" defer></script>
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
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
            <img class="logo" src="svg/Home.svg" alt="Peer Network">
            <h1 id="h1">Settings</h1>
        </header>
        <aside class="left-sidebar left-sidebar-profile">
            <div class="inner-scroll">
                <div id="profile-back-btn" class="profile-back-button hide">
                    <a href="edit_profile.php" class="button btn-transparent">Back</a>
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