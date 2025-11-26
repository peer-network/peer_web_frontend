<?php 
if (session_status() === PHP_SESSION_NONE) {
    ini_set("session.cookie_httponly", 1);
}

$me = substr($_SERVER["REQUEST_URI"],1);
if(strpos($me, '/')!==false) $me = substr($me,strrpos($me, '/')+1);
if(strpos($me, '?')!==false) $me = substr($me,0,strpos($me, '?'));
if(!strlen($me)) $me = 'index.php';
if(!strpos($me,'.php')) $me .= '.php';
$modified = gmdate("D, d M Y H:i:s", filemtime($me)) . " GMT";
header("Last-Modified:" . $modified);
$modified = date('c', filemtime($me));
header("Etag:" . md5_file($me));
// HTML-Dokumente sollen bei jedem Aufruf neu validiert werden, damit nach Deployments keine veralteten Shells geladen werden.
header("Cache-Control: no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
header('Content-Type:text/html; charset=UTF-8');
?>
