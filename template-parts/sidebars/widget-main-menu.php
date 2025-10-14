<div class="widget widget-margin-bottom">
    <div class="widget-inner widget-type-box widget-main-menu">
        <?php $currentPage = basename($_SERVER['PHP_SELF']); // e.g. "dashboard.php" or "profile.php"?>
        <ul class="menu">
            <li class="menu-item <?= ($currentPage === 'dashboard.php') ? 'active' : '' ?>">
                <a href="dashboard.php">
                    <img class="icon" src="svg/Home.svg" alt="dashboard" />
                    Dashboard
                </a>
            </li>
            <li class="menu-item none <?= ($currentPage === 'chat.php') ? 'active' : '' ?>">
                <a href="chat.php">
                    <img class="icon" src="svg/chat-icon-update.svg" alt="Chat" />
                    Chats
                    <span class="notification-badge">8</span>
                </a>
            </li>
            <li class="menu-item <?= ($currentPage === 'wallet.php') ? 'active' : '' ?>">
                <a href="wallet.php">
                    <img class="icon" src="svg/wallets.svg" alt="wallet" />
                    Wallet
                </a>
            </li>
            <li
                class="menu-item <?= ($currentPage === 'setting.php' ||  $currentPage === 'profileSettings.php') ? 'active' : '' ?>">
                <a href="profileSettings.php">
                    <img class="icon icon-group " src="svg/icon-group.svg" alt="settings" />
                    Settings
                </a>
            </li>
            <li class="menu-item">
                <a id="open-onboarding" href="#">
                    <img class="icon" src="svg/qmark.svg" alt="network" />
                    How Peer Works
                </a>
            </li>
            <li class="menu-item referralPage <?= ($currentPage === 'referralBoard.php') ? 'active' : '' ?>">
                <a class="white_border" href="referralBoard.php">
                    <img class="icon" src="svg/invite-friend-icon.svg" alt="network" />
                    Invite a friend
                </a>
            </li>
        </ul>
    </div>
</div>