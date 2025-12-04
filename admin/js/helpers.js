window.moderationModule = window.moderationModule || {};

moderationModule.helpers = {
  // getCookie(name) {
  //   const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  //   return match ? decodeURIComponent(match[1]) : null;
  // },

  getElement(selector) {
    return document.querySelector(selector);
  },

  getElements(selector) {
    return document.querySelectorAll(selector);
  },

  decodeHTML(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  },

  createEl(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "className") el.className = v;
      else if (k === "textContent") el.textContent = v;
      else if (k === "innerHTML") el.innerHTML = v;
      else el.setAttribute(k, v);
    });
    children.forEach(child => el.appendChild(child));
    return el;
  },

  safeMedia(raw, fallback = "") {
      try {
          const arr = JSON.parse(raw || "[]");
          const path = arr[0]?.path;
          return Array.isArray(arr) && path ? domain.replace("://", "://media.") + path : fallback;
      } catch {
          return fallback;
      }
  }
};