window.ChatApp = window.ChatApp || {};

ChatApp.utils = {
  getCookie(name) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  },

  formatTimeAgo(datetime) {
    const diff = Math.floor((new Date() - new Date(datetime)) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  },

  decodeHTML(str) {
    if (typeof str !== "string") return "";

    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  },

  getElement(selector) {
    return document.querySelector(selector);
  },

  getActiveChatType() {
    return document.getElementById("privateBtn").classList.contains("active") ? "private" : "group";
  },

  async getCurrentUserId() {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)userID=([^;]+)/);
    if (cookieMatch) return cookieMatch[1];

    const result = await ChatApp.api.fetchUserProfile();
    const userId = result?.id;
    if (userId) document.cookie = `userID=${userId}; path=/; SameSite=Strict`;
  
    return userId;
  },

  async getCurrentUserImage() {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)userImg=([^;]+)/);
    if (cookieMatch) return cookieMatch[1];

    const result = await ChatApp.api.fetchUserProfile();
    const userImg = result?.img;
    if (userImg) document.cookie = `userImg=${userImg}; path=/; SameSite=Strict`;
  
    return userImg;
  }
};