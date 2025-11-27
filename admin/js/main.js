window.addEventListener("DOMContentLoaded", async () => {
  const { store, service, view, fetcher, helpers } = window.moderationModule;
  try {
    // detect page
    // const page = window.location.pathname.split("/").pop(); // 'index.php' or 'content.php'
    // if (page === "content.php") {
    //   fetcher.initContentPage();
    // } else {
      view.initFilters();
      //load stats
      fetcher.loadStats();
      // Load default ALL items on start
      fetcher.loadItems("LIST_ITEMS", { offset: 0, limit: 20, contentType: null});
    // }
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
