<div class="widget">
    <div class="widget-inner widget-type-box widget-main-menu">
        <?php $currentPage = basename($_SERVER['PHP_SELF']); // e.g. "dashboard.php" or "profile.php"?>
        <ul class="menu">
            <li class="menu-item <?= ($currentPage === 'dashboard.php') ? 'active' : '' ?>">
                <a href="dashboard.php">
                    <img class="icon" src="svg/icon-dashboard.svg" alt="dashboard" />
                    Dashboard
                </a>
            </li>
            <li class="menu-item <?= ($currentPage === 'chat.php') ? 'active' : '' ?>">
                <a href="chat.php">
                    <img class="icon" src="svg/icon-messages.svg" alt="Chat" />
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
                class="menu-item <?= ($currentPage === 'setting.php' ||  $currentPage === 'edit_profile.php') ? 'active' : '' ?>">
                <a href="edit_profile.php">
                    <img class="icon icon-group " src="svg/icon-group.svg" alt="settings" />
                    Settings
                </a>
            </li>
            <li class="menu-item">
                <a href="#">
                    <img class="icon" src="svg/qmark.svg" alt="network" />
                    How Peer Works
                </a>
            </li>
        </ul>
    </div>
</div>