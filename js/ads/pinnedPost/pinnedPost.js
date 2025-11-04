document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const promoteBtn = document.querySelector(".promote_posts");
  const cancelBtn = document.querySelector(".promote_posts_cancel");
  const profileBox = document.querySelector(".profile_header");
  const boostPostDescription = document.querySelector(".boost_post_description");
  const listPosts = document.querySelector(".list_all_post");
  const modal = document.getElementById('boostModal');
  const adsStats = document.querySelector('.ads_container_wrap');
  const advertisePost = document.getElementById('advertisePost');
  
  const ADPOSTPRICE = 200;
  
  let currentStep = 1;
  let postid = null;
  let BALANCE = 0;
  let selectedCard = null;
  let adEndTime = null;
  let isFromPopup = false; 

  // Initialize balance
  (async () => {
    BALANCE = await currentliquidity("token_balance");
  })();

  // ----------------- Check if Post is Boosted -----------------
  function isPostBoosted(postId) {
    if (!POSTS?.listPosts?.affectedRows) return false;
    const post = POSTS.listPosts.affectedRows.find(p => p.id === postId);
    return post?.isAd === true;
  }

  // ----------------- Show Step Function -----------------
  function showStep(step) {
    if (step === 3) {
      checkAdPostEligibility();
    }
    
    document.querySelectorAll('.modal-step').forEach(el => {
      el.classList.remove('active');
    });
    
    const stepEl = document.querySelector(`.modal-step[data-step="${step}"]`);
    if (stepEl) stepEl.classList.add('active');
    currentStep = step;
  }

  // ----------------- Check Balance Eligibility -----------------
  function checkAdPostEligibility() {
    const adMessageEl = document.querySelector('.ad_message');
    
    if (BALANCE < ADPOSTPRICE) {
      advertisePost.innerText = 'Go to profile';
      advertisePost.classList.remove('next-btn');
      advertisePost.classList.add('goToProfile-btn');
      
      if (adMessageEl) {
        adMessageEl.classList.add('error');
        adMessageEl.innerText = "You don't have enough Peer Tokens to start this promotion.";
      }
    } else {
      advertisePost.innerText = 'Pay';
      advertisePost.classList.add('next-btn');
      advertisePost.classList.remove('goToProfile-btn');
      
      if (adMessageEl) {
        adMessageEl.classList.remove('error');
        adMessageEl.innerText = "All set! Your ad is ready to go - click 'Pay' to launch your ad.";
      }
    }
  }

  // ----------------- Boost Card Selection -----------------
  function selectCardForBoosting(card) {
    selectedCard = card;
    postid = card.id;
    
    const previewBoostedPost = document.getElementById("preview_boostedPost");
    if (previewBoostedPost) {
      previewBoostedPost.innerHTML = "";
      
      const clonedCard = card.cloneNode(true);
      clonedCard.querySelectorAll("*").forEach(el => {
        el.replaceWith(el.cloneNode(true));
      });
      
      const usernameEl = clonedCard.querySelector(".post-userName");
      const username = usernameEl ? usernameEl.textContent.trim() : "unknown";
      
      const postInhalt = clonedCard.querySelector(".post-inhalt");
      const social = clonedCard.querySelector(".social");
      
      if (postInhalt && social) {
        const pinnedBtn = document.createElement("div");
        pinnedBtn.classList.add("pinedbtn");
        pinnedBtn.innerHTML = `
          <a class="button btn-blue">
            <img src="svg/pin.svg" alt="pin">
            <span class="ad_username bold">@${username}</span>
          </a>
        `;
        postInhalt.insertBefore(pinnedBtn, social);
      }
      
      previewBoostedPost.appendChild(clonedCard);
    }
    
    modal.classList.remove('none');
    showStep(1);
  }

  // ----------------- Insert Pinned Button -----------------
  function insertPinnedButton(card, username, mode = "profile") {
    if (!isPostBoosted(card.id)) return;
    
    const pinnedBtn = document.createElement("div");
    pinnedBtn.classList.add("pinedbtn");
    pinnedBtn.innerHTML = `
      <a class="button btn-blue">
        <img src="svg/pin.svg" alt="pin">
        <span class="ad_username bold">@${username}</span>
      </a>
    `;

    if (mode === "profile") {
      const postInhalt = card.querySelector(".post-inhalt");
      const social = card.querySelector(".social");
      
      if (postInhalt && social && !postInhalt.querySelector(".pinedbtn")) {
        postInhalt.insertBefore(pinnedBtn, social);
      }
    } else if (mode === "post") {
      const viewpost = document.querySelector(".viewpost");
      if (!viewpost) return;
      
      const footer = viewpost.querySelector(".postview_footer");
      const comments = viewpost.querySelector(".post-comments");
      
      if (footer && comments && !footer.querySelector(".pinedbtn")) {
        comments.insertAdjacentElement("afterend", pinnedBtn);
      }
    }
  }

  // ----------------- API Call: Advertise Post -----------------
  async function advertisePostPinned() {
    const accessToken = getCookie("authToken");
    
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    const graphql = JSON.stringify({
      query: `mutation AdvertisePostPinned {
          advertisePostPinned(postid: "${postid}", advertisePlan: PINNED) {
              status
              ResponseCode
              affectedRows {
                  id
                  createdAt
                  type
                  timeframeStart
                  timeframeEnd
                  totalTokenCost
                  totalEuroCost
              }
          }
        }`,
      variables: {},
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: graphql
    };

    try {
      const query = await fetch(GraphGL, requestOptions);
      const result = await query.json();
      const data = result.data?.advertisePostPinned;
      
      if (!data || data?.status === "error") {
        throw new Error(data?.ResponseCode ? userfriendlymsg(data.ResponseCode) : "Failed to boost post");
      }
      
      if (POSTS?.listPosts?.affectedRows) {
        const postIndex = POSTS.listPosts.affectedRows.findIndex(p => p.id === postid);
        if (postIndex !== -1) {
          POSTS.listPosts.affectedRows[postIndex].isAd = true;
        }
      }
      
      adEndTime = data.affectedRows[0]?.timeframeEnd;
      shiftPostToTop(data);
      updateStep4Display(data);
      showStep(4);
      
      BALANCE = await currentliquidity("token_balance");
      
    } catch (error) {
      console.error("AdvertisePostPinned failed:", error);
      alert("Failed to boost post. Please try again.");
    }
  }

  // ----------------- Shift Post to Top -----------------
  function shiftPostToTop(data) {
    const parentElement = document.getElementById("allpost");
    const cardEl = document.getElementById(postid);
    
    if (parentElement && cardEl) {
      parentElement.prepend(cardEl);
      
      const allCards = parentElement.querySelectorAll('.card');
      allCards.forEach((el) => {
        if (el.id === postid && el !== cardEl) {
          el.remove();
        }
      });
    }
  }

  // ----------------- Update Step 4 Display -----------------
  function updateStep4Display(data) {
    const adPostCreatedAtTime = document.getElementById("adPostCreatedAtTime");
    
    if (adPostCreatedAtTime && data.affectedRows[0]?.timeframeEnd) {
      const endDate = new Date(data.affectedRows[0].timeframeEnd.replace(" ", "T"));
      adPostCreatedAtTime.textContent = endDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).replace(",", " at");
    }
  }

  // ----------------- Filter Boosted Cards -----------------
  function hideBoostedCards() {
    const cards = listPosts.querySelectorAll(".card");
    cards.forEach(card => {
      if (isPostBoosted(card.id)) {
        card.classList.add('none');
      }
    });
  }

  function showBoostedCards() {
    const cards = listPosts.querySelectorAll(".card");
    cards.forEach(card => {
      if (isPostBoosted(card.id)) {
        card.classList.remove('none');
      }
    });
  }

  // ----------------- Attach Card Click Listeners -----------------
  function attachCardListeners() {
    const cards = listPosts.querySelectorAll(".card");
    cards.forEach(card => {
      if (!card.dataset.boostListenerAdded) {
        card.addEventListener("click", function (e) {
          if (listPosts.classList.contains("boostActive")) {
            e.stopImmediatePropagation();
            
            if (!isPostBoosted(card.id)) {
              selectCardForBoosting(card);
            }
          }
        }, { capture: true });
        
        card.dataset.boostListenerAdded = true;
      }
    });
  }

  // ----------------- Modal Event Handlers -----------------
  modal.addEventListener('click', function (e) {
    if (e.target.classList.contains('next-btn')) {
      if (currentStep === 3) {
        advertisePostPinned();
      } else {
        showStep(currentStep + 1);
      }
    }
    
    if (e.target.classList.contains('back-btn')) {
      if (currentStep > 1) showStep(currentStep - 1);
    }
    
    if (e.target.classList.contains('close-btn')) {
      modal.classList.add('none');
      if (isFromPopup && selectedCard) {
        setTimeout(() => {
          selectedCard.click();
        }, 100);
      }
      resetModalState();
    }
    
    // ========== STEP 4: Go to Profile Button ==========
    if (e.target.classList.contains('goToProfile-btn')) {
      modal.classList.add('none');
      deactivateBoostMode();
      
      if (selectedCard && isPostBoosted(selectedCard.id)) {
        const usernameEl = selectedCard.querySelector(".post-userName");
        const username = usernameEl ? usernameEl.textContent.trim() : "unknown";
        insertPinnedButton(selectedCard, username, "profile");
      }
      
      resetModalState();
    }
    
    // ========== STEP 4: Go to Post Button ==========
    if (e.target.classList.contains('goToPost-btn')) {
      modal.classList.add('none');
      deactivateBoostMode();
      
      if (selectedCard && isPostBoosted(selectedCard.id)) {
        const usernameEl = selectedCard.querySelector(".post-userName");
        const username = usernameEl ? usernameEl.textContent.trim() : "unknown";
        
        insertPinnedButton(selectedCard, username, "profile");
        insertPinnedButton(selectedCard, username, "post");
        
        selectedCard.click();
      }
      
      resetModalState();
    }
    
    if (e.target === modal) {
      modal.classList.add('none');
      if (isFromPopup && selectedCard) {
        setTimeout(() => {
          selectedCard.click();
        }, 100);
      }
      resetModalState();
    }
  });

  // ----------------- Reset Modal State -----------------
  function resetModalState() {
    currentStep = 1;
    selectedCard = null;
    postid = null;
    isFromPopup = false; 
    
    advertisePost.innerText = 'Pay';
    advertisePost.classList.add('next-btn');
    advertisePost.classList.remove('goToProfile-btn');
    
    const adMessageEl = document.querySelector('.ad_message');
    if (adMessageEl) {
      adMessageEl.classList.remove('error');
      adMessageEl.innerText = "All set! Your ad is ready to go - click 'Pay' to launch your ad.";
    }
  }

  // ----------------- Activate Boost Mode -----------------
  function activateBoostMode() {
    profileBox.classList.add("boostActive");
    listPosts.classList.add("boostActive");
    cancelBtn.classList.remove("none");
    boostPostDescription.classList.remove("none");
    adsStats.classList.add('none');
    
    attachCardListeners();
    hideBoostedCards();
  }

  // ----------------- Deactivate Boost Mode -----------------
  function deactivateBoostMode() {
    profileBox.classList.remove("boostActive");
    listPosts.classList.remove("boostActive");
    cancelBtn.classList.add("none");
    boostPostDescription.classList.add("none");
    adsStats.classList.remove('none');
    
    showBoostedCards();
  }

  // ----------------- Promote / Cancel Button Handlers -----------------
  if (promoteBtn) {
    promoteBtn.addEventListener("click", activateBoostMode);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", deactivateBoostMode);
  }

  // ----------------- Dropdown Toggle -----------------
  const container = document.querySelector('.boost_adsStats_container');
  const dropdownWrapper = document.querySelector('.boost_dropdown_wrapper');

  if (container && dropdownWrapper) {
    container.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      dropdownWrapper.classList.toggle('open', !expanded);
      dropdownWrapper.hidden = expanded;
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.boost_adsStats_container') && 
          !e.target.closest('.boost_dropdown_wrapper')) {
        container.setAttribute('aria-expanded', 'false');
        dropdownWrapper.classList.remove('open');
        dropdownWrapper.hidden = true;
      }
    });
  }

  // ----------------- Initialize Pinned Buttons on Load -----------------
  function initializePinnedButtons() {
    const cards = listPosts.querySelectorAll(".card");
    cards.forEach(card => {
      if (isPostBoosted(card.id)) {
        const usernameEl = card.querySelector(".post-userName");
        const username = usernameEl ? usernameEl.textContent.trim() : "unknown";
        insertPinnedButton(card, username, "profile");
      }
    });
  }

  if (POSTS?.listPosts?.affectedRows) {
    initializePinnedButtons();
  }

  // ----------------- Boost Post From Popup -----------------
  const boostPostFromPopup = document.getElementById('boostPostFromPopup');

  if (boostPostFromPopup) {
    boostPostFromPopup.addEventListener('click', function(e) {
      e.preventDefault();
      
      const isProfilePage = document.querySelector('.profile_header') !== null;
      if (!isProfilePage) {
        alert("You can only boost posts from your profile page.");
        return;
      }
      
      const viewpost = document.querySelector('.viewpost');
      if (!viewpost) {
        return;
      }
      
      const postIdFromView = viewpost.getAttribute('postid') || viewpost.dataset.postid || viewpost.id;
      if (!postIdFromView) {
        return;
      }
      
      let card = listPosts.querySelector(`.card[id="${postIdFromView}"]`);
      
      if (!card) {
        card = document.getElementById(postIdFromView);
        
        if (!card) {
          alert("Could not find the original post card.");
          return;
        }
      }
      
      if (isPostBoosted(card.id)) {
        alert("This post is already boosted.");
        return;
      }
      
      isFromPopup = true;
      selectCardForBoosting(card);
    });
  }

  // ----------------- Global Functions -----------------
  window.insertPinnedBtn = insertPinnedButton;
  
});