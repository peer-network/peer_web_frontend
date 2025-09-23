<?php
include 'phpheader.php';
include 'host.php';
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <link rel="stylesheet" href="css/password.css?<?php echo filemtime('css/password.css'); ?>">
    <link rel="stylesheet" href="css/register.css?<?php echo filemtime('css/register.css'); ?>" media="all" rel="preload">
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>">
    <script src="js/password.js?<?php echo filemtime('js/password.js'); ?>" defer></script>
    <script src="js/confirmPassword.js?<?php echo filemtime('js/confirmPassword.js'); ?>" defer></script>
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

    <div class="cont">
        <div class="inner-cont">
            <div class="back-btn">
                <a id="back-btn" href="login.php" class="backBtn">
                    <img src="svg/arrow-small-left.svg" alt="">
                    <span>Back</span>
                </a>
            </div>

            <!-- 🔹 Age confirmation FIRST -->
            <div class="ageConfirmation form-container" id="ageConfirmation">
                <section class="ageConfirm ageConfirm1" data-step="1">
                    <img src="svg/ageIcon.svg" alt="">
                    <p>You must be 18+ to proceed. By continuing, you confirm your eligibility.</p>
                    <div class="button-row">
                        <button class="btn-transparent" id="cancelAge">No, I'm under 18</button>
                        <button class="btn-red" id="confirmAge">I am 18+</button>
                    </div>
                    
                </section>

                <section class="ageConfirm ageConfirm2" data-step="2">
                    <img src="svg/Union.svg" alt="">
                    <h2>Oops! Age confirmation needed</h2>
                    <p class="ageConfirm2_p">To use Peer, you need to confirm that you're 18 or older. Unfortunately, we can't continue without this confirmation.</p>
                    <div class="button-row">
                        <a class="button btn-blue" href="login.php" id="cancelAge">Exit</a>
                    </div>
                </section>

                <section class="ageConfirm ageConfirm3" data-step="3">
                    <img src="svg/confirmIcon.svg" alt="">
                    <h2>Welcome to <span class="extra-bold">peer!</span></h2>
                    <p>Your account is ready! Start exploring and earn your first token today.</p>
                    <a href="login.php" class="button"><span>Login&nbsp;</span></a>
                    <!-- <div class="validationMessage" id="finalValidationMessage" for="register"></div> -->
                </section>
            </div>

            <!-- 🔹 Referral form AFTER age -->
            <form class="form-container none" id="multiStepForm">
                <section id="referralCodeForm" class="referral_formStep" data-step="1">
                    <div class="head">
                        <h1 class="heading">Welcome to <span class="extra-bold">peer!</span></h1>
                        <p class="description">One quick step left! Enter your referral code to continue registration.</p>
                    </div>
                    <div class="input-field">
                        <img class="referral" src="svg/referral.svg" alt="referral icon">
                        <input type="text" id="referral_code" name="referral_code" value="" placeholder="Enter referral code" class="referral_code input-text">
                        <img id="copyIcon" class="copy" src="svg/copy.svg" alt="copy icon">
                       
                    </div>
                    <div class="validationMessage" id="refValidationMessage" for="password"></div>
                    <input id="submitStep1" class="button" type="submit" value="Verify code">
                    <div class="signIn_peer">
                        <span class="description">Don't have a code?&nbsp;
                            <a id="noCodeLink" class="link" href="#"><span class="extra-bold">Click&nbsp;here</span></a> to use peer code.
                        </span>
                    </div>
                </section>

                <section id="peersCode" class="referral_formStep" data-step="2">
                    <div class="head">
                        <h1 class="heading">Claim your invitation</h1>
                        <p class="description">Earning starts the moment you enter this magic code.</p>
                    </div>
                    <div class="input-field">
                        <img class="email-icon" src="svg/referral.svg" alt="referral icon">
                        <span id="referral-code-company" class="referral-code referral_code">85d5f836-b1f5-4c4e-9381-1b058e13df93</span>
                        <img id="copyIcon" class="copy" src="svg/copy.svg" alt="copy icon">
                        <!-- <div class="loader">loader reused</div> -->
                    </div>
                    <!-- <div class="validationMessage" id="refValidationMessage"></div> -->
                    <input id="submitStep2" class="button" type="submit" value="Use this code">
                </section>
            </form>

            <!-- 🔹 Register form after referral -->
            <form id="registerForm" class="form-container none">
                <section class="form-step " data-step="1">
                    <div class="head">
                        <h1 class="heading">Register</h1>
                        <p class="description">Create your account in a few seconds and start earning.</p>
                    </div>
                    <div id="regField" class="input-field">
                        <img class="email-icon" src="svg/email-icon.svg" alt="email icon">
                        <input type="email" id="email" name="e_mail" placeholder="E-Mail" required class="input-text" autocomplete="on">
                        <img id="emailValidationIcon" class="tick none" src="svg/tick-icon.svg" alt="tick">
                    </div>
                    <div class="validationMessage" id="emailValidationMessage"></div>
                    <div id="regField" class="input-field">
                        <img class="user" src="svg/user.svg" alt="user">
                        <input type="text" id="username" name="username" class="input-text" placeholder="Username" required autocomplete="off" onfocus="this.removeAttribute('readonly')" readonly>
                        <img id="userValidationIcon" class="tick none" src="svg/tick-icon.svg" alt="tick">
                    </div>
                    <div class="validationMessage" id="userValidationMessage"></div>
                    
                    <!-- Password Component -->
                    <div class="password-component" data-show-strength="true" data-show-message="false" data-name="password"></div>
                    <!-- Confirm Password Component -->
                    <div class="confirm-password-component" data-name="confirm_password"></div>

                    <input id="registerBtn" class="button" type="submit" value="Register">
                    <div class="validationMessage" id="regValidationMessage"></div>
                    <!-- <!-- <div class="regLoader" id="registerLoader">loader reused</div>  -->

                    <div class="signIn">
                        <span class="description">Already registered?&nbsp;</span>
                        <a class="link" href="login.php">Login&nbsp;now</a>
                    </div>
                </section>
            </form>

            <div class="footer">
                <a href="https://www.freeprivacypolicy.com/live/02865c3a-79db-4baf-9ca1-7d91e2cf1724" class="privacy regPr">Privacy Policy</a>
                <p class="version">Version 1.0.0</p>
            </div>
        </div>
    </div>
</body>


</html>