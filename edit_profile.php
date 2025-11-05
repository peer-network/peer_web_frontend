<?php
header('Access-Control-Allow-Origin: *');
include 'phpheader.php';
include 'host.php';
require_once 'auth.php';
checkAuth("unauthorized");
?>
<!DOCTYPE html>
<html lang="de">
<head>
  	<meta charset="UTF-8" />
  	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
  	<title>Setting - Edit Profile</title>
  	<link rel="stylesheet" href="fonts/font-poppins/stylesheet.css?<?php echo filemtime('fonts/font-poppins/stylesheet.css'); ?>">
    <link rel="stylesheet" href="fonts/peer-icon-font/css/peer-network.css?<?php echo filemtime('fonts/peer-icon-font/css/peer-network.css'); ?>">
    <link rel="stylesheet" href="css/password.css?<?php echo filemtime('css/password.css'); ?>">
    <link rel="stylesheet" href="css/style.css?<?php echo filemtime('css/style.css'); ?>" />
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />

    
    <link rel="stylesheet" href="css/settings.css?<?php echo filemtime('css/settings.css'); ?>" />  
   
    
	
    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/password.js?<?php echo filemtime('js/password.js'); ?>" defer></script>
    <script src="js/confirmPassword.js?<?php echo filemtime('js/confirmPassword.js'); ?>" defer></script>
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/global.js?<?php echo filemtime('js/global.js'); ?>" defer></script>
    <script src="js/setting.js?<?php echo filemtime('js/setting.js'); ?>" defer></script>

	
	<?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
