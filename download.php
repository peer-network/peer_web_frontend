<?php
if (!isset($_GET['file'])) {
    die("No file specified.");
}

$fileUrl = $_GET['file'];
$filename = basename($fileUrl);

// remote file stream karo
header("Content-Type: application/octet-stream");
header("Content-Disposition: attachment; filename=\"$filename\"");
header("Content-Transfer-Encoding: binary");
header("Cache-Control: must-revalidate");
header("Pragma: public");

// directly stream file to user
readfile($fileUrl);
exit;