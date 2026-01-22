window.moderationModule = window.moderationModule || {};

// Define tempMedia helper for media URLs
const configEl = document.getElementById("config");
const mediaDomain = configEl?.dataset?.mediaHost || "";
const domain = configEl?.dataset?.host || "";

function tempMedia(path) {
  if (!path) return null;
  return mediaDomain + path.replace("media/", "");
}

moderationModule.fetcher = {
  /* -------------/* ---------------------- NORMALIZER ---------------------- */
  async normalizeItems(items) {
    const mapped = items.map(async (x) => {
      const self = this;
      let item = {
        kind: x.targettype,
        moderationId: x.moderationTicketId,
        date: moderationModule.helpers.formatDate(x.createdat) || "",
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
          : [],
        moderatedBy: x.moderatedBy ? {
          userid: x.moderatedBy.userid,
          username: x.moderatedBy.username || "unknown",
          slug: "#" + (x.moderatedBy.slug || "0000"),
          img: tempMedia(x.moderatedBy.img) || "../svg/noname.svg",
          updatedat: moderationModule.helpers.formatDate(x.moderatedBy.updatedat) || null,
        } : null,

      };

      /* -------------------- POST -------------------- */
      if (x.targettype == "post" && x.targetcontent.post) {
        const post = x.targetcontent.post;
        const user = post.user || {};
        console.log('user data:', user);
        item.username = user.username || "unknown";
        item.userImg = tempMedia(user.img) || "../svg/noname.svg";
        item.slug = "#" + (user.slug || "0000");
        item.title = post.title || "";
        item.description = post.mediadescription || "";
        item.hashtags = post.tags || [];
        item.contentType = post.contenttype;
        item.postid = post.id;
        item.timeAgo = moderationModule.helpers.calctimeAgo(post.createdat);

        const post_gallery = document.createElement("div");
        post_gallery.className = "slider-wrapper";
        post_gallery.innerHTML = `
              <div class="slider-track"></div>
              <span class=" nav-button prev_button"><i class="peer-icon peer-icon-arrow-left"></i></span>
              <span class=" nav-button next_button"><i class="peer-icon peer-icon-arrow-right"></i></span>                  
          `;
        const sliderTrack = post_gallery.querySelector(".slider-track");
        const nextBtn = post_gallery.querySelector(".next_button");
        const prevBtn = post_gallery.querySelector(".prev_button");

        switch (post.contenttype) {
          case "image":
            item.media = '';
            const urls = moderationModule.helpers.safeMedia2(post.media);
            if (urls.length > 0) {

              urls.forEach((url, idx) => {
                const slide = document.createElement("div");
                slide.className = "slide_item";

                const img = document.createElement("img");
                img.src = url;
                img.alt = `post image ${idx + 1}`;

                slide.appendChild(img);
                sliderTrack.appendChild(slide);
              });

              item.media = post_gallery;
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
              const audio_media = document.createElement("div");
              audio_media.className = "audio_cover";
              if (coverUrl) {
                const audio_img = document.createElement("img");
                audio_img.src = coverUrl;
                audio_img.alt = `audio cover`;
                audio_media.appendChild(audio_img);
              }
              const audio = document.createElement("audio");
              audio.src = audioUrl;
              audio.controls = true;
              audio.preload = "metadata";
              audio_media.appendChild(audio);
              item.media = audio_media;
            }

            item.icon = "peer-icon peer-icon-audio-fill";
            break;

          case "video":
            item.media = '';
            const mediaUrl = moderationModule.helpers.safeMedia2(post.media);
            if (mediaUrl.length > 0) {
              mediaUrl.forEach((url, idx) => {
                const slide = document.createElement("div");
                slide.className = "slide_item";

                const video = document.createElement("video");
                video.src = url;
                video.controls = true;
                video.autoplay = 0;
                video.muted = false;
                video.loop = true;
                slide.appendChild(video);
                sliderTrack.appendChild(slide);
              });

              item.media = post_gallery;
            }

            item.icon = "peer-icon peer-icon-play-btn";
            break;

          default:
            item.media = null;
            item.icon = "peer-icon peer-icon-file";
        }


        let currentIndex = 0;
        const totalSlides = sliderTrack.children.length;

        if (totalSlides <= 1) {
          prevBtn.remove();
          nextBtn.remove();
        } else {
          currentIndex = moderationModule.helpers.updateSlider(0, post_gallery);

          nextBtn.addEventListener("click", () => {
            if (currentIndex < totalSlides - 1) {
              currentIndex = moderationModule.helpers.updateSlider(
                currentIndex + 1,
                post_gallery
              );
            }
          });

          prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
              currentIndex = moderationModule.helpers.updateSlider(
                currentIndex - 1,
                post_gallery
              );
            }
          });
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
            hashtags: post.tags || [],
            cover: post.cover,
            username: post.user?.username || "unknown",
            img: tempMedia(post.user?.img) || '../img/noname.png',
            slug: post.user?.slug,
            createdat: moderationModule.helpers.calctimeAgo(post.createdat)
          };


          const mediaUrl = moderationModule.helpers.safeMedia2(post.media);
          if (post.contenttype === "text" && mediaUrl) {
            item.post.description = await this.loadTextFile(mediaUrl);
          } else {
            const post_gallery = document.createElement("div");
            post_gallery.className = "slider-wrapper";
            post_gallery.innerHTML = `
                <div class="slider-track"></div>
                <span class=" nav-button prev_button"><i class="peer-icon peer-icon-arrow-left"></i></span>
                <span class=" nav-button next_button"><i class="peer-icon peer-icon-arrow-right"></i></span>                  
            `;
            const sliderTrack = post_gallery.querySelector(".slider-track");
            const nextBtn = post_gallery.querySelector(".next_button");
            const prevBtn = post_gallery.querySelector(".prev_button");

            switch (post.contenttype) {
              case "video":
                if (mediaUrl.length > 0) {
                  mediaUrl.forEach((url, idx) => {
                    const slide = document.createElement("div");
                    slide.className = "slide_item";

                    const video = document.createElement("video");
                    video.src = url;
                    video.controls = true;
                    video.autoplay = 0;
                    video.muted = false;
                    video.loop = true;
                    slide.appendChild(video);
                    sliderTrack.appendChild(slide);
                  });
                }
                item.post.media = post_gallery;
                break;
              case "image":
                if (mediaUrl.length > 0) {
                  mediaUrl.forEach((url, idx) => {
                    const slide = document.createElement("div");
                    slide.className = "slide_item";

                    const img = document.createElement("img");
                    img.src = url;
                    img.alt = `post image ${idx + 1}`;

                    slide.appendChild(img);
                    sliderTrack.appendChild(slide);
                  });
                }
                item.post.media = post_gallery;

                //item.post.media = `<img src="${mediaUrl}" alt="post image" />`;
                break;
              case "audio":
              default:
                const audioUrl = moderationModule.helpers.safeMedia(post.media);
                const coverUrl = moderationModule.helpers.safeMedia(post.cover);

                if (audioUrl) {
                  const audio_media = document.createElement("div");
                  audio_media.className = "audio_cover";
                  if (coverUrl) {
                    const audio_img = document.createElement("img");
                    audio_img.src = coverUrl;
                    audio_img.alt = `audio cover`;
                    audio_media.appendChild(audio_img);
                  }
                  const audio = document.createElement("audio");
                  audio.src = audioUrl;
                  audio.controls = true;
                  audio.preload = "metadata";
                  audio_media.appendChild(audio);
                  item.post.media = audio_media;
                }

                break;
            }

            let currentIndex = 0;
            const totalSlides = sliderTrack.children.length;

            if (totalSlides <= 1) {
              prevBtn.remove();
              nextBtn.remove();
            } else {
              currentIndex = moderationModule.helpers.updateSlider(0, post_gallery);

              nextBtn.addEventListener("click", () => {
                if (currentIndex < totalSlides - 1) {
                  currentIndex = moderationModule.helpers.updateSlider(
                    currentIndex + 1,
                    post_gallery
                  );
                }
              });

              prevBtn.addEventListener("click", () => {
                if (currentIndex > 0) {
                  currentIndex = moderationModule.helpers.updateSlider(
                    currentIndex - 1,
                    post_gallery
                  );
                }
              });
            }
          }
        }
      }
    }
    return items;
  }
};
