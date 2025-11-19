window.moderationModule = window.moderationModule || {};

moderationModule.store = {
  items: [],                  // All items fetched from API
  filteredItems: [],          // Filtered items based on search / filter
  selectedItems: [],          // Selected items for bulk actions
  currentUserId: null,        
  currentUserImg: null,       
  isInBulkAction: false,      // Flag if bulk action mode is active
  filterText: "",             // Current search/filter text
};
