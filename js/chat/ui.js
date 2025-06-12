window.ChatApp = window.ChatApp || {};

ChatApp.ui = {
  initChatTabs() {
    const privateBtn = document.getElementById("privateBtn");
    const groupBtn = document.getElementById("groupBtn");

    const updateTab = (type) => {
      ChatApp.state.filterType = type;

      const privateBtn = document.getElementById("privateBtn");
      const groupBtn = document.getElementById("groupBtn");

      privateBtn.classList.remove("active");
      groupBtn.classList.remove("active");
      type === "private" ? privateBtn.classList.add("active") : groupBtn.classList.add("active");

      const isOverlayActive = ChatApp.state.isInCreateOverlay;
      const isOnReviewScreen = ChatApp.state.isInReviewScreen;

      if (isOverlayActive && isOnReviewScreen) {
        ChatApp.state.isInCreateOverlay = false;
        ChatApp.state.isInReviewScreen = false;
        ChatApp.state.selectedUsers = [];

        const container = ChatApp.utils.getElement(".chat-pannel-widget");
        container.innerHTML = "";

        ChatApp.loader.loadChats(type);
        return;
      }

      if (isOverlayActive) {
        ChatApp.ui.renderContacts(ChatApp.state.fullContactList);
        return;
      }

      ChatApp.state.isInReviewScreen = false;
      ChatApp.state.isInCreateOverlay = false;
      ChatApp.state.selectedUsers = [];

      ChatApp.loader.loadChats(type);
    };

    // ChatApp.utils.setAvatar(document.querySelector(".chat-input .avatar"));
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
          const container = document.querySelector(".chat-messages");
          const template = document.getElementById("chat-message-template");
          const clone = template.content.cloneNode(true);
          const message = clone.querySelector(".message");

          message.classList.add("right");
          message.querySelector(".message-text").textContent = content;
          message.querySelector(".time").textContent = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          container.appendChild(clone);
          container.scrollTop = container.scrollHeight;

          input.value = "";
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
    return ChatApp.api.fetchGraphQL(ChatApp.graphql.SEND_MESSAGE, { chatid, content })
      .then(res => res?.sendChatMessage?.status === "success");
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
      const isInsideResults = ChatApp.utils.getElement(".chat-list").contains(event.target);
      const isTabClick = event.target.closest("#privateBtn, #groupBtn");
      const isSearchInput = event.target.closest("#search-contacts");

      if (!isInsideResults && !isTabClick && !isSearchInput) {
        resultsBox.style.display = "none";
        ChatApp.state.isInCreateOverlay = false;
      } 
    });
  },

  async getFriends() {
    const data = await ChatApp.api.fetchGraphQL(ChatApp.graphql.LIST_FRIENDS);
    const contactList = data?.listFriends?.affectedRows || [];

    // Keep isInCreateOverlay true so tab switch shows filtered contacts properly
    ChatApp.state.isInReviewScreen = false;
    ChatApp.state.isInCreateOverlay = true;
    ChatApp.state.fullContactList = contactList;

    ChatApp.ui.renderContacts(contactList);
  },

  renderContacts(contactList) {
    const chatMode = ChatApp.state.filterType;
    const container = ChatApp.utils.getElement(".chat-pannel-widget");

    [...container.querySelectorAll(".chat-list-overlay, .chat_buttons, .input.title, #validationMessage")].forEach(el => el.remove());

    ChatApp.state.fullContactList = contactList;

    console.log("before if")
    if (ChatApp.state.isInReviewScreen) {
      console.log("i ma inside if ")
      ChatApp.state.isInCreateOverlay = false;
      return ChatApp.ui.renderReviewScreen(container);
    }

    console.log("after if")
    ChatApp.state.isInCreateOverlay = true;
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
    avatar.src = tempMedia(contact.img.replace("media/", ""));
    avatar.onerror = () => this.src = "./svg/noname.svg";
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

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (ChatApp.state.selectedUsers.length >= 2) {
        requestAnimationFrame(() => {
          ChatApp.state.isInReviewScreen = true;
          ChatApp.ui.renderContacts(ChatApp.state.fullContactList);
        });
      } else {
        alert("Please select at least two participants.");
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
	  nameInput.type = "text";
    nameInput.id = "chatNameInput";
    container.appendChild(nameInput);

    const nameInputError = document.createElement("label");
    nameInputError.id = "validationMessage";
    nameInputError.setAttribute("for", "chatNameInput");
    nameInputError.textContent = "";
    nameInputError.style.color = "red";
    nameInputError.style.display = "none";
    container.appendChild(nameInputError);

    ChatApp.state.selectedUsers.forEach(user => {
      const div = document.createElement("div");
      div.classList.add("chat-list-overlay");
      div.dataset.userId = user.recipients[0];

      const item = document.createElement("div");
      item.classList.add("chat-list-item");
      const avatar = document.createElement("img");
      avatar.src = tempMedia(user.img.replace("media/", ""))
      avatar.onerror = () => this.src = "./svg/noname.svg";
      avatar.alt = user.name;

      const imgSpan = document.createElement("span");
      imgSpan.classList.add("profile-pic");
      imgSpan.appendChild(avatar);

      const nameSpan = document.createElement("span");
      nameSpan.classList.add("profile-name");
      nameSpan.textContent = user.name;

      const removeIconSpan = document.createElement("span");
      removeIconSpan.className = "remove-user-group";
      removeIconSpan.textContent = "remove";

      // const removeBtn = document.createElement("img");
      // removeBtn.className = "chat-icon";
      // removeBtn.src = "svg/remove.svg";
      // removeBtn.alt = "remove";


      removeIconSpan.addEventListener("click", () => {
        ChatApp.state.selectedUsers = ChatApp.state.selectedUsers.filter(
          u => u.recipients[0] !== user.recipients[0]
        );
        if (ChatApp.state.selectedUsers.length === 0) { ChatApp.state.isInReviewScreen = false; ChatApp.ui.renderContacts(ChatApp.state.fullContactList);  }
        else requestAnimationFrame(() => { ChatApp.ui.renderReviewScreen(container)  })
      });

      item.appendChild(imgSpan);
      item.appendChild(nameSpan);
      item.appendChild(removeIconSpan);
      div.appendChild(item);
      container.appendChild(div);
    });

    const footer = document.createElement("div");
    footer.className = "chat_buttons selected";

    const backBtn = document.createElement("a");
    backBtn.href = "#";
    backBtn.className = "back-btn";
    backBtn.textContent = "Add accounts";
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      requestAnimationFrame(() => {
        ChatApp.state.isInReviewScreen = false;
        ChatApp.ui.renderContacts(ChatApp.state.fullContactList);
      });
    });

    const createBtn = document.createElement("a");
    createBtn.href = "#";
    createBtn.className = "next-btn";
    createBtn.textContent = "Create chat";
    createBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const name = nameInput.value.trim();

      if (!name || ChatApp.state.selectedUsers.length < 2) {
        nameInputError.textContent = "Please enter a name and select at least two participants.";
        nameInputError.style.display = "block";
        return;
      }

      // requestAnimationFrame(() => {
        ChatApp.ui.createChat({
          name,
          recipients: ChatApp.state.selectedUsers.map(u => u.recipients[0]),
          image: ChatApp.state.defaultGroupImage,
        });
      // });
    });

    footer.appendChild(backBtn);
    footer.appendChild(createBtn);
    container.appendChild(footer);
  },

  async createChat({ name = null, recipients = [], image = null }) {
    if (!recipients.length) return;
    try {
      await ChatApp.api.fetchGraphQL(ChatApp.graphql.CREATE_CHAT, { name, recipients, image });
      const chatType = recipients.length === 1 ? "private" : "group";
      ChatApp.state.filterType = chatType;

      // Update tab visuals
      const privateBtn = document.getElementById("privateBtn");
      const groupBtn = document.getElementById("groupBtn");

      privateBtn.classList.remove("active");
      groupBtn.classList.remove("active");
      chatType === "private" ? privateBtn.classList.add("active") : groupBtn.classList.add("active");

      // Load chats for the correct tab
      ChatApp.loader.loadChats(chatType, recipients[0]);
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

    const sendMessageTextInput = document.getElementById("sendMessageTextInput");


    const otherUser = chat.chatparticipants.find(u => u.userid !== ChatApp.state.currentUserId);
    header.textContent = chat.type === "private" ? otherUser?.username : chat.name;
    headerAvatar.src = tempMedia(otherUser?.img.replace("media/", ""));
    headerAvatar.onerror = () => this.src = "./svg/noname.svg";
    container.innerHTML = "";
    // console.log(chat);
    chat.chatmessages.forEach(msg => {
      const isCurrentUser = msg.senderid === ChatApp.state.currentUserId;
      const sender = chat.chatparticipants.find(u => u.userid === msg.senderid);
      const time = new Date(msg.createdat).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      
      sendMessageTextInput.src = tempMedia(otherUser?.img.replace("media/", ""));
      sendMessageTextInput.onerror = () => this.src = "./svg/noname.svg";

      const clone = template.content.cloneNode(true);
      const message = clone.querySelector(".message");
      message.classList.add(isCurrentUser ? "right" : "left");
      message.querySelector(".avatar").src = tempMedia(sender?.img.replace("media/", ""));
      message.querySelector(".avatar").onerror = () => this.src = "./svg/noname.svg";

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