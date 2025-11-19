window.moderationModule = window.moderationModule || {};

moderationModule.view = {
  initSearch() {
    const input = moderationModule.helpers.getElement("#search-input");
    if (!input) return;

    input.addEventListener("input", (e) => {
      moderationModule.store.filterText = e.target.value;
      moderationModule.fetcher.filterItems(e.target.value);
    });
  },

  renderItems(items) {
    const container = moderationModule.helpers.getElement(".content_list");
    if (!container) return;

    container.innerHTML = "";

    if (!items || !items.length) {
      container.textContent = "No items found";
      return;
    }

    items.forEach(item => {
      const itemEl = moderationModule.helpers.createEl("div", { className: `content_item ${item.type}` });

      // Content block
      const contentEl = moderationModule.helpers.createEl("div", { className: "content" });

      // Content image/icon
      const imgWrapper = moderationModule.helpers.createEl("span", { className: "content_image" });
      if (item.type === "post") {
        const img = moderationModule.helpers.createEl("img", { src: item.image || "../img/audio-bg.png" });
        const icon = moderationModule.helpers.createEl("i", { className: "peer-icon peer-icon-camera" });
        imgWrapper.append(img, icon);
      } else if (item.type === "user") {
        const img = moderationModule.helpers.createEl("img", { src: item.image || "../img/profile_thumb.png" });
        imgWrapper.appendChild(img);
      } else if (item.type === "comment") {
        const icon = moderationModule.helpers.createEl("i", { className: "peer-icon peer-icon-comment-fill" });
        imgWrapper.appendChild(icon);
      }

      // Content details
      const detailEl = moderationModule.helpers.createEl("span", { className: "content_detail" });
      const userName = moderationModule.helpers.createEl("span", { textContent: item.username, className: item.type === "user" ? "user_name xl_font_size bold italic" : "user_name bold italic" });
      detailEl.appendChild(userName);

      if (item.type === "post" || item.type === "comment") {
        const postTitle = moderationModule.helpers.createEl("span", { textContent: item.title, className: "post_title xl_font_size bold" });
        detailEl.appendChild(postTitle);
      }

      if (item.type === "user" || item.type === "comment") {
        const userSlug = moderationModule.helpers.createEl("span", { textContent: item.slug, className: "user_slug txt-color-gray" });
        detailEl.appendChild(userSlug);
      }

      contentEl.append(imgWrapper, detailEl);

      // Moderation ID
      const modId = moderationModule.helpers.createEl("div", { textContent: item.moderationId, className: "moderation_id xl_font_size txt-color-gray" });

      // Date
      const modDate = moderationModule.helpers.createEl("div", { textContent: item.date, className: "moderation_date xl_font_size txt-color-gray" });

      // Reports
      const reportsEl = moderationModule.helpers.createEl("div", { className: "reports" });
      const reportCount = moderationModule.helpers.createEl("span", { innerHTML: `<i class="peer-icon peer-icon-copy-alt"></i> ${item.reports}`, className: "xl_font_size txt-color-gray" });
      const visibility = moderationModule.helpers.createEl("span", { innerHTML: `<i class="peer-icon peer-icon-eye-close"></i> ${item.visible ? "Visible in the feed" : "Not visible in the feed"}`, className: "visible txt-color-gray" });
      reportsEl.append(reportCount, visibility);

      // Status
      const statusEl = moderationModule.helpers.createEl("div", { className: "status" });
      let statusClass = "";
      if (item.status === "Hidden") statusClass = "hidden-tx xl_font_size red-text";
      if (item.status === "Restored") statusClass = "restored xl_font_size green-text";
      if (item.status === "Waiting for review") statusClass = "review xl_font_size yellow-text";

      const statusSpan = moderationModule.helpers.createEl("span", { textContent: item.status, className: statusClass });
      statusEl.appendChild(statusSpan);

      itemEl.append(contentEl, modId, modDate, reportsEl, statusEl);
      container.appendChild(itemEl);
    });
  }
};
