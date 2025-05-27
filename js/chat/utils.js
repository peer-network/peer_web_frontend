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

  getAvatarUrl(path) {
    return "svg/logo_sw.svg"; // just for test purposes later need to change it back
    if (!path) return "svg/logo_sw.svg";

    // If it's already a full URL (http, https), use as-is
    if (path.startsWith("http")) return path;

    // Otherwise, assume it's a relative path
    return `/peer_web_frontend/img/${path}`;
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