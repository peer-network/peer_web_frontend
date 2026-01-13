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
  <title>Chats</title>
 <link rel="stylesheet" href="fonts/font-poppins/stylesheet.css?<?php echo filemtime('fonts/font-poppins/stylesheet.css'); ?>">
    <link rel="stylesheet" href="fonts/peer-icon-font/css/peer-network.css?<?php echo filemtime('fonts/peer-icon-font/css/peer-network.css'); ?>">
  <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />
  <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
 

  <link rel="stylesheet" href="css/chat.css?<?php echo filemtime('css/chat.css'); ?>" />
  <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>

<body>
  <div id="config"  class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>" data-media-host="<?php echo htmlspecialchars('https://' . $mediaDomain, ENT_QUOTES, 'UTF-8'); ?>">
  </div>
  <div id="edit-profile" class="site_layout">
    <header class="site-header header-profile">
      <img class="logo" src="svg/Home.svg" alt="Peer Network">
      <h1 id="h1">Chat</h1>
    </header>

    <aside class="left-sidebar left-sidebar-chats">
      <div class="inner-scroll">
        <!-- Load sidebar widgets -->
        <?php //require_once ('./template-parts/sidebars/widget-filter.php'); ?>
        <?php //require_once ('./template-parts/sidebars/widget-daily-action.php'); ?>
        <!-- Search Bar -->
        <div class="search-container">
          <input type="text" placeholder="@username " class="input title" />
          <img class="searchbtn" src="svg/lupe.svg" alt="Search" />
          <div class="starter-placeholders">
            <span>@username</span>
            <span>Title</span>
            <img class="searchbtn" src="svg/lupe.svg" alt="Search" />
          </div>
        </div>
      </div>
    </aside>

    <main class="site-main site-main-chats">

      <div class="main-chat">
        <!-- Load the chat list component -->
        <?php require_once ('./template-parts/chat/chat-list.php'); ?>

        <!-- Load the chat container component (this holds individual chat windows) -->
        <?php require_once ('./template-parts/chat/chat-container.php'); ?>
      </div>

    </main>

    <aside class="right-sidebar right-sidebar-chats">
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

  <!-- <script src="sw_instal.min.js" async></script> -->
  <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
  <script src="js/audio.js?<?php echo filemtime('js/audio.js'); ?>" async></script>
  <script src="js/posts.js?<?php echo filemtime('js/posts.js'); ?>" defer></script>
  <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>


  <script src="js/chat/state.js?<?= filemtime('js/chat/state.js') ?>" defer></script>
  <script src="js/chat/utils.js?<?= filemtime('js/chat/utils.js') ?>" defer></script>
  <script src="js/chat/graphql.js?<?= filemtime('js/chat/graphql.js') ?>" defer></script>
  <script src="js/chat/api.js?<?= filemtime('js/chat/api.js') ?>" defer></script>
  <script src="js/chat/ui.js?<?= filemtime('js/chat/ui.js') ?>" defer></script>
  <script src="js/chat/loader.js?<?= filemtime('js/chat/loader.js') ?>" defer></script>
  <script src="js/chat/index.js?<?= filemtime('js/chat/index.js') ?>" defer></script>

</body>

</html>