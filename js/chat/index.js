window.addEventListener("DOMContentLoaded", async () => {
  const { state, api, ui, loader, utils } = window.ChatApp;

  try {
    state.currentUserId = await utils.getCurrentUserId();
    state.currentUserImg = await utils.getCurrentUserImage();
    ui.initChatTabs();
    ui.initSearch();
    ui.bindSendMessageHandler();
    loader.loadChats();
  } catch (err) {
    console.error("Initialization error:", err);
  }
});