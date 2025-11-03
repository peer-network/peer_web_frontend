<?php
include 'phpheader.php';
include 'host.php';
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <title>Peer Network - Forgetpassword</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="fonts/font-poppins/stylesheet.css?<?php echo filemtime('fonts/font-poppins/stylesheet.css'); ?>">
    <link rel="stylesheet" href="fonts/peer-icon-font/css/peer-network.css?<?php echo filemtime('fonts/peer-icon-font/css/peer-network.css'); ?>">
    <link rel="stylesheet" href="css/login-register.css?<?php echo filemtime('css/login-register.css'); ?>" media="all" rel="preload">

   <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/login/forgotpassword.js?<?php echo filemtime('js/login/forgotpassword.js'); ?>" defer></script>
       
   
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
                   
                    <!-- Back Button -->
                    <a href="login.php" class="btn btn-secondary back-btn" id="backBtn" >
                        <span aria-hidden="true"><i class="peer-icon medium_font peer-icon-arrow-left"></i></span>
                        Back
                    </a>
                </div>
                
                <div class="center_area">
                    <!-- Step 1: Enter Email -->
                    <div class="form-step active"  id="emailStep" data-step="1">
                        <div class="step-header">
                            <h2 class="x_large_font">Forgot password</h2>
                            <p class="large_font">Please enter your email and we'll send you a reset link.</p>
                        </div>
                        <form id="emailForm" novalidate>
                             <div class="input-group">
                                <div class="input-field" id="emailField">
                                    <span class="input-icon" aria-hidden="true">
                                        <i class="peer-icon peer-icon-envelope"></i>
                                    </span>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        placeholder="Enter your email"
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

                            <button type="submit" class="btn btn-primary" id="verifyEmailBtn">
                                Reset password
                            </button>
                        </form>
                       
                    </div>

                    <!-- Step 2: Verify Code Form -->
                    <div class="form-step" id="verifycodeStep" data-step="2">
                        <div class="step-header">
                            <h2 class="x_large_font">Verify code</h2>
                            <p id="sentcode_msg" class="large_font">We sent a code to your email. Please, enter the code to change your password.</p>
                        </div>

                        <form id="verifycodeForm" novalidate>
                            <!-- Verify Code Field -->
                            <div class="input-group">
                                <div class="input-field" id="verifycodeField">
                                    <span class="input-icon" aria-hidden="true">
                                        <i class="peer-icon peer-icon-email-password"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        id="verifycode" 
                                        name="verifycode"
                                        placeholder="Enter code"
                                        required
                                        aria-describedby="verifycodeValidation verifycodeHelp"
                                        autocomplete="verifycode"
                                    >
                                    <span class="validation-icon" id="verifycodeValidIcon" aria-hidden="true">
                                        <i class="peer-icon peer-icon-tick-circle"></i>
                                    </span>
                                </div>
                                <div class="validation-message medium_font" id="verifycodeValidation" role="alert" aria-live="polite"></div>
                                <div id="verifycodeHelp" class="sr-only">Enter a valid code</div>
                            </div>


                            <button type="submit" class="btn btn-primary" id="verifycodeBtn">
                                Verify code
                            </button>
                            <div class="response-message medium_font">
                            </div>
                            <div class="dont_get_code medium_font">
                                <p>
                                   Didn't get the code? <span class="resend-txt">You can resend in <span id="timecounter">0:00</span></span>
                                   <a href="#" id="send_again" >Resend Code</a> 
                                </p>
                            </div>
                        </form>
                    </div>

                     <!-- Step 3: New password Form -->
                    <div class="form-step" id="newpasswordStep" data-step="3">
                        <div class="step-header">
                            <h2 class="x_large_font">Enter new password</h2>
                            
                        </div>

                        <form id="newpasswordForm" novalidate>
                           
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
                                        placeholder="Create a strong password"
                                        required
                                        aria-describedby="passwordValidation passwordHelp passwordStrength"
                                        autocomplete="new-password"
                                    >
                                    
                                    <span class="toggle-passwordBtn-icon" id="togglePasswordBtn" title="Toggle password visibility" aria-label="Show/hide password">
                                       <i class="peer-icon peer-icon-eye-close"></i> 
                                    </span>
                                </div>
                                <div class="validation-message medium_font" id="passwordValidation" role="alert" aria-live="polite"></div>
                                
                                <!-- Password Strength Indicator -->
                                <div class="password-strength" id="passwordStrength">
                                    <div class="strength-meter">
                                        <div class="strength-fill" id="strengthFill">
                                            <span class="strength-segment segment-weak"></span>
                                            <span class="strength-segment segment-weak2"></span>
                                            <span class="strength-segment segment-medium"></span>
                                            <span class="strength-segment segment-strong"></span>
                                            <span class="strength-segment segment-excellent"></span>
                                            

                                        </div>
                                    </div>
                                    <ul class="strength-requirements medium_font" role="list" aria-label="Password requirements">
                                        <li id="lengthReq">Min. 8 chars,</li>
                                        <li id="lowerReq">1 lowercase</li>
                                        <li id="upperReq">1 uppercase,</li>
                                        <li id="numberReq">1 number,</li>
                                        <!-- <li id="specialReq">1 special character</li> -->
                                    </ul>
                                </div>
                                <div id="passwordHelp" class="sr-only">Password must meet all security requirements</div>
                            </div>

                            <!-- Confirm Password Field -->
                            <div class="input-group">
                                
                                <div class="input-field" id="confirmPasswordField">
                                    <span class="input-icon" aria-hidden="true">
                                        <i class="peer-icon peer-icon-lock"></i>
                                    </span>
                                    <input 
                                        type="password" 
                                        id="confirmPassword" 
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        required
                                        aria-describedby="confirmPasswordValidation confirmPasswordHelp"
                                        autocomplete="new-password"
                                    >
                                    
                                 <span class="toggle-passwordBtn-icon" id="toggleConfirmPasswordBtn" title="Toggle confirm password visibility" aria-label="Show/hide confirm password">
                                       <i class="peer-icon peer-icon-eye-close"></i> 
                                    </span>
                                </div>
                                <div class="validation-message medium_font" id="confirmPasswordValidation" role="alert" aria-live="polite"></div>
                                <div id="confirmPasswordHelp" class="sr-only">Re-enter your password to confirm</div>
                            </div>
                          
                            <div id="reset_step_message" class="response-message medium_font">
                            </div>

                            <button type="submit" class="btn btn-primary" id="updatePasswordBtn">
                                Update password
                            </button>

                            
                        </form>
                    </div>

                    <!-- Step 4: Success -->
                    <div class="form-step" id="successStep" data-step="4">
                        <div class="success-message">

                        <div class="step-header">
                             <span class="icon" aria-hidden="true">
                                <i class="peer-icon peer-icon-good-tick-circle"></i>
                            </span>
                            <h2 class="x_large_font">Password updated!</h2>
                            <p class="large_font">Your password has been updated. Please use your new password to log in.</p>
                        </div>

                           
                            <a class="btn btn-primary" href='login.php'>
                                Continue to Login
                            </a>
                        </div>
                    </div>
                </div>
                <div class="footer_area medium_font">
                   <p class="version version-number">Version 1.8.1</p>
                </div>
            </div>
        </div>
    </div>
</body>

</html>