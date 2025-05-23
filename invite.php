<?php
include 'phpheader.php';
include 'host.php';

?>
<!DOCTYPE html>
<html lang="de">

<head>
   <script>
        document.addEventListener("DOMContentLoaded", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const baseUrl = `${location.protocol}//${location.host}/`;
        //console.log(baseUrl); // "https://testing.getpeer.eu/"
        const referralUuid = urlParams.get('referralUuid');
        const desktopFallback = baseUrl+"register.php?referralUuid="+ referralUuid;

        if (referralUuid) {
            localStorage.setItem('referralUuid', referralUuid);
            

            const deepLink = "peer://invite/" + referralUuid || null;
            const androidFallback = "https://play.google.com/store/apps/details?id=eu.peernetwork.app";
            const iosFallback = "https://apps.apple.com/app/peer-network/id6744612499";
            

            function openApp() {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isAndroid = /android/i.test(userAgent);
            const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

            // Try to open the app
            if (deepLink && deepLink !== null) {
                window.location = deepLink;
                return;
            }
            

            // After a delay, redirect to the appropriate store
            setTimeout(() => {
                if (isAndroid) {
                window.location = androidFallback;
                } else if (isIOS) {
                window.location = iosFallback;
                }else{
                    window.location = desktopFallback;
                }
            }, 1500);
            }

            // Call immediately after DOM is loaded
            openApp();
        }
        });

   </script>
    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
    <title>PeerNetwork Invite </title>
</head>

<body class="container">
    <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>


</body>

</html>