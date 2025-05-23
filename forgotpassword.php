<?php
include 'phpheader.php';
include 'host.php';
?>
<!DOCTYPE html>
<html lang="de">

<head>
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
        </div>

        

        <input id="submit" class="button" type="submit" name="reset_password" value="Reset Password">

        
        
    </form>

    <form id="verifycodeForm" class="form-container hide">
        <h1 class="heading">Forgot password</h1>
        <p class="description" id="sentcode_msg"></p>
        
        
        <div class="input-field">
            <input type="text" id="verification_code" name="verification_code" placeholder="Enter the code" required class="input-text"                            ></input>
        </div>
        <div id="response_msg_wrong_code"></div>

        <a href="#" id="send_again" class="button">Send agian <span id="timecounter"></span></a>
        
        
        

        
        <!-- <p class="description" style="opacity: 0;">Start posting with peer today!</p> -->
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
        
        <button id="resetpassword" class="button">Save</button>
        
    </form>
    <div id=password_changed_success class=" form-container hide">
        <h2 class="heading">Password Changed!</h12>
        <p class="description">Your password has been changed successfully.</p>
        <a href="login.php" class="button">Login now</a>
    </div>
</body>

</html>