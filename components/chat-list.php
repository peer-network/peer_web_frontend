<?php
/**
 * Author: Luqman
 * Dated: 30 April 2025
 * Usage: This template part will be used in private chat
 */
?>

<div class="chat-list">

    <div class="top-bar">
        <!-- Search Bar -->
        <div class="search-container">
            <input type="text" placeholder=" " class="input title" id="search-contacts" />
            <div class="starter-placeholders">
                <span>@username</span>
                <span>Title</span>
            </div>
        </div>
        <div class="search-contact-results" id="search-contact-results">
            <div class="contacts-found">
                <div class="single-contact" data-userId="7a91806b-f6eb-4c57-b1c6-e65f72d1f179">
                    <img class="contact-avatar" src="./img/ender.png" alt="tester3">
                    <div class="contact-details">
                        <span class="contact-name">tester3</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="chat-switch">
            <button id="privateBtn" class="tab active">Private</button>
            <button id="groupBtn" class="tab">Groups</button>
            <button class="add-btn">+</button>
        </div>

        <!-- Popup Modal (initially hidden) -->
        <!-- <div id="popupOverlay" class="popup-overlay hidden">-->
        <!-- <div class="popup pop-chat-list">
                <p class="section-title">Recently interacted</p>
                <div class="chat-list">
                    <div class="pop-chat-item">
                        <img src="./img/ender.png" alt="avatar">
                        <div class="chat-details">
                            <strong>Amelie Brenner</strong> <span>#239100</span>
                        </div>
                        <span class="chat-icon">💬</span>
                    </div>
                </div>
            </div>
        </div>-->

    </div> <!-- end of top-bar -->

    <template id="chat-sidebar-item-template">
        <div class="chat-item">
            <img class="avatar" src="./img/ender.png" alt="Avatar" />
            <div class="chat-details">
                <div class="chat-row">
                    <span class="name">Name</span>
                    <span class="time">Time</span>
                </div>
                <div class="message-preview">Message preview</div>
                <div class="unread-badge"></div>
            </div>
        </div>
    </template>

    <!-- Chat Item Template -->
    <!--<div class="chat-item">
        <img class="avatar" src="./img/ender.png" alt="avatar" />
        <div class="chat-details">
            <div class="chat-row">
                <span class="name">Amelie Brenner</span>
                <span class="time">7m</span>
            </div>
            <div class="message-preview">Thank you so much!! I really …</div>
        </div>
    </div>-->

</div>