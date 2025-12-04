window.moderationModule = window.moderationModule || {};

moderationModule.fetcher = {
  //     /* -------------/* ---------------------- NORMALIZER ---------------------- */
  async normalizeItems(items) {
    const mapped = items.map(async (x) => {
      const self = this;
      let item = {
        kind: x.targettype,
        moderationId: x.moderationTicketId,
        date: x.createdat,
        reports: x.reportscount,
        status: (x.status || "").replace(/_/g, " ").toLowerCase(),
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
        item.description = post.description || "";
        item.hashtags = post.tags || [];   
        item.contentType = post.contenttype;

        switch (post.contenttype) {
          case "image":
            item.media = moderationModule.helpers.safeMedia(post.media);
            item.icon = "peer-icon peer-icon-camera";
            break;
          case "text":
            try {
              const parsed = JSON.parse(post.media);
              if (Array.isArray(parsed) && parsed.length > 0) 
                item.path = parsed[0].path; 
            } catch (err) {
              console.error("Failed to parse text media:", err);
              item.path = null;
            }
            item.media = null;
            item.icon = "peer-icon peer-icon-text";
            break;
          case "audio":
            item.media = moderationModule.helpers.safeMedia(post.cover, "../img/audio-bg.png");
            item.icon = "peer-icon peer-icon-audio-fill";
            break;
          case "video":
            item.media = moderationModule.helpers.safeMedia(post.cover, "../img/video-bg.png");
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
        item.username = c.user.username || "@unknown";
        item.slug = "#" + (c.user.slug || "0000");
        item.title = c.content || "";
        item.contentType = "comment";
        item.media = tempMedia(c.user?.img) ?? '../img/profile_thumb.png';
        item.icon = "peer-icon peer-icon-comment-fill";
        item.postid = c.postid;
        item.post = null
      }

      /* -------------------- USER -------------------- */
      if (x.targettype === "user" && x.targetcontent.user) {
        // console.log('Parsed biography --> ', (x.targetcontent.user.biography));
        const u = x.targetcontent.user;
        item.userid = u.userid;
        item.username = u.username || "@unknown";
        item.slug = "#" + (u.slug || "0000");
        item.biography = tempMedia(u.biography) || "";
        item.posts = u.posts || 0;
        item.followers = u.followers || 0;
        item.following = u.following || 0;
        item.peers = u.peers || 0;
        item.media = tempMedia(u.img) || "../svg/noname.svg";
        item.contentType = "user";
        item.icon = "peer-icon peer-icon-profile";
        // Normalize biography
        let bioText = "";
        try {
          const bioRaw = u.biography;
          if (typeof bioRaw === "string") {
            try {
              const parsed = JSON.parse(bioRaw);
              if (Array.isArray(parsed) && parsed[0]?.path) {
                const bioUrl = domain.replace("://", "://media.") + parsed[0].path;
                bioText = await self.loadTextFile(bioUrl);
              } else {
                bioText = String(bioRaw);
              }
            } catch (err) {
              if (bioRaw.startsWith("http://") || bioRaw.startsWith("https://")) {
                bioText = await self.loadTextFile(bioRaw);
              } else if (bioRaw.startsWith("/")) {
                const bioUrl = domain.replace("://", "://media.") + bioRaw;
                bioText = await self.loadTextFile(bioUrl);
              } else {
                // plain text biography
                bioText = bioRaw;
              }
            }
          } else if (Array.isArray(bioRaw) && bioRaw[0]?.path) {
            const bioUrl = domain.replace("://", "://media.") + bioRaw[0].path;
            bioText = await self.loadTextFile(bioUrl);
          } else {
            bioText = bioRaw ? String(bioRaw) : "";
          }
        } catch (err) {
          console.error("Failed to load biography for user", u.userid, err);
          bioText = "";
        }

        item.biography = bioText || "";
      }
      return item;
    });

    return await Promise.all(mapped);
  },
// ...existing code...
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
      const response = await moderationModule.service.fetchGraphQL(query, variables);
      const rawItems = response?.moderationItems?.affectedRows || [];
      const normalized = await this.normalizeItems(rawItems);

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

  async loadTextFile(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      console.error("Error loading text file:", err);
      return "Biography not available";
    }
  },

  async enrichCommentsWithPosts(items) {
    for (const item of items) {
        // console.log('Fetched post for comment:', item);

      if (item.contentType === "comment" && item.postid) {
        const post = await this.loadPostById(item.postid);
        if (post) {
          item.post = {
            id: post.id,
            title: post.title,
            description: post.mediadescription,
            contentType: post.contenttype,
            cover: post.cover,
            username: post.user?.username || "@unknown",
            img: tempMedia(post.user?.img) || '../img/profile_thumb.png',
            slug: post.user?.slug
          };

          // console.log(' item.post.img ', item.post.img);

          // Use safeMedia to extract a URL
          const mediaUrl = moderationModule.helpers.safeMedia(post.media);
          if (post.contenttype === "text" && mediaUrl) {
            // For text posts: fetch the file contents and store in description
            item.post.description = await this.loadTextFile(mediaUrl);
          } else {
            // For non-text posts: build the appropriate HTML element
            switch (post.contenttype) {
              case "video":
                item.post.media = `<video src="${mediaUrl}" controls autoplay loop></video>`;
                break;
              case "image":
                item.post.media = `<img src="${mediaUrl}" alt="post image" />`;
                break;
              case "audio":
              default:
                item.post.media = `<audio src="${mediaUrl}" controls autoplay></audio>`;
                break;
            }
          }
        }
      }
    }
    return items;
  }
};
