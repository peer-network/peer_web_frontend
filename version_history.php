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
  	<title>Setting: Version History</title>
  	<link rel="stylesheet" href="fonts/font-poppins/stylesheet.css?<?php echo filemtime('fonts/font-poppins/stylesheet.css'); ?>">
    <link rel="stylesheet" href="fonts/peer-icon-font/css/peer-network.css?<?php echo filemtime('fonts/peer-icon-font/css/peer-network.css'); ?>">
    <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
    <link rel="stylesheet" href="css/settings.css?<?php echo filemtime('css/settings.css'); ?>" />  
   
    
	
    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
    <script src="js/version_history.js?<?php echo filemtime('js/version_history.js'); ?>" defer></script>

	
	<?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>
<body >
	<div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
        <div id="version_history" class="site_layout version_history">
          <header class="site-header header-profile">
            <img class="logo" src="svg/logo_sw.svg" alt="Peer Network">
            <h1 id="h1">Settings</h1>
          </header>
        
          <aside class="left-sidebar left-sidebar-profile">
            <div class="inner-scroll">
                <!-- Load sidebar widgets -->
                <?php //require_once ('./template-parts/sidebars/widget-filter.php'); ?>
                <?php //require_once ('./template-parts/sidebars/widget-daily-action.php'); ?>
                <?php require_once ('./template-parts/sidebars/widget-back-button.php'); ?>
            </div>
          </aside>
        
          <main class="site-main site_main_versionHistory">
            <div id="" class="setting-layout">
                <div id="left_versionHistory" class="setting-menu left_versionHistory">
                    
                </div>
                <div id="right_versionHistory" class="setting-content right_versionHistory">
                    
                </div>
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