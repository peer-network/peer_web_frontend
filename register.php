<?php
include 'phpheader.php';
include 'host.php';
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Peer Network - Register</title>

    
    <link rel="stylesheet" href="fonts/font-poppins/stylesheet.css?<?php echo filemtime('fonts/font-poppins/stylesheet.css'); ?>">
    <link rel="stylesheet" href="fonts/peer-icon-font/css/peer-network.css?<?php echo filemtime('fonts/peer-icon-font/css/peer-network.css'); ?>">
    <link rel="stylesheet" href="css/login-register.css?<?php echo filemtime('css/login-register.css'); ?>" media="all" rel="preload">
    
   
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/register/register.js?<?php echo filemtime('js/register/register.js'); ?>" defer></script>
    
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
                    <!-- Step 1: Referral Code -->
                    <div class="form-step active"  id="referralStep" data-step="1">
                        <div class="step-header">
                            <h2 class="x_large_font">Welcome to <strong>peer!</strong></h2>
                            <p class="large_font">One quick step left! Enter your referral code to complete registration.</p>
                        </div>
                        <form id="referralForm" novalidate>
                            <div class="input-group">
                                <div class="input-field" id="referralCodeField">
                                    <span class="input-icon" aria-hidden="true">                                         
                                        <i class="peer-icon peer-icon-referral"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        id="referralCode" 
                                        name="referralCode"
                                        placeholder="Enter your referral code"
                                        required
                                        aria-describedby="referralValidation referralHelp"
                                        autocomplete="off"
                                    >
                                   
                                    <span class="validation-icon" id="referralCodeValidIcon" aria-hidden="true">
                                        <i class="peer-icon peer-icon-tick-circle"></i>
                                    </span>
                                </div>
                                <div class="validation-message medium_font" id="referralCodeValidation" role="alert" aria-live="polite"></div>
                                <div id="referralHelp" class="sr-only">Enter the referral code provided to you</div>
                            </div>

                            <button type="submit" class="btn btn-primary" id="verifyReferralBtn">
                                Verify Code
                            </button>
                        </form>
                        <div class="step-footer medium_font">
                                <p>
                                    Don't have a code? <a href="#" id="useDefaultCodeBtn">Click here</a> to get peer code
                                </p>
                            </div>
                    </div>

                    <!-- Step 1b: Default Referral Code -->
                    <div class="form-step" id="defaultReferralStep" data-step="1b">
                        <div class="step-header">
                            <h2 class="x_large_font">Claim Your Invitation</h2>
                            <p class="large_font">Earning starts the moment you enter this magic code</p>
                        </div>
                        <div class="input-group">
                            
                            <div class="referral-code-display medium_font" >
                                <span class="input-icon" aria-hidden="true">                                         
                                    <i class="peer-icon peer-icon-referral"></i>
                                </span>
                                <span id="defaultReferralCode">85d5f836-b1f5-4c4e-9381-1b058e13df93</span>
                                
                            </div>
                        </div>

                        <button type="button" class="btn btn-primary" id="useThisCodeBtn">
                            Use This Code
                        </button>
                    </div>

                    <!-- Step 2: Registration Form -->
                    <div class="form-step" id="registrationStep" data-step="2">
                        <div class="step-header">
                            <h2 class="x_large_font">Register</h2>
                            <p class="large_font">Create your account in few seconds and start earning on your favorite content.</p>
                        </div>

                        <form id="registrationForm" novalidate>
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

                            <!-- Username Field -->
                            <div class="input-group">
                               
                                <div class="input-field" id="usernameField">
                                    <span class="input-icon" aria-hidden="true">
                                         <i class="peer-icon peer-icon-user"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        id="username" 
                                        name="username"
                                        placeholder="Choose a username"
                                        required
                                        aria-describedby="usernameValidation usernameHelp"
                                        autocomplete="username"
                                    >
                                    <span class="validation-icon" id="usernameValidIcon" aria-hidden="true">
                                        <i class="peer-icon peer-icon-tick-circle"></i>
                                    </span>
                                </div>
                                <div class="validation-message medium_font" id="usernameValidation" role="alert" aria-live="polite"></div>
                                <div id="usernameHelp" class="sr-only">Username must be 5-20 characters, starting with a letter</div>
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
                                <div class="password-strength none" id="passwordStrength">
                                    <div class="strength-labels medium_font">
                                        <span class="strength-text very-weak">Very weak</span>
                                        <span class="strength-text weak">Weak</span>
                                        <span class="strength-text improvement">Needs improvement</span>
                                        <span class="strength-text good">Good</span>
                                        <span class="strength-text excellent">Excellent</span> 
                                    </div>
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
                            <!-- Checkboxes Field -->
                            <div class="input-group">
                               
                                <!-- Privacy Policy Checkbox -->
                                <div class="checkbox-field" id="readPrivacyField">
                                    <label class="checkbox-wrapper" for="readPrivacy">
                                        <input 
                                            type="checkbox" 
                                            id="readPrivacy" 
                                            name="readPrivacy"
                                            aria-describedby="checkboxValidation"
                                        >
                                        <span class="checkbox-label medium_font">
                                            I agree to the 
                                            <a href="https://peerapp.de/privacy.html" target="_blank">Privacy Policy.</a>
                                        </span>
                                    </label>
                                </div>

                                 <!-- EULA Checkbox -->
                                <div class="checkbox-field" id="agreementEULAField">
                                    <label class="checkbox-wrapper" for="agreementEULA">
                                        <input 
                                            type="checkbox" 
                                            id="agreementEULA" 
                                            name="agreementEULA"
                                            aria-describedby="checkboxValidation"
                                        >
                                        <span class="checkbox-label medium_font">
                                           I agree to the <a href="https://peerapp.de/EULA.html">End User License Agreement (EULA)</a>.
                                        </span>
                                    </label>
                                </div>
                                <!-- Validation Message -->
                                <div class="validation-message medium_font" id="checkboxValidation" role="alert" aria-live="polite"></div>
                                
                                
                            </div>


                            <button type="submit" class="btn btn-primary" id="registerBtn">
                                Create Account
                            </button>

                            <div class="already_register medium_font">
                                <p>
                                    Already registered?
                                    <a href="login.php">Login here</a>
                                </p>
                            </div>
                        </form>
                    </div>

                    <!-- Step 3: Success -->
                    <div class="form-step" id="successStep" data-step="3">
                        <div class="success-message">

                        <div class="step-header">
                             <span class="icon" aria-hidden="true">
                                <i class="peer-icon peer-icon-good-tick-circle"></i>
                            </span>
                            <h2 class="x_large_font">Welcome to <strong>peer!</strong></h2>
                            <p class="large_font">Your account is ready! Start exploring and earn your first token today.</p>
                        </div>

                           
                            <a class="btn btn-primary" href='login.php'>
                                Continue to Login
                            </a>
                        </div>
                    </div>
                </div>
                <div class="footer_area medium_font">
                   <p class="version">Version 1.8.1</p>
                </div>
            </div>
        </div>
    </div>
</body>


</html>