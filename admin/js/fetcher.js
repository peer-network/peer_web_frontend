window.moderationModule = window.moderationModule || {};

moderationModule.fetcher = {
  /* -------------/* ---------------------- NORMALIZER ---------------------- */
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
            username: r.username || "unknown",
            slug: "#" + (r.slug || "0000"),
            img: tempMedia(r.img) || "../svg/noname.svg",
            updatedat: moderationModule.helpers.formatDate(r.updatedat) || null,
          }))
        : []
      };

      /* -------------------- POST -------------------- */
      if (x.targettype == "post" && x.targetcontent.post) {
        const post = x.targetcontent.post;
        const user = post.user || {};
        item.username = user.username || "unknown";
        item.slug = "#" + (user.slug || "0000");
        item.title = post.title || "";
        item.description = post.mediadescription || "";
        item.hashtags = post.tags || [];   
        item.contentType = post.contenttype;
        item.postid = post.id;
        switch (post.contenttype) {
            case "image":
              item.media = '';
              const urls = moderationModule.helpers.safeMedia2(post.media);
              if (urls.length === 1) {
                item.media = urls.map((url, idx) =>
                              `<img src="${url}" alt="post image ${idx + 1}" />`
                            ).join("");
              }
              item.icon = "peer-icon peer-icon-camera";
            break;

          case "text":
            try {
              const mediaUrl = moderationModule.helpers.safeMedia(post.media);
              item.description = await self.loadTextFile(mediaUrl);
              
            } catch (err) {
              console.error("Failed to parse text media:", err);
            }
            item.media = '';
            item.icon = "peer-icon peer-icon-text";
            break;
          
          case "audio":
            item.media = '';
            const audioUrl = moderationModule.helpers.safeMedia(post.media);
            const coverUrl = moderationModule.helpers.safeMedia(post.cover);
            if (audioUrl) {
              if (coverUrl) {
                item.media = `<div class="audio_cover"><img src="${coverUrl}" alt="audio cover" /></div><audio src="${audioUrl}" controls></audio>`;
              } else {
                item.media = `<audio src="${audioUrl}" controls></audio>`;
              }
            }
           
            item.icon = "peer-icon peer-icon-audio-fill";
            break;
          
          case "video":
            item.media = '';
            const mediaUrl = moderationModule.helpers.safeMedia2(post.media);
            if (mediaUrl) {
              mediaUrl.map((url) => {
                item.media = `<video src="${url}" controls loop></video>`;
              });
            } 
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
        let commenterId = c.userid || null;
        
        item.content = c.content || "";
        item.contentType = "comment";
        item.timeAgo = timeAgo(c.createdat);
        item.icon = "peer-icon peer-icon-comment-fill";
        item.postid = c.postid;
        item.post = null;
        item.commentid = c.commentid; 
        if (commenterId) {
          const fullUserArray = await self.loadUserById(commenterId);
          const fullUser = Array.isArray(fullUserArray) ? fullUserArray[0] : fullUserArray;
          const userId = fullUser?.userid || fullUser?.id;
          
          if (userId) {
            item.commenterProfile = {
              userid: fullUser.id,
              username: fullUser.username || "unknown",
              slug: "#" + (fullUser.slug || "0000"),
              img: tempMedia(fullUser.img) || "../svg/noname.svg",
              posts: fullUser.amountposts || 0,
              followers: fullUser.amountfollower || 0,
              following: fullUser.amountfollowed || 0,
            };
            
            item.username = item.commenterProfile.username;
            item.slug = item.commenterProfile.slug;
            //item.media = item.commenterProfile.img;
          } else {
            item.username = "unknown";
            item.slug = "#0000";
            item.media = "../svg/noname.svg";
          }
        }
      }

      /* -------------------- USER -------------------- */
      if (x.targettype === "user" && x.targetcontent.user) {
        const u = x.targetcontent.user;
        item.userid = u.userid;
        item.username = u.username || "unknown";
        item.slug = "#" + (u.slug || "0000");
        item.biography = tempMedia(u.biography) || "";
        item.posts = u.posts || 0;
        item.followers = u.followers || 0;
        item.following = u.following || 0;
        item.peers = u.peers || 0;
        item.media = tempMedia(u.img) || "../svg/noname.svg";
        item.contentType = "user";
        item.icon = "peer-icon peer-icon-profile";
        
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

  async loadItems(type = "LIST_ITEMS", { offset = 0, limit = 20, contentType = null } = {}) {
    try {
      const query = moderationModule.schema[type];
      if (!query) throw new Error("Invalid query type: " + type);

      const variables = { offset, limit, contentType };
      const response = await moderationModule.service.fetchGraphQL(query, variables);
      const rawItems = response?.moderationItems?.affectedRows || [];
      const normalized = await this.normalizeItems(rawItems);
      const enriched = await this.enrichCommentsWithPosts(normalized);
      
      moderationModule.store.items = enriched;
      moderationModule.store.filteredItems = enriched;
      moderationModule.view.renderItems(enriched);
      moderationModule.store.pagination.offset = enriched.length;
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

  async loadUserById(userid) {
    try {
      const query = moderationModule.schema.LIST_USER_BY_ID;
      if (!query) throw new Error("Invalid LIST_USER_BY_ID query");
      const variables = { userid };
      const response = await moderationModule.service.fetchGraphQL(query, variables);
      return response?.getProfile?.affectedRows || null;
    } catch (err) {
      console.error("Error loading user by ID:", err);
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
      if (item.contentType == "comment" && item.postid) {
        const post = await this.loadPostById(item.postid);
        if (post) {
          item.post = {
            id: post.id,
            title: post.title,
            description: post.mediadescription,
            contentType: post.contenttype,
            cover: post.cover,
            username: post.user?.username || "unknown",
            img: tempMedia(post.user?.img) || '../img/noname.png',
            slug: post.user?.slug,
            createdat: post.createdat
          };

          const mediaUrl = moderationModule.helpers.safeMedia(post.media);
          if (post.contenttype === "text" && mediaUrl) {
            item.post.description = await this.loadTextFile(mediaUrl);
          } else {
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
