<?php
include 'phpheader.php';
include 'host.php';
$message = "";
if (isset($_GET['message'])) {
    switch ($_GET['message']) {
        case 'unauthorized':
            $message = "You do not have access. Please log in to continue.";
            break;
        case 'sessionExpired':
            $message = "Your session has expired. Please log in again.";
            break;
        case 'mustLogin':
            $message = "Please log in to access your dashboard.";
            break;
        case 'walletAccessDenied':
            $message = "Please log in to access your wallet.";
            break;
    }
}
?>
<!DOCTYPE html>
<html lang="de">
<?php if ($message): ?>
<div class="alert alert-warning"><?= htmlspecialchars($message) ?></div>
<?php endif; ?>

<head>
    <link rel="stylesheet" href="css/register.css?<?php echo filemtime('css/register.css'); ?>" media="all" rel="preload">
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>">
    <script src="js/lib/modal.js?<?php echo filemtime('js/lib/modal.js'); ?>" defer></script>
    <script src="js/login/login.js?<?php echo filemtime('js/login/login.js'); ?>" defer></script>
    <script src="js/login/confirmLoginRegister.js?<?php echo filemtime('js/login/confirmLoginRegister.js'); ?>" defer></script>
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
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
        <div class="peerLogo">
            <img src="svg/logo_farbe.svg" alt="Peer logo"/>
            <h1>peer</h1>
        </div>
        <div class="head">
            <h1 class="heading">Hey there, <span class="waving-hand">👋</span><br> Welcome back!</h1>
            <p class="description">It’s good to see you again! Log in to continue your journey with us!</p>
        </div>
        <div class="input-field">
            <img src="svg/email-icon.svg"  alt="">
            <input type="email" id="email" name="e_mail" placeholder="E-Mail" required class="input-text" autocomplete="on"></input>
        </div>

        <div class="input-field">
            <img src="svg/lock1.svg" alt="">
            <input type="password" id="password" name="password" placeholder="Password" required class="input-text"></input>
            <label id="validationMessage" for="password"></label>
        </div>
        <div class="rem-for">
            <label for="rememberMe"><input type="checkbox" id="rememberMe" name="rememberMe"/>Remember me</label>
            <a class="link" href="forgotpassword.php">forgot&nbsp;password?</a>
        </div>
        <input id="submit" class="button" type="submit" name="Login" value="Login">
        <div class="line-with-text"><span>or</span></div>
        <a href="register.php" class="button reg">
            <span>Register&nbsp;now</span>
            <img src="svg/arrow1.svg" alt="">
        </a>
        <!-- <p class="description" style="opacity: 0;">Start posting with peer today!</p> -->
    </form>

</body>

</html>