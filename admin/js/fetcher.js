window.moderationModule = window.moderationModule || {};

moderationModule.fetcher = {
  async loadItems(filterType = "ALL") {
    const query = moderationModule.schema.LIST_ITEMS;

    try {
      // fetch GraphQL through moderation module
      const data = await moderationModule.service.fetchGraphQL(query);

      const rawItems = data?.moderationItems?.affectedRows || [];

      const typedItems = rawItems.map(item => ({
        ...item,
        type: item.targettype
      }));

      const filtered =
        filterType === "ALL"
          ? typedItems
          : typedItems.filter(i => i.type === filterType);

      const listRoot = document.querySelector(".moderation-list");
      listRoot.innerHTML = ""; 

      if (filtered.length === 0) {
        document.getElementById("no_items_found")?.classList.add("active");
        return;
      } else {
        document.getElementById("no_items_found")?.classList.remove("active");
      }

      filtered.forEach(item => {
        const html = moderationModule.fetcher.renderRow(item);
        listRoot.insertAdjacentHTML("beforeend", html);
      });

    } catch (error) {
      console.error("Error loading moderation items:", error);
    }
  },

  renderRow(item) {
    const content = moderationModule.fetcher.getContentPreview(item);

    return `
      <div class="moderation-row moderation-item" data-id="${item.moderationTicketId}">
        <div class="col-content">
          ${content}
        </div>

        <div class="col-id">
          #${item.moderationTicketId}<br>
          ${item.targetContentId}
        </div>

        <div class="col-date">
          ${moderationModule.utils.formatDate(item.createdat)}
        </div>

        <div class="col-reports">
          <span class="reports-icon">📄</span> 
          ${item.reportscount}
          <div class="reports-note">Not visible in feed</div>
        </div>

        <div class="col-status ${item.status.toLowerCase()}">
          ${item.status}
        </div>
      </div>
    `;
  },

  getContentPreview(item) {
    const c = item.targetcontent;

    if (item.type === "post") {
      return `
        <div class="content-preview post">
          <img class="avatar" src="${c.post.user.img}" alt="">
          <div>
            <div class="username">@${c.post.user.username}</div>
            <div class="title">${c.post.title || "Untitled Post"}</div>
          </div>
        </div>
      `;
    }

    if (item.type === "comment") {
      return `
        <div class="content-preview comment">
          <img class="avatar" src="${c.comment.user?.img || 'svg/noname.svg'}" alt="">
          <div>
            <div class="username">@${c.comment.user?.username || "Unknown"}</div>
            <div class="title">${c.comment.content}</div>
          </div>
        </div>
      `;
    }

    if (item.type === "user") {
      return `
        <div class="content-preview user">
          <img class="avatar" src="${c.user.img}" alt="">
          <div>
            <div class="username">${c.user.username}</div>
            <div class="title">#${c.user.userid}</div>
          </div>
        </div>
      `;
    }

    return "Unknown content";
  }
};
