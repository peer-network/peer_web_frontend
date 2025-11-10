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
    <link rel="stylesheet" href="css/myAds.css?<?php echo filemtime('css/myAds.css'); ?>" />

    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/fetchJSONFiles.js?<?php echo filemtime('js/fetchJSONFiles.js'); ?>" defer></script>
    <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
    <script src="js/load_posts.js?<?php echo filemtime('js/load_posts.js'); ?>" defer></script>
    <script src="./js/ads/adsHistory/myAds.js?<?php echo filemtime('./js/ads/adsHistory/myAds.js'); ?>" defer></script>
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
            <?php require_once ('./template-parts/sidebars/widget-back-button.php'); ?>
        </div>
    </aside>
    <main class="site-main site-main-myAds">
      <h1 class="myAds_h1">My Ads</h1>
      <div id="myAds_header" class="myAds_header">
        <div class="myAds_earnings">
          <h1>Earnings</h1>
          <div class="earnings_box header_box">
            <p>Gems</p>
            <div class="ads_gems_count">
              <img src="svg/peer-icon-gems.svg" alt="">
              <span id="myAdsGemsEarned" class="bold xxl_font_size">0</span>
            </div>
          </div>
        </div>
        <div class="myAds_spendings">
          <h1>Spendings</h1>
          <div class="spendings_box header_box">
            <p>Tokens</p>
            <div class="ads_tokens_count">
              <img src="svg/logo_sw.svg" alt="">
              <span id="myAdsTokensSpent" class="bold xxl_font_size">0</span>
            </div>
          </div>
        </div>
        <div class="myAds_interactions">
          <h1>Interactions</h1>
          <div class="interactions_box header_box">
            <div class="likes">
              <i class="peer-icon peer-icon-like"></i>
              <p>Likes</p>
              <span id="myAdsLikes" class="bold xxl_font_size">0</span>
            </div>
            <div class="vr"></div>
            <div class="dislikes">
              <i class="peer-icon peer-icon-dislike"></i>
              <p>Dislikes</p>
              <span id="myAdsDislikes" class="bold xxl_font_size">0</span>
            </div>
            <div class="vr"></div>
            <div class="comments">
              <i class="peer-icon peer-icon-comment-alt"></i>
              <p>Comments</p>
              <span id="myAdsComments" class="bold xxl_font_size">0</span>
            </div>
            <div class="vr"></div>
            <div class="views">
              <i class="peer-icon peer-icon-eye-open"></i>
              <p>Views</p>
              <span id="myAdsViews" class="bold xxl_font_size">0</span>
            </div>
            <div class="vr"></div>
            <div class="reports">
              <i class="peer-icon peer-icon-warning"></i>
              <p>Reports</p>
              <span id="myAdsReports" class="bold xxl_font_size">0</span>
            </div>
          </div>
        </div>
      </div>
      <div class="myAds_main">
        <div class="top">
          <h1 class="myAds_h1">All advertisements</h1>
          <span>Total: <em id="myAdsTotalCount">0</em></span>
        </div>
        <div class="myAds_lists"></div>
        <!-- Hidden expandable section for the advertisement listing -->
          <!-- <div class="ad_dropdown none">
            <div class="ad_dropdown_content">
              <p>More details about this ad will appear here...</p>
            </div>
          </div> -->
      </div>
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