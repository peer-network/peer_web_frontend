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
    <title>Create Post</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css'>
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-solid-rounded/css/uicons-solid-rounded.css'>
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-thin-straight/css/uicons-thin-straight.css'>
    <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />
    <link rel="stylesheet" href="css/add-post.css?<?php echo filemtime('css/add-post.css'); ?>" />
    <link rel="stylesheet" href="css/all-post.css?<?php echo filemtime('css/all-post.css'); ?>" />
    <link rel="stylesheet" href="css/view-post.css?<?php echo filemtime('css/view-post.css'); ?>" />
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
    <link rel="stylesheet" href="css/crop.css?<?php echo filemtime('css/crop.css'); ?>" />

    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/audio.js?<?php echo filemtime('js/audio.js'); ?>" async></script>
    <script src="js/crop.js?<?php echo filemtime('js/crop.js'); ?>" defer></script>
    <script src="js/posts.js?<?php echo filemtime('js/posts.js'); ?>" defer></script>
    <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
    <script src="js/add_post.js?<?php echo filemtime('js/add_post.js'); ?>" defer></script>
    <script src="js/voiceRecorderApi.js?<?php echo filemtime('js/voiceRecorderApi.js'); ?>" defer></script>

    <script src="js/ffmpeg/ffmpeg/package/dist/umd/ffmpeg.js?<?php echo filemtime('js/ffmpeg/ffmpeg/package/dist/umd/ffmpeg.js'); ?>"></script>
    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>

<body>
    <div id="config" class="none"
        data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>">
    </div>
    <div id="addPost" class="site_layout">
        <header class="site-header header-profile">
            <img class="logo" src="svg/newpost-fill.svg" alt="Peer Network">
            <h1 id="h1">Text Post</h1>
        </header>

        <aside class="left-sidebar left-sidebar-createpost">
            <div class="inner-scroll">
                <!-- Load sidebar widgets -->
                <?php require_once('./template-parts/sidebars/widget-create-post-filter.php'); ?>
            </div>
        </aside>

        <main class="site-main site-main-createpost">
            <div id="addPostSection">
                <?php require_once ('./template-parts/content-parts/add-post.php'); ?>
            </div>

            <div id="previewSection" class="none">
                <?php require_once('./template-parts/content-parts/preview.php'); ?>
            </div>
        </main>

        <aside class="right-sidebar right-sidebar-createpost">
            <div class="inner-scroll">
                <!-- Load sidebar widgets -->
                <?php require_once('./template-parts/sidebars/widget-profile.php'); ?>
                <?php require_once('./template-parts/sidebars/widget-main-menu.php'); ?>
                <?php require_once('./template-parts/sidebars/widget-add-new-post.php'); ?>
                <?php require_once('./template-parts/sidebars/widget-web-version.php'); ?>
            </div>
        </aside>
        <?php require_once('./template-parts/footer.php'); ?>
    </div>
    <dialog id="videocodierung">
        <img src="svg/logo_farbe.svg" alt="codierung">
        The video is being re-encoded.
        <span id="nocursor" tabindex="-1"></span>
    </dialog>
    <dialog id="videoloading">
        <img src="svg/logo_farbe.svg" alt="codierung">
        The file is loading.
    </dialog>
</body>

</html>