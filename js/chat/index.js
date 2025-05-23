window.addEventListener("DOMContentLoaded", async () => {
  const { state, api, ui, loader } = window.ChatApp;

  try {
    state.currentUserId = await api.getCurrentUserId();
    ui.initChatTabs();
    ui.initSearch();
    ui.bindSendMessageHandler();
    loader.loadChats();
  } catch (err) {
    console.error("Initialization error:", err);
  }
});