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
      else el.setAttribute(k, v);
    });
    children.forEach(child => el.appendChild(child));
    return el;
  }
};