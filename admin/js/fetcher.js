window.moderationModule = window.moderationModule || {};

moderationModule.fetcher = {
  /* ---------------------- NORMALIZER ---------------------- */
  normalizeItems(items) {
    return items.map( (x) => {
      let item = {
        kind: x.targettype, // post, comment, user
        moderationId: x.moderationTicketId,
        date: x.createdat,
        reports: x.reportscount,
        // normalize status
        status: (x.status || "").replace(/_/g, " ").toLowerCase(),
        // visible: map : default false
        visible: x.visible !== undefined ? x.visible : false,
        reporters: Array.isArray(x.reporters)
        ? x.reporters.map(r => ({
            userid: r.userid,
            username: r.username || "@unknown",
            slug: "#" + (r.slug || "0000"),
            img: r.img || "../svg/noname.svg",
            updatedat: r.updatedat || null,
          }))
        : []
      };

      /* -------------------- POST -------------------- */
      if (x.targettype === "post" && x.targetcontent.post) {
        const post = x.targetcontent.post;
        const user = post.user || {};

        item.username = user.username || "@unknown";
        item.slug = "#" + (user.slug || "0000");
        item.title = post.title || "";
        item.description = post.description || ""; // for content_box details
        item.hashtags = post.tags || [];   
        item.contentType = post.contenttype;

        switch (post.contenttype) {
          case "image":
            item.media = moderationModule.helpers.safeMedia(post.media);
            item.icon = "peer-icon peer-icon-camera";
            break;
          case "text":
            item.media = null;
            item.icon = "peer-icon peer-icon-text";
            break;
          case "audio":
            item.media = moderationModule.helpers.safeMedia(
              post.cover,
              "../img/audio-bg.png"
            );
            item.icon = "peer-icon peer-icon-audio-fill";
            break;
          case "video":
            item.media = moderationModule.helpers.safeMedia(
              post.cover,
              "../img/video-bg.png"
            );
            item.icon = "peer-icon peer-icon-play-btn";
            break;
          default:
            item.media = null;
            item.icon = "peer-icon peer-icon-file";
        }
      }

      /* -------------------- COMMENT -------------------- */
      if (x.targettype === "comment" && x.targetcontent.comment) {
        const c = x.targetcontent.comment;
        // const user = c.user || {};
        
        item.username = c.user.username || "@unknown";
        item.slug = "#" + (c.user.slug || "0000"); // consistent with posts/users
        item.title = c.content || "";
        item.contentType = "comment";
        item.media = c.user?.img ?? '../img/profile_thumb.png';
        item.icon = "peer-icon peer-icon-comment-fill";
        item.postid = c.postid;
        item.post = null
      }

      /* -------------------- USER -------------------- */
      if (x.targettype === "user" && x.targetcontent.user) {
        const u = x.targetcontent.user;
        item.username = u.username || "@unknown";
        item.slug = "#" + (u.slug || "0000");
        item.bio = u.bio || ""; // profile text
        item.posts = u.posts || 0;
        item.followers = u.followers || 0;
        item.following = u.following || 0;
        item.peers = u.peers || 0;
        item.media = tempMedia(u.img) || "../svg/noname.svg";
        item.contentType = "user";
        item.icon = "peer-icon peer-icon-profile";
      }

      return item;
    });
  },
    /* ---------------------- LOAD ITEMS ---------------------- */
    async loadStats() {
      try {
        const query = moderationModule.schema.STATS;
        if (!query) throw new Error("Invalid STATS query");

        const response = await moderationModule.service.fetchGraphQL(query);

        const stats = response?.moderationStats?.affectedRows || {};

        const parsed = {
          awaiting: stats.AmountAwaitingReview || 0,
          hidden: stats.AmountHidden || 0,
          restored: stats.AmountRestored || 0,
          illegal: stats.AmountIllegal || 0,
        };

        moderationModule.view.renderStats(parsed);

      } catch (err) {
        console.error("Error loading stats:", err);
      }
    }, 

  /* ---------------------- LOAD ITEMS ---------------------- */
  async loadItems(type = "LIST_ITEMS", { offset = 0, limit = 20, contentType = null } = {}) {
    try {
      const query = moderationModule.schema[type];
      if (!query) throw new Error("Invalid query type: " + type);

      const variables = { offset, limit, contentType };

      const response = await moderationModule.service.fetchGraphQL(
        query,
        variables
      );

      const rawItems = response?.moderationItems?.affectedRows || [];
      const normalized = this.normalizeItems(rawItems);

      // moderationModule.store.items = normalized;
      // moderationModule.store.filteredItems = normalized;
      // moderationModule.view.renderItems(normalized);
      // enrich in background
      this.enrichCommentsWithPosts(normalized).then(updated => {
        moderationModule.store.items = updated;
        moderationModule.store.filteredItems = updated;
        moderationModule.view.renderItems(updated);
      });
    } catch (err) {
      console.error("Error loading items:", err);
    }
  },

   async loadPostById(postid) {
    try {
      const query = moderationModule.schema.LIST_POST_BY_ID;
      if (!query) throw new Error("Invalid LIST_POST_BY_ID query");
      const variables = { postid };
      const response = await moderationModule.service.fetchGraphQL(query, variables);
      const post = response?.listPosts?.affectedRows?.[0] || null;
      if (!post) {
        console.warn("No post found for ID:", postid);
        return null;
      }

      return post;
    } catch (err) {
      console.error("Error loading post by ID:", err);
      return null;
    }
  },

  async enrichCommentsWithPosts(items) {
    for (const item of items) {
      console.log(item)
      if (item.contentType === "comment" && item.postid && !item.post) {
        const post = await this.loadPostById(item.postid);
        if (post) {
          item.post = {
            id: post.id,
            title: post.title,
            description: post.mediadescription,
            contentType: post.contenttype,
            media: post.media,
            cover: post.cover,
            user: post.user?.username || "@unknown",
            img: post.user?.img,
            slug: post.user?.slug
          };
        }
      }
    }
    return items;
  }

  // initContentPage() {
  //   const params = new URLSearchParams(window.location.search);
  //   const moderationId = params.get("id");

  //   if (!moderationId) return console.error("No moderation ID in URL");

  //   console.log(moderationModule.store)
  //   const item = moderationModule.store.items.find(
  //     (i) => i.moderationId == moderationId
  //   );

  //   if (!item) {
  //     console.error("Item not found in store. You may need to fetch it from backend.");
  //     return;
  //   }

  //   moderationModule.view.renderContentDetails(item);
  // }

  /* ---------------------- FILTER ---------------------- */
  // filterItems(searchText) {
  //   const lower = searchText.toLowerCase();

  //   const filtered = moderationModule.store.items.filter(item =>
  //     (item.title && item.title.toLowerCase().includes(lower)) ||
  //     (item.username && item.username.toLowerCase().includes(lower))
  //   );

  //   moderationModule.store.filteredItems = filtered;
  //   moderationModule.view.renderItems(filtered);
  // }


 

};
