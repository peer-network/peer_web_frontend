<?php
/**
 * Author: Luqman
 * Dated: 29 April 2025
 * Usage: This template includes JavaScript files that are necessary for the functionality of the site.
 * It links to external libraries and custom scripts for handling dynamic content, interactive features and user interactions.
 * The script files are included at the end of the body to ensure the page content loads first before executing the JavaScript.
 * This file centralizes the inclusion of scripts to maintain uniformity and make future updates or additions easier.
 */
?>

<!-- <script src="sw_instal.min.js" async></script> -->
<script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
<script src="js/audio.js?<?php echo filemtime('js/audio.js'); ?>" async></script>
<script src="js/posts.js?<?php echo filemtime('js/posts.js'); ?>" defer></script>

<?php
// if ($_SERVER[''])
?>
<script src="js/chat.js?<?php echo filemtime('js/chat.js'); ?>" defer></script>