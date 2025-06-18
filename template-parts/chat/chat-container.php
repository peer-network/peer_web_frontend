<?php
/**
 * Author: Luqman
 * Dated: 29 April 2025
 * Usage: This template provides the HTML structure for the private chat container.
 * It contains the layout for displaying messages, input fields and other necessary elements
 * to facilitate a one-on-one chat experience. This template is specifically used in the private chat page
 * (privatechat.php) and is designed to handle private communication between users.
 */
?>

<div class="chat-container">
    <div class="chat-header">
    	<div class="header-left">
            <img src="svg/noname.svg" alt="user" class="avatar">
            <span class="username"></span>
        </div>
        <div class="header-right">
            <span class="search_chat"><img class="" src="svg/noname.svg" alt="Search" /></span>
            <span class="dots">
            <em></em>
            <em></em>
            <em></em>
            </span>
        </div>
    </div>

     <template id="chat-message-template">
        <div class="message">
            <div class="profile_avatar">
                <img class="avatar" alt="Avatar">
            </div>
            <div class="message_content">
                <div class="bubble blue">
                    <span class="message-text"></span>
                    <span class="time"></span>
                </div>
            </div>
        </div>
    </template>

    <div class="chat-messages"></div>
    
    <div class="chat-input">
        <img id="sendMessageUserImg" src="svg/noname.svg" class="avatar">
        <textarea name="" id="sendPrivateMessage" cols="30" rows="4" placeholder="Write a message ..."></textarea>
        <div class="error-block" id="sendMessageTextError">
            <label>Message must be 500 characters or fewer</label>
        </div>
    </div>

    <div id="no_chatMessage_found" class="no_post_found">No Chat found...</div>
</div>
