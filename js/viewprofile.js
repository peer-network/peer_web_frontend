document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const userID = params.get('user') || params.get("testid");
  const testvisibilityStatus = params.get("uservisibility");
  const urlIsReported = params.get("isreported");

  getProfile(userID).then(userprofile => {
    
    const viewProfile = document.querySelector('.view-profile');
    if(userprofile.ResponseCode=='30201' && userprofile.status=='error'){
      //No User Found;
      window.location.href = "404.php";
      return;
    }

    /*-- handling profile visibility----*/
    let visibilityStatus = userprofile.affectedRows.visibilityStatus || 'NORMAL';

   
    const hasActiveReports = userprofile.affectedRows.hasActiveReports || false;
   
    let isReportedByYou = userprofile.affectedRows.isreported;

    if (urlIsReported !== null) {
      isReportedByYou = (urlIsReported.toLowerCase() === "true");
    }

    if (isReportedByYou === true) {
      disableReportButton();
    }
    
    /*-- for testing profile report and visibility----*/  
          if(testvisibilityStatus){
            visibilityStatus = testvisibilityStatus;
          }

    /*-- End : testing profile report and visibility----*/
    if(viewProfile) {
     viewProfile.classList.add("profile_visibilty_"+visibilityStatus.toLowerCase());
    }
    if(visibilityStatus === 'ILLEGAL' || visibilityStatus === 'illegal'){
      userprofile.affectedRows.username='removed';
      userprofile.affectedRows.slug='removed';
      userprofile.affectedRows.img='svg/noname.svg';
     const reportButton = document.querySelector('.report_profile');
     reportButton.remove();
      
    } 
    if(hasActiveReports) {
      
      if (viewProfile) {
       viewProfile.classList.add('profile_has_reported');
      }
      addReportedBadge();
    }
    /*-- End : handling profile visibility----*/
    const profileInfo = document.querySelector(".profile_info");
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
          biography2.innerText = biographyText;
        })
        .catch(error => {
          console.error("Error loading biography:", error);
          biography2.innerText = "Biography not available";
        });
    } 

    /*---illegal Frame content */
      if(visibilityStatus === 'ILLEGAL' || visibilityStatus === 'illegal'){
        biography2.innerText='removed';
        profileimg.remove();
        
          
        const illegalProfileHTML = `
        <div class="illegal_profile_frame xl_font_size">
          <div class="illegal_content">
            <div class="icon_illegal"><i class="peer-icon peer-icon-illegal xxl_font_size"></i></div>
            <div class="illegal_title bold">Profile data is removed as illegal</div>
          </div>
        </div>`;
        
        profileInfo.insertAdjacentHTML("afterbegin", illegalProfileHTML);
      }

    /*---End illegal Frame content */

    /*---Hidden Account Frame */
    if(visibilityStatus === 'HIDDEN' || visibilityStatus === 'hidden'){
       
      const hiddenAccountHTML = `
        <div class="hidden_account_frame">
          <div class="hidden_content">
            <div class="hidden_header xl_font_size bold">
              <span class="hidden_icon"><i class="peer-icon peer-icon-eye-close"></i></span>
              <div class="hidden_title">Sensitive content</div>
            </div>
            <div class="hidden_description md_font_size">
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
          
          hiddenFrame.remove();
          
          if(viewProfile) {
            viewProfile.classList.remove('profile_visibilty_hidden');
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
              visibilityStatus
              hasActiveReports
              isfollowed
              isfollowing
              isreported
              amountposts
              amounttrending
              amountfollowed
              amountfollower
              amountfriends
              amountblocked
              amountreports
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