window.ChatApp = window.ChatApp || {};

ChatApp.loader = {
  async loadChats(filterType = "private", userId = null) {
    // const token = ChatApp.utils.getCookie("authToken");
    const query = ChatApp.graphql.LIST_CHATS;

    try {
      const data = await ChatApp.api.fetchGraphQL(query);
      const rawChats = data?.listChats?.affectedRows || [];

      const typedChats = rawChats
        .map(chat => {
          const isPrivate = !chat.name?.trim() && !chat.image;
          return { ...chat, type: isPrivate ? "private" : "group" };
        })
        .filter(chat => chat.type === filterType);

      const chatList = typedChats.map(chat => ({
        id: chat.id,
        name: chat.name,
        image: "./svg/noname.svg",
        type: chat.type,
        senderId: chat.senderid,
        chatmessages: [...(chat.chatmessages || [])].sort((a, b) => new Date(a.createdat) - new Date(b.createdat)),
        chatparticipants: chat.chatparticipants || [],
        unreadCount: 0,
      }));

      ChatApp.loader.renderSidebar(chatList, userId);

    } catch (error) {
      console.error("Error loading chats:", error);
    }
  },

  renderSidebar(chatList, userId) {
    const sidebar = document.querySelector(".chat-list");
    const template = document.getElementById("chat-sidebar-item-template");
    ChatApp.state.currentUserId = ChatApp.state.currentUserId || null;
    sidebar.querySelectorAll(".chat-item").forEach(el => el.remove());

    chatList.forEach((chat, index) => {
      const otherUser = chat.chatparticipants.find(p => p.userid !== ChatApp.state.currentUserId) || chat.chatparticipants[0];
      const lastMessage = chat.chatmessages.at(-1);
      const time = lastMessage ? ChatApp.utils.formatTimeAgo(lastMessage.createdat) : "—";
      const preview =  ChatApp.utils.decodeHTML(lastMessage?.content) || "Start chatting...";
      const clone = template.content.cloneNode(true);
      const item = clone.querySelector(".chat-item");
      item.setAttribute("data-chatid", chat.id);
      item.querySelector(".avatar").alt = otherUser.username;
      item.querySelector(".avatar").src = tempMedia(otherUser.img.replace("media/", ""));
      item.querySelector(".avatar").onerror = () => this.src = "./svg/noname.svg";
      item.querySelector(".name").textContent = chat.type === "private" ? otherUser.username : chat.name;
      item.querySelector(".time").textContent = time;
      item.querySelector(".message-preview").textContent = preview;

      item.addEventListener("click", () => {
        document.querySelectorAll(".chat-item").forEach(el => el.classList.remove("active-chat"));
        item.classList.add("active-chat");
        ChatApp.ui.renderMessages(chat);
      });

      sidebar.appendChild(clone);
      const shouldAutoSelect = (userId && otherUser.userid === userId) || (!userId && index === 0);

      if (shouldAutoSelect) {
        item.classList.add("active-chat");
        ChatApp.ui.renderMessages(chat);
      }
    });
  }
};