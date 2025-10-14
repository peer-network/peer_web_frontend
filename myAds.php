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
    <title>Peer Network - My Ads</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css'>
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-solid-rounded/css/uicons-solid-rounded.css'>
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-thin-straight/css/uicons-thin-straight.css'>
    <link rel="stylesheet" href="css/myAds.css?<?php echo filemtime('css/myAds.css'); ?>" />
    <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />

  <!-- <script src="sw_instal.min.js" async></script> -->
  <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
  <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
  <script src="js/load_posts.js?<?php echo filemtime('js/load_posts.js'); ?>" defer></script>
  <?php
      $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
      include 'meta.min.php';
      ?>
</head>
<body >
  <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
  <div id="profile" class="site_layout">
    <header class="site-header header-myAds">
        <img class="logo" src="svg/Home.svg" alt="Peer Network">
        <h1 class="myAds_h1" id="h1">Dashboard</h1>
    </header>
    <aside class="left-sidebar left-sidebar-myAds">
        <div class="inner-scroll for-filters">
            <!-- Load sidebar widgets -->
              <div class="inner-scroll-filters">
                <?php require_once('./template-parts/sidebars/widget-filter.php'); ?>
                <?php require_once('./template-parts/sidebars/widget-sort-filter.php'); ?>
            </div>
            <?php require_once('./template-parts/sidebars/widget-collapse-button.php'); ?>
        </div>
    </aside>
    <main class="site-main site-main-myAds">
      <h1 class="myAds_h1">My Ads</h1>
      <div id="myAds_header" class="myAds_header">
        <div class="myAds_earnings">
          <h2>Earnings</h2>
          <div class="earnings_box header_box">
            <p>Gems</p>
            <div>
              <img src="" alt="">
              <span>25566</span>
            </div>
          </div>
        </div>
        <div class="myAds_spendings">
          <h2>Spendings</h2>
          <div class="spendings_box header_box">
            <p>Gems</p>
            <div>
              <img src="" alt="">
              <span>25566</span>
            </div>
          </div>
        </div>
        <div class="myAds_interactions">
          <h2>Interactions</h2>
          <div class="interactions_box header_box">
            <div class="likes">
              <img src="" alt="">
              <p>Likes</p>
              <span>300K</span>
            </div>
            <div class="vr"></div>
            <div class="dislikes">
              <img src="" alt="">
              <p>Dislikes</p>
              <span>1K</span>
            </div>
            <div class="vr"></div>
            <div class="comments">
              <img src="" alt="">
              <p>Comments</p>
              <span>20K</span>
            </div>
            <div class="vr"></div>
            <div class="views">
              <img src="" alt="">
              <p>Views</p>
              <span>566K</span>
            </div>
            <div class="vr"></div>
            <div class="reports">
              <img src="" alt="">
              <p>Reports</p>
              <span>219</span>
            </div>
          </div>
        </div>
      </div>
      <div class="myAds_main"></div>
    </main>
    <aside class="right-sidebar right-sidebar-profile"> 
      <div class="inner-scroll">
        <!-- Load sidebar widgets -->
        <?php //require_once ('./template-parts/sidebars/widget-profile.php'); ?>
        <div class="widget widget-margin-bottom">
          <div class="widget-inner widget-type-box">
              <?php require_once('./template-parts/sidebars/widget-daily-action.php'); ?>
          </div>
        </div>
        <?php require_once ('./template-parts/sidebars/widget-main-menu.php'); ?>
        <?php require_once ('./template-parts/sidebars/widget-add-new-post.php'); ?>
        <?php require_once ('./template-parts/sidebars/widget-web-version.php'); ?>
      </div>
    </aside>
    <?php require_once ('./template-parts/footer.php'); ?>
  </div>
</body>
</html>