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
<head>
   <title>Peer Network - Login</title>
   <meta charset="UTF-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="fonts/font-poppins/stylesheet.css?<?php echo filemtime('fonts/font-poppins/stylesheet.css'); ?>">
    <link rel="stylesheet" href="fonts/peer-icon-font/css/peer-network.css?<?php echo filemtime('fonts/peer-icon-font/css/peer-network.css'); ?>">
    <link rel="stylesheet" href="css/login-register.css?<?php echo filemtime('css/login-register.css'); ?>" media="all" rel="preload">
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/fetchJSONFiles.js?<?php echo filemtime('js/fetchJSONFiles.js'); ?>" defer></script>
    <script src="js/login/login.js?<?php echo filemtime('js/login/login.js'); ?>" defer></script>
    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>

<body>
    <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>

    <div class="container large_font">
        <div class="container_left">
            <div class="phone">
                <div class="screen">
                    <img src="img/register.webp" alt="Login" width="612" height="612">
                </div>
                <div class="home-button">
                    <img src="svg/logo_sw.svg" alt="PeerLogo" width="96" height="96">
                </div>
            </div>
            <img class="logo" src="svg/logo_farbe.svg" alt="Peer logo" width="96" height="96" />
        </div>
        <div class="container_right">
            <div class="container_inner">
                <div class="top_head_area">
                    <?php if ($message): ?>
                    <div class="error-warning medium_font">
                    <span aria-hidden="true">
                        <i class="peer-icon  peer-icon-warning"></i>
                    </span> 
                    <?php echo htmlspecialchars($message); ?>
                    </div>
                <?php endif; ?>
    
                </div>
                
                <div class="center_area">
        
                    <div class="form-step active" id="loginStep" >
                        <div class="step-header">
                            <div class="peerLogo">
                                <img src="svg/PeerLogoWhite.svg" alt="Peer logo">
                            </div>
                            <h2 class="x_large_font">
                                Hey there,<br />
                                Welcome back
                            </h2>
                            <p class="large_font">It's good to see you again! Log in to continue your journey with us!</p>
                        </div>

                        <form id="loginForm" novalidate>
                            <!-- Email Field -->
                            <div class="input-group">
                                <div class="input-field" id="emailField">
                                    <span class="input-icon" aria-hidden="true">
                                        <i class="peer-icon peer-icon-envelope"></i>
                                    </span>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        placeholder="E-mail"
                                        required
                                        aria-describedby="emailValidation emailHelp"
                                        autocomplete="email"
                                    >
                                    <span class="validation-icon" id="emailValidIcon" aria-hidden="true">
                                        <i class="peer-icon peer-icon-tick-circle"></i>
                                    </span>
                                </div>
                                <div class="validation-message medium_font" id="emailValidation" role="alert" aria-live="polite"></div>
                                <div id="emailHelp" class="sr-only">Enter a valid email address</div>
                            </div>

                           

                            <!-- Password Field -->
                            <div class="input-group">
                                
                                <div class="input-field" id="passwordField">
                                    <span class="input-icon" aria-hidden="true">
                                        <i class="peer-icon peer-icon-lock"></i>
                                    </span>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password"
                                        placeholder="Password"
                                        required
                                        aria-describedby="passwordValidation passwordHelp passwordStrength"
                                        autocomplete="new-password"
                                    >
                                    
                                    <span class="toggle-passwordBtn-icon" id="togglePasswordBtn" title="Toggle password visibility" aria-label="Show/hide password">
                                       <i class="peer-icon peer-icon-eye-close"></i> 
                                    </span>
                                </div>
                                <div class="validation-message medium_font" id="passwordValidation" role="alert" aria-live="polite"></div>
                                
                              
                            </div>
                            <div class="input-group remember_forgetlink">
                               
                                <!-- Remember me Checkbox -->
                                <div class="checkbox-field" id="rememberMeField">
                                    <label class="checkbox-wrapper" for="rememberMe">
                                        <input 
                                            type="checkbox" 
                                            id="rememberMe" 
                                            name="rememberMe"
                                            aria-describedby="checkboxValidation"
                                        >
                                        <span class="checkbox-label medium_font">
                                            Remember me
                                        </span>
                                    </label>
                                </div>

                                 
                                <div class="forgetpassword-link medium_font" >
                                    <a href="forgotpassword.php">Forgot password?</a>
                                </div>
                                <!-- Validation Message -->
                                <div class="validation-message medium_font" id="checkboxValidation" role="alert" aria-live="polite"></div>
                                
                                
                            </div>
                           

                            <button type="submit" class="btn btn-primary" id="loginBtn">
                                Login
                            </button>
                            
                        </form>

                        <div class="line-with-text"><span class="medium_font">OR</span></div>
                           
                        <a href="register.php" class="btn btn-white">Register now <span aria-hidden="true"><i class="peer-icon medium_font peer-icon-arrow-right-bold"></i></span></a>
                                
                    </div>

                </div>
                <div class="footer_area medium_font">
                    <a href="https://peerapp.de/privacy.html" target="_blank">Privacy Policy.</a>
                    <p class="version-number version"></p>
                </div>
            </div>
        </div>
    </div>
</body>

</html>