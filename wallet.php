<?php
header('Access-Control-Allow-Origin: *');
include 'phpheader.php';
include 'host.php';
?>
<!DOCTYPE html>
<html lang="de">

<head>
  <link rel="stylesheet" href="css/dashboard.css?<?php echo filemtime('css/dashboard.css'); ?>" />
  <link rel="stylesheet" href="css/wallet.css?<?php echo filemtime('css/wallet.css'); ?>" />
  <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
  <link rel="stylesheet" href="css/scrollshadow.css?<?php echo filemtime('css/scrollshadow.css'); ?>" />

  <!-- <script src="sw_instal.min.js" async></script> -->
  <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
  <script src="js/wallet.js?<?php echo filemtime('js/wallet.js'); ?>" defer></script>

  <?php
  $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
  include 'meta.min.php';
  ?>
  <title>Wallet</title>
</head>

<body>
  <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
  <header>
    <svg class="none">

    </svg>
  </header>

  <article id="dashboard" class="dashboard">
    <header id="header">
      <div id="DashboardHeader" class="header">
        <div>
          <img src="svg/logo_sw.svg" alt="Peer Network Logo" />
          <h1 id="h1">Wallet</h1>
        </div>

      </div>
    </header>

    <!-- Sidebar -->
    <aside class="sidebar">

    </aside>

    <!-- Main Content Area (Mittlere Spalte mit einem inneren Grid) -->
    <main id="main" class="main ">
      <div id="wallet">
        <div id="wallet-person">
        </div>
        <div id="freecontent">
          <h2 id="timeuntil">Time until next Mint</h2>
          <div class="radial-progress" id="nextmintRadial" style="--progress: 65">
            <div class="value">
              <span id="nextminttime">03:46:54</span>
              <div class="label"><span id="nextminthours">&nbsp;&nbsp;</span><span>&nbsp;hrs,&nbsp;</span><span id="nextmintminutes">&nbsp;&nbsp;</span><span>&nbsp;min,&nbsp;</span><span id="nextmintseconds">&nbsp;&nbsp;</span><span>&nbsp;sec</span></div>
            </div>
          </div>
          <div class="con-freeaction">
            <h2>Daily free actions</h2>
            <div class="limit-container">
              <div class="label">
                Likes
                <span>(</span>
                <span id="Likesused">&nbsp;</span>
                <span>/</span>
                <span id="Likesavailable">&nbsp;</span>
                <span>&nbsp;left)</span>
              </div>
              <div class="progress-bar">
                <div id="LikesStat" class="progress" style="--progress: 0%;"></div>
              </div>
            </div>

            <div class="limit-container">
              <div class="label">
                Comments
                <span>(</span>
                <span id="Commentsused">&nbsp;</span>
                <span>/</span>
                <span id="Commentsavailable">&nbsp;</span>
                <span>&nbsp;left)</span>
              </div>
              <div class="progress-bar">
                <div id="CommentsStat" class="progress" style="--progress: 0%;"></div>
              </div>
            </div>

            <div class="limit-container">
              <div class="label">
                Posts
                <span>(</span>
                <span id="Postsused">&nbsp;</span>
                <span>/</span>
                <span id="Postsavailable">&nbsp;</span>
                <span>&nbsp;left)</span>
              </div>
              <div class="progress-bar">
                <div id="PostsStat" class="progress" style="--progress: 0%;"></div>
              </div>
            </div>
          </div>
        </div>
        <div id="wallet-amount">
          <div class="token">
            <span id="token"></span>
            <img src="svg/logo_sw.svg" alt="peer token" class="logo" />
            <p>Token Total</p>
          </div>
          <div class="money">
            <span id="money"></span>
            <span></span>
            <p>Money Total (EUR)</p>
          </div>
          <!-- <div class="gems">
            <span id="gems"></span>
            <img src="svg/gem.svg" alt="peer token" class="logo" />
            <p>Gems Total (All time)</p>
          </div> -->
        </div>

      </div>
    </main>

    <!-- Extra Content Area (Rechte Spalte) -->
    <aside class="profil">
      <div id="profil-container">
        <!-- Profil-Bild und Name -->
        <div class="profile-header">
          <div id="cropContainer" class="cropContainer">
            <img id="profilbild" src="svg/noname.svg" alt="Profile Picture" class="profile-picture" />
            <!-- <img id="editProfileImage" src="svg/edit.svg" alt="edit">
                        <img id="cropButton" src="svg/ok.svg" alt="edit"> -->
          </div>
          <!-- <div id="badge" class="badge"></div> -->
          <h2 id="username">&nbsp;</h2>
          <p id="slug" class="username">&nbsp;</p>
        </div>

        <!-- Statistiken -->
        <div class="stats">
          <div class="stat">
            <span id="userPosts">&nbsp;</span>
            <p>Posts</p>
          </div>
          <div class="stat">
            <span id="followers">&nbsp;</span>
            <p>Followers</p>
          </div>
          <div class="stat">
            <span id="following">&nbsp;</span>
            <p>Following</p>
          </div>
        </div>

        <!-- Menü -->
        <a href="dashboard.php" class="menu-item ">
          <img class="icon" src="svg/icon-dashboard.svg" alt="dashboard" />
          <p>Dashboard</p>
        </a>
        <div class="menu-item comming-soon">
          <img class="icon" src="svg/icon-messages.svg" alt="messages" />
          <p>Messages</p>
          <div class="notification-badge">8</div>
        </div>
        <div class="menu-item comming-soon">
          <img class="icon" src="svg/icon-network.svg" alt="network" />
          <p>Network</p>
        </div>
        <div class="menu-item active">
          <img class="icon" src="svg/icon-wallet.svg" alt="wallet" />
          <p>Wallet</p>
        </div>

      </div>
      </div>
      <div id="profil-login" class="none">
        <a href="/login.php">login</a>
        <a href="/register.php">register</a>
      </div>
    </aside>

  </article>
  <div id="overlay" class="none scrollable">

  </div>
  </div>
</body>

</html>