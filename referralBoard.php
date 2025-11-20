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
    <title>Peer Network - Referral Program</title>
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

    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/fetchJSONFiles.js?<?php echo filemtime('js/fetchJSONFiles.js'); ?>" defer></script>
    <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
    <script src="js/load_posts.js?<?php echo filemtime('js/load_posts.js'); ?>" defer></script>
    <script src="js/referral.js?<?php echo filemtime('js/referral.js'); ?>" defer></script>
    <?php
      $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
      include 'meta.min.php';
      ?>
</head>

<body>
    <div id="config" class="none"
        data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
    <div id="profile" class="site_layout">
        <header class="site-header header-referralBoard">
            <img class="logo" src="svg/Home.svg" alt="Peer Network">
            <h1 class="referralBoard_h1" id="h1">Dashboard</h1>
        </header>
        <aside class="left-sidebar left-sidebar-referralBoard">
            <div class="inner-scroll for-filters">
                <!-- Load sidebar widgets -->
                <div class="inner-scroll-filters">
                    <?php require_once('./template-parts/sidebars/widget-filter.php'); ?>
                    <?php require_once('./template-parts/sidebars/widget-sort-filter.php'); ?>
                </div>
                <?php require_once('./template-parts/sidebars/widget-collapse-button.php'); ?>
            </div>
        </aside>
        <main class="site-main site-main-referralBoard">
            <div class="referralBoard_container">
                <div class="referralBoard_header">
                    <h1>Referral Program</h1>
                    <p>Invite a friend and earn <em class="bold"> 1% of their earnings</em> every time they transfer or
                        cash out <em class="bold">forever</em>. The more you refer, the more you earn!</p>
                    <p>Copy the code and share it with person. Make sure he entered it while registration.</p>
                    <div class="referral_link_container">
                        <span class="link_text" id="referralLink"></span>
                        <img src="svg/refCopy.svg" alt="Copy icon">
                    </div>
                    <!-- Copy Notification -->
                    <div class="toast" id="toast">
                        <svg class="toast_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7">
                            </path>
                        </svg>
                        <span class="toast_message">Link copied!</span>
                    </div>
                </div>
                <div class="referralBoard_body">
                    <!-- Tab Navigation -->
                    <div class="referral_tabs">
                        <div class="button referral_tab active" data-tab="invited">
                            <span class="tab_label">Invited Friends</span>
                            <!-- <span class="tab_count" id="invitedCount">0</span> -->
                        </div>
                        <div class="button referral_tab" data-tab="inviter">
                            <span class="tab_label">My Inviter</span>
                            <!-- <span class="tab_count" id="inviterCount">0</span> -->
                        </div>
                    </div>
                    <div class="referral_top">
                        <h3>Account</h3>
                    </div>
                    <!-- Content Area -->
                    <div class="referral_content">
                        <!-- Invited Friends List -->
                        <div class="referral_list active" id="invitedList">
                            <div class="loading_state" id="invitedLoading">
                                <div class="spinner"></div>
                                <p>Loading invited friends...</p>
                            </div>
                            <div class="empty_state none" id="invitedEmpty">
                                <!-- <svg class="empty_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg> -->
                                <p>You haven't referred anyone yet, <br> share your referral link to invite friends</p>
                            </div>
                            <div class="users_grid none" id="invitedUsers"></div>
                        </div>
                        <!-- My Inviter List -->
                        <div class="referral_list" id="inviterList">
                            <div class="loading_state none" id="inviterLoading">
                                <div class="spinner"></div>
                                <p>Loading inviter...</p>
                            </div>
                            <div class="empty_state none" id="inviterEmpty">
                                <!-- <svg class="empty_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg> -->
                                <p>No inviter found, <br> you joined directly without a referral</p>
                            </div>
                            <div class="users_grid none" id="inviterUsers"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <aside class="right-sidebar right-sidebar-referralBoard">
            <div class="inner-scroll">
                <!-- Load sidebar widgets -->
                <?php require_once('./template-parts/sidebars/widget-profile.php'); ?>
                <?php require_once('./template-parts/sidebars/widget-main-menu.php'); ?>
                <?php require_once('./template-parts/sidebars/widget-add-new-post.php'); ?>
                <?php require_once('./template-parts/sidebars/widget-web-version.php'); ?>
            </div>
        </aside>
        <?php require_once ('./template-parts/footer.php'); ?>
    </div>
</body>

</html>