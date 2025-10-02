const limit = 20; 
const offset = 0;
// Get user ID from URL or cookie
function getEffectiveUserID() {
  const params = new URLSearchParams(window.location.search);
  return params.get("user") || getCookie("userID");
}

const userID = getEffectiveUserID();
// const avatar = "https://media.getpeer.eu";

// Modal logic
async function openRelationsModal(userID, defaultType = "followers") {
  const modal = document.getElementById("modal_Overlay");
  modal.classList.remove("none");

  console.log("Opening modal for userID:", userID, "defaultType:", defaultType);

  const currentUserId = getCookie("userID");
  const isOwnProfile = userID === currentUserId;

  // Only show Peers tab if viewing own profile
  const peersTab = isOwnProfile ? '<div class="tab-btn" data-type="peers">Peers</div>' : '';

  modal.innerHTML = `
    <div class="modal-content relationsModal">
      <button class="modal-close">&times;</button>
      <div class="tabs">
        <div class="tab-btn" data-type="followers">Followers</div>
        <div class="tab-btn" data-type="following">Following</div>
        ${peersTab}
      </div>
      <div class="modal-body">Loading...</div>
    </div>`;

  const body = modal.querySelector(".modal-body");

  modal.querySelector(".modal-close").addEventListener("click", () => modal.classList.add("none"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("none");
  });

  const accessToken = getCookie("authToken");

  // cache results so we don't refetch on tab switch
  const cached = {};

  async function fetchRelations(type) {
    if (cached[type]) return cached[type];

    try {
      if (type === "peers") {
        // Only fetch peers for current user
        if (!isOwnProfile) {
          cached[type] = [];
          return cached[type];
        }

        const [peersResp, relationsResp] = await Promise.all([
          fetch(GraphGL, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ query: `
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
            ` })
          }),
          fetch(GraphGL, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ query: `
              query {
                listFollowRelations(
                userid: "${currentUserId}"
                limit: ${limit}
                offset: ${offset}) {
                  affectedRows {
                    followers { id }
                    following { id }
                  }
                }
              }
            ` })
          })
        ]);

        const peersData = await peersResp.json();
        const relationsData = await relationsResp.json();

        const peers = peersData.data.listFriends.affectedRows || [];
        const followers = relationsData.data.listFollowRelations.affectedRows.followers || [];
        const following = relationsData.data.listFollowRelations.affectedRows.following || [];

        const followingIds = new Set(following.map(f => f.id));
        const followerIds = new Set(followers.map(f => f.id));

        cached[type] = peers.map(peer => ({
          ...peer,
          id: peer.userid,
          isfollowed: followingIds.has(peer.userid), // You follow them
          isfollowing: followerIds.has(peer.userid)  // They follow you
        }));

      } else {
        const resp = await fetch(GraphGL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ query: `
            query {
              listFollowRelations(
              userid: "${userID}"
              limit: ${limit}
              offset: ${offset}) {
                affectedRows {
                  followers {
                    id username slug img isfollowed isfollowing
                  }
                  following {
                    id username slug img isfollowed isfollowing
                  }
                }
              }
            }
          ` })
        });

        const data = await resp.json();
        cached[type] = data.data.listFollowRelations.affectedRows[type] || [];
      }
    } catch (err) {
      console.error("Error fetching relations:", err);
      cached[type] = null;
    }

    return cached[type];
  }

  async function loadTab(type) {
    body.innerHTML = "Loading...";

    modal.querySelectorAll(".tab-btn").forEach(btn =>
      btn.classList.toggle("active", btn.dataset.type === type)
    );

    const users = await fetchRelations(type);

    if (!users || users.length === 0) {
      body.innerHTML = `<p>No ${type} found.</p>`;
    } else {
      renderUsers(users, body);
    }
  }

  // attach tab switching
  modal.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => loadTab(btn.dataset.type));
  });

  // load the default tab (clicked type)
  // If peers is clicked on someone else's profile, default to followers
  const tabToLoad = (defaultType === "peers" && !isOwnProfile) ? "followers" : defaultType;
  loadTab(tabToLoad);
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
