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
<title>Peer Network - View Profile</title>
<link rel="stylesheet" href="fonts/font-poppins/stylesheet.css?<?php echo filemtime('fonts/font-poppins/stylesheet.css'); ?>">
<link rel="stylesheet" href="fonts/peer-icon-font/css/peer-network.css?<?php echo filemtime('fonts/peer-icon-font/css/peer-network.css'); ?>">

<link rel='stylesheet' href='https://cdn-uicons.flaticon.com/3.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css'>	
<link rel='stylesheet' href='https://cdn-uicons.flaticon.com/3.0.0/uicons-solid-rounded/css/uicons-solid-rounded.css'>
<link rel='stylesheet' href='https://cdn-uicons.flaticon.com/3.0.0/uicons-thin-straight/css/uicons-thin-straight.css'>
<link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />
<link rel="stylesheet" href="css/profile.css?<?php echo filemtime('css/profile.css'); ?>" />
<link rel="stylesheet" href="css/all-post.css?<?php echo filemtime('css/all-post.css'); ?>" />
<link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
<link rel="stylesheet" href="css/view-post.css?<?php echo filemtime('css/view-post.css'); ?>" />

<!-- <script src="sw_instal.min.js" async></script> -->
<script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
 <script src="js/lib/modal.js?<?php echo filemtime('js/lib/modal.js'); ?>" async></script>
<script src="js/audio.js?<?php echo filemtime('js/audio.js'); ?>" async></script>
<script src="js/posts.js?<?php echo filemtime('js/posts.js'); ?>" defer></script>
<script src="js/fetchJSONFiles.js?<?php echo filemtime('js/fetchJSONFiles.js'); ?>" defer></script>
<script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
<script src="js/comments.js?<?php echo filemtime('js/comments.js'); ?>" defer></script>
<script src="js/load_posts.js?<?php echo filemtime('js/load_posts.js'); ?>" defer></script>
<script src="js/list_follow.js?<?php echo filemtime('js/list_follow.js'); ?>" defer></script>
<script src="js/reports/report_user.js?<?php echo filemtime('js/reports/report_user.js'); ?>" defer></script>
<script src="js/viewprofile.js?<?php echo filemtime('js/viewprofile.js'); ?>" defer></script>
<?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>
<body >
<div id="config"  class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>" data-media-host="<?php echo htmlspecialchars('https://' . $mediaDomain, ENT_QUOTES, 'UTF-8'); ?>"></div>
<div id="profile" class="site_layout view-profile">
  <header class="site-header header-profile"> <img class="logo" src="svg/Home.svg" alt="Peer Network">
    <h1 class="dashboard_h1" id="h1">Profile</h1>
  </header>
  <aside class="left-sidebar left-sidebar-profile"> 
    <div class="inner-scroll for-filters">
        <div class="inner-scroll-filters">
          <!-- Load sidebar widgets -->
          <?php require_once ('./template-parts/sidebars/widget-filter.php'); ?>
          <?php require_once('./template-parts/sidebars/widget-sort-filter.php'); ?>
        </div>
        <?php require_once('./template-parts/sidebars/widget-collapse-button.php'); ?>
    </div>
  </aside>
  <main class="site-main site-main-profile">
   
    <div class="profile_header" id="profil-container">
      <div class="profile_picture">
        <div class="cropContainer"><img id="profilbild2" class="profile-picture" src="svg/noname.svg" alt="Profile Picture" /></div>
      </div>
      <div class="profile_info">
        <h2 class="profile_title"><span  id="username2" class="xxl_font_size bold">&nbsp;</span><span id="slug2" class="profile_no xl_font_size txt-color-gray">&nbsp;</span></h2>
        <div class="profile_description md_font_size txt-color-gray" id="biography2"> </div>
        <div class="profile_stats md_font_size txt-color-gray"> <span class="post_count"><em id="userPosts2" class="xxl_font_size">&nbsp;</em> Posts</span> <span id="followers_count" class="followers_count"><em id="followers2" class="xxl_font_size">&nbsp;</em> <span class="new_count" id="recent_followers2"></span> Followers</span> <span id="following_count" class="following_count"><em id="following2" class="xxl_font_size">&nbsp;</em> Following</span> <span id="peer_count" class="peer_count"><em id="Peers2" class="xxl_font_size">0</em> Peers</span>  </div>
        
        <div id="modal_Overlay" class="modalOverlay none"></div>
      </div>
      <!-- rendering via js code written in viewprofile.js -->
      <div class="profile_edit_box">
        <div class=""><a class="button btn-transparent follow-button" id="followbtn" href="#">Follow</a></div>
        <div class="moreActions_container_wrap">
          <div class="button moreActions_container" role="button" aria-expanded="false" aria-controls="moreActions" tabindex="0">More</div>
          <div class="moreActions_wrapper" hidden>
            <div class="report_profile">Report profile</div>
            <div class="block_content">Block content</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Load Posts Container -->
    <div id="allpost" class="list_all_post"> </div>
    <div id="post_loader"><img src="svg/logo_farbe.svg" alt="loading" /></div>
    <div id="no_post_found" class="no_post_found">No Post found...</div>
    <!-- End: Load Posts Container --> 
  </main>
  <aside class="right-sidebar right-sidebar-profile"> 
  <div class="inner-scroll">
    <!-- Load sidebar widgets -->
    <?php require_once ('./template-parts/sidebars/widget-profile.php'); ?>
    <?php require_once ('./template-parts/sidebars/widget-main-menu.php'); ?>
    <?php require_once ('./template-parts/sidebars/widget-add-new-post.php'); ?>
    <?php require_once ('./template-parts/sidebars/widget-web-version.php'); ?>
  </div>
  </aside>
  <?php require_once ('./template-parts/footer.php'); ?>
  <?php require_once ('./template-parts/content-parts/view-post.php'); ?>
</div>
</body>
</html>