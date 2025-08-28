<?php
header('Access-Control-Allow-Origin: *');
//include 'phpheader.php';
include 'host.php';

?>
<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Peer Network - View Post</title>
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
    <link rel="stylesheet" href="<?= $baseUrl ?>/css/style.css" />

    <link rel="stylesheet" href="<?= $baseUrl ?>/css/all-post.css" />
    <link rel="stylesheet" href="<?= $baseUrl ?>/css/modal.css" />
    <link rel="stylesheet" href="<?= $baseUrl ?>/css/view-post.css" />
    <link rel="stylesheet" href="<?= $baseUrl ?>/css/post.css" />
    

    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="<?= $baseUrl ?>/js/lib.min.js" defer></script>
    <script src="<?= $baseUrl ?>/js/audio.js" async></script>
    <script src="<?= $baseUrl ?>/js/comments.js" defer></script>
    <script src="<?= $baseUrl ?>/js/global.js" defer></script>
    


    
    <script src="<?= $baseUrl ?>/js/guestpost.js" defer></script>


    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>

<body>
    <div id="config" class="none"
        data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>">
    </div>
    <div id="nonuser-viewpost" class="site_layout_nonuser">
       

      
        <main class="site-main-nonuser postloader">
            <div class="site-main-nonuser-inner">
                <div class="view-only-mode">

                <div class="site-logo"><img class="logo" src="<?= $baseUrl ?>/svg/peerLogoWhite.svg" alt="Peer Network"></div>
                    
                        <div class="view-only-mode-heading">
                            <svg xmlns="http://www.w3.org/2000/svg" width="59" height="40" viewBox="0 0 59 40" fill="none">
                                <path d="M29.5 32C32.8523 32 35.7017 30.8333 38.0483 28.5C40.3949 26.1667 41.5682 23.3333 41.5682 20C41.5682 16.6667 40.3949 13.8333 38.0483 11.5C35.7017 9.16667 32.8523 8 29.5 8C26.1477 8 23.2983 9.16667 20.9517 11.5C18.6051 13.8333 17.4318 16.6667 17.4318 20C17.4318 23.3333 18.6051 26.1667 20.9517 28.5C23.2983 30.8333 26.1477 32 29.5 32ZM29.5 27.2C27.4886 27.2 25.779 26.5 24.371 25.1C22.9631 23.7 22.2591 22 22.2591 20C22.2591 18 22.9631 16.3 24.371 14.9C25.779 13.5 27.4886 12.8 29.5 12.8C31.5114 12.8 33.221 13.5 34.629 14.9C36.0369 16.3 36.7409 18 36.7409 20C36.7409 22 36.0369 23.7 34.629 25.1C33.221 26.5 31.5114 27.2 29.5 27.2ZM29.5 40C22.9742 40 17.0295 38.1889 11.6659 34.5667C6.30227 30.9444 2.41364 26.0889 0 20C2.41364 13.9111 6.30227 9.05556 11.6659 5.43333C17.0295 1.81111 22.9742 0 29.5 0C36.0258 0 41.9705 1.81111 47.3341 5.43333C52.6977 9.05556 56.5864 13.9111 59 20C56.5864 26.0889 52.6977 30.9444 47.3341 34.5667C41.9705 38.1889 36.0258 40 29.5 40ZM29.5 34.6667C34.5508 34.6667 39.1881 33.3444 43.4119 30.7C47.6358 28.0556 50.8652 24.4889 53.1 20C50.8652 15.5111 47.6358 11.9444 43.4119 9.3C39.1881 6.65556 34.5508 5.33333 29.5 5.33333C24.4492 5.33333 19.8119 6.65556 15.5881 9.3C11.3642 11.9444 8.13485 15.5111 5.9 20C8.13485 24.4889 11.3642 28.0556 15.5881 30.7C19.8119 33.3444 24.4492 34.6667 29.5 34.6667Z" fill="white"/>
                            </svg>
                            <span class="xl_font_size">View-only mode</span>
                        </div>
                        <p class="md_font_size txt-color-gray">Sign up to interact and access everything!</p>
                   
                </div>
            
                <?php require_once('./template-parts/content-parts/view-post.php'); ?>

                <div class="signup-button-container">
                    <a href="<?= $baseUrl ?>/register.php" class="button btn-blue">Sign Up</a>
                </div>
            </div>

        
        </main>
       
        <?php require_once('./template-parts/footer.php'); ?>
        
    </div>
</body>

</html>