  document.getElementById("followers_count").addEventListener("click", () => {
    modalOverlay("followers");
  });
  document.getElementById("following_count").addEventListener("click", () => {
    modalOverlay("following");
  });

  const avatar = "https://media.getpeer.eu";
  async function modalOverlay(type) {
    const modal = document.getElementById("modalOverlay");
    modal.classList.remove("none");
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="modal-header">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
        <div class="modal-body">Loading ${type}...</div>
      </div>`;

    document.querySelector(".modal-close").addEventListener("click", () => {
      modal.classList.add("none");
    });
 
    const accessToken = getCookie("authToken");
    const query = `
      query {
        listFollowRelations{
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
    `;

    try {
      const response = await fetch(GraphGL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      const body = modal.querySelector(".modal-body");
      body.innerHTML = "";

      const users = data.data.listFollowRelations.affectedRows[type]; 

      if (!users || users.length === 0) {
        body.innerHTML = "<p>No users found.</p>";
        return;
      }

      users.forEach(user => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.innerHTML = `<div class="profilStats"><img src="${avatar}/${user.img}" alt="${user.username}" /> ${user.username}  #${user.slug}</div>`;

        const img = item.querySelector("img");
        img.onerror = function () {
          this.src = "svg/noname.svg";
        };

        const followButton = document.createElement("button");
        followButton.classList.add("follow-button");
        followButton.dataset.userid = user.id;

        if (user.isfollowed) {
          followButton.classList.add("following");
          followButton.textContent = "Following";
        } else {
          followButton.textContent = "Follow +";
        }

        followButton.addEventListener("click", async function (event) {
          event.stopPropagation();
          event.preventDefault();

          const newStatus = await toggleFollowStatus(user.id);

          if (newStatus !== null) {
            user.isfollowed = newStatus;
            followButton.textContent = newStatus ? "Following" : "Follow +";
            followButton.classList.toggle("following", newStatus);
          } else {
            alert("Failed to update follow status. Please try again.");
          }
        });

        item.appendChild(followButton);
        body.appendChild(item);
      });


    } catch (error) {
      console.error("Fetch error:", error);
      modal.querySelector(".modal-body").innerHTML = `<p>Error loading ${type}.</p>`;
    }
  }
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

        const variables = { userid };

        try {
          const response = await fetch(GraphGL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ query, variables }),
          });

          const result = await response.json();

          if (result.data && result.data.toggleUserFollowStatus) {
            return result.data.toggleUserFollowStatus.isfollowing;
          } else {
            console.error("GraphQL error:", result.errors);
            return null;
          }
        } catch (error) {
          console.error("Network error:", error);
          return null;
        }
  }