<?php
/**
 * Author: Victor
 * Dated: 26 June 2025
 * Usage: This template provides the HTML structure for the password button.
 * It contains the layout for displaying password, input fields and other necessary elements
 */
?>

<div class="input-field">
  <img class="password-icon" src="svg/lock1.svg" alt="">
  <input type="password" name="password" placeholder="Password" id="password" required class="input-text password-field">
  <img id="togglePassword" class="seePass none" src="svg/seePass.png" alt="See Password">
</div>
<div id="passwordStrength" class="strength-bar none">
  <span class="bar-segment"></span>
  <span class="bar-segment"></span>
  <span class="bar-segment"></span>
  <span class="bar-segment"></span>
</div>
<div id="validationMessage" class="validationMessage"></div>
