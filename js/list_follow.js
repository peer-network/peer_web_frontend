const limit = 20; 
const offset = 0;
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
      loadTab(btn.dataset.type, body, tabButtons, userID, currentUserId, isOwnProfile, cache, accessToken);
    });
  });

  // Load default tab
  const tabToLoad = (defaultType === "peers" && !isOwnProfile) ? "followers" : defaultType;
  await loadTab(tabToLoad, body, tabButtons, userID, currentUserId, isOwnProfile, cache, accessToken);
}

/**
 * Closes the modal
 * @param {HTMLElement} modal - Modal element
 */
function closeModal(modal) {
  modal.classList.add("none");
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
 */
async function loadTab(type, body, tabButtons, userID, currentUserId, isOwnProfile, cache, accessToken) {
  body.innerHTML = "Loading...";

  // Update active tab styling
  tabButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.type === type);
  });

  try {
    const users = await fetchRelations(type, userID, currentUserId, isOwnProfile, cache, accessToken);

    if (!users || users.length === 0) {
      body.innerHTML = `<p>No ${type} found.</p>`;
    } else {
      renderUsers(users, body);
    }
  } catch (error) {
    console.error(`Error loading ${type} tab:`, error);
    body.innerHTML = `<p>Error loading ${type}. Please try again.</p>`;
  }
}

/**
 * Fetches user relations data
 * @param {string} type - Type of relations (followers/following/peers)
 * @param {string} userID - Target user ID
 * @param {string} currentUserId - Current logged-in user ID
 * @param {boolean} isOwnProfile - Whether viewing own profile
 * @param {Object} cache - Cache object
 * @param {string} accessToken - Authentication token
 * @returns {Promise<Array>} Array of user objects
 */
async function fetchRelations(type, userID, currentUserId, isOwnProfile, cache, accessToken) {
  // Return cached data if available
  if (cache[type]) {
    return cache[type];
  }

  try {
    let users;

    if (type === "peers" && isOwnProfile) {
      // Fetch ONLY mutual followers for current user
      users = await fetchPeers(accessToken);
    } else {
      // Fetch followers or following with YOUR perspective
      users = await fetchFollowersOrFollowing(type, userID, currentUserId, accessToken);
    }

    cache[type] = users;
    return users;

  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    cache[type] = [];
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
          listFriends {
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
    isfollowed: true,
    isfollowing: true
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
            limit: ${limit}
            offset: ${offset}
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
  return data?.data?.listFollowRelations?.affectedRows || { followers: [], following: [] };
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
