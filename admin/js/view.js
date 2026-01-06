window.moderationModule = window.moderationModule || {};

moderationModule.view = {
  initFilters() {
    const list = document.querySelectorAll(".item_filters li");
    const reviewChk = document.getElementById("review_chk");

    // type/contentType
    const kindFrom = (type, contentType) => {
      if (contentType) return contentType;
      if (type === "LIST_POST") return "post";
      if (type === "LIST_COMMENT") return "comment";
      if (type === "LIST_USER") return "user";
      return null;
    };

    const statusIsWaiting = (item) => {
      const s = ((item.status || item.post ?.status || item.targetstatus || "") + "").toLowerCase().trim();
      return s.includes("waiting");
    };

    const applyAndRender = (items, kind = null) => {
      let arr = Array.isArray(items) ? items.slice() : [];
      if (kind) arr = arr.filter(i => (i.kind || "").toString() === kind);
      if (reviewChk && reviewChk.checked) {
        const filtered = arr.filter(i => statusIsWaiting(i));
        this.renderItems(filtered);
      } else {
        this.renderItems(arr);
      }
    };

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
        moderationModule.store.pagination.filter.type = type;
        moderationModule.store.pagination.filter.contentType = contentType;

        await loadAndRender(type, contentType);
      });
    });

    if (reviewChk) {
      reviewChk.addEventListener("change", async () => {
        const kind = kindFrom(lastType, lastContentType);
        const cached = Array.isArray(moderationModule.store ?.items) ? moderationModule.store.items.filter(i => !kind || i.kind === kind) : [];
        if (cached.length) {
          applyAndRender(cached, kind);
          return;
        }

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
    //const items = moderationModule.store.filteredItems;
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
          (item.kind == "user") ? imgEl.onerror = function () { this.src = "../svg/noname.svg"; }: imgEl.onerror = function () { this.remove(); };
          imgWrapper.append(imgEl);
        }
      
       imgWrapper.append(moderationModule.helpers.createEl("i", {
          className: item.icon
        }));

      const detailEl = moderationModule.helpers.createEl("span", {
        className: "content_detail"
      });
      const userNameClass =  item.kind === "user" ? "user_name xl_font_size bold italic" : "user_name bold italic";
      detailEl.append(
        moderationModule.helpers.createEl("span", {
          className: userNameClass,
          textContent: '@' + item.username,
        })
      );

      if (item.kind === "post") {
        detailEl.append(
          moderationModule.helpers.createEl("span", {
            className: "post_title xl_font_size bold",
            textContent: item.title,
          })
        );
      }

      if (item.kind === "user") {
        detailEl.append(
          moderationModule.helpers.createEl("span", {
            className: "user_slug txt-color-gray",
            textContent: item.slug,
          })
        );
      }

      if (item.kind === "comment") {
        detailEl.append(
            moderationModule.helpers.createEl("span", {
              className: "post_title xl_font_size bold",
              textContent: item.post?.title,
            })
        );
         detailEl.append(
            moderationModule.helpers.createEl("span", {
              className: "user_slug txt-color-gray",
              textContent: item.commentid,
            })
        );
      }

      contentEl.append(imgWrapper, detailEl);
      const modId = moderationModule.helpers.createEl("div", {
        className: "moderation_id xl_font_size txt-color-gray",
        textContent: '#' + item.moderationId,
      });

      const modDate = moderationModule.helpers.createEl("div", {
        className: "moderation_date xl_font_size txt-color-gray",
        textContent: item.date,
      });

      const reportsEl = moderationModule.helpers.createEl("div", {
        className: "reports"
      });

      const isFlagged = item.reports >= 5;
      const reportCount = moderationModule.helpers.createEl("span", {
        className: `xl_font_size txt-color-gray ${isFlagged ? "red-text" : ""}`,
        innerHTML: isFlagged
          ? `<i class="peer-icon peer-icon-flag-fill red-text"></i> ${item.reports}`
          : `<i class="peer-icon peer-icon-flag txt-color-gray"></i> ${item.reports}`,
      });

      const statusVal = (item.status || "").toLowerCase();
      const visibility = moderationModule.helpers.createEl("span", {
        className: "visible txt-color-gray",
        innerHTML: statusVal == "illegal" || item.reports >= 5 ?  
          `<i class="peer-icon peer-icon-eye-close"></i> Not visible in the feed`:
          ""
      });
      reportsEl.append(reportCount, visibility);

      const statusEl = moderationModule.helpers.createEl("div", {
        className: "status"
      });
      let statusClass = "";

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
      if (item.kind == "post") {
        const postBlock = document.createElement("div");
        postBlock.className = "content_type_post";
        postBlock.innerHTML = `
          <div class="profile_post">
            <div class="profile">
              <span class="profile_image">
                <img class="profile-picture" src="${item?.userImg}" onerror="this.src='../svg/noname.svg'" alt="user image">
              </span>
              <span class="profile_detail">
                <span class="user_name xl_font_size bold italic">${item.username}</span>
                <span class="user_slug txt-color-gray">${item.slug}</span>
              </span>
            </div>
            <div class="fullpost_link">
              <a class="button btn-transparent" href="../dashboard.php?postid=${item?.postid}" target='_blank'>See full post <i class="peer-icon peer-icon-arrow-right"></i></a>
            </div>
          </div>
          <div class="post_detail post_type_${item?.contentType}">
           <div class="post_media">${item?.media}</div>
           <div class="post_info">
              <div class="post_title">
                <h2 class="xxl_font_size bold">${item.title}</h2>
                <span class="timeagao txt-color-gray">${item?.timeAgo}</span>
              </div>
              <div class="post_text">${item.description || ""}</div>
              <div class="hashtags txt-color-blue">${(item.hashtags || []).map(h => `<span class="hashtag">${h}</span>`).join("")}</div>
            </div>
          </div>
        `;

        const mediaContainer = postBlock.querySelector(".post_media");

        if (item.media instanceof HTMLElement) {
          mediaContainer.innerHTML="";
          mediaContainer.appendChild(item.media);
        }

        boxLeft.append(postBlock);
      }

      /* USER DETAILS */
      if (item.kind == "user") {
        const userBlock = document.createElement("div");
        userBlock.className = "content_type_profile";
        userBlock.innerHTML = `
          <div class="profile">
              <div class="profile_image">
                  <img src="${item.media}" />
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
        const userimg = userBlock.querySelector(".profile_image img");
        if (userimg) {
          userimg.onerror = function () { this.src = "../svg/noname.svg"; }
        }

        boxLeft.append(userBlock);
      }

      /* COMMENT DETAILS */
      if (item.kind == "comment" && item.post) {
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
                <span class="timeagao txt-color-gray">${item.post.createdat}</span>
              </div>
              <div class="post_text">${item?.post?.description}</div>
              <div class="hashtags txt-color-blue">
                ${(item?.post?.hashtags || []).map(h => `<span class="hashtag">#${h}</span>`).join("")}
              </div>
            </div>
          </div>
        `;

        const mediaContainer = commentPostDetail.querySelector(".post_media");

        if (item.post.media instanceof HTMLElement) {
          mediaContainer.innerHTML="";
          mediaContainer.appendChild(item.post.media);
        }


        commentType.append(commentBox, commentPostDetail);
        boxLeft.append(commentType);
      }

      /* RIGHT SIDE: status, reported by actions */
      const contenStatus = moderationModule.helpers.createEl("div", { className: "conten_status" });
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
          const r = moderationModule.helpers.createEl("div", {
            className: "profile_item"
          });
          r.innerHTML = ` 
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
                </div>`;

          profilesContainer.appendChild(r);
        });
      }

      boxRight.append(reportedBy);

      const actionButtons = moderationModule.helpers.createEl("div", {
        className: `action_buttons default ${statusVal == "waiting for review" ? "" : "none"}`
      });

      const applyModerationUI = () => {
        actionButtons.classList.add("none");
        moderatedBox.classList.remove("none");
      };

      // Hide confirmation box
      const confirmHide = moderationModule.helpers.createEl("div", {
        className: "action_box action_hide none"
      });
      confirmHide.innerHTML = `
        <div class="action_info">
            <h3 class="xl_font_size bold">Are you sure you want to hide this content?</h3>
            <p class="txt-color-gray">It will require additional confirmation from users to be shown.</p>
        </div>
        <div class="action_buttons">
            <a class="button btn-transparent btn_cancel" href="#">No</a>
            <a class="button btn-white btn_confirm" href="#">Yes</a>
        </div>
      `;

      // Restore confirmation box
      const confirmRestore = moderationModule.helpers.createEl("div", {
        className: "action_box action_restore none"
      });
      confirmRestore.innerHTML = `
        <div class="action_info">
            <h3 class="xl_font_size bold">Are you sure you want to restore this content?</h3>
            <p class="txt-color-gray">It will reappear in everyone’s feed.</p>
        </div>
        <div class="action_buttons">
            <a class="button btn-transparent btn_cancel" href="#">No</a>
            <a class="button btn-white btn_confirm" href="#">Yes</a>
        </div>
      `;

      // Illegal confirmation box
      const confirmIllegal = moderationModule.helpers.createEl("div", {
        className: "action_box action_illegal none"
      });
      confirmIllegal.innerHTML = `
        <div class="action_info">
            <h3 class="xl_font_size bold red-text">Are you sure this content is illegal?</h3>
            <p class="txt-color-gray">It will never be shown to anyone again.</p>
        </div>
        <div class="action_buttons">
            <a class="button btn-transparent btn_cancel" href="#">No</a>
            <a class="button btn-white btn_confirm" href="#">Yes</a>
        </div>
      `;

      // Hide button + handlers
      const hideBtn = moderationModule.helpers.createEl("a", {
        className: "button btn-transparent",
        textContent: "Hide",
        href: "#"
      });
      hideBtn.addEventListener("click", (e) => {
        e.preventDefault();
        confirmHide.classList.remove("none");
        actionButtons.classList.add("none");
        return false
      });
      confirmHide.querySelector(".btn_cancel").onclick = () => { 
        confirmHide.classList.add("none");   
        actionButtons.classList.remove("none"); 
        return false;
      }

      confirmHide.querySelector(".btn_confirm").onclick = async (e) => {
        e.preventDefault();
        await moderationModule.service.performModeration(item.moderationId, "hidden");
        confirmHide.classList.add("none");      
        const actionBox = e.target.closest(".action_box");
        if (!actionBox) return;
        let el = actionBox;

        while (el = el.nextElementSibling) {
          if (el.classList.contains("moderated_by_box"))
            break;
        }

        const moderatedByBox = el;
        if (!moderatedByBox || !moderatedByBox.classList.contains("moderated_by_box")) return;
        const moderatedAction = moderatedByBox.querySelector(".moderated_action");
        if (moderatedAction) {
          moderatedAction.textContent = "hidden";
          moderatedAction.className = "moderated_action xl_font_size red-text";
        }
        applyModerationUI();
        
        return false;
      }

      // Restore button + handlers
      const restoreBtn = moderationModule.helpers.createEl("a", {
        className: "button btn-blue bold",
        textContent: "Restore",
        href: ""
      });
      restoreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        confirmRestore.classList.remove("none");
        actionButtons.classList.add("none");
        return false;
      });
      confirmRestore.querySelector(".btn_cancel").onclick = (e) => { 
        e.preventDefault();
        confirmRestore.classList.add("none"); 
        actionButtons.classList.remove("none");
        return false;
      }
      confirmRestore.querySelector(".btn_confirm").onclick = async (e) => {
        e.preventDefault();
        await moderationModule.service.performModeration(item.moderationId, "restored");
        confirmRestore.classList.add("none");

        const actionBox = e.target.closest(".action_box");
        if (!actionBox) return;
        let el = actionBox;

        while (el = el.nextElementSibling) {
          if (el.classList.contains("moderated_by_box"))
            break;
        }

        const moderatedByBox = el;
        
        if (!moderatedByBox || !moderatedByBox.classList.contains("moderated_by_box")) return;
        const moderatedAction = moderatedByBox.querySelector(".moderated_action");
        if (moderatedAction) {
          moderatedAction.textContent = "Restored";
          moderatedAction.className = "moderated_action xl_font_size green-text";
        }

        applyModerationUI();
        return false;
      };

      // Illegal button + handlers
      const illegalBtn = moderationModule.helpers.createEl("a", {
        className: "button btn-red-transparent",
        textContent: "Mark as illegal",
        href: ""
      });
      illegalBtn.addEventListener("click", (e) => {
        e.preventDefault();
        confirmIllegal.classList.remove("none");
        actionButtons.classList.add("none");
        return false
      });
      confirmIllegal.querySelector(".btn_cancel").onclick = (e) => { 
        e.preventDefault();
        confirmIllegal.classList.add("none"); 
        actionButtons.classList.remove("none");
        return false;
      }
      confirmIllegal.querySelector(".btn_confirm").onclick = async (e) => {
        e.preventDefault();
        await moderationModule.service.performModeration(item.moderationId, "illegal");
        confirmIllegal.classList.add("none");

        const actionBox = e.target.closest(".action_box");
        if (!actionBox) return;
        let el = actionBox;

        while (el = el.nextElementSibling) {
          if (el.classList.contains("moderated_by_box"))
            break;
        }

        const moderatedByBox = el;
        if (!moderatedByBox || !moderatedByBox.classList.contains("moderated_by_box")) return;
        const moderatedAction = moderatedByBox.querySelector(".moderated_action");
        if (moderatedAction) {
          moderatedAction.textContent = "Illegal";
          moderatedAction.className = "moderated_action xl_font_size red-text";
        }
        
        applyModerationUI();
        return false;
      };

      // Append buttons and confirmation boxes to right box       
      actionButtons.append(restoreBtn, hideBtn, illegalBtn);
      boxRight.append(confirmHide, confirmRestore, confirmIllegal);
      boxRight.append(actionButtons);
    
      /* Moderated box */
      const moderatedBox = moderationModule.helpers.createEl("div", {
        className: `moderated_by_box ${statusVal == "waiting for review" ? "none" : ""}`
      });

      // moderated box
      moderatedBox.innerHTML = `
        <div class="moderated_info">
          <span class="label xl_font_size txt-color-gray">Moderated by</span>
          <span class="profile">
            <span class="profile_image">
              <img class="profile-picture" src="${item?.moderatedBy?.img}" onerror="this.src='../svg/noname.svg'" alt="user image">
            </span>
            <span class="profile_detail">
              <span class="user_name xl_font_size bold italic">${item.moderatedBy?.username || "moderator"}</span>
              <span class="user_slug txt-color-gray">${item.moderatedBy?.slug || "#000000"}</span>
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
      
      // contentBox.addEventListener("click", (evt) => {
        //evt.stopPropagation();
        //evt.preventDefault();
      // });
    });
  },

  toggleRow(itemEl, contentBox) {
    const container = moderationModule.helpers.getElement(".content_load");
    const allBoxes = container.querySelectorAll(".content_item .content_box");

    allBoxes.forEach((box) => {
      if (box !== contentBox && !box.classList.contains("none")) {
        box.classList.add("none");
        box.parentElement.classList.remove("active");
      }
    });

    const isOpen = !contentBox.classList.contains("none");
    if (isOpen) {
      contentBox.classList.add("none");
      itemEl.classList.remove("active");
    } else {
      contentBox.classList.remove("none");
      itemEl.classList.add("active");
    }
  },

  initWindowInfiniteScroll() {
    window.addEventListener("scroll", async () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 200) {
        const { pagination } = moderationModule.store;
        if (pagination.loading || pagination.noMore) return;

        pagination.loading = true;

        const { offset, limit, filter } = pagination;
        const type = filter?.type || "LIST_ITEMS";
        const contentType = filter?.contentType || null;

        try {
          const query = moderationModule.schema[type];
          if (!query) throw new Error("GraphQL query undefined for type: " + type);

          const vars = { offset, limit, contentType };
          const response = await moderationModule.service.fetchGraphQL(query, vars);
          const rawItems = response?.moderationItems?.affectedRows || response?.moderationItems || [];
          if (!rawItems.length) {
            pagination.noMore = true;
            pagination.loading = false;
            return;
          }

          const normalized = await moderationModule.fetcher.normalizeItems(rawItems);
          const enriched = await moderationModule.fetcher.enrichCommentsWithPosts(normalized);

          moderationModule.store.filteredItems.push(...enriched);

          const reviewChk = document.getElementById("review_chk");
          let filtered = moderationModule.store.filteredItems;
          if (reviewChk?.checked) {
            filtered = filtered.filter(i => (i.status || "").toLowerCase().includes("waiting"));
          }
          //moderationModule.store.filteredItems = filtered;
          moderationModule.view.renderItems(filtered);
          moderationModule.store.pagination.offset += rawItems.length;
        } catch (err) {
          console.error("Scroll fetch error:", err);
        }

        pagination.loading = false;
      }
    });
  }
};