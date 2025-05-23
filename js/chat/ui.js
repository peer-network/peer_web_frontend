window.ChatApp = window.ChatApp || {};

ChatApp.ui = {

initChatTabs() {
  const privateBtn = document.getElementById("privateBtn");
  const groupBtn = document.getElementById("groupBtn");

  let suppressTabSwitch = false;
  ChatApp.state.suppressTabSwitch = suppressTabSwitch; 

  const updateTab = (type) => {
    if (ChatApp.state.suppressTabSwitch) return; 

    ChatApp.state.filterType = type;
    privateBtn.classList.toggle("active", type === "private");
    groupBtn.classList.toggle("active", type === "group");
    ChatApp.loader.loadChats(type);
  };

  privateBtn.addEventListener("click", () => updateTab("private"));
  groupBtn.addEventListener("click", () => updateTab("group"));

  updateTab("private");
},

  bindSendMessageHandler() {
  const input = document.getElementById("sendPrivateMessage");
  if (!input) return;

  let isSending = false;

  input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter" && !event.shiftKey && !isSending) {
      event.preventDefault();

      const chatid = document.querySelector(".chat-item.active-chat")?.getAttribute("data-chatid");
      const content = input.value.trim();
      if (!chatid || !content) return;

      isSending = true;
      try {
        const success = await ChatApp.ui.sendMessage(chatid, content);
        if (success) {
          input.value = "";
          //ChatApp.loader.loadChats(ChatApp.state.filterType);
        }
      } catch (err) {
        console.error("Send failed:", err);
      } finally {
        isSending = false;
      }
    }
  });
  },

  sendMessage(chatid, content) {
    return ChatApp.api
      .fetchGraphQL(ChatApp.graphql.SEND_MESSAGE, { chatid, content })
      .then((res) => {
        return res?.sendChatMessage?.status === "success";
      });
  },

  initSearch() {
    const searchInput = ChatApp.utils.getElement("#search-contacts");
    const resultsBox = ChatApp.utils.getElement("#search-contact-results");
    if (!searchInput || !resultsBox) return;

    searchInput.addEventListener("click", (event) => {
      resultsBox.style.display = "block";
      event.stopPropagation();
      ChatApp.ui.getFriends();
    });

    document.addEventListener("click", (event) => {
    const isInsideResults = resultsBox.contains(event.target);
    const isTabClick = event.target.closest("#privateBtn, #groupBtn");
    const isSearchInput = event.target.closest("#search-contacts");

  if (!isInsideResults && !isTabClick && !isSearchInput) {
    //resultsBox.style.display = "none";
  }
});
  },

  async getFriends() {
    const data = await ChatApp.api.fetchGraphQL(ChatApp.graphql.LIST_FRIENDS);
    const contactList = data?.listFriends?.affectedRows || [];
    ChatApp.ui.renderContacts(contactList);
  },

  renderContacts(contactList) {
    const container = ChatApp.utils.getElement(".chat-pannel-widget");
    container.innerHTML = "";

    const chatMode = ChatApp.state.filterType;

    if (!ChatApp.state.isInReviewScreen) ChatApp.state.fullContactList = contactList;
    if (ChatApp.state.isInReviewScreen) return ChatApp.ui.renderReviewScreen(container);

    ChatApp.state.selectedUsers = ChatApp.state.selectedUsers.filter(Boolean);

    contactList.forEach(contact => {
      const userCard = ChatApp.ui.createUserCard(contact, chatMode);
      container.appendChild(userCard);
    });

    if (chatMode === "group") {
      const footer = ChatApp.ui.createFooterButtons();
      container.appendChild(footer);
    }
  },

  createUserCard(contact, chatMode) {
    const div = document.createElement("div");
    div.classList.add("chat-list-overlay");
    div.dataset.userId = contact.userid;

    const item = document.createElement("div");
    item.classList.add("chat-list-item");

    const avatar = document.createElement("img");
    avatar.src = ChatApp.utils.getAvatarUrl(contact.img);
    avatar.alt = contact.username;

    const imgSpan = document.createElement("span");
    imgSpan.classList.add("profile-pic");
    imgSpan.appendChild(avatar);

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("profile-name");
    nameSpan.textContent = `${contact.username}`;

    item.appendChild(imgSpan);
    item.appendChild(nameSpan);

    if (chatMode === "private") {
      const chatIcon = document.createElement("img");
      chatIcon.className = "chat-icon";
      chatIcon.src = "svg/chats.svg";
      chatIcon.alt = "chat";
      item.appendChild(chatIcon);

      div.addEventListener("click", () => {
        ChatApp.ui.createChat({
          name: contact.username,
          recipients: [contact.userid],
        });
      });
    } else {
      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.checked = ChatApp.state.selectedUsers.some(u => u.recipients[0] === contact.userid);

      checkBox.addEventListener("change", () => {
        if (checkBox.checked) {
          if (!ChatApp.state.selectedUsers.some(u => u.recipients[0] === contact.userid)) {
            ChatApp.state.selectedUsers.push({
              name: contact.username,
              recipients: [contact.userid],
              img: contact.img,
            });
          }
        } else {
          ChatApp.state.selectedUsers = ChatApp.state.selectedUsers.filter(u => u.recipients[0] !== contact.userid);
        }
        ChatApp.ui.updateSelectedCount();
      });

      item.appendChild(checkBox);
    }

    div.appendChild(item);
    return div;
  },

  createFooterButtons() {
    const footer = document.createElement("div");
    footer.className = "chat_buttons selected";

    const countSpan = document.createElement("span");
    countSpan.className = "count-selected";
    countSpan.textContent = `${ChatApp.state.selectedUsers.length} account selected`;

    const nextBtn = document.createElement("a");
    nextBtn.href = "#";
    nextBtn.className = "next-btn";
    nextBtn.textContent = "Next";

    nextBtn.addEventListener("click", () => {
      if (ChatApp.state.selectedUsers.length > 0) {
        ChatApp.state.isInReviewScreen = true;
        ChatApp.ui.renderContacts(ChatApp.state.fullContactList);
      }
    });

    footer.appendChild(countSpan);
    footer.appendChild(nextBtn);
    return footer;
  },

  updateSelectedCount() {
    const countSpan = ChatApp.utils.getElement(".count-selected");
    if (countSpan) {
      countSpan.textContent = `${ChatApp.state.selectedUsers.length} account${ChatApp.state.selectedUsers.length === 1 ? '' : 's'} selected`;
    }
  },

  renderReviewScreen(container) {
    container.innerHTML = "";

    const nameInput = document.createElement("input");
    nameInput.placeholder = "*Give a name to a chat";
    nameInput.className = "input title";
    container.appendChild(nameInput);

    ChatApp.state.selectedUsers.forEach(user => {
      const div = document.createElement("div");
      div.classList.add("chat-list-overlay");
      div.dataset.userId = user.recipients[0];

      const item = document.createElement("div");
      item.classList.add("chat-list-item");

      const avatar = document.createElement("img");
      avatar.src = ChatApp.utils.getAvatarUrl(user.img);
      avatar.alt = user.name;

      const imgSpan = document.createElement("span");
      imgSpan.classList.add("profile-pic");
      imgSpan.appendChild(avatar);

      const nameSpan = document.createElement("span");
      nameSpan.classList.add("profile-name");
      nameSpan.textContent = `${user.name}`;

      // const removeBtn = document.createElement("button");
      // removeBtn.textContent = "-";

      const removeBtn = document.createElement("img");
      removeBtn.className = "chat-icon";
      removeBtn.src = "svg/remove.svg";
      removeBtn.alt = "chat";


      removeBtn.addEventListener("click", () => {
        ChatApp.state.selectedUsers = ChatApp.state.selectedUsers.filter(u => u.recipients[0] !== user.recipients[0]);
        ChatApp.ui.renderContacts(ChatApp.state.fullContactList);
      });

      item.appendChild(imgSpan);
      item.appendChild(nameSpan);
      item.appendChild(removeBtn);
      div.appendChild(item);
      container.appendChild(div);
    });

    const footer = document.createElement("div");
    footer.className = "chat_buttons selected";

    const backBtn = document.createElement("a");
    backBtn.href = "#";
    backBtn.className = "back-btn";
    backBtn.textContent = "Add accounts";
    backBtn.addEventListener("click", () => {
      ChatApp.state.isInReviewScreen = false;
      ChatApp.ui.renderContacts(ChatApp.state.fullContactList);
    });

    const createBtn = document.createElement("a");
    createBtn.href = "#";
    createBtn.className = "next-btn";
    createBtn.textContent = "Create chat";
    createBtn.addEventListener("click", () => {
      const name = nameInput.value.trim();
      if (!name || ChatApp.state.selectedUsers.length === 0) return;
      ChatApp.ui.createChat({
        name,
        recipients: ChatApp.state.selectedUsers.map(u => u.recipients[0]),
        image: "data:image/webp;base64,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",
      });
    });

    footer.appendChild(backBtn);
    footer.appendChild(createBtn);
    container.appendChild(footer);
  },

  async createChat({ name = null, recipients = [], image = null }) {    
    if (!recipients.length) return;
    try {
      await ChatApp.api.fetchGraphQL(ChatApp.graphql.CREATE_CHAT, { name, recipients, image });
      ChatApp.loader.loadChats(recipients.length === 1 ? "private" : "group", recipients[0]);
      const resultsBox = ChatApp.utils.getElement("#search-contact-results");
      if (resultsBox) resultsBox.style.display = "none";
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  },

  renderMessages(chat) {
    const container = document.querySelector(".chat-messages");
    const template = document.getElementById("chat-message-template");
    const header = document.querySelector(".chat-header .username");
    const headerAvatar = document.querySelector(".chat-header .avatar");

    const otherUser = chat.chatparticipants.find(u => u.userid !== ChatApp.state.currentUserId);
    header.textContent = chat.type === "private" ? otherUser?.username : chat.name;
    headerAvatar.src = ChatApp.utils.getAvatarUrl(otherUser?.img);

    container.innerHTML = "";

    chat.chatmessages.forEach(msg => {
      const isCurrentUser = msg.senderid === ChatApp.state.currentUserId;
      const sender = chat.chatparticipants.find(u => u.userid === msg.senderid);
      const time = new Date(msg.createdat).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const clone = template.content.cloneNode(true);
      const message = clone.querySelector(".message");
      message.classList.add(isCurrentUser ? "right" : "left");
      message.querySelector(".avatar").src = ChatApp.utils.getAvatarUrl(sender?.img);

      const textEl = message.querySelector(".message-text");
      if (chat.type === "group") {
        textEl.innerHTML = `<div class="sender-name">${isCurrentUser ? "– you" : `@${sender?.username}`}</div>` + ChatApp.utils.decodeHTML(msg.content);
      } else {
        textEl.textContent = ChatApp.utils.decodeHTML(msg.content);
      }

      message.querySelector(".time").textContent = time;
      container.appendChild(clone);
    });

    container.scrollTop = container.scrollHeight;
  }
};
