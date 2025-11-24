let currentOffset = 0;
let currentLimit = 20;
let isLoading = false;
let hasMore = true;
let currentType = null;
let observerInstance = null;
// Get user ID from URL or cookie
function getEffectiveUserID() {
  const params = new URLSearchParams(window.location.search);
  return params.get("user") || getCookie("userID");
}

const userID = getEffectiveUserID();
// const avatar = "https://media.getpeer.eu";

// ============================================
// LISTFOLLOWS.JS - Relations Modal
// ============================================

/**
 * Opens the followers/following/peers modal
 * @param {string} userID - ID of user whose relations to display
 * @param {string} defaultType - Default tab to open (followers/following/peers)
 */
async function openRelationsModal(userID, defaultType = "followers") {
  const modal = document.getElementById("modal_Overlay");
  if (!modal) {
    console.error("Modal overlay element not found");
    return;
  }

  currentOffset = 0;
  hasMore = true;
  isLoading = false;
  currentType = null;

  modal.classList.remove("none");
  document.body.style.overflow = "hidden";

  const currentUserId = getCookie("userID");
  const isOwnProfile = userID === currentUserId;

  // Build modal HTML
  const peersTab = isOwnProfile 
    ? '<div class="tab-btn" data-type="peers">Peers</div>' 
    : '';

  modal.innerHTML = `
    <div class="modal-content relationsModal">
      <button class="modal-close" aria-label="Close modal">&times;</button>
      <div class="tabs">
        <div class="tab-btn" data-type="followers">Followers</div>
        <div class="tab-btn" data-type="following">Following</div>
        ${peersTab}
      </div>
      <div class="modal-body">Loading...</div>
    </div>`;

  const body = modal.querySelector(".modal-body");
  const closeBtn = modal.querySelector(".modal-close");

  // Event listeners
  closeBtn.addEventListener("click", () => closeModal(modal));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });

  // Setup tab functionality
  const cache = {};
  const accessToken = getCookie("authToken");

  const tabButtons = modal.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentOffset = 0;
      hasMore = true;
      isLoading = false;

      loadTab(btn.dataset.type, body, tabButtons, userID, currentUserId, isOwnProfile, cache, accessToken, false);
    });
  });

  // Load default tab
  const tabToLoad = (defaultType === "peers" && !isOwnProfile) ? "followers" : defaultType;
  await loadTab(tabToLoad, body, tabButtons, userID, currentUserId, isOwnProfile, cache, accessToken, false);
}

/**e
 * Closes the modal
 * @param {HTMLElement} modal - Modal element
 */
function closeModal(modal) {
  modal.classList.add("none");
  document.body.style.overflow = "";
  
  if (observerInstance) {
    observerInstance.disconnect();
    observerInstance = null;
  }

  currentOffset = 0;
  hasMore = true;
  isLoading = false;
  currentType = null;
}

/**
 * Loads a specific tab in the modal
 * @param {string} type - Tab type (followers/following/peers)
 * @param {HTMLElement} body - Modal body element
 * @param {NodeList} tabButtons - All tab button elements
 * @param {string} userID - Target user ID
 * @param {string} currentUserId - Current logged-in user ID
 * @param {boolean} isOwnProfile - Whether viewing own profile
 * @param {Object} cache - Cache object for storing fetched data
 * @param {string} accessToken - Authentication token
 * @param {boolean} isLoadMore - Whether this is a load more request
 */
async function loadTab(type, body, tabButtons, userID, currentUserId, isOwnProfile, cache, accessToken, isLoadMore = false) {
  if (isLoading || (!isLoadMore && !hasMore)) return;
  
  isLoading = true;
  currentType = type;

  if (!isLoadMore) {
    body.innerHTML = "Loading...";
    currentOffset = 0;
    hasMore = true;
  }

  // Show loading indicator
  let loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'block';
  }

  // Update active tab styling
  tabButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.type === type);
  });

  try {
    const users = await fetchRelations(type, userID, currentUserId, isOwnProfile, accessToken, isLoadMore);

    if (!users || users.length === 0) {
      if (!isLoadMore) {
        body.innerHTML = `<p>No ${type} found.</p>`;
      }
      hasMore = false;

      const sentinel = document.getElementById('sentinel');
      if (sentinel) sentinel.remove();
      if (loadingIndicator) loadingIndicator.remove();
    } else {
      if (!isLoadMore) {
        // Initial load - use renderUsers (which clears container)
        renderUsers(users, body);
        
        // Setup infinite scroll
        setupIntersectionObserver(body, tabButtons, userID, currentUserId, isOwnProfile, cache, accessToken);
      } else {
        // Load more - append users before sentinel
        appendMoreUsers(users, body);
      }
      
      // Update offset
      currentOffset += users.length;
      
      // Check if we've loaded all users
      if (users.length < currentLimit) {
        hasMore = false;
        const sentinel = document.getElementById('sentinel');
        if (sentinel) sentinel.remove();
        if (loadingIndicator) loadingIndicator.remove();
      }
    }
  } catch (error) {
    console.error(`Error loading ${type} tab:`, error);
    if (!isLoadMore) {
      body.innerHTML = `<p>Error loading ${type}. Please try again.</p>`;
    }
    hasMore = false;
  } finally {
    isLoading = false;
    
    // Hide loading indicator
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
  }
}

