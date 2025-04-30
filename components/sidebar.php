<?php
/**
 * Author: Luqman
 * Dated: 29 April 2025
 * Usage: This template provides the sidebar navigation for the site.
 * It contains links to different sections of the dashboard, such as chat, profile and settings.
 * The sidebar is included in various pages (e.g., dashboard, chat pages) to provide a consistent navigation experience across the site.
 * The file ensures that the sidebar layout and links are centralized, making future updates easier and maintaining uniformity.
 */
?>

<aside class="sidebar">
  <div id="DashboardHeader" class="header">
    <div>
      <img src="svg/logo_sw.svg" alt="Peer Network Logo" />
      <h1 id="h1">Messages</h1>
    </div>
  </div>
  <div class="menu chats stats sidebar_chats">
    <a href="privatechat.php" class="menu-item">
      <img class="icon" src="svg/icon-dashboard.svg" alt="dashboard" />
      <p>Direct Message</p>
    </a>

    <a href="groupchat.php" class="menu-item">
      <img class="icon" src="svg/icon-network.svg" alt="network" />
      <p>Group messages</p>
    </a>
  </div>
</aside>