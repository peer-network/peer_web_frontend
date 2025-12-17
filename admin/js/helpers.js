window.moderationModule = window.moderationModule || {};

moderationModule.helpers = {
  getCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  },

  getFromStorage(key, path = null) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      
      // If no path specified, return entire object
      if (!path) return parsed;
      
      return path.split('.').reduce((obj, prop) => obj?.[prop], parsed);
    } catch (err) {
      console.error(`Error reading from localStorage (${key}):`, err);
      return null;
    }
  },

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
  },

  safeMedia2(raw, fallback = "") {
    try {
      const arr = JSON.parse(raw || "[]");
      if (!Array.isArray(arr) || arr.length === 0) return [fallback];

      return arr.map(m => domain.replace("://", "://media.") + m.path);
    } catch {
      return [fallback];
    }
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  }
};