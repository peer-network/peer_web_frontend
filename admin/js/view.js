window.moderationModule = window.moderationModule || {};

moderationModule.view = {
  initFilters() {
    const list = document.querySelectorAll(".item_filters li");

    list.forEach((li) => {
      li.addEventListener("click", async (e) => {
        e.preventDefault();

        // remove active
        document .querySelectorAll(".item_filters li a").forEach((a) => a.classList.remove("active"));

        li.querySelector("a").classList.add("active");

        // Determine schema type + contentType
        let type = "LIST_ITEMS";
        let contentType = null;

        if (li.classList.contains("post")) {
          type = "LIST_POST";
          contentType = "post";

        } else if (li.classList.contains("comments")) {
          type = "LIST_COMMENT";
          contentType = "comment";
        
        } else if (li.classList.contains("accounts")) {
          type = "LIST_USER";
          contentType = "user";
        }

        // Load items
        await moderationModule.fetcher.loadItems(type, { offset: 0, limit: 20, contentType });
      });
    });
  },

  renderStats(stats) {
  if (!stats) return;

  const selectors = {
    awaiting: ".stat_box.review .stat_count",
    hidden: ".stat_box.hidden-st .stat_count",
    restored: ".stat_box.restored .stat_count",
    illegal: ".stat_box.illegal .stat_count",
  };

  Object.entries(selectors).forEach(([key, selector]) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = stats[key];
  });
},

  renderItems(items) {
    const container = moderationModule.helpers.getElement(".content_load");
    if (!container) return;

    container.innerHTML = "";

    if (!items || !items.length) {
      container.textContent = "No items found";
      return;
    }

    items.forEach((item) => {
      const itemEl = moderationModule.helpers.createEl("div", {
        className: `content_item ${item.kind}`,
      });

      /* -------------------- CONTENT -------------------- */
      const contentEl = moderationModule.helpers.createEl("div", {
        className: "content",
      });
      const imgWrapper = moderationModule.helpers.createEl("span", {
        className: "content_image",
      });

      /* -------------------- MEDIA / ICON -------------------- */
      if (item.media) {
        const imgEl = moderationModule.helpers.createEl("img", { src: item.media });

        /* USER IMAGE FALLBACK */
        if (item.kind === "user") {
          imgEl.onerror = function () {
            this.src = "../svg/noname.svg";
          };
        }

        imgWrapper.append(imgEl);

        if (item.kind === "post") {
          imgWrapper.append(moderationModule.helpers.createEl("i", { className: item.icon }));
        }
      } else {
        imgWrapper.append(moderationModule.helpers.createEl("i", { className: item.icon }));
      }

      /* -------------------- DETAILS -------------------- */
      const detailEl = moderationModule.helpers.createEl("span", {
        className: "content_detail",
      });

      const userNameClass = item.kind === "user" ? "user_name xl_font_size bold italic" : "user_name bold italic";

      detailEl.append(
        moderationModule.helpers.createEl("span", {
          className: userNameClass,
          textContent: item.username,
        })
      );

      if (item.kind === "post" || item.kind === "comment") {
        detailEl.append(
          moderationModule.helpers.createEl("span", {
            className: "post_title xl_font_size bold",
            textContent: item.title,
          })
        );
      }

      if (item.kind === "user" || item.kind === "comment") {
        detailEl.append(
          moderationModule.helpers.createEl("span", {
            className: "user_slug txt-color-gray",
            textContent: item.slug,
          })
        );
      }

      contentEl.append(imgWrapper, detailEl);

      /* -------------------- MOD INFO -------------------- */
      const modId = moderationModule.helpers.createEl("div", {
        className: "moderation_id xl_font_size txt-color-gray",
        textContent: item.moderationId,
      });

      const modDate = moderationModule.helpers.createEl("div", {
        className: "moderation_date xl_font_size txt-color-gray",
        textContent: item.date,
      });

      const reportsEl = moderationModule.helpers.createEl("div", {
        className: "reports",
      });

      const reportCount = moderationModule.helpers.createEl("span", {
        className: "xl_font_size txt-color-gray",
        innerHTML: `<i class="peer-icon peer-icon-copy-alt"></i> ${item.reports}`,
      });

      const visibility = moderationModule.helpers.createEl("span", {
        className: "visible txt-color-gray",
        innerHTML:
          item.visible === "illegal"
            ? `<i class="peer-icon peer-icon-eye-close"></i> Not visible in the feed`
            : "",
      });

      reportsEl.append(reportCount, visibility);

      /* -------------------- STATUS -------------------- */
      const statusEl = moderationModule.helpers.createEl("div", { className: "status" });
      let statusClass = "";

      if (item.status == "hidden" || item.status == "illegal")
        statusClass = "hidden-tx xl_font_size red-text";
      else if (item.status == "Restored")
        statusClass = "restored xl_font_size green-text";
      else if (item.status == "waiting for review")
        statusClass = "review xl_font_size yellow-text";

      statusEl.append(
        moderationModule.helpers.createEl("span", {
          className: statusClass,
          textContent: item.status,
        })
      );

      itemEl.append(contentEl, modId, modDate, reportsEl, statusEl);
      container.appendChild(itemEl);


      itemEl.addEventListener("click", () => {
        window.location.href = `content.php?id=${item.moderationId}`;
      });
    });
  },







  renderContentDetails(item) {
    const container = document.querySelector(".content_box_left"); 
    if (!container) return;

    container.innerHTML = ""; // clear old content

    // Username
    const usernameEl = window.moderationModule.helpers.createEl("h2", {
      textContent: item.username,
      className: "xl_font_size bold italic",
    });

    // Title / Comment
    const titleEl = window.moderationModule.helpers.createEl("p", {
      textContent: item.title || "No title/content",
      className: "xl_font_size",
    });

    // Status
    const statusEl = window.moderationModule.helpers.createEl("p", {
      textContent: `Status: ${item.status}`,
      className: "txt-color-gray",
    });

    // Media if exists
    let mediaEl = null;
    if (item.media) {
      mediaEl = window.moderationModule.helpers.createEl("img", {
        src: item.media,
        alt: item.title || "",
        className: "content_media",
      });
    }

    container.append(usernameEl, titleEl, statusEl);
    if (mediaEl) container.appendChild(mediaEl);
  }

};
