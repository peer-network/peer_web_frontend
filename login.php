<?php
include 'phpheader.php';
include 'host.php';
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <link rel="stylesheet" href="css/register.css?<?php echo filemtime('css/register.css'); ?>" media="all" rel="preload">
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>">

    <script src="js/lib/const.js?<?php echo filemtime('js/lib/const.js'); ?>" defer></script>
    <script src="js/login/login.js?<?php echo filemtime('js/login/login.js'); ?>" defer></script>
    <script src="js/login/confirmLoginRegister.js?<?php echo filemtime('js/login/confirmLoginRegister.js'); ?>" defer></script>
    <!-- <script src="sw_instal.min.js" async></script> -->
    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
    <title>Login Peer</title>
</head>

<body class="container">
    <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>

    <aside class="bild">
        <div class="phone">
            <div class="screen">
                <img src="img/register.webp" alt="Login" width="612" height="612">
            </div>

            <div class="home-button">
                <img src="svg/logo_sw.svg" alt="PeerLogo" width="96" height="96">
            </div>
        </div>
        <img class="logo" src="svg/logo_farbe.svg" alt="Peer logo" width="96" height="96" />
    </aside>

    <form id="registerForm" class="form-container">
        <h1 class="heading">Welcome back!</h1>
        <p class="description">Almost like with any social media you can share the content you love, but with peer, you earn on the side – no fame needed!</p>
        <div class="auth">
            <div class="vector">
                <img class="bubbles" alt="bubbles" src="svg/bubbles.svg" width="351" height="128">
                <div class="buttons">
                    <img src="svg/github.svg" height="48" width="48" alt="Login with GitHub">
                    <img src="svg/google.svg" height="48" width="48" alt="Login with Google">
                    <img src="svg/apple.svg" height="48" width="48" alt="Login with Apple">
                </div>
            </div>

        </div>
        <div class="line-with-text"><span>or</span></div>
        <div class="input-field">
            <input type="email" id="email" name="e_mail" placeholder="E-Mail" required class="input-text" autocomplete="on"></input>
        </div>

        <div class="input-field">
            <input type="password" id="password" name="password" placeholder="Password" required class="input-text"></input>
            <label id="validationMessage" for="password"></label>
        </div>

        <input id="submit" class="button" type="submit" name="Login" value="Login">

        <div class="signIn">
            <a class="link" href="forgotpassword.php">forgot&nbsp;password</a>
        </div>
        <!-- <p class="description" style="opacity: 0;">Start posting with peer today!</p> -->
    </form>

    <input type="checkbox" id="disclaimer" name="disclaimer" class="checkbox">
    <label for="disclaimer" class="disclaimer-container"><img src="img/DISLAIMER.png" alt="disclaimer-image" class="disclaimer" width="3240" height="1650"></label>

</body>

</html>