</head>
<body >
	<div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
        <div id="edit-profile" class="site_layout">
          <header class="site-header header-profile">
            <img class="logo" src="svg/logo_sw.svg" alt="Peer Network">
            <h1 id="h1">Settings</h1>
          </header>
        
          <aside class="left-sidebar left-sidebar-profile">
          <div class="inner-scroll">
            <!-- Load sidebar widgets -->
            <?php //require_once ('./template-parts/sidebars/widget-filter.php'); ?>
           	<?php //require_once ('./template-parts/sidebars/widget-daily-action.php'); ?>
           
           	<div id="profile-back-btn" class="profile-back-button hide" >
                <a href="edit_profile.php" class="button btn-transparent" >Back</a>
            </div>
            <div id="main-profile-back-btn" class="profile-back-button" >
                <a href="                                    profile.php" class="button btn-transparent" >Back to Profile</a>
            </div>
          </div>
          </aside>
        
          <main class="site-main site-main-edit-profile">
          
        
       		 <div id="edit-pofile" class="setting-layout">
                <div class="setting-menu">
                    <ul>
                        <li class="active"><a href="#">Profile Setting</a></li>
                        <li><a href="#">Prefrences</a></li>
                    </ul>
                </div>
                
                <div class="setting-content">
                    <div id="change-pic-bio" class="profile-widget active">
                        <div class="edit-profile">
                            <div class="profile_picture">
                            	<div class="cropContainer">
                            	<span class="online_status"></span>
                                <img id="myprofilbild" class="profile-picture my-profile-picture" src="svg/noname.svg" alt="Profile Picture" />
                                </div>
                                                            
                                <a href="#" id="change-picture" class="button change-picture">Change Picture</a>
                                <div class="none"> <input type="file" id="fileInput" accept="image/*" /></div>
                            </div>
                            <div class="profile-fields">
                                <div class="input-field transparent">
                                    <label>Description</label>
                                    <textarea cols="40" rows="5" maxlength="5000" class="input-textarea"  id="biography"  name="profile-description" placeholder="Write a description to your profile..." ></textarea>
                                </div>
                                <div id="response_msg_bio" class="response_msg"></div>
                                <div class="input-field username-row transparent">
                                    <label>Username</label>
                                    <span>@<span  id="pusername">&nbsp;</span></span>
                                    <a href="#" id="changeusernamebtn">Change</a>
                                    
                                </div>
                            </div>
                            <button id="saveprofileBtn" class=" full-width-btn btn-white">Save Changes</button>
                        </div>
                        
                        
                        
                        <div class="profile-setting-buttons">
                            <div class="change-password-email">
                                <a  id="changePassbtn" href="#" class="button change-pass-btn btn-transparent">Change password</a>
                                <a id="changeEmailbtn" href="#" class="button change-email-btn btn-transparent">Change e-mail</a>
                            </div>
                            <div class="logout-deactivate-buttons">
                                <a href="#" id="logOut" class="button logout-btn full-width-btn btn-red-transparent">Log Out</a>
                                <div id="modalOverlay" class="modal-overlay none">
                                    <div class="logOut-pop" id="logOutPop">
                                        <img src="svg/error.svg" alt="logout">
                                        <p>Are you sure you want to log out?</p>
                                        <div class="button-row">       
                                            <button id="cancelLogoutBtn" class="btn-transparent">Cancel</button>
                                            <button id="confirmLogoutBtn" class="btn-blue">Yes</button>
                                        </div>
                                    </div>
                                </div>
                                <a href="#" id="deactivateProfile" class="button change-pass-btn full-width-btn btn-red-transparent">Deactivate profile</a>
                            </div>

                        </div>
                        
                        <div id="imageModal" class="modal">
                            <div class="modal-content">
                                <span class="closeBtn"> <img   src="svg/close.svg" alt="Close" /></span>
                                <h2 class="modal-content-heading">Preview</h2>
                                <div class="image-preview-wrapper">
                                    <img id="previewImage" src="" alt="Preview" />
                                </div>
                                <div class="img-zoom">
                                    <label>Zoom</label>
                                    <input type="range" id="zoomSlider" min="1" max="3" step="0.1" value="1" />
                                </div>
                                <div class="button-row">
                                    <button id="cancelBtn" class="btn-transparent">Cancel</button>
                                    <button id="applyBtn" class="btn-blue">Apply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="change-username" class="profile-widget" >
                        
                        <div class="edit-profile change-username">
                            <h2 class="section_heading">Change username</h2>
                            <form id="changeusernameForm" class="form-container">
                                <div class="profile-fields">
                                    <div class="input-field">
                                    <input type="text" id="newusername" name="username" class="input-text" placeholder="Enter new username" required="" >
                                    </div>
                                    <div class="input-field">
                                        <input type="password" id="userPassword" name="password" placeholder="Enter password" required="" class="input-text">
                                        
                                    </div>
                                </div>
                                <div id="response_msg_change_username" class="response_msg"></div>
                                <button id="changeUserBtn" class="save-btn full-width-btn " disabled=true>Submit</button>
                            </form>
                        </div>
                        

                    </div>

                    <div id="change-password" class="profile-widget">
                        
                        <div class="edit-profile change-password">
                            <h2 class="section_heading">Change password</h2>
                            <form id="changepasswordForm" class="form-container">
                                <div class="profile-fields">
                                    <div class="input-field">
                                        <input type="password" id="old_password" name="old_password" class="input-text" placeholder="Enter old password" required="" >
                                    </div>
                                    <!-- Password Component -->
                                    <div class="password-component" data-show-strength="true" data-show-message="false" data-name="password"></div>
                                    <!-- Confirm Password Component -->
                                    <div class="confirm-password-component"  data-name="confirm_password"></div>
                                </div>
                                <button id="changePasswordBtn" class="save-btn full-width-btn ">Submit</button>
                            </form>
                        </div>
                        

                    </div>

                    <div id="change-email" class="profile-widget">
                        
                        <div class="edit-profile change-email">
                            <h2 class="section_heading">Change e-mail</h2>
                            <form id="changeemailForm" class="form-container">
                                <div class="profile-fields">
                                    <div class="input-field">
                                    <input type="email" id="new_email" name="new_email" class="input-text" placeholder="Enter new e-mail" required="" >
                                    </div>
                                    <div class="input-field">
                                        <input type="password" id="yourpassword" name="yourpassword" placeholder="Enter password" required="" class="input-text">
                                    </div>
                                   
                                </div>
                                <div id="response_msg_change_email" class="response_msg"></div>
                                <button id="changeEmailBtn" class="save-btn full-width-btn ">Submit</button>
                            </form>
                        </div>
                        

                    </div>

                </div>
                    

               
        
              </div>
         
          </main>
        
          <aside class="right-sidebar right-sidebar-edit-profile">
          <div class="inner-scroll">
           <!-- Load sidebar widgets -->
           <?php require_once ('./template-parts/sidebars/widget-profile.php'); ?>
           <?php require_once ('./template-parts/sidebars/widget-main-menu.php'); ?>
           <?php require_once ('./template-parts/sidebars/widget-add-new-post.php'); ?>
           <?php require_once ('./template-parts/sidebars/widget-web-version.php'); ?>
          </div> 
          </aside>
        
           <?php require_once ('./template-parts/footer.php'); ?>
          
        	
        	

        	
    		
    
    </div>
</body>
</html>