<?php
$directories = ['svg/', 'css/', 'js/'];
$files = array();

foreach ($directories as $directory) {
    if (is_dir($directory)) {
        if ($dh = opendir($directory)) {
            while (($file = readdir($dh)) !== false) {
                if ($file != '.' && $file != '..' && is_file($directory . $file)) {
                    $files[] = $directory . $file;
                }
            }
            closedir($dh);
        }
    }
}

header('Content-Type: application/json');
echo json_encode($files);