/**
 * Sets up intersection observer for infinite scroll
 */
function setupIntersectionObserver(body, tabButtons, userID, currentUserId, isOwnProfile, cache, accessToken) {
  // Remove existing sentinel and loading indicator if they exist
  let sentinel = document.getElementById('sentinel');
  let loadingIndicator = document.getElementById('loadingIndicator');
  
  if (sentinel) sentinel.remove();
  if (loadingIndicator) loadingIndicator.remove();
  
  // Disconnect existing observer
  if (observerInstance) {
    observerInstance.disconnect();
  }
  
  // Create new sentinel
  sentinel = document.createElement('div');
  sentinel.id = 'sentinel';
  sentinel.style.height = '1px';
  sentinel.style.marginTop = '20px';
  body.appendChild(sentinel);
  
  // Create loading indicator
  loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loadingIndicator';
  loadingIndicator.style.textAlign = 'center';
  loadingIndicator.style.padding = '20px';
  loadingIndicator.style.display = 'none';
  loadingIndicator.innerHTML = '<p>Loading more...</p>';
  body.appendChild(loadingIndicator);
  
  // Create new observer
  observerInstance = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoading && hasMore) {
        loadTab(currentType, body, tabButtons, userID, currentUserId, isOwnProfile, cache, accessToken, true);
      }
    });
  }, {
    root: body,
    rootMargin: '100px',
    threshold: 0
  });
  
  observerInstance.observe(sentinel);
}

/**
 * Fetches user relations data
 * @param {string} type - Type of relations (followers/following/peers)
 * @param {string} userID - Target user ID
 * @param {string} currentUserId - Current logged-in user ID
 * @param {boolean} isOwnProfile - Whether viewing own profile
 * @param {Object} cache - Cache object
 * @param {string} accessToken - Authentication token
 * @param {boolean} isLoadMore - Whether this is a load more request
 * @returns {Promise<Array>} Array of user objects
 */
async function fetchRelations(type, userID, currentUserId, isOwnProfile, accessToken, isLoadMore) {

  try {
    let users;

    if (type === "peers" && isOwnProfile) {
      // Fetch ONLY mutual followers for current user
      users = await fetchPeers(accessToken);
    } else {
      // Fetch followers or following with YOUR perspective
      users = await fetchFollowersOrFollowing(type, userID, currentUserId, accessToken);
    }

    return users || []; 

  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return [];
  }
}

/**
 * Fetches peers (mutual followers) for current user
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Array>} Array of peer user objects
 */
async function fetchPeers(accessToken) {
  const response = await fetch(GraphGL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      query: `
        query {
          listFriends (limit: ${currentLimit}, offset: ${currentOffset}) {
            affectedRows {
              userid
              img
              username
              slug
            }
          }
        }
      `
    })
  });

  const data = await response.json();
  const peers = data?.data?.listFriends?.affectedRows || [];

  // For peers, both isfollowed and isfollowing are true by definition
  return peers.map(peer => ({
    ...peer,
    id: peer.userid,
    isfollowing: true,
    isfollowed: true
  }));
}

/**
 * Fetches followers or following with current user's perspective
 * @param {string} type - Type (followers/following)
 * @param {string} userID - Target user ID
 * @param {string} currentUserId - Current logged-in user ID
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Array>} Array of user objects with follow status
 */
