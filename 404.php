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
<title>Page Not Found - Peer Network</title>
<link rel="stylesheet" href="fonts/font-poppins/stylesheet.css?<?php echo filemtime('fonts/font-poppins/stylesheet.css'); ?>">
<link rel="stylesheet" href="fonts/peer-icon-font/css/peer-network.css?<?php echo filemtime('fonts/peer-icon-font/css/peer-network.css'); ?>">

<link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />


<?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>
<body >
<div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
<div id="profile" class="site_layout">
  <header class="site-header header-profile"> 
  </header>
  <aside class="left-sidebar left-sidebar-profile"> 
  <div class="inner-scroll">
      
  </div>
  </aside>
  <main class="site-main site-main-profile">
    
    <section class="error-404 not-found">
			<header class="page-header">
				<h1 class="page-title">404</h1>
			</header><!-- .page-header -->

			<div class="page-content">
				<p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
				<div class="homebtn"><a href="dashboard.php" class="button btn-blue">Dashboard</a></div>
				
				

			</div><!-- .page-content -->
		</section>
    
  </main>
  <aside class="right-sidebar right-sidebar-profile"> 
  <div class="inner-scroll">
   
  </div>
  </aside>
  <?php require_once ('./template-parts/footer.php'); ?>
  
</div>
</body>
</html>