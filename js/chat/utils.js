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

  getAvatarUrl(apiPath) {
    const fallback = "./svg/logo_sw.svg";

    if (!apiPath || typeof apiPath !== "string") return fallback;

    const fileName = apiPath.split("/").pop();
    const localPath = `/peer_web_frontend/img/${fileName}`;

    try {
      this.checkImageExists(localPath);
      return localPath;
    } catch {
      return fallback;
    }
  },

  checkImageExists(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
    });
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
  }
};