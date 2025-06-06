<?php
include 'phpheader.php';
include 'host.php';
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  	
    <link rel="stylesheet" href="css/register.css?<?php echo filemtime('css/register.css'); ?>" media="all" rel="preload">
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>">
    <script src="js/lib/modal.js?<?php echo filemtime('js/lib/modal.js'); ?>" defer></script>
    <script src="js/login/forgotpassword.js?<?php echo filemtime('js/login/forgotpassword.js'); ?>" defer></script>
    <script src="js/login/confirmLoginRegister.js?<?php echo filemtime('js/login/confirmLoginRegister.js'); ?>" defer></script>
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <!-- <script src="sw_instal.min.js" async></script> -->
    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
    <title>Forgot password</title>
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

    
    <form id="forgotpasswordForm" class="form-container">
       <h1 class="heading">Forgot password</h1>
        <p class="description">Enter your e-mail address to receive the code.</p>
        
        
        <div class="input-field">
            <input type="email" id="email" name="e_mail" placeholder="E-mail" required class="input-text" autocomplete="on"></input>
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

       <div id="validationMessage"></div>
   
        <input id="submit" class="button" type="submit" name="reset_password" value="Reset Password">

        
        
    </form>

    <form id="verifycodeForm" class="form-container hide">
        <h1 class="heading">Forgot password</h1>
        <p class="description" id="sentcode_msg"></p>
        
        
        <div class="input-field">
            <input type="text" id="verification_code" name="verification_code" placeholder="Enter the code" required class="input-text" ></input>
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
        <div id="response_msg_wrong_code"></div>
        <input id="verify_code" class="button" type="submit" name="verify_code" value="Verify code">
        <a href="#" id="send_again" >Send agian <span id="timecounter"></span></a>
        
        
    </form>
 
    <form id="resetpasswordForm" class="form-container hide">
        <h1 class="heading">Reset password</h1>
        <p class="description" id="resetpass_msg"></p>
        
        
         <div class="input-field">
            <input type="password" id="new_password" name="new_password" placeholder="Enter new password" required="" class="input-text">
        </div>
        <div class="input-field">
            <input type="password" id="repeat_password" name="repeat_password" placeholder="Repeat password" required="" class="input-text">
        </div>
        <div id="response_msg_change_password"></div>
        
        <button id="resetpassword" class="button">Update Password</button>
        
    </form>
    <div id=password_changed_success class=" form-container hide">
        <h2 class="heading">Password Changed!</h12>
        <p class="description">Your password has been changed successfully.</p>
        <a href="login.php" class="button">Login now</a>
    </div>
</body>

</html>