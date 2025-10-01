<?php
header('Access-Control-Allow-Origin: *');
include 'phpheader.php';
include 'host.php';
require_once 'auth.php';
checkAuth("unauthorized");
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Peer Network - Maintenance Page</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css'>
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-solid-rounded/css/uicons-solid-rounded.css'>
    <link rel='stylesheet'
        href='https://cdn-uicons.flaticon.com/3.0.0/uicons-thin-straight/css/uicons-thin-straight.css'>
    <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />

    <link rel="stylesheet" href="css/maintenance.css?<?php echo filemtime('css/maintenance.css'); ?>" />
    
    <!-- Firebase App (Compat) -->
    <script src="https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js"></script>
    <!-- Firebase Analytics (Compat) -->
    <script src="https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics-compat.js"></script>

    <script>
        // Your Firebase config
        const firebaseConfig = {
            apiKey: "AIzaSyBRrV8AuxJlS_9DQ2jZKqTHT8m70AhGxiU",
            authDomain: "peer-de113.firebaseapp.com",
            projectId: "peer-de113",
            storageBucket: "peer-de113.firebasestorage.app",
            messagingSenderId: "1088506353097",
            appId: "1:1088506353097:web:e74867ffd43d0fad440418",
            measurementId: "G-RYR3LKVF4L"
        };
        //  This works with compat
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
    </script>


    <!-- <script src="sw_instal.min.js" async></script> -->


    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>

<body>
    <div class="maintenance_container">
        <div class="peer_logo">
            <img src="svg/peerLogoWhite.svg" alt="peer logo">
        </div>
        
        <h1>We'll Be Right Back</h1>
        
        <p class="subtitle">Our team is working hard to improve your experience</p>
        
        <div class="status-card">
            <div class="status-indicator">
                <span class="status-dot"></span>
                <span class="status-text">Maintenance in Progress</span>
            </div>
            
            <p class="message">We are currently performing scheduled maintenance to improve your experience.</p>
            
            <p class="message"><strong class="highlight">Peer App</strong> will be back online shortly.</p>
            
            <p class="message">Thank you for your patience and understanding.</p>
            
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        </div>
        
        <p class="info-text">Need urgent assistance? Contact us at support@peerapp.com</p>
    </div>
</body>
</html>