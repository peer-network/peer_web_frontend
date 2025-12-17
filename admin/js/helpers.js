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
  },
  calctimeAgo(datetime) {
    // Clean microseconds and treat as UTC
    const cleaned = datetime.replace(/\.\d+$/, "") + "Z";
    const timestamp = new Date(cleaned);
    const now = Date.now();

    const elapsed = now - timestamp; // in ms

    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} sec`;
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    if (weeks < 4) return `${weeks}w`;
    if (months < 12) return `${months}m`;
    return `${years} y`;
  },
  updateSlider(index, post_gallery_obj) {
    const sliderTrack = post_gallery_obj.querySelector(".slider-track");
    const nextBtn = post_gallery_obj.querySelector(".next_button");
    const prevBtn = post_gallery_obj.querySelector(".prev_button");

    const totalSlides = sliderTrack.children.length;
    const currentIndex = Math.max(0, Math.min(index, totalSlides - 1));

    const targetItem = sliderTrack.children[currentIndex];
    const offsetLeft = targetItem.offsetLeft;

    sliderTrack.style.transform = `translateX(-${offsetLeft}px)`;

    prevBtn.classList.toggle("disabled", currentIndex === 0);
    nextBtn.classList.toggle("disabled", currentIndex === totalSlides - 1);

    sliderTrack.querySelectorAll("video").forEach((vid) => {
      vid.pause();
      vid.currentTime = 0;
    });
    return currentIndex;
  }
};