<?php
/**
 * Author: Khalid Meraj
 * Dated: 12 May 2025
 * Usage: This template is responsible for rendering the user profile section in the dashboard.
 * It displays user-related information such as profile picture, username and status.
 * The profile section is typically shown in the sidebar or as part of the user’s dashboard view.
 * The file centralizes user information and can be reused across different pages where user profile data is needed.
 */
?>


 <aside class="profil">
        <div id="profil-container">
            

            <!-- Menü -->
            <div class="menu stats">
                <a href="dashboard.php" class="menu-item">
                    <img class="icon" src="svg/icon-dashboard.svg" alt="dashboard" />
                    <p>Dashboard</p>
                </a>
                <a class="menu-item comming-soon">
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
