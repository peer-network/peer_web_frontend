window.moderationModule = window.moderationModule || {};

moderationModule.fetcher = {

  /* ---------------------- NORMALIZER ---------------------- */
  normalizeItems(items) {
    return items.map(x => {
      let item = {
        type: x.targettype,                               // FIX
        moderationId: x.moderationTicketId,
        date: x.createdat,
        reports: x.reportscount,
        status: x.status.replace(/_/g, " "),              // waiting_for_review → waiting for review
        visible: false
      };

      /* ---------------------- POST ---------------------- */
      if (x.targettype === "post" && x.targetcontent.post) {
        const post = x.targetcontent.post;
        const postUser = post.user || {};

        item.username = postUser.username || "@unknown";
        item.slug = "#" + (postUser.slug || "0000");
        item.title = post.title || "";

        try {
          const media = JSON.parse(post.media);
          const path = media?.[0]?.path || "";
          item.image = path
            ? "https://testing.getpeer.eu" + path
            : "../img/audio-bg.png";
        } catch {
          item.image = "../img/audio-bg.png";
        }
      }

      /* ---------------------- USER ---------------------- */
      if (x.targettype === "user" && x.targetcontent.user) {
        const user = x.targetcontent.user;

        item.username = user.username;
        item.slug = "#" + user.slug;
        item.image = user.img
          ? "https://testing.getpeer.eu" + user.img
          : "../img/profile_thumb.png";
      }

      /* ---------------------- COMMENT ---------------------- */
      if (x.targettype === "comment" && x.targetcontent.comment) {
        const c = x.targetcontent.comment;
        const cUser = c.user || {};

        item.username = cUser.username || "@unknown";
        item.slug = c.commentid;   // comments don’t have slugs
        item.title = c.content;
      }

      return item;
    });
  },

  /* ---------------------- LOAD ITEMS ---------------------- */
  async loadItems(type = "LIST_ITEMS") {
    try {
      const query = moderationModule.schema[type];
      if (!query) throw new Error("Invalid query type: " + type);

      const response = await moderationModule.service.fetchGraphQL(query);
      const rawItems = response?.moderationItems?.affectedRows || [];

      // 🔥 Normalize BEFORE storing and rendering
      const normalized = this.normalizeItems(rawItems);

      moderationModule.store.items = normalized;
      moderationModule.store.filteredItems = normalized;

      moderationModule.view.renderItems(normalized);
    } catch (err) {
      console.error("Error loading items:", err);
    }
  },

  /* ---------------------- FILTER ---------------------- */
  filterItems(searchText) {
    const lower = searchText.toLowerCase();

    const filtered = moderationModule.store.items.filter(item =>
      item.title?.toLowerCase().includes(lower) ||
      item.username?.toLowerCase().includes(lower)
    );

    moderationModule.store.filteredItems = filtered;
    moderationModule.view.renderItems(filtered);
  }
};