async function fetchFollowersOrFollowing(type, userID, currentUserId, accessToken) {
  // Fetch the target user's relations
  const targetRelations = await fetchUserRelations(userID, accessToken);
  const targetUsers = targetRelations?.[type] || [];

  // If viewing own profile, we need to determine mutual relationships
  if (userID === currentUserId) {
    const myFollowers = new Set(
      (targetRelations.followers || []).map(u => u.id)
    );
    const myFollowing = new Set(
      (targetRelations.following || []).map(u => u.id)
    );

    return targetUsers.map(user => {
      if (type === "followers") {
        // These are people who follow YOU
        return {
          ...user,
          isfollowed: myFollowing.has(user.id),  // Do you follow them back?
          isfollowing: true  // They follow you (that's why they're in this list)
        };
      } else {
        // type === "following"
        // These are people YOU follow
        return {
          ...user,
          isfollowed: true,  // You follow them (that's why they're in this list)
          isfollowing: myFollowers.has(user.id)  // Do they follow you back?
        };
      }
    });
  }

  // Viewing someone else's profile - need YOUR perspective
  const myRelations = await fetchUserRelations(currentUserId, accessToken);
  
  const myFollowing = new Set(
    (myRelations?.following || []).map(u => u.id)
  );
  const myFollowers = new Set(
    (myRelations?.followers || []).map(u => u.id)
  );

  // Map users with YOUR perspective
  return targetUsers.map(user => ({
    ...user,
    isfollowed: myFollowing.has(user.id),  // Do YOU follow them?
    isfollowing: myFollowers.has(user.id)  // Do they follow YOU?
  }));
}


/**
 * Fetches all relations for a specific user
 * @param {string} userID - User ID to fetch relations for
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Object>} Object containing followers and following arrays
 */
async function fetchUserRelations(userID, accessToken) {
  console.log(`Fetching relations with offset: ${currentOffset}, limit: ${currentLimit}`);

  const response = await fetch(GraphGL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      query: `
        query {
          listFollowRelations(
            userid: "${userID}"
            limit: ${currentLimit}
            offset: ${currentOffset}
          ) {
            affectedRows {
              followers {
                id
                username
                slug
                img
              }
              following {
                id
                username
                slug
                img
              }
            }
          }
        }
      `
    })
  });

  const data = await response.json();
  console.log(`Received ${data?.data?.listFollowRelations?.affectedRows?.followers?.length || 0} followers, ${data?.data?.listFollowRelations?.affectedRows?.following?.length || 0} following`);

  return data?.data?.listFollowRelations?.affectedRows || { followers: [], following: [] };
}

/**
 * Renders users for initial load (clears container first)
 * @param {Array} users - Array of user objects
 * @param {HTMLElement} container - Container element
 */
function renderUsersInitial(users, container) {
  container.innerHTML = "";
  const currentUserId = getCookie("userID");

  if (!users || users.length === 0) {
    container.innerHTML = "<p>No users found.</p>";
    return;
  }

  users.forEach((user) => {
    const userItem = createUserItem(user, currentUserId);
    container.appendChild(userItem);
  });
}

/**
 * Appends more users for infinite scroll (doesn't clear container)
 * @param {Array} users - Array of user objects
 * @param {HTMLElement} container - Container element
 */
function appendMoreUsers(users, container) {
  const currentUserId = getCookie("userID");
  const sentinel = document.getElementById('sentinel');

  users.forEach((user) => {
    const userItem = createUserItem(user, currentUserId);
    // Insert before sentinel if it exists, otherwise append
    if (sentinel) {
      container.insertBefore(userItem, sentinel);
    } else {
      container.appendChild(userItem);
    }
  });
}

// bind clicks
const profileUserID = userID; // or however you're setting this variable

document.querySelectorAll(".followers_count").forEach(el => {
  el.addEventListener("click", () => {
    openRelationsModal(profileUserID, "followers");
    console.log("Followers clicked");
  });
});

document.querySelectorAll(".following_count").forEach(el => {
  el.addEventListener("click", () => {
    openRelationsModal(profileUserID, "following");
  });
});

document.querySelectorAll(".peer_count").forEach(el => {
  el.addEventListener("click", () => {
    const currentUserId = getCookie("userID");
    
    // Only open peers modal if it's the logged-in user's profile
    if (profileUserID === currentUserId) {
      openRelationsModal(profileUserID, "peers");
    }
  });
});

// if (document.getElementById("peer_count")) {
//   document.getElementById("peer_count").addEventListener("click", () => {
//     openRelationsModal(userID, "peers");
//   });
// }


// Follow/unfollow toggle mutation
async function toggleFollowStatus(userid) {
  const accessToken = getCookie("authToken");
  const query = `
    mutation ToggleUserFollowStatus($userid: ID!) {
      toggleUserFollowStatus(userid: $userid) {
        status
        ResponseCode
        isfollowing
      }
    }
  `;

  try {
    const response = await fetch(GraphGL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query, variables: { userid } }),
    });

    const result = await response.json();
    return result.data?.toggleUserFollowStatus?.isfollowing ?? null;

  } catch (error) {
    console.error("Toggle follow error:", error);
    return null;
  }
}

// Helper function
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
