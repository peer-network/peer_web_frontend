document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  // const userID = params.get('user');

  /*-- for testing profile report and visibility----*/
  const testUserId = params.get("testid");
  const userID = testUserId || params.get('user');
  
  const AccountVisibilityStatus = {
    NORMAL: "NORMAL",
    HIDDEN: "HIDDEN",
    ILLEGAL: "ILLEGAL"
  };
  /*-- End : testing profile report and visibility----*/

  getProfile(userID).then(userprofile => {
    
    if(userprofile.ResponseCode=='30201' && userprofile.status=='error'){
      //No User Found;
      window.location.href = "404.php";
      return;
    }

    /*-- for testing profile report and visibility----*/
    userprofile.affectedRows.visibilityStatus = AccountVisibilityStatus.NORMAL;
    
    if(testUserId){
      userprofile.affectedRows.visibilityStatus = AccountVisibilityStatus.HIDDEN;
      
      userprofile.affectedRows.originalData = {
        username: userprofile.affectedRows.username,
        slug: userprofile.affectedRows.slug,
        img: userprofile.affectedRows.img,
        biography: userprofile.affectedRows.biography
      };
    
      const viewProfile = document.querySelector('.view-profile');
      if(viewProfile) {
        viewProfile.classList.add("visibility_hidden");
      }
    }
    /*-- End : testing profile report and visibility----*/

    const profileimg = document.getElementById("profilbild2");
    const username2 = document.getElementById("username2");
    const slug2 = document.getElementById("slug2");
    const following2 = document.getElementById("following2");
    const followers2 = document.getElementById("followers2");
    const Peers2 = document.getElementById("Peers2");
    const userPosts2 = document.getElementById("userPosts2");
    const biography2 = document.getElementById("biography2");
    const bioPath2 = userprofile.affectedRows.biography;
    
    // Get follow states
    const isfollowed = userprofile.affectedRows.isfollowed;
    const isfollowing = userprofile.affectedRows.isfollowing;
    
    // Initialize follow button with proper state
    const followBtn = document.getElementById("followbtn");
    if (followBtn) {
      // Store state in data attributes
      followBtn.dataset.isfollowing = isfollowing;
      
      // Set initial button state using the centralized function
      updateFollowButtonState(followBtn, isfollowing, isfollowed);
      
      // Set up event listener
      followBtn.addEventListener("click", async function () {
        const user = {
          id: userID,
          isfollowed: this.classList.contains("following") || this.classList.contains("Peer"),
          isfollowing: this.dataset.isfollowing === "true"
        };
        
        await handleFollowButtonClick(this, user);
        
        // Update the stored state after successful toggle
        this.dataset.isfollowing = user.isfollowed;
      });
    }

    profileimg.onerror = function () {
      this.src = "svg/noname.svg";
    };
    profileimg.src = userprofile.affectedRows.img ? tempMedia(userprofile.affectedRows.img.replace("media/", "")) : "svg/noname.svg";

    if(username2){
      username2.innerText=userprofile.affectedRows.username;
    }
    if(slug2){
      slug2.innerText= "#" +userprofile.affectedRows.slug;
    }
    if(userPosts2){
      userPosts2.innerText= userprofile.affectedRows.amountposts;
    }
    if(following2){
      following2.innerText= userprofile.affectedRows.amountfollowed;
    }
    if(followers2){
      followers2.innerText= userprofile.affectedRows.amountfollower;
    }
    if(Peers2){
      Peers2.innerText= userprofile.affectedRows.amountfriends;
    }


    // Check if bioPath is valid
    if (bioPath2 && biography2) {
      const fullPath2 = tempMedia(userprofile.affectedRows.biography);


      fetch(fullPath2, { cache: "no-store" })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch biography text file");
          }
          return response.text();
        })
        .then(biographyText => {
          document.getElementById("biography2").innerText = biographyText;
        })
        .catch(error => {
          console.error("Error loading biography:", error);
          document.getElementById("biography2").innerText = "Biography not available";
        });
    } 

    /*---Hidden Account Frame */
    if(userprofile.affectedRows.visibilityStatus == 'HIDDEN' || userprofile.affectedRows.visibilityStatus == 'hidden'){
      
      const profileInfo = document.querySelector(".profile_info");
      
      const hiddenAccountHTML = `
        <div class="hidden_account_frame">
          <div class="hidden_content">
            <div class="hidden_header">
              <i class="peer-icon peer-icon-eye-close"></i>
              <div class="hidden_title md_font_size bold">Sensitive content</div>
            </div>
            <div class="hidden_description">
              This content may be sensitive or abusive.<br>
              Do you want to view it anyway?
            </div>
          </div>
          <div class="view_content">
            <a href="#" class="button btn-transparent">View content</a>
          </div>
        </div>
      `;

      profileInfo.insertAdjacentHTML("afterbegin", hiddenAccountHTML);
      
      const hiddenFrame = profileInfo.querySelector(".hidden_account_frame");
      const viewBtn = hiddenFrame.querySelector(".view_content a");
      
      if (viewBtn) {
        viewBtn.addEventListener("click", (e) => {
          e.preventDefault();
          
          if(userprofile.affectedRows.originalData) {
            const original = userprofile.affectedRows.originalData;
            
            if(username2) {
              username2.innerText = original.username;
            }
            if(slug2) {
              slug2.innerText = "#" + original.slug;
            }
            if(profileimg) {
              profileimg.src = original.img ? tempMedia(original.img.replace("media/", "")) : "svg/noname.svg";
            }
            
            if(original.biography && biography2) {
              const fullPath2 = tempMedia(original.biography);
              fetch(fullPath2, { cache: "no-store" })
                .then(response => response.text())
                .then(biographyText => {
                  biography2.innerText = biographyText;
                })
                .catch(error => {
                  console.error("Error loading biography:", error);
                  biography2.innerText = "Biography not available";
                });
            }
          }
          
          hiddenFrame.remove();
          const viewProfile = document.querySelector('.view-profile');
          if(viewProfile) {
            viewProfile.classList.remove('visibility_hidden');
          }
        });
      }
    }
    /*---End Hidden Account Frame */
  });
  
  const post_loader = document.getElementById("post_loader");
  
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        postsLaden(userID);
      }
    });
  };
  
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px 100% 0px",
    threshold: 0.1,
  };

  if (post_loader) {
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(post_loader);
  } else {
    console.warn("⚠️ Post Loader element not found — cannot observe.");
  }

  async function getProfile(userID) {
    const accessToken = getCookie("authToken");

    const query = `
      query GetProfile {
        getProfile (userid: "${userID}") {
          status
          ResponseCode
          affectedRows {
              id
              username
              status
              slug
              img
              biography
              isfollowed
              isfollowing
              amountposts
              amounttrending
              amountfollowed
              amountfollower
              amountfriends
              amountblocked
          }
        }
      }
    `;

    try {
      const response = await fetch(GraphGL,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ query })
      });

      const json = await response.json();
      return json?.data?.getProfile || null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  const button = document.querySelector('.moreActions_container');
  const dropdown = document.querySelector('.moreActions_wrapper');

  function toggleDropdown() {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      button.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('open');
      dropdown.setAttribute('hidden', '');
    } else {
      button.setAttribute('aria-expanded', 'true');
      dropdown.classList.toggle('open');
      dropdown.hidden = isExpanded;
    }
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.moreActions_container_wrap')) {
      button.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('open');
      dropdown.setAttribute('hidden', '');
    }
  });

  button.addEventListener('click', toggleDropdown);

});