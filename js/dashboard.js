// :TODO VIEWS

document.addEventListener("DOMContentLoaded", () => {
  const post_loader = document.getElementById("post_loader");
  
  // Funktion erstellen, die aufgerufen wird, wenn der Footer in den Viewport kommt
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        postsLaden();
        // console.log("Der Footer ist jetzt im Viewport sichtbar!");
      }
    });
  };
  const observerOptions = {
    root: null, // null bedeutet, dass der Viewport als root genutzt wird
    rootMargin: "0px 0px 100% 0px",
    threshold: 0.1, // 10% des Footers müssen im Viewport sein, um die Funktion auszulösen
  };

  if (post_loader) {
    console.log(post_loader)
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(post_loader);

    
    // If post_loader is already visible on load (e.g. big screen), load posts
    window.addEventListener("load", () => {
      const rect = post_loader.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        postsLaden();
      } else {
        requestAnimationFrame(ensurePostLoaderVisible); // Try again next frame
      }
    });

    // 3. Manual check on scroll (in case layout shifts after interaction)
    window.addEventListener("scroll", () => {
      const rect = post_loader.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        console.log("🖱️ Fallback load triggered (on scroll)");
        postsLaden();
      }
    }, { passive: true });

   } else {
    console.warn("⚠️ Post Loader element not found — cannot observe.");
  }
  console.log("post_loader:", post_loader);
  console.log("Loader exists:", post_loader, post_loader.getBoundingClientRect());

  // Use requestAnimationFrame to wait until the next render frame before checking visibility
  // Ensures layout is stable (e.g. images loaded, DOM settled) before trying to load posts
  // requestAnimationFrame(ensurePostLoaderVisible);

  const titleInput = document.getElementById("searchTitle");
  const tagInput = document.getElementById("searchTag");
  const userInput = document.getElementById("searchUser");
  const lupe = document.querySelector(".lupe");
  const avatar = "https://media.getpeer.eu";
  
  // Function to search for users via GraphQL
  async function searchUsers(username) {
    // let users
    const accessToken = getCookie("authToken");

    const query = `
      query SearchUser {
        searchUser(username: "${username}", offset: 0, limit: 20) {
          status
          counter
          ResponseCode
          affectedRows {
            id
            username
            slug
            img
            biography
          }
        }
      }
    `;

    try {
      const response = await fetch(GraphGL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ query })
      });

      // userInput.addEventListener("focus", async () => {
      //   const json = await response.json();
      //   users = json?.data?.searchUser?.affectedRows || [];
      //   const dropdown = document.getElementById("userDropdown");

      //   dropdown.innerHTML = "";
      //   dropdown.style.display = users.length ? "block" : "none";

      //   users.forEach(user => {
      //     const item = document.createElement("div");
      //     item.className = "dropdown-item";
      //     item.innerHTML = `<img src="${avatar}/${user.img}"> ${user.username}`;
      //     item.addEventListener("click", () => {
      //       loadUserProfile(user.username);
      //       dropdown.style.display = "none";
      //     });
      //     dropdown.appendChild(item);
      //   });
      // });


      const json = await response.json();
      const users = json?.data?.searchUser?.affectedRows || [];

      const dropdown = document.getElementById("userDropdown");
      dropdown.innerHTML = "";
      if (users.length) {
        dropdown.classList.remove("none");
      } else {
        dropdown.classList.add("none");
      }

      users.forEach(user => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.innerHTML = `<img src="${avatar}/${user.img}"> ${user.username}`;
        
        const img = item.querySelector("img");
        img.onerror = function () {
          this.src = "svg/noname.svg";
        };

        item.addEventListener("click", () => {
          window.location.href = `view-profile.php?user=${user.id}`;
          dropdown.classList.add("none");
        });
        dropdown.appendChild(item);
      });

      return users;
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }

   
  }
  

  

   //Function to search for tags via GraphQL
   async function listTags() {
     const accessToken = getCookie("authToken");
     const query = `
       query ListTags {
         listTags(offset: 0, limit: 20) {
           status
           counter
           ResponseCode
           affectedRows {
             name
           }
         }
       }
     `;

     try {
       const response = await fetch(GraphGL, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${accessToken}`
         },
         body: JSON.stringify({ query })
       });

       const json = await response.json();
       console.log("Tag search result:", json);
       console.log()
       return json?.data?.listTags?.affectedRows || [];
     } catch (error) {
       console.error("Error listing tags:", error);
       return [];
     }
   }

  


  if (tagInput) {
    tagInput.addEventListener("input", () => {
      let query = tagInput.value.trim();
      // console.log("Input query:", query);
      if (query.startsWith("#")) {
        query = query.slice(1);
      }
      if (query.length > 0) {
        searchTags(query);
      }
    });
  }

  async function searchTags(tagName) {
    const accessToken = getCookie("authToken");
    //console.log("Tag search result:", tagName);


    const query = `
      query searchTags ($tagName: String!) {
        searchTags(tagName: $tagName, limit: 10) {
          status
          counter
          ResponseCode
          affectedRows {
            name
            
          }
        }
      }
   `;

   
    const variables = { tagName };
    try {
      const response = await fetch(GraphGL,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ query, variables })
      });

      const json = await response.json();
      const tags = json?.data?.searchTags?.affectedRows || [];
      displayTags(tags);
    } catch (error) {
      console.error("Error searching tags:", error);
    }
  }
  

  const tagDropdown = document.getElementById("tagDropdown");
  function displayTags(tags) {
    tagDropdown.innerHTML = "";

      if (!Array.isArray(tags) || tags.length === 0) {
        tagDropdown.classList.add("none");
        return;
      }else {
        tagDropdown.classList.remove("none");
      }

      tags.forEach(tag => {
        const tagItem = document.createElement("div");
        tagItem.classList = "dropdown-item";
        tagItem.textContent = `#${tag.name}`;

        tagItem.addEventListener("click", () => {
          tagInput.value = `#${tag.name}`;
          localStorage.setItem("searchTag", tag.name);
          tagDropdown.classList.add("none");
          // Calling the existing listPosts from post.js
          postsLaden();
          // getPosts(tag.name);
        });

        tagDropdown.appendChild(tagItem);
      });
  }

  // Main applyFilters function
  async function applyFilters() {
    // const titleValue = titleInput.value.trim().toLowerCase();
    const userValue = userInput.value.trim().toLowerCase();
    const tagValue = tagInput.value.trim().toLowerCase();
    //console.log(tagValue);

    if (userValue) await searchUsers(userValue);
    // if (titleValue) await searchTitles(titleValue);
    // if (tagValue) await searchTags(tagValue);

    // Optionally save local storage (optional)
    // localStorage.setItem("searchTitle", titleValue);
    // localStorage.setItem("searchTag", tagValue);
    localStorage.setItem("searchUser", userValue);
    
  }
  

  // Add input listeners
  if (userInput) {
    [ userInput].forEach((input) =>
      input.addEventListener("input", applyFilters)
    );
  }

  // Trigger on click
  if (lupe) {
    lupe.addEventListener("click", applyFilters);
  }
  const searchgroup = document.getElementById("searchGroup");
  if (searchgroup) {
    const pulldown = searchgroup.querySelectorAll(".dropdown");
      searchgroup.addEventListener("mouseleave", () => {
        pulldown.forEach((item) => {
          item.classList.add("none");
        });
      });
  }


 

});

