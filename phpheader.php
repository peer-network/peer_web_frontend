<?php 
ini_set("session.cookie_httponly", 1);

$me = substr($_SERVER["REQUEST_URI"],1);
if(strpos($me, '/')!==false) $me = substr($me,strrpos($me, '/')+1);
if(strpos($me, '?')!==false) $me = substr($me,0,strpos($me, '?'));
if(!strlen($me)) $me = 'index.php';
if(!strpos($me,'.php')) $me .= '.php';
$modified = gmdate("D, d M Y H:i:s", filemtime($me)) . " GMT";
header("Last-Modified:" . $modified);
$modified = date('c', filemtime($me));
header("Etag:" . md5_file($me));
header('Content-Type:text/html; charset=UTF-8');
?>