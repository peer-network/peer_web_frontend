<?php
/**
 * Author: Luqman
 * Dated: 29 April 2025
 * Usage: This template is responsible for rendering the user profile section in the dashboard.
 * It displays user-related information such as profile picture, username and status.
 * The profile section is typically shown in the sidebar or as part of the user’s dashboard view.
 * The file centralizes user information and can be reused across different pages where user profile data is needed.
 */
?>

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

                <a href="profile.php" class="view-profil stats ">
                    <img src="svg/profile.svg" alt="">
                    <p>View Profile</p>
                </a>
            </div>

            <!-- Menü -->
            <div class="menu stats">
                <a href="dashboard.php" class="menu-item">
                    <img class="icon" src="svg/icon-dashboard.svg" alt="dashboard" />
                    <p>Dashboard</p>
                </a>
                <div class="menu-item active">
                    <img class="icon" src="svg/icon-messages.svg" alt="messages" />
                    <p>Chats</p>
                    <div class="notification-badge">8</div>
                </div>
                <a href="wallet.php" class="menu-item">
                    <img class="icon" src="svg/wallets.svg" alt="network" />
                    <p>Wallet</p>
                </a>
                <a href="edit_profile.php" class="menu-item ">
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
                    <p>New post</p>
                </div>
            </div>
        </div>
        <div id="profil-login" class="none">
            <a href="/login.php">login</a>
            <a href="/register.php">register</a>
        </div>
    </aside>