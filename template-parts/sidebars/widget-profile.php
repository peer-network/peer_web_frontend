<div class="widget widget-margin-bottom">
    	
    	<a href="profile.php" class="widget-inner widget-type-box profile_link widget-profile">
        
        	<!-- Profil-Bild und Name -->
                <div class="profile-header profile_header">
                    <div id="cropContainer" class="cropContainer">
                    <span class="online_status"></span>
                        <img id="profilbild" src="svg/noname.svg" alt="Profile Picture" class="profilbild profile-picture" />
                        <!-- <img id="editProfileImage" src="svg/edit.svg" alt="edit">
                            <img id="cropButton" src="svg/ok.svg" alt="edit"> -->
                    </div>
                    <!-- <div id="badge" class="badge"></div> -->
                    <div class="pro-name">
                        <div id="username" class="username user-profile-name">&nbsp;</div>
                        <p id="slug" class="slug username">&nbsp;</p>
                    </div>
                </div>

                <!-- Statistiken -->
                <div class="stats">
                    <div class="none stat">
                        <span id="userPosts">&nbsp;</span>
                        <p>Posts</p>
                    </div>
                    <div class="stat">
                        <span id="followers">&nbsp;</span>
                        <p>Followers</p>
                    </div>
                    <div class="stat">
                        <span id="Peers">&nbsp;</span>
                        <p>Peers</p>
                    </div>
                    <div class="stat">
                        <span id="following">&nbsp;</span>
                        <p>Following</p>
                    </div>
                </div>

                <!-- Daily free actions -->
        		<?php require_once('./template-parts/sidebars/widget-daily-action.php'); ?>
        </a>
</div>