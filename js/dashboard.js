// :TODO VIEWS
document.addEventListener("DOMContentLoaded", () => {
  const post_loader = document.getElementById("post_loader");
  let observer;
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
    //console.log(post_loader)
    observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(post_loader);


    // If post_loader is already visible on load (e.g. big screen), load posts
    /* window.addEventListener("load", () => {
       const rect = post_loader.getBoundingClientRect();
       if (rect.top < window.innerHeight && rect.bottom >= 0) {
         //postsLaden();
       } else {
         requestAnimationFrame(ensurePostLoaderVisible); // Try again next frame
       }
     });*/

    // 3. Manual check on scroll (in case layout shifts after interaction)
    let lastScrollCheck = 0;

    window.addEventListener("scroll", () => {
      const now = Date.now();
      if (now - lastScrollCheck < 500) return; // Only check every 500ms
      lastScrollCheck = now;

      const rect = post_loader.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        postsLaden();
      }
    }, {
      passive: true
    });

  } else {
    console.warn(" Post Loader element not found — cannot observe.");
  }

  const titleInput = document.getElementById("searchTitle");
  if (titleInput) {
    titleInput.addEventListener("input", validateTitle);
  }


  let searchDebounceTimer = null;

  function validateTitle() {
    const searchTitle = titleInput.value.trim();

    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    if (searchTitle.length === 0 || (searchTitle.length >= 2 && searchTitle.length <= 63)) {
      searchDebounceTimer = setTimeout(() => {
        handleSearch();
      }, 300);
    }
  }

  const lupe = document.querySelector(".lupe");
  // const avatar = "https://media.getpeer.eu";

  const userInput = document.getElementById("searchUser");
  if (userInput) {
    // userInput.addEventListener("click", handleUserSearch);
    userInput.addEventListener("keyup", handleUserSearch);
    // userInput.addEventListener("focus", handleUserSearch);
    userInput.addEventListener("blur", () => {

      const parentBox = userInput.closest(".search-box");
      if (parentBox) {
        parentBox.classList.remove("active");
      }
    });


    function handleUserSearch() {
      const parentBox2 = userInput.closest(".search-box");
      const regex = /^[a-zA-Z0-9-]+$/;

      if (parentBox2) {
        parentBox2.classList.add("active");
      }

      let uquery = userInput.value.trim().toLowerCase();
      //console.log("Input uquery:", query);
      if (uquery.startsWith("@")) {
        uquery = uquery.slice(1);
      }

      // if (uquery.length > 0) {
      //   searchUsers(uquery);
      // }

      if (uquery.length < 3 || uquery.length > 23 || !/^[a-zA-Z0-9_]+$/.test(uquery)) {
        const dropdown = document.getElementById("userDropdown");
        dropdown.innerHTML = "";
        dropdown.classList.add("active");
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.innerHTML = `Username must be 3-23 chars with letters, numbers or underscores.`;
        dropdown.appendChild(item);
      } else {
        searchUsers(uquery);
      }
    }
  }

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
        body: JSON.stringify({
          query
        })
      });


      const json = await response.json();
      const users = json?.data?.searchUser?.affectedRows || [];

      const dropdown = document.getElementById("userDropdown");
      dropdown.innerHTML = "";
      if (users.length) {
        dropdown.classList.add("active");
      } else {
        dropdown.classList.add("active");
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.innerHTML = 'No users found. Try different search terms.';
        dropdown.appendChild(item);
      }

      users.forEach(user => {
        const userimg = user.img ? tempMedia(user.img.replace("media/", "")) : "svg/noname.svg";
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.innerHTML = `<img src="${userimg}"> ${user.username}`;

        const img = item.querySelector("img");
        img.onerror = function () {
          this.src = "svg/noname.svg";
        };

        item.addEventListener("click", () => {
          window.location.href = `view-profile.php?user=${user.id}`;
          dropdown.classList.remove("active");
        });
        dropdown.appendChild(item);
      });

      return users;
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }

  const tagInput = document.getElementById("searchTag");
  if (tagInput) {
    // tagInput.addEventListener("click", handleTagSearch);
    tagInput.addEventListener("keyup", handleTagSearch);
    // tagInput.addEventListener("focus", handleTagSearch);
    tagInput.addEventListener("blur", () => {

      const parentBox = tagInput.closest(".search-box");
      if (parentBox) {
        parentBox.classList.remove("active");
      }
    });


    function handleTagSearch() {
      const parentBox = tagInput.closest(".search-box");
      if (parentBox) {
        parentBox.classList.add("active");
      }

      let query = tagInput.value.trim();
      //console.log("Input query:", query);
      if (query.startsWith("#")) {
        query = query.slice(1);
      }

      // if (query.length > 0) {
      //   searchTags(query);
      // }

      // else{
      //handleSearch();
      // }

      //implement validations

      const dropdown = document.getElementById("tagDropdown");
      dropdown.innerHTML = "";
      dropdown.classList.add("active");
      const item = document.createElement("div");
      item.className = "dropdown-item";

      if (query.length < 2 || query.length > 53 || !/^[a-zA-Z]+$/.test(query)) {

        item.innerHTML = `Tag must be 2-53 chars with letters only.`; // matches regex

        //console.log('i m in if');
      } else {
        searchTags(query);
      }

      dropdown.appendChild(item);

    }
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

    const variables = {
      tagName
    };
    try {
      const response = await fetch(GraphGL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          query,
          variables
        })
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
      tagDropdown.classList.add("active");
      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.innerHTML = 'No tag found. Try different search terms.';
      tagDropdown.appendChild(item);
      return;
    } else {
      tagDropdown.classList.add("active");
    }


    tags.forEach(tag => {
      const tagItem = document.createElement("div");
      tagItem.classList = "dropdown-item";
      tagItem.textContent = `#${tag.name}`;

      tagItem.addEventListener("click", () => {
        tagInput.value = `#${tag.name}`;
        localStorage.setItem("searchTag", tag.name);
        tagDropdown.classList.add("active");
        handleSearch();

      });

      tagDropdown.appendChild(tagItem);
    });
  }

  // Main applyFilters function
  async function applyFilters() {
    // const titleValue = titleInput.value.trim().toLowerCase();
    //const userValue = userInput.value.trim().toLowerCase();
    //const tagValue = tagInput.value.trim().toLowerCase();
    //console.log(tagValue);

    //if (userValue) await searchUsers(userValue);
    // if (titleValue) await searchTitles(titleValue);
    // if (tagValue) await searchTags(tagValue);

    // Optionally save local storage (optional)
    // localStorage.setItem("searchTitle", titleValue);
    // localStorage.setItem("searchTag", tagValue);
    //localStorage.setItem("searchUser", userValue);

  }


  // Add input listeners
  /* if (userInput) {
     [ userInput].forEach((input) =>
       input.addEventListener("input", applyFilters)
     );
   }*/

  // Trigger on click
  if (lupe) {
    lupe.addEventListener("click", applyFilters);
  }
  const searchgroup = document.getElementById("searchGroup");
  if (searchgroup) {
    const pulldown = searchgroup.querySelectorAll(".dropdown");
    searchgroup.addEventListener("mouseleave", () => {
      pulldown.forEach((item) => {
        item.classList.remove("active");
      });
    });
  }

  function handleSearch() {
    try {

      // Temporarily stop the observer to prevent duplicate postsLaden call
      if (observer && post_loader) {
        observer.unobserve(post_loader);
      }


      //console.log("Calling postsLaden() from tag click...");
      const parentElement = document.getElementById("allpost"); // Das übergeordnete Element
      parentElement.innerHTML = "";
      postoffset = 0;
      //manualLoad = true;
      postsLaden(); // Check if this runs

      // tagDropdown.classList.remove("active");
      // Re-enable observer if you need infinite scroll after loading
      setTimeout(() => {
        if (observer && post_loader) {
          //observer.observe(post_loader);
        }
      }, 1000); // Delay allows DOM to update (optional)


    } catch (err) {
      console.error("Error in postsLaden():", err);
    }
  }
});