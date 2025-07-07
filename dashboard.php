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
    <title>Peer Network - Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />

    <link rel="stylesheet" href="css/all-post.css?<?php echo filemtime('css/all-post.css'); ?>" />
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
    <link rel="stylesheet" href="css/view-post.css?<?php echo filemtime('css/view-post.css'); ?>" />


    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/lib/modal.js?<?php echo filemtime('js/lib/modal.js'); ?>" defer></script>
    <script src="js/audio.js?<?php echo filemtime('js/audio.js'); ?>" async></script>
    <script src="js/posts.js?<?php echo filemtime('js/posts.js'); ?>" defer></script>
    <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
    <script src="js/load_posts.js?<?php echo filemtime('js/load_posts.js'); ?>" defer></script>


    <script src="js/dashboard.js?<?php echo filemtime('js/dashboard.js'); ?>" defer></script>


    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>

<body>
    <div id="config" class="none"
        data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
    <div id="dashboard" class="site_layout">
        <header class="site-header header-dashboard">
            <img class="logo" src="svg/Home.svg" alt="Peer Network">
            <h1 id="h1">Dashboard</h1>
        </header>

        <aside class="left-sidebar left-sidebar-dashboard">
            <div class="inner-scroll">
                <!-- Load sidebar widgets -->
                <?php require_once ('./template-parts/sidebars/widget-filter.php'); ?>
                <?php require_once ('./template-parts/sidebars/widget-sort-filter.php'); ?>
                <?php require_once ('./template-parts/sidebars/widget-daily-action.php'); ?>

            </div>
        </aside>

        <main class="site-main site-main-dashboard">
            <svg class="none">
                <symbol id="post-comment" viewBox="0 0 44 45">
                    <path
                        d="m4.4 33c0.092-0.449 0.0274-0.915-0.183-1.32-1.42-2.74-2.22-5.86-2.22-9.17 0-3.96 1.17-7.82 3.37-11.1 2.2-3.29 5.32-5.85 8.98-7.37s7.68-1.91 11.6-1.14c3.88 0.772 7.44 2.68 10.2 5.47 2.8 2.8 4.7 6.36 5.47 10.2s0.376 7.9-1.14 11.6c-1.51 3.65-4.08 6.78-7.37 8.98s-7.16 3.37-11.1 3.37c-3.31 0-6.43-0.8-9.17-2.22-0.407-0.21-0.873-0.275-1.32-0.183l-8.94 1.83 1.83-8.94z"
                        fill="none" stroke="#FFFAFA" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" />
                </symbol>
                <symbol id="post-like" viewBox="0 0 48 45">
                    <path id="mener"
                        d="m34.3 2.5c-4.5 0-8.38 2.66-10.3 6.54-1.95-3.88-5.83-6.54-10.3-6.54-6.45 0-11.7 5.46-11.7 12.2s4 12.9 9.16 17.9 12.8 9.88 12.8 9.88 7.42-4.74 12.8-9.88c5.78-5.48 9.16-11.2 9.16-17.9s-5.22-12.2-11.7-12.2z"
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="4" />
                </symbol>
                <symbol id="post-view" fill="none" viewBox="0 0 56 39">
                    <g stroke="#FFFAFA" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                        <path
                            d="m36.4 19.5c0 2.22-0.885 4.34-2.46 5.91s-3.71 2.45-5.94 2.45-4.36-0.88-5.94-2.45-2.46-3.69-2.46-5.91c0-2.22 0.885-4.34 2.46-5.91 1.58-1.57 3.71-2.45 5.94-2.45s4.36 0.88 5.94 2.45c1.58 1.57 2.46 3.69 2.46 5.91z" />
                        <path
                            d="m28 37c-11.9 0-21.5-7.17-25.8-17.5 4.36-10.3 14-17.5 25.8-17.5s21.5 7.17 25.8 17.5c-4.36 10.3-14 17.5-25.8 17.5z" />
                    </g>
                </symbol>
                <symbol id="multi" viewBox="0 0 100 100">
                    <g fill="none" stroke="#00bdff" stroke-linejoin="round" stroke-width="9">
                        <rect x="10" y="10" width="65" height="65" />
                        <rect x="25" y="25" width="65" height="65" />
                    </g>
                </symbol>
            </svg>
            <?php require_once ('./template-parts/content-parts/post-search-filters.php'); ?>

            <!-- Load Posts Container -->
            <div id="allpost" class="list_all_post"> </div>
            <div id="post_loader"><img src="svg/logo_farbe.svg" alt="loading" /></div>
            <div id="no_post_found" class="no_post_found">No Post found...</div>
            <!-- End: Load Posts Container -->
        </main>

        <aside class="right-sidebar right-sidebar-dashboard">
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