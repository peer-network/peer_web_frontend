window.addEventListener("DOMContentLoaded", async () => {
  const { store, service, view, fetcher, helpers } = window.moderationModule;

  try {
    // store.currentUserId = helpers.getCookie("userId");
    // store.currentUserImg = helpers.getCookie("userImg");

    // view.initSearch();

    view.initFilters();   // 

    // Load items
    fetcher.loadItems('LIST_ITEMS');

    // Then render them
    // view.renderItems(items);
  } catch (err) {
    console.error("Initialization error:", err);
  }
});

/**
 * MAPPING:
 * loader  -> fetcher
 * graphql -> schema
 * index   -> main
 * api     -> service
 * state   -> store
 * ui      -> view
 * utils   -> helpers
 */