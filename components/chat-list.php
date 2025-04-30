<?php
/**
 * Author: Luqman
 * Dated: 30 April 2025
 * Usage: This template part will be used in private chat and group chat
 */
?>

<div class="chat-list">

    <div class="top-bar">
        <!-- Search Bar -->
        <div class="search-container">
            <input type="text" placeholder="Title" class="input title" />
        </div>

        <!-- Private / Groups Toggle + Add Button -->
        <div class="chat-switch">
            <button class="tab active">Private</button>
            <button class="tab">Groups</button>
            <button class="add-btn">+</button>
        </div>
    </div>

    <!-- Chat Item Template -->
    <div class="chat-item">
        <img class="avatar" src="./img/ender.png" alt="avatar" />
        <div class="chat-details">
            <div class="chat-row">
                <span class="name">Amelie Brenner</span>
                <span class="time">7m</span>
            </div>
            <div class="message-preview">Thank you so much!! I really …</div>
        </div>
    </div>

    <div class="chat-item">
        <img class="avatar" src="./img/ender.png" alt="avatar" />
        <div class="chat-details">
            <div class="chat-row">
                <span class="name">Brandon Miles</span>
                <span class="time">30m</span>
            </div>
            <div class="message-preview"><span class="you">You:</span> What about tomorrow?</div>
        </div>
    </div>

    <div class="chat-item active-chat">
        <img class="avatar" src="./img/ender.png" alt="avatar" />
        <div class="chat-details">
            <div class="chat-row">
                <span class="name">Serhio Milos</span>
                <span class="time">34m</span>
            </div>
            <div class="message-preview"><span class="you">You:</span> I also wanted to ask u…</div>
        </div>
    </div>

    <div class="chat-item unread">
        <img class="avatar" src="./img/ender.png" alt="avatar" />
        <div class="chat-details">
            <div class="chat-row">
                <span class="name">Amanda Poppins</span>
                <span class="time">35m</span>
            </div>
            <div class="message-preview message-preview-unread">Hey! I am currently doing our …</div>
            <div class="unread-badge">1</div>
        </div>
    </div>

    <div class="chat-item unread">
        <img class="avatar" src="./img/ender.png" alt="avatar" />
        <div class="chat-details">
            <div class="chat-row">
                <span class="name">Eva Turner</span>
                <span class="time">35m</span>
            </div>
            <div class="message-preview">There is no way he did the …</div>
            <div class="unread-badge">1</div>
        </div>
    </div>

    <div class="chat-item">
        <img class="avatar" src="./img/ender.png" alt="avatar" />
        <div class="chat-details">
            <div class="chat-row">
                <span class="name">Evelin Ray</span>
                <span class="time">3h</span>
            </div>
            <div class="message-preview"><span class="you">You:</span> Here is the text prompt …</div>
        </div>
    </div>

    <div class="chat-item">
        <img class="avatar" src="./img/ender.png" alt="avatar" />
        <div class="chat-details">
            <div class="chat-row">
                <span class="name">Samuel Fick</span>
                <span class="time">1d</span>
            </div>
            <div class="message-preview"><span class="you">You:</span> Here is the text prompt …</div>
        </div>
    </div>
</div>
