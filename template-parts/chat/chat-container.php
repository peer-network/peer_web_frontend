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
            <img src="./img/ender.png" alt="user" class="avatar">
            <span class="username">Amelie Poppins</span>
        </div>
        <div class="header-right">
            <span class="search_chat"><img class="" src="svg/lupe.svg" alt="Search" /></span>
            <span class="dots">
            <em></em>
            <em></em>
            <em></em>
            </span>
        </div>
    </div>

    <!--<div class="chat-messages">
        <div class="message left">
            <div class="profile_avatar">
                <img src="https://i.pravatar.cc/40?img=1" class="avatar" alt="Avatar">
            </div>
            <div class="message_content">
                <div class="bubble blue">
                    Yeah right? :)
                    <span class="time">9:30</span>
                </div>
            </div>
        </div>

        <div class="message right">
            <div class="profile_avatar">
                <img src="https://i.pravatar.cc/40?img=2" class="avatar" alt="Avatar">
            </div>
            <div class="message_content">
                <div class="bubble blue">
                    Yeah right? :)
                    <span class="time">9:30</span>
                </div>
            </div>
        </div>

        <div class="message left">
            <div class="profile_avatar">
                <img src="https://i.pravatar.cc/40?img=3" class="avatar" alt="Avatar">
            </div>
            <div class="message_content">
                <div class="bubble blue">
                    Yeah right? :)
                    <span class="time">9:30</span>
                </div>
            </div>
        </div>

        <div class="message right">
            <div class="profile_avatar">
                <img src="https://i.pravatar.cc/40?img=2" class="avatar" alt="Avatar">
            </div>
            <div class="message_content">
                <div class="bubble blue">
                    Yeah right? :)
                    <span class="time">9:30</span>
                </div>
                <div class="bubble blue">
                    Send me other pictures and posts.
                    <span class="time">9:30</span>
                </div>
                <div class="bubble blue">
                    Send me other pictures and posts.
                    <span class="time">9:30</span>
                </div>
            </div>
        </div>

        <div class="message left">
            <div class="profile_avatar">
                <img src="https://i.pravatar.cc/40?img=1" class="avatar" alt="Avatar">
            </div>
            <div class="message_content">
                <div class="bubble blue">
                    Yeah right? :)
                    <span class="time">9:30</span>
                </div>
                <div class="bubble blue">
                    Yeah right? :)
                    <span class="time">9:30</span>
                </div>
            </div>
        </div>

        <div class="message right">
            <div class="profile_avatar">
                <img src="https://i.pravatar.cc/40?img=2" class="avatar" alt="Avatar">
            </div>
            <div class="message_content">
                <div class="bubble blue">
                    Yeah right? :)
                    <span class="time">9:30</span>
                </div>
                <div class="bubble blue">
                    Send me other pictures and posts.
                    <span class="time">9:30</span>
                </div>
                <div class="bubble blue">
                    Send me other pictures and posts.
                    <span class="time">9:30</span>
                </div>
            </div>
        </div>


    </div>-->
    

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
        <img id="sendMessageTextInput" src="" class="avatar">
        <textarea name="" id="sendPrivateMessage" cols="30" rows="4" placeholder="Write a message ..."></textarea>
    </div>
</div>
