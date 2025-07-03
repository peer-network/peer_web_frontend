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
        
        <form class="form-container" id="multiStepForm">
                <a id="" href="login.php" class="backBtn">
                    <img src="svg/arrow-small-left.svg" alt="">
                    <span>Back</span>
                </a>
                <section id="referralCodeForm" class="form-step" data-step="1">
                <div class="head">
                    <h1 class="heading">Welcome to <span class="extra-bold">peer!</span></h1>
                    <p class="description">One quick step left! Enter your referral code to complete registration.</p>
                </div>
                <div class="input-field">
                    <img class="referral" src="svg/referral.svg"  alt="email icon">
                    <input type="text" id="referral_code" name="referral_code" value="" placeholder="Enter referral code" class="input-text"></input>
                    <img id="copyIcon" class="copy" src="svg/copy.svg"  alt="email icon">
                    <div class="loader">
                        <svg width="60" height="30" viewBox="0 0 100 50">
                            <line x1="10" y1="25" x2="10" y2="25" stroke="#00050d" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="30" y1="25" x2="30" y2="25" stroke="#00050d" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.2s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.2s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="50" y1="25" x2="50" y2="25" stroke="#00050d" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.4s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.4s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="70" y1="25" x2="70" y2="25" stroke="#00050d" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.6000000000000001s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.6000000000000001s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="90" y1="25" x2="90" y2="25" stroke="#00050d" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.8s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.8s" repeatCount="indefinite"></animate>
                            </line>
                        </svg>
                    </div>
                </div>
                <div class="validationMessage" id="refValidationMessage" for="password"></div>
                <input class="button" type="submit" name="registrieren" value="Verify code">
                <div class="signIn">
                    <span class="description">Don't have a code?&nbsp;
                    <a id="noCodeLink" class="link" href="#"> <span class="extra-bold">Click&nbsp;here</span> </a> to get peer code.
                    </span>
                </div>
            </section>

            <section id="peersCode" class="form-step" data-step="2">
                <div class="head">
                    <h1 class="heading">This is <span class="extra-bold">peers</span> Code!</h1>
                    <p class="description">Earning starts the moment you enter this magic code.</p>
                </div>
                <div class="input-field">
                    <img class="email-icon" src="svg/referral.svg"  alt="email icon">
                    <span id="referral_code" class="referral-code">8e2b5672-84bd-4a5c-a5d0-f4bfc212ec2a</span>
                     
                    <div class="loader">
                        <svg width="60" height="30" viewBox="0 0 100 50">
                            <line x1="10" y1="25" x2="10" y2="25" stroke="#00050d" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="30" y1="25" x2="30" y2="25" stroke="#00050d" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.2s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.2s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="50" y1="25" x2="50" y2="25" stroke="#00050d" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.4s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.4s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="70" y1="25" x2="70" y2="25" stroke="#00050d" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.6000000000000001s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.6000000000000001s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="90" y1="25" x2="90" y2="25" stroke="#00050d" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.8s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.8s" repeatCount="indefinite"></animate>
                            </line>
                        </svg>
                    </div>
                </div>
                <div class="validationMessage" id="refValidationMessage" for="password"></div>
                <input id="submitStep2" class="button" type="submit" name="registrieren" value="Use this code">
            </section>
        </form>

        <form id="registerForm" class="form-container none">
            <a id="back-btn" href="#" class="backBtn">
                <img src="svg/arrow-small-left.svg" alt="">
                <span>Back</span>
            </a>
            <section class="form-step none" data-step="1">
                <div class="head">
                    <h1 class="heading">Register</h1>
                    <p class="description">Create your account in few seconds and start earning on your favorite content.</p>
                </div>
                <div class="input-field">
                    <img class="email-icon" src="svg/email-icon.svg"  alt="email icon">
                    <input type="email" id="email" name="e_mail" placeholder="E-Mail" required class="input-text" autocomplete="on"></input>
                    <img class="tick" src="svg/tick-icon.png" alt="tick">
                </div>
                <div class="validationMessage" id="emailValidationMessage" for="register"></div>
                <div class="input-field">
                    <img class="user" src="svg/user.svg" alt="tick">
                    <input type="text" id="username" name="username" class="input-text" placeholder="Username" required autocomplete="on"></input>
                    <img class="tick" src="svg/tick-icon.png" alt="tick">
                </div>
                <!-- Password Component -->
                <div class="password-component" data-show-strength="true" data-show-message="false" data-name="password"></div>
                <!-- Confirm Password Component -->
                <div class="confirm-password-component"  data-name="confirm_password"></div>
                <input class="button" type="submit" name="registrieren" value="Register">
                <div class="validationMessage" id="regValidationMessage" for="register"></div>
                <div class="regLoader" id="registerLoader">
                        <svg width="120" height="60" viewBox="0 0 100 50">
                            <line x1="10" y1="25" x2="10" y2="25" stroke="#fff" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="30" y1="25" x2="30" y2="25" stroke="#fff" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.2s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.2s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="50" y1="25" x2="50" y2="25" stroke="#fff" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.4s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.4s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="70" y1="25" x2="70" y2="25" stroke="#fff" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.6000000000000001s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.6000000000000001s" repeatCount="indefinite"></animate>
                            </line>
                            <line x1="90" y1="25" x2="90" y2="25" stroke="#fff" stroke-width="4" stroke-linecap="round">
                                <animate attributeName="y1" values="25;10;25" dur="1s" begin="0.8s" repeatCount="indefinite"></animate>
                                <animate attributeName="y2" values="25;40;25" dur="1s" begin="0.8s" repeatCount="indefinite"></animate>
                            </line>
                        </svg>
                    </div>
                
                <div class="signIn">
                    <span class="description">Already have an account?&nbsp;</span>
                    <a class="link" href="login.php">Sign&nbsp;in</a>
                </div>
                <!-- <p class="description" style="opacity: 0;">Start posting with peer today!</p> -->
            </section>
        </form>

        <div class="ageConfirmation form-container none" id="ageConfirmation">
            <section class="ageConfirm" data-step="1">
                <img src="svg/ageIcon.svg" alt="">
                <p>You must be 18+ to proceed. By continuing, you confirm your eligibility.</p>
                <div class="button-row">
                    <button class="btn-transparent" id="cancelAge">No, I'm under 18 </button>
                    <button class="btn-red" id="confirmAge">I am 18+</button>
                </div>
                <div class="validationMessage" id="ageValidationMessage" for="register"></div>
            </section>

            <section class="ageConfirm" data-step="2">
                <img src="svg/ageIcon.svg" alt="">
                <h2>Age requirement are not met!</h2>
                <p>Per our Terms of Service, this application is restricted to users aged 18 and above.</p>
                <div class="button-row">
                    <a class="btn-transparent" href="login.php" id="cancelAge">Exit</a>
                    <a class="btn-red" href="" id="confirmAge">Read Policy</a>
                </div>
            </section>

            <section class="ageConfirm" data-step="3">
                <img src="svg/confirmIcon.svg" alt="">
                <h2>Welcome to <span class="extra-bold">peer!</span></h2>
                <p>Your account is ready! Start exploring and earn your first token today.</p>
                <a href="login.php" class="button">
                    <span>Login&nbsp;</span>
                </a>
                <div class="validationMessage" id="finalValidationMessage" for="register"></div>
            </section>

        </div>

        <div class="footer">
            <span>By continuing, you agree to</span>
            <a href="" class="privacy regPr">Privacy Policy</a>
            <p class="version">Version 1.0.0</p>
        </div>
    </div>
</body>

</html>