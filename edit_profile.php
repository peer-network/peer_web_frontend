<?php
header('Access-Control-Allow-Origin: *');
include 'phpheader.php';
include 'host.php';
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <link rel="stylesheet" href="css/dashboard.css?<?php echo filemtime('css/dashboard.css'); ?>" />
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
    <link rel="stylesheet" href="css/scrollshadow.css?<?php echo filemtime('css/scrollshadow.css'); ?>" />
    <link rel="stylesheet" href="css/settings.css?<?php echo filemtime('css/settings.css'); ?>" />

    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/lib/responscodes.js?<?php echo filemtime('js/lib/responscodes.js'); ?>" defer></script>
    <script src="js/lib/modal.js?<?php echo filemtime('js/lib/modal.js'); ?>" defer></script>
    <script src="js/audio.js?<?php echo filemtime('js/audio.js'); ?>" async></script>
    <script src="js/posts.js?<?php echo filemtime('js/posts.js'); ?>" defer></script>
    <script src="js/setting.js?<?php echo filemtime('js/setting.js'); ?>" defer></script>


    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
    <title>Settings - Edit Profile</title>
</head>

<body>
    <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
   

    <article id="dashboard" class="dashboard setting-page">
        <!-- Sidebar -->
        <aside class="sidebar">
            <form id="filter" class="filterContainer">
                    <div class="dash">
                        <img class="logo" src="svg/logo_sw.svg" alt="Peer Network Logo" />
                        <h1 id="h1">Settings</h1>
                    </div>

                    <div id="profile-back-btn" class="profile-back-button hide" >
                        <a href="edit_profile.php" >Back</a>
                    </div>
               
            </form>
        
        </aside>

        <!-- Main Content Area (Mittlere Spalte mit einem inneren Grid) -->
        <main id="main" class="main">
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
                                <img id="myprofilbild" class="profile-picture my-profile-picture" src="svg/noname.svg" alt="Profile Picture" />
                                                            
                                <a href="#" id="change-picture" class="button change-picture">Change Picture</a>
                                <div class="none"> <input type="file" id="fileInput" accept="image/*" /></div>
                            </div>
                            <div class="profile-fields">
                                <div class="input-field">
                                    <label>Description</label>
                                    <textarea cols="40" rows="5" maxlength="2000" class="input-textarea"  id="biography"  name="profile-description" placeholder="Write a description to your profile..." ></textarea>
                                </div>
                                <div class="input-field">
                                    <label>Username</label>
                                    <span>@<span  id="pusername">&nbsp;</span></span>
                                    <a href="#" id="changeusernamebtn">Change</a>
                                    
                                </div>
                            </div>
                            <button id="saveprofileBtn" class="save-btn full-width-btn btn-style-white">Save Changes</button>
                        </div>
                        <div class="profile-setting-buttons">
                            <div class="change-password-email">
                                <a  id="changePassbtn" href="#" class="button change-pass-btn btn-style-transparent">Change password</a>
                                <a id="changeEmailbtn" href="#" class="button change-email-btn btn-style-transparent">Change e-mail</a>
                            </div>
                            <div class="logout-deactivate-buttons">
                                <a href="#" id="logOut" class="button change-email-btn full-width-btn btn-style-red-border">
                                    Log Out
                                    <img src="svg/logOut.svg" alt="">
                                </a>
                                <div id="modalOverlay" class="modal-overlay none">
                                    <div class="logOut-pop" id="logOutPop">
                                        <img src="svg/error.svg" alt="">
                                        <p>Are you sure you want to log out?</p>
                                        <div class="button-row">
                                            <button id="cancelLogoutBtn" class="btn-style-transparent">Cancel</button>
                                            <button id="confirmLogoutBtn" class="btn-style-blue">Yes</button>
                                        </div>
                                    </div>
                                </div>
                                <a href="#" id="deactivateProfile" class="button change-pass-btn full-width-btn btn-style-red-border">Deactivate profile</a>
                            </div>

                        </div>
                        <div id="imageModal" class="modal">
                            <div class="modal-content">
                                <span class="closeBtn"> <img   src="svg/close.svg" alt="Close" /></span>
                                <h2 class="modal-content-heading">Preview</h2>
                                <div class="image-preview-wrapper">
                                    <img id="previewImage" src="" alt="Preview" />
                                </div>
                                <label>Zoom</label>
                                <input type="range" id="zoomSlider" min="1" max="3" step="0.1" value="1" />
                                <div class="button-row">
                                    <button id="cancelBtn" class="btn-style-transparent">Cancel</button>
                                    <button id="applyBtn" class="btn-style-blue">Apply</button>
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
                                        <input type="password" id="password" name="password" placeholder="Enter password" required="" class="input-text">
                                        
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
                                    <div class="input-field">
                                        <input type="password" id="new_password" name="new_password" placeholder="Enter new password" required="" class="input-text">
                                    </div>
                                    <div class="input-field">
                                        <input type="password" id="repeat_password" name="repeat_password" placeholder="Repeat password" required="" class="input-text">
                                    </div>
                                </div>
                                <div id="response_msg_change_password" class="response_msg"></div>
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
    <aside class="profil">
        <div id="profil-container">
            <div class="pro-sec">
                <!-- Profil-Bild und Name -->
                <div class="profile-header">
                    <div id="cropContainer" class="cropContainer">
                        <img id="profilbild" src="svg/noname.svg" alt="Profile Picture" class="profile-picture" />
                        <!-- <img id="editProfileImage" src="svg/edit.svg" alt="edit">
                            <img id="cropButton" src="svg/ok.svg" alt="edit"> -->
                    </div>
                    <!-- <div id="badge" class="badge"></div> -->
                    <div class="pro-name">
                        <h2 id="username">&nbsp;</h2>
                        <p id="slug" class="username">&nbsp;</p>
                    </div>
                </div>

                <!-- Statistiken -->
                <div class="stats">
                    <div class="stat">
                        <span id="userPosts">&nbsp;</span>
                        <p>Posts</p>
                    </div>
                    <div class="stat">
                        <span id="followers">&nbsp;</span>
                        <p>Followers</p>
                    </div>
                    <div class="stat">
                        <span id="following">&nbsp;</span>
                        <p>Following</p>
                    </div>
                </div>

                <a href="profile.php" class="view-profil stats">
                    <img src="svg/profile.svg" alt="">
                    <p>View Profile</p>
                </a>
            </div>

            <!-- Menü -->
            <div class="menu stats">
                <a href="dashboard.php" class="menu-item active">
                    <img class="icon" src="svg/icon-dashboard.svg" alt="dashboard" />
                    <p>Dashboard</p>
                </a>
                <a class="menu-item ">
                    <img class="icon" src="svg/icon-messages.svg" alt="messages" />
                    <p>Chats</p>
                    <div class="notification-badge">8</div>
                </a>
                <a href="wallet.php" class="menu-item">
                    <img class="icon" src="svg/wallets.svg" alt="network" />
                    <p>Wallet</p>
                </a>
                <a href="wallet.php" class="menu-item comming-soon">
                    <img class="icon icon-group " src="svg/icon-group.svg" alt="settings" />
                    <p>Settings</p>
                </a>
                <a class="menu-item comming-soon">
                    <img class="icon" src="svg/qmark.svg" alt="network" />
                    <p>How Peer Works</p>
                </a>
            </div>
            <div class="menu stats">
                <div class="menu-item"  id="btAddPost">
                    <img class="icon" src="svg/newpost.svg" alt="network" />
                    <p>Create a post</p>
                </div>
            </div>
        </div>
        <div id="profil-login" class="none">
            <a href="/login.php">login</a>
            <a href="/register.php">register</a>
        </div>
    </aside>
        <div id="footer" class="footer">
            
        </div>
    </article>
    
</body>

</html>