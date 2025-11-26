window.moderationModule = window.moderationModule || {};

moderationModule.view = {
  // initSearch() {
  //   const input = moderationModule.helpers.getElement("#search-input");
  //   if (!input) return;

  //   input.addEventListener("input", (e) => {
  //     moderationModule.store.filterText = e.target.value;
  //     moderationModule.fetcher.filterItems(e.target.value);
  //   });
  // },

  initFilters() {
    const list = document.querySelectorAll(".item_filters li");
    list.forEach(li => {
      li.addEventListener("click", async (e) => {
        e.preventDefault();

        document.querySelectorAll(".item_filters li a")
          .forEach(a => a.classList.remove("active"));

        li.querySelector("a").classList.add("active");

        let queryType = "LIST_ITEMS";

        if (li.classList.contains("post")) queryType = "LIST_POST";
        else if (li.classList.contains("comments")) queryType = "LIST_COMMENT";
        else if (li.classList.contains("accounts")) queryType = "LIST_USER";

        await moderationModule.fetcher.loadItems(queryType);

        moderationModule.store.filterText = "";
        const search = document.querySelector("#search-input");
        if (search) search.value = "";
      });
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
      const contentEl = moderationModule.helpers.createEl("div", { className: "content" });
      const imgWrapper = moderationModule.helpers.createEl("span", { className: "content_image" });

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
        imgWrapper.append(
          moderationModule.helpers.createEl("i", { className: item.icon })
        );
      }

      /* -------------------- DETAILS -------------------- */
      const detailEl = moderationModule.helpers.createEl("span", { className: "content_detail" });

      const userNameClass =
        item.kind === "user"
          ? "user_name xl_font_size bold italic"
          : "user_name bold italic";

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

      const reportsEl = moderationModule.helpers.createEl("div", { className: "reports" });

      const reportCount = moderationModule.helpers.createEl("span", {
        className: "xl_font_size txt-color-gray",
        innerHTML: `<i class="peer-icon peer-icon-copy-alt"></i> ${item.reports}`,
      });

      const visibility = moderationModule.helpers.createEl("span", {
        className: "visible txt-color-gray",
        innerHTML: item.visible === "illegal"
          ? `<i class="peer-icon peer-icon-eye-close"></i> Not visible in the feed`
          : "",
      });

      reportsEl.append(reportCount, visibility);

      /* -------------------- STATUS -------------------- */
      const statusEl = moderationModule.helpers.createEl("div", { className: "status" });
      let statusClass = "";

      if (item.status == "Hidden" || item.status == "illegal") statusClass = "hidden-tx xl_font_size red-text";
      else if (item.status == "Restored") statusClass = "restored xl_font_size green-text";
      else if (item.status == "waiting for review") statusClass = "review xl_font_size yellow-text";

      statusEl.append(
        moderationModule.helpers.createEl("span", {
          className: statusClass,
          textContent: item.status,
        })
      );

      itemEl.append(contentEl, modId, modDate, reportsEl, statusEl);
      container.appendChild(itemEl);
    });
  },
};
