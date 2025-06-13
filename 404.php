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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
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