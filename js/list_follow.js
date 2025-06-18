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

function renderUsers(users, container) {
  container.innerHTML = "";
  const avatar = "https://media.getpeer.eu";
  const currentUserId = getCookie("userID");

  users.forEach(user => {
    const item = document.createElement("div");
    item.className = "dropdown-item clickable-user";
    item.innerHTML = `
      <div class="profilStats">
        <img src="${avatar}/${user.img}" alt="${user.username}" />
        ${user.username}  #${user.slug}
      </div>
    `;

    item.querySelector("img").onerror = () => { item.querySelector("img").src = "svg/noname.svg"; };

    item.addEventListener("click", () => {
      window.location.href = `view-profile.php?user=${user.id || user.userid}`;
    });

    if ((user.id || user.userid) !== currentUserId) {
      const followButton = document.createElement("button");
      followButton.classList.add("follow-button");
      followButton.dataset.userid = user.id || user.userid;

      if (user.isfollowed && user.isfollowing) {
        followButton.textContent = "Peer";
        followButton.classList.add("following");
      } else if (user.isfollowed) {
        followButton.textContent = "Following";
        followButton.classList.add("following");
      } else {
        followButton.textContent = "Follow +";
      }

      followButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const targetUserId = user.id || user.userid;
        const newStatus = await toggleFollowStatus(user.id || user.userid);

        if (newStatus !== null) {
          user.isfollowed = newStatus;

          const followerCountSpan = document.getElementById("following");
          if (followerCountSpan) {
            let count = parseInt(followerCountSpan.textContent, 10) || 0;
            count = newStatus ? count + 1 : Math.max(0, count - 1);
            followerCountSpan.textContent = count;
          }

          document.querySelectorAll(`.follow-button[data-userid="${targetUserId}"]`).forEach(btn => {
            btn.classList.toggle("following", newStatus);

            if (newStatus && user.isfollowing) {
              btn.textContent = "Peer";
            } else if (newStatus) {
              btn.textContent = "Following";
            } else {
              btn.textContent = "Follow +";
            }
          });
        } else {
          Merror("Failed to update follow status. Please try again.");
        }
      });

      item.appendChild(followButton);
    }

    container.appendChild(item);
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
