window.moderationModule = window.moderationModule || {};

moderationModule.fetcher = {

  /* ---------------------- NORMALIZER ---------------------- */
  normalizeItems(items) {
    return items.map(x => {
        let item = {
            kind: x.targettype,                // post / comment / user
            moderationId: x.moderationTicketId,
            date: x.createdat,
            reports: x.reportscount,
            status: x.status.replace(/_/g, " "),
            visible: false
        };

        /* -------------------- COMMON HELPERS -------------------- */
        const safeMedia = (raw, fallback = "") => {
         
            try {
                const arr = JSON.parse(raw || "[]");
                
                return Array.isArray(arr) && arr[0]?.path ? tempMedia(arr[0].path) : fallback;
            } catch {
                return fallback;
            }
        };

        /* -------------------- POST -------------------- */
        if (x.targettype === "post" && x.targetcontent.post) {
            const post = x.targetcontent.post;
            const user = post.user || {};

            item.username = user.username || "@unknown";
            item.slug = "#" + (user.slug || "0000");
            item.title = post.title || "";
            item.contentType = post.contenttype;

            switch (post.contenttype) {
                case "image":
                    item.media = safeMedia(post.media);
                    item.icon = "peer-icon peer-icon-camera";
                    break;
                case "text":
                    item.media = null;
                    item.icon = "peer-icon peer-icon-text";
                    break;
                case "audio":
                    item.media = safeMedia(post.cover, "../img/audio-bg.png"); 
                    item.icon = "peer-icon peer-icon-audio-fill";
                    break;
                case "video":
                    item.media = safeMedia(post.cover, "../img/video-bg.png");
                    item.icon = "peer-icon peer-icon-play-btn";
                    break;
            }
        }

        /* -------------------- COMMENT -------------------- */
        if (x.targettype === "comment" && x.targetcontent.comment) {
            const c = x.targetcontent.comment;
            const user = c.user || {};

            item.username = user.username || "@unknown";
            item.slug = c.commentid;
            item.title = c.content;
            item.contentType = "comment";
            item.media = null;
            item.icon = "peer-icon peer-icon-comment-fill";
        }

        /* -------------------- USER -------------------- */
        if (x.targettype === "user" && x.targetcontent.user) {
            const u = x.targetcontent.user;

            item.username = u.username || "@unknown";
            item.slug = "#" + (u.slug || "0000");
            item.media = tempMedia(u.img) || "../svg/noname.svg";
            item.contentType = "user";
            // item.icon = "peer-icon peer-icon-profile";
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

      // Normalize BEFORE storing and rendering
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
      (item.title && item.title.toLowerCase().includes(lower)) ||
      (item.username && item.username.toLowerCase().includes(lower))
    );

    moderationModule.store.filteredItems = filtered;
    moderationModule.view.renderItems(filtered);
  }
};