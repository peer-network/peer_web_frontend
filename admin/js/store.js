window.moderationModule = window.moderationModule || {};

moderationModule.store = {
  items: [],
  filteredItems: [],
  pagination: {
      offset: 0,
      limit: 20,
      loading: false,
      noMore: false,
      filter: {
        type: "LIST_ITEMS",
        contentType: null,
        status: null,
      }
    }
};
