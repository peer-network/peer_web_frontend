<?php
session_start();

function checkAuth($redirectMessage = "unauthorized") {
    if (!isset($_COOKIE['authToken']) || empty($_COOKIE['authToken'])) {
        header("Location: login.php?message=$redirectMessage");
        exit();
    }
}
?>
