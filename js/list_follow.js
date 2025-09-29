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

  modal.innerHTML = `
    <div class="modal-content relationsModal">
      <button class="modal-close">&times;</button>
      <div class="tabs">
        <div class="tab-btn" data-type="followers">Followers</div>
        <div class="tab-btn" data-type="following">Following</div>
        <div class="tab-btn" data-type="peers">Peers</div>
      </div>
      <div class="modal-body">Loading...</div>
    </div>`;

  const body = modal.querySelector(".modal-body");

  modal.querySelector(".modal-close").addEventListener("click", () => modal.classList.add("none"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("none");
  });

  const accessToken = getCookie("authToken");

  // cache results so we don’t refetch on tab switch
  const cached = {};

  async function fetchRelations(type) {
    if (cached[type]) return cached[type];

    try {
      if (type === "peers") {
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
                listFollowRelations(userid: "${userID}") {
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

        const followerIds = new Set(followers.map(f => f.id));
        const followingIds = new Set(following.map(f => f.id));

        cached[type] = peers.map(peer => ({
          ...peer,
          isfollowed: followerIds.has(peer.userid),
          isfollowing: followingIds.has(peer.userid)
        }));

      } else {
        const resp = await fetch(GraphGL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ query: `
            query {
              listFollowRelations(userid: "${userID}") {
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
  loadTab(defaultType);
}

// bind clicks
document.getElementById("followers_count").addEventListener("click", () => {
  openRelationsModal(userID, "followers");
  console.log("Followers clicked");
});

document.getElementById("following_count").addEventListener("click", () => {
  openRelationsModal(userID, "following");
});

if (document.getElementById("peer_count")) {
  document.getElementById("peer_count").addEventListener("click", () => {
    openRelationsModal(userID, "peers");
  });
}


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
