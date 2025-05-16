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
            <input type="text" placeholder=" " class="input title" />
            <div class="starter-placeholders">
                <span>@username</span>
                <span>Title</span>
            </div>
        </div>

        <!-- overlay dev -->
        <!--<div class="search-contact-results" id="search-contact-results">
            <div class="contacts-found">
                <div class="single-contact" data-userId="7a91806b-f6eb-4c57-b1c6-e65f72d1f179">
                    <img class="contact-avatar" src="./img/ender.png" alt="tester3">
                    <div class="contact-details">
                        <span class="contact-name">tester3</span>
                        <img class="chat-icon" src="svg/chats.svg" alt="chat" />
                    </div>
                </div>
            </div>
        </div>-->

        <div class="chat-switch">
            <button id="privateBtn" data-type="private" class="tab">Private</button>
            <button id="groupBtn" data-type="group" class="tab active">Groups</button>
            <button class="add-btn" id="search-contacts">+</button>
        </div>

        <div class="chat-pannel">
            <div class="chat-pannel-widget">

                <div class="chat-list-overlay">
                    <div class="chat-list-item">
                        <span class="profile-pic"><img src="svg/logo_sw.svg" alt="Profile Pic" /></span>
                        <span class="profile-name">Amelie Brenner <span class="profile-no">#15362</span></span>
                        <input type="checkbox" />
                    </div>
                    <div class="chat-list-item">
                        <span class="profile-pic"><img src="svg/logo_sw.svg" alt="Profile Pic" /></span>
                        <span class="profile-name">Amelie Brenner <span class="profile-no">#15362</span></span>
                        <input type="checkbox" />

                    </div>
                    <div class="chat-list-item">
                        <span class="profile-pic"><img src="svg/logo_sw.svg" alt="Profile Pic" /></span>
                        <span class="profile-name">Amelie Brenner <span class="profile-no">#15362</span></span>
                        <input type="checkbox" />

                    </div>

                </div>
                <div class="chat_buttons selected">
                    <span class="count-selected">1 account selected</span>
                    <a href="#" class="next-btn">Next</a>
                </div>

                <div class="chat_buttons">
                    <a href="#" class="back-btn">Back</a>
                    <a href="#" class="next-btn">Next</a>
                </div>

            </div>
        </div>
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