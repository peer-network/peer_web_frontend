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
  	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  	<link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />
    
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
    <link rel="stylesheet" href="css/add-post.css?<?php echo filemtime('css/add-post.css'); ?>" />
    
    <link rel="stylesheet" href="css/wallet.css?<?php echo filemtime('css/wallet.css'); ?>" />  
   
    
	
    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/audio.js?<?php echo filemtime('js/audio.js'); ?>" async></script>
    <script src="js/posts.js?<?php echo filemtime('js/posts.js'); ?>" defer></script>
    <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
    <script src="js/add_post.js?<?php echo filemtime('js/add_post.js'); ?>" defer></script>
    
    
     
	<script src="js/wallet.js?<?php echo filemtime('js/wallet.js'); ?>" defer></script>

	
	<?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>
<body >
	<div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
        <div id="edit-profile" class="site_layout">
          <header class="site-header header-profile">
            <img class="logo" src="svg/Home.svg" alt="Peer Network">
            <h1 id="h1">Wallet</h1>
          </header>
        
          <aside class="left-sidebar left-sidebar-wallet">
          <div class="inner-scroll">
            <!-- Load sidebar widgets -->
            
            
          
          
          <?php require_once ('./template-parts/sidebars/widget-wallet-time-until.php'); ?>
            <?php require_once ('./template-parts/sidebars/widget-wallet-menu.php'); ?>
           	<?php require_once ('./template-parts/sidebars/widget-daily-action.php'); ?>
           
           	
          </div>
          </aside>
        
          <main class="site-main site-main-wallet">
          
        
        	 

      <div class="main-header">
        <div class="transfer-wrapper">
          <div class="transfer-dropdown hidden" id="transferDropdown"></div>
        </div>
      </div>

          <div id="wallet">
            <div class="token">
              <h2>Total Tokens</h2>
              <div>
                <img src="svg/logo_sw.svg" alt="peer token" class="logo" />
                <span id="token"></span>
                <div class="money">
                  <span>~</span>
                  <span id="money"></span>
                  <span id="tokenpercent"></span>
                </div>
              </div>
            </div>
    
            <div class="kurs">
              <div>
                <span class="peerkurs">1 Peer Token ≈ 0.01€</span>
                <img src="svg/steigend.svg" alt="">
              </div>
    
              <span>1 Gem ≈ 133 PeerTokens</span>
            </div>
          </div>
      <div id="wallet-transaction">
        <h2>List of transactions</h2>
        <div id="history-container" class="history-container">
          <div class="history-header">
            <span class="type">Type</span>
            <span class="date">Date</span>
            <span class="amount">Amount</span>
          </div>
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