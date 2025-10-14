<div class="widget widget-margin-bottom">
    <div class="widget-inner widget-type-box widget-main-menu">
        <?php $currentPage = basename($_SERVER['PHP_SELF']); // e.g. "dashboard.php" or "profile.php"?>
        <ul class="menu">
            <li class="menu-item <?= ($currentPage === 'dashboard.php') ? 'active' : '' ?>">
                <a href="dashboard.php">
                    <i class="peer-icon peer-icon-home-alt"></i>
                    <i class="filled peer-icon peer-icon-home"></i>
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
                    <i class="peer-icon peer-icon-wallet"></i>
                    <i class="filled peer-icon peer-icon-wallet-filled"></i>
                    Wallet
                </a>
            </li>
            <li
                class="menu-item <?= ($currentPage === 'setting.php' ||  $currentPage === 'profileSettings.php') ? 'active' : '' ?>">
                <a href="profileSettings.php">
                     <i class="peer-icon peer-icon-setting"></i>
                     <i class="filled peer-icon peer-icon-setting-filled"></i>
                    Settings
                </a>
            </li>
            <li class="menu-item">
                <a id="open-onboarding" href="#">
                     <i class="peer-icon peer-icon-help"></i>
                     <i class="filled peer-icon peer-icon-help-filled"></i>
                    How Peer Works
                </a>
            </li>
            <li class="menu-item referralPage <?= ($currentPage === 'referralBoard.php') ? 'active' : '' ?>">
                <a class="white_border" href="referralBoard.php">
                    <i class="peer-icon peer-icon-referral"></i>
                     <i class="filled peer-icon peer-icon-referral"></i>

                    Invite a friend
                </a>
            </li>
        </ul>
    </div>
</div>