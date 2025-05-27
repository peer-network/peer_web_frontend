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
   <form id="filter" class="filterContainer">
                    <div class="dash">
                        <h1>Chat</h1>
                        <img class="logo" src="svg/cht.svg" alt="Peer Network Logo" />
                    </div>
                <div class="search-group" id="searchGroup">
                    <div class="search-box">
                        <input name="searchUser" id="searchUser" type="text" placeholder="@username" />
                        <div class="dropdown none" id="userDropdown"></div>
                    </div>

                    <img class="lupe" id="searchBtn" src="svg/lupe.svg" alt="search"/>
                </div>
                <div id="userResults" class="user-results"></div>
            </form>
</aside>
