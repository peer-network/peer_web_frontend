let
  privateBtn,
  groupBtn,
  sendPrivateMessage,
  currentUserId;

let filterType = "private";

window.addEventListener("DOMContentLoaded", () => {
  privateBtn = document.getElementById("privateBtn");
  groupBtn = document.getElementById("groupBtn");
  sendPrivateMessage = document.getElementById("sendPrivateMessage");
  console.log('on doucment load ', document.getElementById("sendPrivateMessage"))
  const updateTab = (type) => {
    filterType = type;
    privateBtn.classList.toggle("active", type === "private");
    groupBtn.classList.toggle("active", type === "group");
    loadChats(type);
  };

  privateBtn.addEventListener("click", () => updateTab("private"));
  groupBtn.addEventListener("click", () => updateTab("group"));

  updateTab("private");




  async function loadChats(filterType = "private", userId = null) {

    const accessToken = getCookie("authToken");
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    const query = `
    query ListChats {
      listChats {
        affectedRows {
          id
          image
          name
          createdat
          updatedat
          chatmessages {
            id
            senderid
            chatid
            content
            createdat
          }
          chatparticipants {
            userid
            img
            username
            slug
            hasaccess
          }
        }
      }
    }
  `;

    try {
      const response = await fetch(GraphGL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query
        }),
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const result = await response.json();
      if (result.errors) throw new Error(result.errors[0].message);

      const rawChats = result ?.data ?.listChats ?.affectedRows || [];

      const typedChats = rawChats
        .map(chat => {
          const isPrivate = !chat.name ?.trim() && !chat.image;
          return {
            ...chat,
            type: isPrivate ? "private" : "group"
          };
        })
        .filter(chat => chat.type === filterType);

      console.log('typedChats ', typedChats);
      const chatList = typedChats.map(chat => ({
        id: chat.id,
        name: chat.name,
        image: chat.image,
        type: chat.type,
        senderId: chat.senderid,
        chatmessages: [...(chat.chatmessages || [])].sort((a, b) => new Date(a.createdat) - new Date(b.createdat)),
        chatparticipants: chat.chatparticipants || [],
        unreadCount: 0,
      }));

      renderChatSidebar(chatList, userId);

    } catch (error) {
      console.error("Error loading chats:", error);
    }
  }

  async function renderChatSidebar(chatList, userId) {
    const sidebar = document.querySelector(".chat-list");
    const template = document.getElementById("chat-sidebar-item-template");
    currentUserId = await getCurrentUserId();
    sidebar.querySelectorAll(".chat-item").forEach(el => el.remove());

    console.log('currentUserId ', currentUserId);

    chatList.forEach((chat, index) => {
      const otherUser = chat.chatparticipants.find(p => p.userid !== currentUserId) || chat.chatparticipants[0];
      const lastMessage = chat.chatmessages.at(-1);
      const time = lastMessage ? formatTimeAgo(lastMessage.createdat) : "—";
      const preview = lastMessage ?.content || "Start chatting...";
      const unread = chat.unreadCount > 0;

      const clone = template.content.cloneNode(true);
      const item = clone.querySelector(".chat-item");


      if (unread) item.classList.add("unread");

      item.setAttribute("data-chatid", chat.id);
      item.querySelector(".avatar").alt = otherUser.username;
      item.querySelector(".name").textContent = chat.type === "private" ? otherUser.username : chat.name;
      item.querySelector(".time").textContent = time;

      const previewEl = item.querySelector(".message-preview");
      previewEl.textContent = preview;
      if (unread) previewEl.classList.add("message-preview-unread");

      const badge = item.querySelector(".unread-badge");
      if (unread) {
        badge.textContent = chat.unreadCount;
        badge.style.display = "";
      }

      item.onclick = () => {
        document.querySelectorAll(".chat-item").forEach(el => el.classList.remove("active-chat"));
        item.classList.add("active-chat");
        renderMessages(chat);
      };

      sidebar.appendChild(clone);

      const shouldAutoSelect =
        (userId && otherUser.userid === userId) || (!userId && index === 0);

      if (shouldAutoSelect) {
        item.classList.add("active-chat");
        renderMessages(chat);
      }

      // if (index === 0) item.classList.add("active-chat");
      // if (index === 0)  renderMessages(chat);

    });
  }

  async function renderMessages(chat) {
    const container = document.querySelector(".chat-messages");
    const template = document.getElementById("chat-message-template");
    if (!template) return console.error("Template not found!");

    container.innerHTML = "";

    const header = document.querySelector(".chat-header .username");
    const headerAvatar = document.querySelector(".chat-header .avatar");

    const otherUser = chat.chatparticipants.find(u => u.userid !== currentUserId);
    header.textContent = chat.type === "private" ? otherUser ?.username : chat.name;
    headerAvatar.src = getAvatarUrl(otherUser ?.img);

    chat.chatmessages.forEach(msg => {
      const isCurrentUser = msg.senderid === currentUserId;
      const sender = chat.chatparticipants.find(u => u.userid === msg.senderid);
      const iso = msg.createdat.replace(" ", "T").split(".")[0] + "Z";
      const time = new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
      const clone = template.content.cloneNode(true);
      const message = clone.querySelector(".message");

      if (!message) return;

      message.classList.add(isCurrentUser ? "right" : "left");
      message.querySelector(".avatar").src = getAvatarUrl(sender ?.img);

      const textEl = message.querySelector(".message-text");

      // Add user-name label for group chat
      if (chat.type === "group") {
        textEl.innerHTML = `<div class="sender-name">${isCurrentUser ? "– you" : `@${sender?.username || "User"}`}</div>` + decodeHTML(msg.content);
      } else {
        textEl.textContent = decodeHTML(msg.content);
      }

      message.querySelector(".time").textContent = time;
      container.appendChild(clone);
    });

    container.scrollTop = container.scrollHeight;
  }


  async function sendMessage(chatid, content) {

    const accessToken = getCookie("authToken");

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    const query = `
    mutation sendChatMessage($chatid: ID!, $content: String!) {
      sendChatMessage(chatid: $chatid, content: $content) {
        status
        ResponseCode
        affectedRows {
          content
          createdat
        }
      }
    }
  `;

    const variables = {
      chatid,
      content
    };

    try {
      const response = await fetch(GraphGL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query,
          variables
        }),
      });

      if (!response.ok) throw new Error("Chat message send failed.");
      return await response.json();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  console.log('sendPrivateMessage ', sendPrivateMessage)

  if (sendPrivateMessage) {
    console.log('set');
    let isSending = false;
    sendPrivateMessage.addEventListener("keydown", async function (event) {
      console.log('jey down');
      if (event.key === "Enter" && !event.shiftKey && !isSending) {
        event.preventDefault();

        const chatid = document.querySelector(".chat-item.active-chat") ?.getAttribute("data-chatid");
        const content = event.target.value.trim();

        if (!chatid || !content) return;

        isSending = true;
        try {
          const res = await sendMessage(chatid, content);
          const status = res ?.data ?.sendChatMessage ?.status;

          if (status === "success") {
            const template = document.getElementById("chat-message-template");
            const clone = template.content.cloneNode(true);
            const message = clone.querySelector(".message");

            message.classList.add("right");
            message.querySelector(".avatar").src = getAvatarUrl("/img/ender.png");
            message.querySelector(".message-text").textContent = content;
            message.querySelector(".time").textContent = new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            const container = document.querySelector(".chat-messages");
            container.appendChild(clone);
            container.scrollTop = container.scrollHeight;

            event.target.value = "";
          }
        } catch (err) {
          console.error("Send failed:", err);
        } finally {
          isSending = false;
        }
      }
    });
  }

  async function getCurrentUserId() {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)userID=([^;]+)/);
    if (cookieMatch) {
      cachedUserId = cookieMatch[1];
      return cachedUserId;
    }

    try {
      const result = await hello();
      const userId = result ?.currentuserid;
      if (userId) {
        document.cookie = `userID=${userId}; path=/; SameSite=Strict`;
        cachedUserId = userId;
      }
      return cachedUserId;
    } catch (err) {
      console.error("Failed to retrieve user ID:", err.message);
      return null;
    }
  }

  function formatTimeAgo(datetime) {
    const diff = Math.floor((new Date() - new Date(datetime)) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  }

  function getAvatarUrl(path) {
    return path ? `http://localhost/peer_web_frontend${path}` : "svg/noname.svg";
  }

  function decodeHTML(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    const firstPass = txt.value;

    txt.innerHTML = firstPass;
    return txt.value;
  }

  function getActiveChatType() {
    return document.getElementById("privateBtn").classList.contains("active") ?
      "private" :
      "group";
  }

  const search_contacts = document.getElementById('search-contacts');
  const resultsBox = document.getElementById('search-contact-results');

  search_contacts.addEventListener('click', (event) => {
    // let inputValue = search_contacts.value.trim();
    // if (inputValue !== '' && inputValue.length > 1) {
    resultsBox.style.display = 'block';
    // } else {
    //   search_contact_results.style.display = 'none';
    // }

    event.stopPropagation();
    getFreinds();
  });

  document.addEventListener("click", (event) => {
    const isClickInside = resultsBox.contains(event.target); // || search_contacts.contains(event.target);

    if (!isClickInside) resultsBox.style.display = "none";

  });

  // async function getFreinds() {

  //   const accessToken = getCookie("authToken");
  //   const headers = new Headers({
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${accessToken}`,
  //   });

  //   const query = `
  //     query ListFriends {
  //     listFriends {
  //         status
  //         counter
  //         ResponseCode
  //         affectedRows {
  //             userid
  //             img
  //             username
  //             slug
  //             biography
  //             updatedat
  //         }
  //       }
  //     }
  //   `;

  //   try {
  //     const response = await fetch(GraphGL, {
  //       method: "POST",
  //       headers,
  //       body: JSON.stringify({
  //         query
  //       }),
  //     });

  //     if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  //     const result = await response.json();
  //     if (result.errors) throw new Error(result.errors[0].message);

  //     const container = document.querySelector(".contacts-found");
  //     container.innerHTML = ""; // Clear previous items

  //     contactList = result ?.data ?.listFriends ?.affectedRows || null;

  //     contactList.forEach(contact => {
  //       // .single-contact
  //       const contactDiv = document.createElement("div");
  //       contactDiv.classList.add("single-contact");
  //       contactDiv.setAttribute("data-userId", contact.userId);

  //       // .contact-avatar
  //       const avatarImg = document.createElement("img");
  //       avatarImg.classList.add("contact-avatar");
  //       avatarImg.setAttribute("src", getAvatarUrl("/img/ender.png"));
  //       avatarImg.setAttribute("alt", contact.name);

  //       // .contact-details
  //       const detailsDiv = document.createElement("div");
  //       detailsDiv.classList.add("contact-details");

  //       // .contact-name
  //       const nameSpan = document.createElement("span");
  //       nameSpan.classList.add("contact-name");
  //       nameSpan.textContent = contact.username;

  //       // .chat-icon
  //       const chatIcon = document.createElement("img");
  //       chatIcon.classList.add("chat-icon");
  //       chatIcon.setAttribute("src", "svg/chats.svg");
  //       chatIcon.setAttribute("alt", "chat");

  //       // Nest structure
  //       detailsDiv.appendChild(nameSpan);
  //       detailsDiv.appendChild(chatIcon);

  //       contactDiv.appendChild(avatarImg);
  //       contactDiv.appendChild(detailsDiv);
  //       contactDiv.setAttribute("data-userId", contact.userid);

  //       // 🔥 Add click event to contact row
  //       contactDiv.addEventListener("click", () => createChatWithUser(contact.username, contact.userid));
  //       container.appendChild(contactDiv);
  //     })
  //   } catch (error) {
  //     console.error("Error loading chats:", error);
  //   }
  // }

  // async function createChatWithUser(name, userId) {
  //   const token = getCookie("authToken");
  //   if (!token || !userId) {
  //     console.error("Missing token or userId.");
  //     return;
  //   }

  //   const query = `
  //     mutation CreateChat($name: String!, $recipients: [String!]!) {
  //       createChat(input: { name: $name, recipients: $recipients }) {
  //         status
  //         ResponseCode
  //         affectedRows {
  //           chatid
  //         }
  //       }
  //     }
  //   `;

  //   const variables = {
  //     name: name ? ? null,
  //     recipients: [userId],
  //   };

  //   try {
  //     const res = await fetch(GraphGL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         query,
  //         variables
  //       }),
  //     });

  //     const json = await res.json();
  //     if (!res.ok || json.errors) throw new Error(json.errors ?. [0] ?.message || "Failed to create chat");

  //     console.log("Chat created:", json.data);
  //     // return json.data;
  //     const chatType = getActiveChatType();

  //     loadChats(chatType, userId);
  //     resultsBox.style.display = "none";

  //   } catch (err) {
  //     console.error("Error creating chat:", err.message);
  //   }
  // }


  async function createChat({
    name = null,
    recipients = []
  }) {
    const token = getCookie("authToken");
    if (!token || !recipients.length) {
      console.error("Missing token or recipients");
      return;
    }

    const query = `
    mutation CreateChat($name: String, $recipients: [String!]!) {
      createChat(input: { name: $name, recipients: $recipients }) {
        status
        ResponseCode
        affectedRows {
          chatid
        }
      }
    }
  `;

    const variables = {
      name,
      recipients
    };

    try {
      const res = await fetch(GraphGL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          variables
        }),
      });

      const json = await res.json();
      if (!res.ok || json.errors) throw new Error(json.errors ?. [0] ?.message || "Failed to create chat");

      const chatType = recipients.length === 1 ? "private" : "group";
      loadChats(chatType, recipients[0]); // Pass the main userId for rendering
      if (typeof resultsBox !== "undefined") resultsBox.style.display = "none";

    } catch (err) {
      console.error("Error creating chat:", err.message);
    }
  }

  async function getFreinds() {
    const token = getCookie("authToken");
    const query = `
    query ListFriends {
      listFriends {
        affectedRows {
          userid
          img
          username
        }
      }
    }
  `;

    try {
      const res = await fetch(GraphGL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query
        }),
      });

      const json = await res.json();
      const contactList = json ?.data ?.listFriends ?.affectedRows || [];

      renderContacts(contactList);
    } catch (err) {
      console.error("Error loading friends:", err.message);
    }
  }


  function renderContacts(contactList, mode = "private") {
    const container = document.querySelector(".contacts-found");
    container.innerHTML = "";

    contactList.forEach(contact => {
      const div = document.createElement("div");
      div.classList.add("single-contact");
      div.dataset.userId = contact.userid;

      const avatar = document.createElement("img");
      avatar.className = "contact-avatar";
      avatar.src = getAvatarUrl(contact.img);
      avatar.alt = contact.username;

      const details = document.createElement("div");
      details.className = "contact-details";

      const nameSpan = document.createElement("span");
      nameSpan.className = "contact-name";
      nameSpan.textContent = contact.username;

      const chatIcon = document.createElement("img");
      chatIcon.className = "chat-icon";
      chatIcon.src = "svg/chats.svg";
      chatIcon.alt = "chat";

      details.appendChild(nameSpan);
      details.appendChild(chatIcon);

      div.appendChild(avatar);
      div.appendChild(details);

      // 🔥 Reuse unified createChat() for private
      div.addEventListener("click", () =>
        createChat({
          name: contact.username,
          recipients: [contact.userid]
        })
      );

      container.appendChild(div);
    });
  }


});