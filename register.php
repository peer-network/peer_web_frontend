<?php
include 'phpheader.php';
include 'host.php';

?>
<!DOCTYPE html>
<html lang="de">

<head>
    <link rel="stylesheet" href="css/register.css?<?php echo filemtime('css/register.css'); ?>" media="all" rel="preload">
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>">
    <script src="js/register/confirmLoginRegister.js?<?php echo filemtime('js/register/confirmLoginRegister.js'); ?>" defer></script>
    <script src="js/register/register.js?<?php echo filemtime('js/register/register.js'); ?>" defer></script>
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <!-- <script src="js/sw_instal.min.js" defer></script> -->
    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
    <title>Registrierungsbildschirm</title>
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
        <h1 class="heading">Get started!</h1>
        <p class="description">Almost like with any social media you can share the content you love, but with peer, you earn on the side – no fame needed!</p>
        <div class="input-field">
            <input type="text" id="username" name="username" class="input-text" placeholder="Username" required autocomplete="on"></input>
        </div>
        <div class="input-field">
            <input type="email" id="email" name="e_mail" placeholder="E-Mail" required class="input-text" autocomplete="on"></input>
        </div>
        <div class="br"></div>
        <div class="input-field">
            <input type="password" id="password" name="password" placeholder="Password" required class="input-text"></input>
        </div>
        <div class="input-field">
            <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm Password" required class="input-text"></input>
            <label id="validationMessage" for="password"></label>
        </div>
        <div class="input-field">
            <input type="text" id="referral_code" name="referral_code" value="" placeholder="Enter referral code" class="input-text"></input>
            <label id="validationMessage" for="password"></label>
        </div>
        <input class="button" type="submit" name="registrieren" value="Registrieren">
        <div id="modalOverlay" class="modal-overlay none">
            <div class="modal-box">
                <h2>Confirm Your Identity</h2>
                <label for="notBot"><input type="checkbox" id="notBot"/> I'm not a bot</label><br/>
                <label for="ageCheck"><input type="checkbox" id="ageCheck"/> I'm 18+ years old</label><br/>
                <button id="confirmSubmit">Continue</button>
            </div>
        </div>
        <div class="signIn">
            <span class="description">Already have an account?&nbsp;</span>
            <a class="link" href="login.php">Sign&nbsp;in</a>
        </div>
        <!-- <p class="description" style="opacity: 0;">Start posting with peer today!</p> -->
    </form>

</body>

</html>