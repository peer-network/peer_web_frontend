window.addEventListener("DOMContentLoaded", async () => {
  const { store, service, view, fetcher, helpers } = window.moderationModule;

  try {
    view.initFilters();

    // Load default ALL items on start
    await fetcher.loadItems(
      "LIST_ITEMS",
      {
        offset: 0,
        limit: 20,
        contentType: null   // null means ALL
      }
    );

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