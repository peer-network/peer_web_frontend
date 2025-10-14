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
<title>Peer Network - Profile</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
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
<script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
<script src="js/comments.js?<?php echo filemtime('js/comments.js'); ?>" defer></script>
<script src="js/load_posts.js?<?php echo filemtime('js/load_posts.js'); ?>" defer></script>
<script src="js/list_follow.js?<?php echo filemtime('js/list_follow.js'); ?>" defer></script>
<script src="js/profile.js?<?php echo filemtime('js/profile.js'); ?>" defer></script>
<?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>
<body >
<div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
<div id="profile" class="site_layout">
  <header class="site-header header-profile"> <img class="logo" src="svg/dashboard-profile.svg" alt="Peer Network">
    <h1 class="dashboard_h1" id="h1">Profile</h1>
  </header>
  <aside class="left-sidebar left-sidebar-profile"> 
  <div class="inner-scroll for-filters">
      <div class="inner-scroll-filters">
        <!-- Load sidebar widgets -->
        <!-- <div class="widget profile_buttons">
          <div class="widget-inner"> 
            <a class="button btn-white notification" href="#">Notifications</a> 
            <a class="button btn-white share_profile" href="#">Share profile</a> 
            <a class="button btn-white activity" href="#">Activity</a> 
          </div>
        </div> -->
        <?php require_once ('./template-parts/sidebars/widget-filter.php'); ?>
        <?php require_once('./template-parts/sidebars/widget-sort-filter.php'); ?>
      </div>
      <?php require_once('./template-parts/sidebars/widget-collapse-button.php'); ?>
  </div>
  </aside>
  <main class="site-main site-main-profile">
  
    <div class="profile_header" id="profil-container">
      <div class="profile_picture">
        <div class="cropContainer"><span class="online_status"></span><img id="profilbild" class="profilbild profile-picture" src="svg/noname.svg" alt="Profile Picture" /></div>
      </div>
      <div class="profile_info">
        <h2 class="profile_title"><span class="username"  id="username">&nbsp;</span><span id="slug" class="slug profile_no">&nbsp;</span></h2>
        <div class="profile_description" id="biography"> </div>
        <div class="profile_stats"> <span class="post_count"><em id="userPosts">&nbsp;</em> Posts</span> <span id="followers_count" class="followers_count"><em id="followers">&nbsp;</em> <span class="new_count" id="recent_followers"></span> Followers</span> <span id="following_count" class="following_count"><em id="following">&nbsp;</em> Following</span> <span id="peer_count" class="peer_count"><em id="Peers">0</em> Peers</span> </div>
        <h4 class="boost_post_description none">Select any post you want to boost for more visibility.</h4>
        <div id="modal_Overlay" class="modalOverlay none"></div>
      </div>
      <div class="profile_edit_box">
        <a class="button btn-white edit-profile" href="profileSettings.php">Edit</a>
        <div class="ads_container_wrap">
          <div class="button boost_adsStats_container" role="button" aria-expanded="false" aria-controls="boostDropdown" tabindex="0">Ads</div>
          <div class="boost_dropdown_wrapper" hidden>
            <div class="button btn-blue promote_posts">Boost post</div>
            <a href="myAds.php" class="button btn-white">My Ads</a>
          </div>
        </div>
        <div class="button btn-white promote_posts_cancel none">Cancel</div>
      </div>
    </div>

    <!-- Boost Post Modal -->
    <?php require_once('./template-parts/content-parts/boostPosts.php'); ?>
    <!-- Load Posts Container -->
    <div id="allpost" class="list_all_post"> </div>
    <div id="post_loader"><img src="svg/logo_farbe.svg" alt="loading" /></div>
    <div id="no_post_found" class="no_post_found">No Post found...</div>
    <!-- End: Load Posts Container --> 
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
  <?php require_once ('./template-parts/content-parts/view-post.php'); ?>
</div>
</body>
</html>