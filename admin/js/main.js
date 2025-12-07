window.addEventListener("DOMContentLoaded", async () => {
  const { store, service, view, fetcher, helpers } = window.moderationModule;
  
  try {
    // Fetch and display username
    const userid = helpers.getFromStorage('userData', 'userid');
    
    if (userid) {
      const query = moderationModule.schema.LIST_USER_BY_ID;
      const response = await service.fetchGraphQL(query, { userid });
      const user = response?.getProfile?.affectedRows;
      
      // Update username in header
      const usernameEl = document.querySelector('.loggedin .username');
      if (usernameEl && user) {
        usernameEl.textContent = user.username || 'Admin';
      }
    }
    
    // Normal initialization
    view.initFilters();
    fetcher.loadStats();
    fetcher.loadItems("LIST_ITEMS", { offset: 0, limit: 20, contentType: null });
    
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
