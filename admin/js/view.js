window.moderationModule = window.moderationModule || {};

moderationModule.view = {
  // initFilters() {
  //   const list = document.querySelectorAll(".item_filters li");

  //   list.forEach((li) => {
  //     li.addEventListener("click", async (e) => {
  //       e.preventDefault();

  //       // remove active
  //       document .querySelectorAll(".item_filters li a").forEach((a) => a.classList.remove("active"));

  //       li.querySelector("a").classList.add("active");

  //       // Determine schema type + contentType
  //       let type = "LIST_ITEMS";
  //       let contentType = null;

  //       if (li.classList.contains("post")) {
  //         type = "LIST_POST";
  //         contentType = "post";

  //       } else if (li.classList.contains("comments")) {
  //         type = "LIST_COMMENT";
  //         contentType = "comment";

  //       } else if (li.classList.contains("accounts")) {
  //         type = "LIST_USER";
  //         contentType = "user";
  //       }

  //       // Load items
  //       await moderationModule.fetcher.loadItems(type, { offset: 0, limit: 20, contentType });
  //     });
  //   });
  // },

  initFilters() {
    const list = document.querySelectorAll(".item_filters li");
    const reviewChk = document.getElementById("review_chk");

    // normalize kind from type/contentType
    const kindFrom = (type, contentType) => {
      if (contentType) return contentType;
      if (type === "LIST_POST") return "post";
      if (type === "LIST_COMMENT") return "comment";
      if (type === "LIST_USER") return "user";
      return null;
    };

    // robust status check (handles nested post.status etc)
    const statusIsWaiting = (item) => {
      const s = ((item.status || item.post ?.status || item.targetstatus || "") + "").toLowerCase().trim();
      return s.includes("waiting");
    };

    // apply filter by kind + waiting status and render
    const applyAndRender = (items, kind = null) => {
      let arr = Array.isArray(items) ? items.slice() : [];
      if (kind) arr = arr.filter(i => (i.kind || "").toString() === kind);
      if (reviewChk && reviewChk.checked) {
        const filtered = arr.filter(i => statusIsWaiting(i));
        console.debug("applyAndRender: filtered waiting items", filtered.length, "of", arr.length, "kind=", kind);
        this.renderItems(filtered);
      } else {
        this.renderItems(arr);
      }
    };

    // load from server; if server returns nothing and we have cached items, fallback to cache
    const loadAndRender = async (type, contentType) => {
      const opts = {
        offset: 0,
        limit: 20,
        contentType
      };
      if (reviewChk && reviewChk.checked) opts.status = "waiting for review";
      const result = await moderationModule.fetcher.loadItems(type, opts);
      const items = Array.isArray(result) ? result : (moderationModule.store ?.items || []);
      const kind = kindFrom(type, contentType);

      if ((!items || items.length === 0) && Array.isArray(moderationModule.store ?.items) && moderationModule.store.items.length) {
        // fallback: try cached items for the same kind
        const cached = moderationModule.store.items.filter(i => !kind || (i.kind === kind));
        applyAndRender(cached, kind);
        return;
      }

      applyAndRender(items, kind);
    };

    let lastType = "LIST_ITEMS";
    let lastContentType = null;

    list.forEach((li) => {
      li.addEventListener("click", async (e) => {
        e.preventDefault();
        document.querySelectorAll(".item_filters li a").forEach((a) => a.classList.remove("active"));
        li.querySelector("a") ?.classList.add("active");

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

        lastType = type;
        lastContentType = contentType;

        await loadAndRender(type, contentType);
      });
    });

    if (reviewChk) {
      reviewChk.addEventListener("change", async () => {
        // prefer client-side cached items for the current kind to avoid disappearing list
        const kind = kindFrom(lastType, lastContentType);
        const cached = Array.isArray(moderationModule.store ?.items) ? moderationModule.store.items.filter(i => !kind || i.kind === kind) : [];
        if (cached.length) {
          applyAndRender(cached, kind);
          return;
        }
        // else request server for the last selected filter
        await loadAndRender(lastType, lastContentType);
      });
    }
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

      const itemInner = moderationModule.helpers.createEl("div", {
        className: "content_item_inner",
      });

      /* -------------------- SUMMARY -------------------- */
      const contentEl = moderationModule.helpers.createEl("div", {
        className: "content"
      });
      const imgWrapper = moderationModule.helpers.createEl("span", {
        className: "content_image"
      });

      if (item.media) {
        const imgEl = moderationModule.helpers.createEl("img", { src: item.media });
             
        if (item.kind == "user") {
      
         imgEl.onerror = function () { this.src = "../svg/noname.svg"; };
        }else{
          imgEl.onerror = function () { this.remove(); };
        }
         
        imgWrapper.append(imgEl);
        if (item.kind === "post") {
          imgWrapper.append(moderationModule.helpers.createEl("i", {
            className: item.icon
          }));
        }
      } else {
        imgWrapper.append(moderationModule.helpers.createEl("i", {
          className: item.icon
        }));
      }

      const detailEl = moderationModule.helpers.createEl("span", {
        className: "content_detail"
      });
      const userNameClass =
        item.kind === "user" ? "user_name xl_font_size bold italic" : "user_name bold italic";

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

      const modId = moderationModule.helpers.createEl("div", {
        className: "moderation_id xl_font_size txt-color-gray",
        textContent: item.moderationId,
      });

      const modDate = moderationModule.helpers.createEl("div", {
        className: "moderation_date xl_font_size txt-color-gray",
        textContent: item.date,
      });

      const reportsEl = moderationModule.helpers.createEl("div", {
        className: "reports"
      });
      const reportCount = moderationModule.helpers.createEl("span", {
        className: "xl_font_size txt-color-gray",
        innerHTML: `<i class="peer-icon peer-icon-copy-alt"></i> ${item.reports}`,
      });
      const visibility = moderationModule.helpers.createEl("span", {
        className: "visible txt-color-gray",
        innerHTML: item.visible === false ?
          `<i class="peer-icon peer-icon-eye-close"></i> Not visible in the feed` :
          "",
      });
      reportsEl.append(reportCount, visibility);

      const statusEl = moderationModule.helpers.createEl("div", {
        className: "status"
      });
      let statusClass = "";
      const statusVal = (item.status || "").toLowerCase();
      if (statusVal === "hidden" || statusVal === "illegal") {
        statusClass = "hidden-tx xl_font_size red-text";
      } else if (statusVal === "restored") {
        statusClass = "restored xl_font_size green-text";
      } else if (statusVal === "waiting for review") {
        statusClass = "review xl_font_size yellow-text";
      }
      statusEl.append(
        moderationModule.helpers.createEl("span", {
          className: statusClass,
          textContent: item.status,
        })
      );

      itemInner.append(contentEl, modId, modDate, reportsEl, statusEl);
      itemEl.append(itemInner);

      /* -------------------- DETAILS BOX -------------------- */
      const contentBox = moderationModule.helpers.createEl("div", {
        className: "content_box none",
      });
      const boxLeft = moderationModule.helpers.createEl("div", {
        className: "content_box_left"
      });
      const boxRight = moderationModule.helpers.createEl("div", {
        className: "content_box_right"
      });

      /* POST DETAILS */
      if (item.kind === "post") {
        const postBlock = document.createElement("div");
        postBlock.className = "content_type_post";
        postBlock.innerHTML = `
          <div class="profile_post">
            <div class="profile">
              <span class="profile_image"><img src="../img/profile_thumb.png" /></span>
              <span class="profile_detail">
                <span class="user_name xl_font_size bold italic">${item.username}</span>
                <span class="user_slug txt-color-gray">${item.slug}</span>
              </span>
            </div>
            <div class="fullpost_link">
              <a class="button btn-transparent" href="../dashboard.php?postid=${item?.postid}" target='_blank'>See full post <i class="peer-icon peer-icon-arrow-right"></i></a>
            </div>
          </div>
          <div class="post_detail">
            <div class="post_title">
              <h2 class="xxl_font_size bold">${item.title}</h2>
              <span class="timeagao txt-color-gray">2h</span>
            </div>
            <div class="post_text">${item.description || ""}</div>
            <div class="hashtags txt-color-blue">${(item.hashtags || []).map(h => `<span class="hashtag">${h}</span>`).join("")}</div>
          </div>
        `;
        boxLeft.append(postBlock);
      }

      /* USER DETAILS */
      if (item.kind === "user") {
        const userBlock = document.createElement("div");
        userBlock.className = "content_type_profile";
        userBlock.innerHTML = `
          <div class="profile">
              <div class="profile_image">
                  <img src="../img/profile_thumb.png" />
                  <img src="${item.media || "../img/profile_thumb.png"}" />
              </div>
              <div class="profile_detail">
                  <div class="user_info">
                      <span
                          class="user_name xl_font_size bold italic">${item.username}</span>
                      <span class="user_slug txt-color-gray">#${item.slug}</span>
                  </div>
                  <div class="user_profile_txt txt-color-gray">${item.biography || ""}</div>

                  <div class="profile_stats txt-color-gray">
                      <span class="post_count">
                          <em id="userPosts" class="xl_font_size bold">${item?.posts || 0}</em>
                          Publications
                      </span>
                      <span id="followers_count" class="followers_count">
                          <em id="followers" class="xl_font_size bold">${item?.followers || 0}</em> Followers
                      </span>
                      <span id="following_count" class="following_count">
                          <em id="following" class="xl_font_size bold">${item?.following || 0}</em> Following
                      </span>
                      <span id="peer_count" class="peer_count">
                          <em id="peers" class="xl_font_size bold">${item?.peers || 0}</em> Peers
                      </span>
                  </div>

              </div>
          </div>
          <div class="profile_link">
              <a class="button btn-transparent" href="../view-profile.php?user=${item.userid}" target='_blank'>View profile <i class="peer-icon peer-icon-arrow-right"></i></a>
          </div>
        `;

        boxLeft.append(userBlock);
      }

      /* COMMENT DETAILS */
      if (item.kind === "comment" && item.post) {
        const commentType = document.createElement("div");
        commentType.className = "content_type_comment";
        // Comment box
        const commentBox = document.createElement("div");
        commentBox.className = "comment_box";
        commentBox.innerHTML = `
          <h2 class="xxl_font_size bold">
              <i class="peer-icon peer-icon-comment-fill xl_font_size"></i> 
              Reported comment
          </h2>
          <div class="comment_item">
              <div class="commenter-pic">
                  <img class="profile-picture" src="${item?.commenterProfile?.img}" onerror="this.src='../svg/noname.svg'" alt="user image">
              </div>
              <div class="comment_body">
                  <div class="commenter_info xl_font_size">
                      <span class="cmt_userName bold italic">${item?.commenterProfile?.username}</span>
                      <span class="cmt_profile_id txt-color-gray">${item?.commenterProfile?.slug}</span>
                      <span class="timeagao txt-color-gray">${item?.timeAgo}</span>
                  </div>
                  <div class="comment_text xl_font_size">${item.content}</div>

              </div>
              <div class="comment_like xl_font_size">
                  <i class="peer-icon peer-icon-like"></i>
                  <span>0</span>
              </div>
          </div>`;

        // Linked post details under the comment
        const commentPostDetail = document.createElement("div");
        commentPostDetail.className = "comment_post_detail";
        commentPostDetail.innerHTML = `
          <div class="profile_post">
            <div class="profile">
              <span class="profile_image"><img src="${item?.post?.img}" onerror="this.src='../svg/noname.svg'"></span>
              <span class="profile_detail">
                <span class="user_name xl_font_size bold italic">${item?.post?.username}</span>
                <span class="user_slug txt-color-gray">#${item?.post?.slug}</span>
              </span>
            </div>
            <div class="fullpost_link">
              <a class="button btn-transparent" href="../dashboard.php?postid=${item?.post?.id}" target='_blank'>See full post <i class="peer-icon peer-icon-arrow-right"></i></a>
            </div>
          </div>
          <div class="post_detail post_type_${item?.post?.contentType}">
            <div class="post_media">${item?.post?.media}</div>
            <div class="post_info">
              <div class="post_title">
                <h2 class="xl_font_size bold">${item?.post?.title}</h2>
                <span class="timeagao txt-color-gray">2h</span>
              </div>
              <div class="post_text">${item?.post?.description}</div>
              <div class="hashtags txt-color-blue">
                ${(item.hashtags || []).map(h => `<span class="hashtag">${h}</span>`).join("")}
              </div>
            </div>
          </div>
        `;

        commentType.append(commentBox, commentPostDetail);
        boxLeft.append(commentType);
      }

      /* RIGHT SIDE: status, reported by actions */
      const contenStatus = moderationModule.helpers.createEl("div", {
        className: "conten_status"
      });
      const rightStatusClass =
        statusVal === "hidden" || statusVal === "illegal" ? "hidden-tx xl_font_size red-text" :
        statusVal === "restored" ? "restored xl_font_size green-text" :
        "review xl_font_size yellow-text";

      contenStatus.innerHTML = `
        <span class="label xl_font_size txt-color-gray">Status</span>
        <span class="${rightStatusClass}">${item.status}</span>
      `;
      //boxRight.append(contenStatus);

      const reportedBy = moderationModule.helpers.createEl("div", {
        className: "reported_by"
      });
      reportedBy.innerHTML = `
        <div class="head">
          <span class="label xl_font_size">Reported by</span>
          <span class="flag xl_font_size red-text">
            <i class="peer-icon peer-icon-copy-alt"></i>
            ${item.reports}
          </span>
        </div>
        <div class="reported_by_profiles"></div>
      `;

      const profilesContainer = reportedBy.querySelector(".reported_by_profiles");
      if (Array.isArray(item.reporters)) {
        item.reporters.forEach(rep => {
          const r = document.createElement("div");
          r.innerHTML = ` 
              <div class="profile_item">
                <div class="profile">
                    <span class="profile_image">
                        <img src="${rep.img}" alt="user image" onerror="this.src='../svg/noname.svg'" />
                    </span>
                    <span class="profile_detail">
                        <span
                            class="user_name xl_font_size bold italic">${rep.username}</span>
                        <span class="user_slug txt-color-gray">${rep.slug}</span>
                    </span>
                </div>
                <div class="report_time xl_font_size txt-color-gray">
                    ${rep.updatedat}
                </div>
              </div>`;

          profilesContainer.appendChild(r);
        });
      }

      boxRight.append(reportedBy);

      const actionButtons = moderationModule.helpers.createEl("div", {
        className: `action_buttons ${statusVal == "waiting for review" ? "" : "none"}`
      });

      // console.log("Creating action buttons for item:", actionButtons.className);

      const hideBtn = moderationModule.helpers.createEl("a", {
        className: "button btn-transparent",
        textContent: "Hide",
        href: "#"
      });
      hideBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const res = await moderationModule.service.performModeration(item.moderationId, "hidden");
        console.log("Hidden:", res);
      });

      const restoreBtn = moderationModule.helpers.createEl("a", {
        className: "button btn-blue bold",
        textContent: "Restore",
        href: "#"
      });
      restoreBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const res = await moderationModule.service.performModeration(item.moderationId, "restored");
        console.log("Restored:", res);
      });

      const illegalBtn = moderationModule.helpers.createEl("a", {
        className: "button btn-red-transparent",
        textContent: "Mark as illegal",
        href: "#"
      });
      illegalBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const res = await moderationModule.service.performModeration(item.moderationId, "illegal");
        console.log("Illegal:", res);
      });

      actionButtons.append(restoreBtn, hideBtn, illegalBtn);
      boxRight.append(actionButtons);

      /* Moderated box */
      const moderatedBox = moderationModule.helpers.createEl("div", {
        className: `moderated_by_box  ${statusVal == "waiting for review" ? "none" : ""}`
      });

      moderatedBox.innerHTML = `
        <div class="moderated_info">
          <span class="label xl_font_size txt-color-gray">Moderated by</span>
          <span class="profile">
            <span class="profile_image">
              <img src="../img/profile_thumb.png" />
            </span>
            <span class="profile_detail">
              <span class="user_name xl_font_size bold italic">${item.moderatorName || "moderator"}</span>
              <span class="user_slug txt-color-gray">${item.moderatorSlug || "#000000"}</span>
            </span>
          </span>
          <span class="datetime xl_font_size txt-color-gray">${item.moderatedAt || ""}</span>
        </div>
        <div class="moderated_action xl_font_size ${statusVal === "restored" ? "green-text" : statusVal === "illegal" || statusVal === "hidden" ? "red-text" : "yellow-text"}">
          ${item.status}
        </div>
      `;
      boxRight.append(moderatedBox);

      contentBox.append(boxLeft, boxRight);
      itemEl.append(contentBox);
      container.appendChild(itemEl);

      /* -------------------- TOGGLE -------------------- */
      itemInner.addEventListener("click", (evt) => {
        this.toggleRow(itemEl, contentBox);
      });

      // Prevent clicks inside row
      contentBox.addEventListener("click", (evt) => {
        evt.stopPropagation();
      });
    });
  },

  toggleRow(itemEl, contentBox) {
    // Close any other open rows first
    const container = moderationModule.helpers.getElement(".content_load");
    const allBoxes = container.querySelectorAll(".content_item .content_box");

    allBoxes.forEach((box) => {
      if (box !== contentBox && !box.classList.contains("none")) {
        box.classList.add("none");
        box.parentElement.classList.remove("active"); // optional styling hook
      }
    });

    // Toggle the clicked row
    const isOpen = !contentBox.classList.contains("none");
    if (isOpen) {
      contentBox.classList.add("none");
      itemEl.classList.remove("active"); // optional styling hook
    } else {
      contentBox.classList.remove("none");
      itemEl.classList.add("active"); // optional styling hook
    }
  }
};