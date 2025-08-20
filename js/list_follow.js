 // Get user ID from URL or cookie
function getEffectiveUserID() {
  const params = new URLSearchParams(window.location.search);
  return params.get("user") || getCookie("userID");
}

const userID = getEffectiveUserID();
const avatar = "https://media.getpeer.eu";

// Bind UI click handlers
document.getElementById("followers_count").addEventListener("click", () => {
  openModal(userID, "followers");
});

document.getElementById("following_count").addEventListener("click", () => {
  openModal(userID, "following");
});

if (document.getElementById("peer_count")) {
  document.getElementById("peer_count").addEventListener("click", () => {
    openModal(userID, "peers");
  });
}

// Modal logic
async function openModal(userID, type) {
  const modal = document.getElementById("modal_Overlay");
  modal.classList.remove("none");
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <div class="modal-header">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
      <div class="modal-body">Loading ${type}...</div>
    </div>`;

  modal.querySelector(".modal-close").addEventListener("click", () => modal.classList.add("none"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("none");
  });
  

  const accessToken = getCookie("authToken");

  try {
    let users = [];

    if (type === "peers") {
      // Fetch peers and follow relations in parallel
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

      const peers = peersData.data.listFriends.affectedRows;
      const followers = relationsData.data.listFollowRelations.affectedRows.followers;
      const following = relationsData.data.listFollowRelations.affectedRows.following;

      // Create sets for faster lookup
      const followerIds = new Set(followers.map(f => f.id));
      const followingIds = new Set(following.map(f => f.id));

      // Map peers and add isfollowed, isfollowing flags
      users = peers.map(peer => ({
        ...peer,
        isfollowed: followerIds.has(peer.userid),
        isfollowing: followingIds.has(peer.userid)
      }));

    } else {
      // For followers or following modal, just fetch normally
      const resp = await fetch(GraphGL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ query: `
          query {
            listFollowRelations(userid: "${userID}") {
              affectedRows {
                followers {
                  id
                  username
                  slug
                  img
                  isfollowed
                  isfollowing
                }
                following {
                  id
                  username
                  slug
                  img
                  isfollowed
                  isfollowing
                }
              }
            }
          }
        ` })
      });

      const data = await resp.json();
      users = data.data.listFollowRelations.affectedRows[type];
    }

    // render users in modal
    renderUsers(users, modal.querySelector(".modal-body"));

  } catch (error) {
    console.error("Error fetching data:", error);
    modal.querySelector(".modal-body").innerHTML = `<p>Error loading ${type}.</p>`;
  }
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
