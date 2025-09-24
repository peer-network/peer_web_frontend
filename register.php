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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="css/password.css?<?php echo filemtime('css/password.css'); ?>">
    <link rel="stylesheet" href="css/register.css?<?php echo filemtime('css/register.css'); ?>" media="all" rel="preload">
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>">
    <script src="js/password.js?<?php echo filemtime('js/password.js'); ?>" defer></script>
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/register/register.js?<?php echo filemtime('js/register/register.js'); ?>" defer></script>
    
    <!-- <script src="js/sw_instal.min.js" defer></script> -->
    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
    <title>Registrierungsbildschirm</title>
</head>

<body>
    <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>

    <div class="container">
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
                    <!-- Progress Bar -->
                    <div class="progress-bar" role="progressbar" aria-label="Registration progress">
                        <div class="progress-fill" style="width: 25%"></div>
                    </div>

                    <!-- Back Button -->
                    <button type="button" class="back-btn" id="backBtn" style="display: none;">
                        <span aria-hidden="true">←</span>
                        Back
                    </button>
                </div>
                
                <div class="center_area">
                    <!-- Step 1: Age Verification -->
                    <div class="form-step active" id="ageVerification" data-step="1">
                        <div class="step-header">
                            <span class="icon" aria-hidden="true"><img src="svg/ageIcon.svg" alt="Age Verification Required" /></span>
                            <p>You must be 18+ to proceed. By continuing, you confirm your eligibility.</p>
                        </div>
                        
                        <div class="age-verification">
                            <div class="btn-group">
                                <button type="button" class="btn" id="underAgeBtn">
                                    No, I’m Under 18
                                </button>
                                <button type="button" class="btn btn-red" id="confirmAgeBtn">
                                    I Am 18+
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 1b: Age Rejection -->
                    <div class="form-step" id="ageRejection" data-step="1b">
                        <div class="step-header">
                            <span class="icon" aria-hidden="true">⚠️</span>
                            <h2>Age Requirement Not Met</h2>
                            <p>Unfortunately, you must be 18 or older to use our service</p>
                        </div>
                        
                        <div class="age-verification">
                            <p style="margin-bottom: 2rem;">We appreciate your interest, but cannot proceed without age verification.</p>
                            
                            <button type="button" class="btn btn-primary" onclick="window.location.href='/'">
                                Return to Homepage
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: Referral Code -->
                    <div class="form-step" id="referralStep" data-step="2">
                        <div class="step-header">
                            <h2>Welcome to <strong>peer!</strong></h2>
                            <p>Enter your referral code to continue registration</p>
                        </div>

                        <form id="referralForm" novalidate>
                            <div class="input-group">
                                <label for="referralCode" class="required">Referral Code</label>
                                <div class="input-field" id="referralField">
                                    <span class="input-icon" aria-hidden="true">🎫</span>
                                    <input 
                                        type="text" 
                                        id="referralCode" 
                                        name="referralCode"
                                        placeholder="Enter your referral code"
                                        required
                                        aria-describedby="referralValidation referralHelp"
                                        autocomplete="off"
                                    >
                                    <button type="button" class="copy-btn" id="copyReferralBtn" title="Copy referral code" aria-label="Copy referral code to clipboard">
                                        📋
                                    </button>
                                    <span class="validation-icon" id="referralValidIcon" aria-hidden="true">✓</span>
                                </div>
                                <div class="validation-message" id="referralValidation" role="alert" aria-live="polite"></div>
                                <div id="referralHelp" class="sr-only">Enter the referral code provided to you</div>
                            </div>

                            <button type="submit" class="btn btn-primary" id="verifyReferralBtn">
                                Verify Code
                            </button>

                            <div style="text-align: center; margin-top: 1rem;">
                                <p style="font-size: 0.9rem; color: #666;">
                                    Don't have a code? 
                                    <button type="button" id="useDefaultCodeBtn" style="background: none; border: none; color: #667eea; cursor: pointer; text-decoration: underline;">
                                        Use peer code
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>

                    <!-- Step 2b: Default Referral Code -->
                    <div class="form-step" id="defaultReferralStep" data-step="2b">
                        <div class="step-header">
                            <h2>Claim Your Invitation</h2>
                            <p>Earning starts the moment you enter this magic code</p>
                        </div>

                        <div class="input-group">
                            <label>Your Referral Code</label>
                            <div class="referral-code-display" >
                                <span id="defaultReferralCode">85d5f836-b1f5-4c4e-9381-1b058e13df93</span>
                                <button type="button" class="copy-btn" id="copyDefaultBtn" title="Copy default referral code">📋</button>
                            </div>
                        </div>

                        <button type="button" class="btn btn-primary" id="useThisCodeBtn">
                            Use This Code
                        </button>
                    </div>

                    <!-- Step 3: Registration Form -->
                    <div class="form-step" id="registrationStep" data-step="3">
                        <div class="step-header">
                            <h2>Create Your Account</h2>
                            <p>Fill in your details to complete registration</p>
                        </div>

                        <form id="registrationForm" novalidate>
                            <!-- Email Field -->
                            <div class="input-group">
                                <label for="email" class="required">Email Address</label>
                                <div class="input-field" id="emailField">
                                    <span class="input-icon" aria-hidden="true">📧</span>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                        aria-describedby="emailValidation emailHelp"
                                        autocomplete="email"
                                    >
                                    <span class="validation-icon" id="emailValidIcon" aria-hidden="true">✓</span>
                                </div>
                                <div class="validation-message" id="emailValidation" role="alert" aria-live="polite"></div>
                                <div id="emailHelp" class="sr-only">Enter a valid email address</div>
                            </div>

                            <!-- Username Field -->
                            <div class="input-group">
                                <label for="username" class="required">Username</label>
                                <div class="input-field" id="usernameField">
                                    <span class="input-icon" aria-hidden="true">👤</span>
                                    <input 
                                        type="text" 
                                        id="username" 
                                        name="username"
                                        placeholder="Choose a username"
                                        required
                                        aria-describedby="usernameValidation usernameHelp"
                                        autocomplete="username"
                                    >
                                    <span class="validation-icon" id="usernameValidIcon" aria-hidden="true">✓</span>
                                </div>
                                <div class="validation-message" id="usernameValidation" role="alert" aria-live="polite"></div>
                                <div id="usernameHelp" class="sr-only">Username must be 5-20 characters, starting with a letter</div>
                            </div>

                            <!-- Password Field -->
                            <div class="input-group">
                                <label for="password" class="required">Password</label>
                                <div class="input-field" id="passwordField">
                                    <span class="input-icon" aria-hidden="true">🔒</span>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password"
                                        placeholder="Create a strong password"
                                        required
                                        aria-describedby="passwordValidation passwordHelp passwordStrength"
                                        autocomplete="new-password"
                                    >
                                    <button type="button" class="copy-btn" id="togglePasswordBtn" title="Toggle password visibility" aria-label="Show/hide password">
                                        👁️
                                    </button>
                                </div>
                                <div class="validation-message" id="passwordValidation" role="alert" aria-live="polite"></div>
                                
                                <!-- Password Strength Indicator -->
                                <div class="password-strength" id="passwordStrength">
                                    <div class="strength-meter">
                                        <div class="strength-fill" id="strengthFill"></div>
                                    </div>
                                    <ul class="strength-requirements" role="list" aria-label="Password requirements">
                                        <li id="lengthReq">At least 8 characters</li>
                                        <li id="upperReq">One uppercase letter</li>
                                        <li id="numberReq">One number</li>
                                        <li id="specialReq">One special character</li>
                                    </ul>
                                </div>
                                <div id="passwordHelp" class="sr-only">Password must meet all security requirements</div>
                            </div>

                            <!-- Confirm Password Field -->
                            <div class="input-group">
                                <label for="confirmPassword" class="required">Confirm Password</label>
                                <div class="input-field" id="confirmPasswordField">
                                    <span class="input-icon" aria-hidden="true">🔒</span>
                                    <input 
                                        type="password" 
                                        id="confirmPassword" 
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        required
                                        aria-describedby="confirmPasswordValidation confirmPasswordHelp"
                                        autocomplete="new-password"
                                    >
                                    <span class="validation-icon" id="confirmPasswordValidIcon" aria-hidden="true">✓</span>
                                </div>
                                <div class="validation-message" id="confirmPasswordValidation" role="alert" aria-live="polite"></div>
                                <div id="confirmPasswordHelp" class="sr-only">Re-enter your password to confirm</div>
                            </div>

                            <button type="submit" class="btn btn-primary" id="registerBtn">
                                Create Account
                            </button>

                            <div style="text-align: center; margin-top: 1rem;">
                                <p style="font-size: 0.9rem; color: #666;">
                                    Already have an account? 
                                    <a href="/login" style="color: #667eea; text-decoration: none;">Login here</a>
                                </p>
                            </div>
                        </form>
                    </div>

                    <!-- Step 4: Success -->
                    <div class="form-step" id="successStep" data-step="4">
                        <div class="success-message">
                            <span class="icon" aria-hidden="true">🎉</span>
                            <h2>Welcome to <strong>peer!</strong></h2>
                            <p style="margin: 1rem 0 2rem 0;">Your account has been created successfully! You can now start exploring and earning your first tokens.</p>
                            
                            <button type="button" class="btn btn-primary" onclick="window.location.href='/login'">
                                Continue to Login
                            </button>
                        </div>
                    </div>
                </div>
                <div class="footer_area">
                    <a href="https://www.freeprivacypolicy.com/live/02865c3a-79db-4baf-9ca1-7d91e2cf1724" class="privacy regPr">Privacy Policy</a>
                    <p class="version">Version 1.0.0</p>
                </div>
            </div>
        </div>
    </div>
</body>


</html>