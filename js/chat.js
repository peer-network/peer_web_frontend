window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("privateBtn").addEventListener("click", () => loadChats("private"));
  document.getElementById("groupBtn").addEventListener("click", () => loadChats("group"));

  loadChats("private");
});

async function loadChats(filterType = "private") {
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
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);

    const rawChats = result?.data?.listChats?.affectedRows || [];

    const typedChats = rawChats
      .map(chat => {
        const isPrivate = !chat.name?.trim() && !chat.image;
        return { ...chat, type: isPrivate ? "private" : "group" };
      })
      .filter(chat => chat.type === filterType);

    const chatList = typedChats.map(chat => ({
      id: chat.id,
      name: chat.name,
      image: chat.image,
      type: chat.type,
      chatmessages: [...(chat.chatmessages || [])].sort((a, b) => new Date(a.createdat) - new Date(b.createdat)),
      chatparticipants: chat.chatparticipants || [],
      unreadCount: 0,
    }));

    renderChatSidebar(chatList);
  } catch (error) {
    console.error("Error loading chats:", error);
  }
}

async function renderChatSidebar(chatList) {
  const currentUserId = await getCurrentUserId();
  const sidebar = document.querySelector(".chat-list");
  const template = document.getElementById("chat-sidebar-item-template");

  sidebar.querySelectorAll(".chat-item").forEach(el => el.remove());

  chatList.forEach((chat, index) => {
    const otherUser = chat.chatparticipants.find(p => p.userid !== currentUserId) || chat.chatparticipants[0];
    const lastMessage = chat.chatmessages.at(-1);
    const time = lastMessage ? formatTimeAgo(lastMessage.createdat) : "—";
    const preview = lastMessage?.content || "Start chatting...";
    const unread = chat.unreadCount > 0;

    const clone = template.content.cloneNode(true);
    const item = clone.querySelector(".chat-item");

    if (index === 0) item.classList.add("active-chat");
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

    if (index === 0) {
      renderMessages(chat);
    }
  });
}

async function renderMessages(chat) {
  const container = document.querySelector(".chat-messages");
  const template = document.getElementById("chat-message-template");
  if (!template) return console.error("Template not found!");

  container.innerHTML = "";

  const header = document.querySelector(".chat-header .username");
  const headerAvatar = document.querySelector(".chat-header .avatar");
  const currentUserId = await getCurrentUserId();

  const otherUser = chat.chatparticipants.find(u => u.userid !== currentUserId);
  header.textContent = chat.type === "private" ? otherUser?.username : chat.name;
  headerAvatar.src = getAvatarUrl(otherUser?.img);

  chat.chatmessages.forEach(msg => {
    const isCurrentUser = msg.senderid === currentUserId;
    const sender = chat.chatparticipants.find(u => u.userid === msg.senderid);
    const iso = msg.createdat.replace(" ", "T").split(".")[0] + "Z";
    const time =  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const clone = template.content.cloneNode(true);
    const message = clone.querySelector(".message");

    if (!message) return;

    message.classList.add(isCurrentUser ? "right" : "left");
    message.querySelector(".avatar").src = getAvatarUrl(sender?.img);

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

  const variables = { chatid, content };

  try {
    const response = await fetch(GraphGL, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) throw new Error("Chat message send failed.");
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

const sendPrivateMessage = document.getElementById("sendPrivateMessage");
if (sendPrivateMessage) {
  let isSending = false;

  sendPrivateMessage.addEventListener("keydown", async function (event) {
    if (event.key === "Enter" && !event.shiftKey && !isSending) {
      event.preventDefault();

      const chatid = document.querySelector(".chat-item.active-chat")?.getAttribute("data-chatid");
      const content = event.target.value.trim();

      if (!chatid || !content) return;

      isSending = true;
      try {
        const res = await sendMessage(chatid, content);
        const status = res?.data?.sendChatMessage?.status;

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
    const userId = result?.currentuserid;
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