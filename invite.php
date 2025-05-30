<?php
include 'phpheader.php';
include 'host.php';

?>
<!DOCTYPE html>
<html lang="de">

<head>
   <script src="js/invite.js?<?php echo filemtime('js/invite.js'); ?>" defer></script>

    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
    <title>PeerNetwork Invite </title>
</head>

<body class="container">
    <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
    Having trouble opening the app?<a id="openAppBtn"  href="#">Click Here</a> to continue manually.

</body>

</html>