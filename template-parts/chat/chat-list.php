<?php
/**
 * Author: Luqman
 * Dated: 30 April 2025
 * Usage: This template part will be used in private chat
 */
?>

<div class="chat-list">

    <div class="top-bar">
        

        <div class="chat-switch">
            <button id="privateBtn" data-type="private" class="tab">Private</button>
            <button id="groupBtn" data-type="group" class="tab active">Groups</button>
            <button class="add-btn btn-blue" id="search-contacts">+</button>
        </div>
    </div> <!-- end of top-bar -->

    <div class="chat-pannel" id="search-contact-results">
        <div class="chat-pannel-widget">
            <div id="no_post_found" class="no_post_found">No Friend found...</div>
        </div>
    </div>

    <template id="chat-sidebar-item-template">
        <div class="chat-item">
            <img class="avatar" src="" alt="Avatar" />
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
</div>