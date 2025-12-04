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
  <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />

  <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />


  <link rel="stylesheet" href="css/wallet.css?<?php echo filemtime('css/wallet.css'); ?>" />



  <!-- <script src="sw_instal.min.js" async></script> -->
  <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
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
      <h1 id="h1"><i class="peer-icon peer-icon-wallet-filled"></i> Wallet</h1>
    </header>

    <aside class="left-sidebar left-sidebar-wallet">
      <div class="inner-scroll">
        <!-- Load sidebar widgets -->
        <?php //require_once ('./template-parts/sidebars/widget-wallet-time-until.php'); ?>
        <?php //require_once ('./template-parts/sidebars/widget-wallet-menu.php'); ?>

      </div>
    </aside>

    <main id="main" class="site-main site-main-wallet">

      <div class="wallet_main">
        <div class="wallet_header">
          <h2 class="wallet_heading xl_font_size">Available balance</h2>
          <div class="balance_transfer">
            <div class="wallet_balance">
              <img src="svg/logo_sw.svg" alt="peer token" class="logo">
              <span id="token" class="bold xxxl_font_size">0</span>
            </div>
            
            <div class="wallet_transfer">
              
              <a href="#" id="openTransferDropdown" class="md_font_size"><span>Transfer <em>to user</em></span> <i class="peer-icon peer-icon-arrow-right"></i></a>
            </div>

              <div class="wallet_reload">
              <a href="#"  class="md_font_size">Reload <i class="peer-icon peer-icon-refresh-alt"></i></a>
            </div>

          </div>
        </div>
        <div class="wallet_transactions">
          <h3 class="transaction_heading xl_font_size">Transactions</h3>
          <div id="history-container" class="transaction_lists">


            <div class="tarnsaction_item trans_in">
              <div class="transaction_record">
                <div class="transaction_info">
                  <div class="transaction_media">
                    <i class="peer-icon peer-icon-pinpost"></i>
                  </div>
                  <div class="transaction_content">
                    <div class="tinfo md_font_size"><span class="title bold">Pinned post promo</span></div>
                  </div>

                </div>
                <div class="transaction_date md_font_size txt-color-gray">10 Jun 2025, 04:20</div>
                <div class="transaction_price xl_font_size bold">-200</div>
              </div>
              <div class="transaction_detail">
                <div class="transaction_detail_inner">
                  <div class="price_detail_row md_font_size"><span class="price_label txt-color-gray">Transaction amount</span> <span class="price bold">0.000000009</span></div>
                  <div class="price_detail_row md_font_size"><span class="price_label txt-color-gray">Base amount</span> <span class="price bold">0.0.96</span></div>
                  <div class="price_detail_row md_font_size"><span class="price_label txt-color-gray">Fees included</span> <span class="price bold">38</span></div>
                  <div class="price_detail_row"><span class="price_label txt-color-gray">2% to Peer Bank (platform fee)</span> <span class="price txt-color-gray">14</span></div>
                  <div class="price_detail_row"><span class="price_label txt-color-gray">1% Burned (removed from supply)</span> <span class="price txt-color-gray">12</span></div>
                  <div class="price_detail_row"><span class="price_label txt-color-gray">1% to your Inviter</span> <span class="price txt-color-gray">12</span></div>
                </div>
              </div>
            </div>

             <div class="tarnsaction_item trans_out">
              <div class="transaction_record">
                <div class="transaction_info">
                  <div class="transaction_media">
                    <img src="img/profile_thumb.png">
                  </div>
                  <div class="transaction_content">
                    <div class="tinfo md_font_size"><span class="title bold">Transfer from</span> <span class="user_name bold italic">@Krikowl</span> <span class="user_slug txt-color-gray">#239100</span></div>
                    <div class="message txt-color-gray"><i class="peer-icon peer-icon-comment-dot"></i>Thank you so much for all your help with the project... </div>
                  </div>

                </div>
                <div class="transaction_date md_font_size txt-color-gray">10 Jun 2025, 04:20</div>
                <div class="transaction_price xl_font_size bold">+2000</div>
              </div>

              <div class="transaction_detail">
                <div class="transaction_detail_inner">
                  <div class="price_detail_row md_font_size"><span class="price_label txt-color-gray">Transaction amount</span> <span class="price bold">0.000000009</span></div>
                  <div class="message_row">
                    <span class="message_label md_font_size txt-color-gray"><i class="peer-icon peer-icon-comment-dot"></i> Message:</span> 
                    <span class="message_body">Hey! Thank you so much for all your help with the project presentation yesterday. I really appreciate how you stayed late to help me finalize the slides and practice the pitch. Your feedback was invaluable and I couldn't have done it without your support. The client loved it! Here's a little something to show my gratitude. Let's celebrate this weekend! 🎉🙌</span>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <?php require_once ('./template-parts/wallet/walletTokenTransfer.php'); ?>

      
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