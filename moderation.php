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
    <title>Peer Network - Admin</title>
    <link rel="stylesheet" href="fonts/font-poppins/stylesheet.css?<?php echo filemtime('fonts/font-poppins/stylesheet.css'); ?>">
    <link rel="stylesheet" href="fonts/peer-icon-font/css/peer-network.css?<?php echo filemtime('fonts/peer-icon-font/css/peer-network.css'); ?>">
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css'>
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-solid-rounded/css/uicons-solid-rounded.css'>
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-thin-straight/css/uicons-thin-straight.css'>

    <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />
     <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
    <link rel="stylesheet" href="css/moderation.css?<?php echo filemtime('css/moderation.css'); ?>" />

    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
    <script src="./js/moderation.js?<?php echo filemtime('./js/moderation.js'); ?>" defer></script>
    <?php
      $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
      include 'meta.min.php';
      ?>
</head>
<body >
  <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
  <div id="moderation" class="moderation_site_layout site_layout">
    <header class="site-header header-admin">
        <h1 class="admin_h1" id="h1">Admin</h1>
    </header>
    <aside class="left-sidebar left-sidebar-myAds">
        <div class="inner-scroll for-filters">
            <!-- Load sidebar widgets -->
            <div class="leftContainer">
                <p>Logged in as</p>
                <div id="adminID" class="adminID">Jacob123</div>
                <a href="dashbord.php" class="button btn-red-transparent back_toUserBtn">
                    Back to user mode
                    <img src="svg/back-icon.svg" alt="">
                </a>
            </div>
            
        </div>
    </aside>
    <main class="site-main site-main-admin">
        <h1 class="admin_h1">Content moderation</h1>
        <div id="admin_header" class="admin_header">
            <div class="admin_review admin_box">
                <div class="admin_box_top">
                    <p class="xl_font_size">Awaiting Review</p>
                    <img src="svg/Union-admin.svg" alt="">
                </div>
                <div class="admin_box_bottom">
                    <span class="bold xxl_font_size">0</span>
                    <p>Requires immediate attention</p>
                </div>
            </div>

            <div class="admin_hidden admin_box">
                <div class="admin_box_top">
                    <p class="xl_font_size">Hidden</p>
                    <img src="svg/eye-admin.svg" alt="">
                </div>
                <div class="admin_box_bottom">
                    <span class="bold xxl_font_size">0</span>
                    <p>Currently not visible to users</p>
                </div>
            </div>

            <div class="admin_restored admin_box">
                <div class="admin_box_top">
                    <p class="xl_font_size">Restored</p>
                    
                    <img src="svg/mark-admin.svg" alt="">
                </div>
                <div class="admin_box_bottom">
                    <span class="bold xxl_font_size">0</span>
                    <p>Reviewed and restored</p>
                </div>
            </div>

            <div class="admin_illegal admin_box">
                <div class="admin_box_top">
                    <p class="xl_font_size">Illegal</p>
                    <img src="svg/close-admin.svg" alt="">
                </div>
                <div class="admin_box_bottom">
                    <span class="bold xxl_font_size">0</span>
                    <p>Never shows to users</p>
                </div>
            </div>
        </div>
    </main>
    <?php require_once ('./template-parts/footer.php'); ?>
  </div>
</body>
</html>