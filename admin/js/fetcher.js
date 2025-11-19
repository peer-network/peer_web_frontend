window.moderationModule = window.moderationModule || {};

moderationModule.fetcher = {
  async loadItems(type = "LIST_ITEMS") {
    try {
      const query = moderationModule.schema[type];
      if (!query) throw new Error("Invalid query type: " + type);

      const response = await moderationModule.service.fetchGraphQL(query);

      // GraphQL responses usually have `data` field
      const items = response.data.moderationItems.affectedRows;

      // store items
      moderationModule.store.items = items;
      moderationModule.store.filteredItems = items;

      // render items
      moderationModule.view.renderItems(items);
    } catch (err) {
      console.error("Error loading items:", err);
    }
  },

  filterItems(searchText) {
    const lower = searchText.toLowerCase();
    const filtered = moderationModule.store.items.filter(item => {
      const title = item.targetcontent?.post?.title || "";
      const username = item.targetcontent?.user?.username || "";
      return title.toLowerCase().includes(lower) || username.toLowerCase().includes(lower);
    });

    moderationModule.store.filteredItems = filtered;
    moderationModule.view.renderItems(filtered);
  }
};
