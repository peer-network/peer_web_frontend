<?php
/**
 * Author: Victor
 * Dated: 26 June 2025
 * Usage: This template provides the HTML structure for the confirm password button.
 * It contains the layout for displaying password, input fields and other necessary elements
 */
?>

<div class="input-field">
  <img class="password-icon" src="svg/lock1.svg" alt="">
  <input type="password" id="confirm_password" placeholder="Confirm Password" required class="input-text" />
  <img class="seePass" src="svg/seePass.png" alt="See Password" id="toggleConfirmPassword" />
</div>
<div class="validationMessage none" id="confirmValidationMessage"></div>
