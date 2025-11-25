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
  <title>Wallet</title>
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


  <link rel="stylesheet" href="css/new-wallet.css?<?php echo filemtime('css/new-wallet.css'); ?>" />



  <!-- <script src="sw_instal.min.js" async></script> -->
  <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
  <script src="js/audio.js?<?php echo filemtime('js/audio.js'); ?>" async></script>
  <script src="js/posts.js?<?php echo filemtime('js/posts.js'); ?>" defer></script>
  <script src="js/fetchJSONFiles.js?<?php echo filemtime('js/fetchJSONFiles.js'); ?>" defer></script>
  <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
  <script src="js/wallet.js?<?php echo filemtime('js/wallet.js'); ?>" defer></script>

  <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>

<body>
  <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>">
  </div>
  <div id="edit-profile" class="site_layout">
    <header class="site-header header-profile">
      <i class="xl_font_size peer-icon peer-icon-wallet-filled"></i>
      <h1 id="h1">Wallet</h1>
    </header>

    <aside class="left-sidebar left-sidebar-wallet none">
      <div class="inner-scroll">
        <!-- Load sidebar widgets -->
        <?php require_once ('./template-parts/sidebars/widget-wallet-time-until.php'); ?>
      </div>
    </aside>

    <main id="main" class="site-main site-main-wallet">

      <?php require_once ('./template-parts/wallet/walletTokenTransfer.php'); ?>

      <div class="wallet" id="wallet">
        <div class="wallet_top_container">
          <h2 class="xxl_font_size">Available balance</h2>
          <div class="token_transfer_container">
            <div class="token_container">
                <img src="svg/logo_sw.svg" alt="peer token" class="logo" />
                <span class="token xxxl_font_size bold" id="token"></span>
                <div class="money none">
                <span>~</span>
                <span id="money"></span>
                <span id="tokenpercent"></span>
                </div>
            </div>
            <ul class="menu">
                <li class="menu-item" > <a href="#" class="openTransferDropdown" id="openTransferDropdown"><span class="md_font_size">Transfer</span><span class="md_font_size faint">To user</span><i class="peer-icon peer-icon-arrow-right"></i>  </a> </li>
                <li class="menu-item none"> <a href="#" > <img class="icon" src="svg/buy.svg" alt="Buy" /> Buy </a> </li>
                <li class="menu-item none" > <a href="#" > <img class="icon" src="svg/sell.svg" alt="Sell" /> Sell </a> </li>
            </ul>
          </div>
        </div>
        <div class="none kurs">
          <div>
            <span class="peerkurs">1 Peer Token ≈ 0.1€</span>
            <img src="svg/steigend.svg" alt="">
          </div>
          <span>1 Gem ≈ 133 PeerTokens</span>
        </div>
      </div>
      <div class="wallet-transaction" id="wallet-transaction">
        <h2 class="xxl_font_size">List of transactions</h2>
        <div id="history-container" class="history-container">
          
          <!-- <div id="history-sentinel" class="history-sentinel"></div> -->
        </div>
      </div>
    </main>
    <aside class="right-sidebar right-sidebar-wallet">
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