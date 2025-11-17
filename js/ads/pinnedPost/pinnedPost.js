document.addEventListener("DOMContentLoaded", () => {
  const DOM = {
    promoteBtn: document.querySelector(".promote_posts"),
    cancelBtn: document.querySelector(".promote_posts_cancel"),
    profileBox: document.querySelector(".profile_header"),
    boostPostDescription: document.querySelector(".boost_post_description"),
    listPosts: document.querySelector(".list_all_post"),
    modal: document.getElementById("boostModal"),
    adsStats: document.querySelector(".ads_container_wrap"),
    advertisePost: document.getElementById("advertisePost"),
    boostPostFromPopup: document.getElementById("boostPostFromPopup"),
    dropdownContainer: document.querySelector(".boost_adsStats_container"),
    dropdownWrapper: document.querySelector(".boost_dropdown_wrapper"),
  };

  const STATE = {
    ADPOSTPRICE: 200,
    currentStep: 1,
    postid: null,
    BALANCE: 0,
    selectedCard: null,
    adEndTime: null,
    isFromPopup: false,
  };

  (async () => {
    STATE.BALANCE = await currentliquidity("token_balance");
  })();

  function isPostBoosted(postId) {
    if (!POSTS?.listPosts?.affectedRows) return false;
    const post = POSTS.listPosts.affectedRows.find((p) => p.id === postId);
    return post?.isAd === true;
  }

  function showStep(step) {
    if (step === 3) {
      checkAdPostEligibility();
    }

    document.querySelectorAll(".modal-step").forEach((el) => {
      el.classList.remove("active");
    });

    const stepEl = document.querySelector(`.modal-step[data-step="${step}"]`);
    if (stepEl) stepEl.classList.add("active");
    STATE.currentStep = step;
  }

  function checkAdPostEligibility() {
    const adMessageEl = document.querySelector(".ad_message");
    const hasEnoughBalance = STATE.BALANCE >= STATE.ADPOSTPRICE;

    DOM.advertisePost.innerText = hasEnoughBalance ? "Pay" : "Go to profile";
    DOM.advertisePost.classList.toggle("next-btn", hasEnoughBalance);
    DOM.advertisePost.classList.toggle("goToProfile-btn", !hasEnoughBalance);

    if (adMessageEl) {
      adMessageEl.classList.toggle("error", !hasEnoughBalance);
      adMessageEl.innerText = hasEnoughBalance
        ? "All set! Your ad is ready to go - click 'Pay' to launch your ad."
        : "You don't have enough Peer Tokens to start this promotion.";
    }
  }

  function selectCardForBoosting(card, screen = 1) {
    STATE.selectedCard = card;
    STATE.postid = card.id;

    const previewBoostedPost = document.getElementById("preview_boostedPost");
    if (!previewBoostedPost) return;

    previewBoostedPost.innerHTML = "";

    const clonedCard = card.cloneNode(true);
    clonedCard.querySelectorAll("*").forEach((el) => {
      el.replaceWith(el.cloneNode(true));
    });

    const usernameEl = clonedCard.querySelector(".post-userName");
    const username = usernameEl ? usernameEl.textContent.trim() : "unknown";

    const postInhalt = clonedCard.querySelector(".post-inhalt");
    const social = clonedCard.querySelector(".social");

    if (postInhalt && social) {
      const pinnedBtn = createPinnedButton(username);
      postInhalt.insertBefore(pinnedBtn, social);
    }

    previewBoostedPost.appendChild(clonedCard);
    DOM.modal.classList.remove("none");
    showStep(screen);
  }

  function createPinnedButton(username) {
    const pinnedBtn = document.createElement("div");
    pinnedBtn.classList.add("pinedbtn");
    pinnedBtn.innerHTML = `
      <a class="btn-blue">
        <img src="svg/pin.svg" alt="pin">
        <span class="ad_username bold none">@${username}</span>
      </a>
    `;
    return pinnedBtn;
  }

  function insertPinnedButton(card, username, mode = "profile") {
    const postId = card.id || card.getAttribute("id");
    if (!isPostBoosted(postId)) return;

    card.classList.add("PINNED");
    const pinnedBtn = createPinnedButton(username);

    if (mode === "profile") {
      const postInhalt = card.querySelector(".post-inhalt");
      const social = card.querySelector(".social");

      if (postInhalt && social && !postInhalt.querySelector(".pinedbtn")) {
        postInhalt.insertBefore(pinnedBtn, social);
      }
    }

    if (mode === "post") {
      const viewpost = document.getElementById("cardClicked");
      if (!viewpost) return;

      const footer = viewpost.querySelector(".postview_footer");
      const comments = viewpost.querySelector(".post-comments");

      if (footer && comments && !footer.querySelector(".pinedbtn")) {
        comments.insertAdjacentElement("afterend", pinnedBtn);
      }
    }
  }

  async function advertisePostPinned() {
    const accessToken = getCookie("authToken");

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    const graphql = JSON.stringify({
      query: `mutation AdvertisePostPinned {
          advertisePostPinned(postid: "${STATE.postid}", advertisePlan: PINNED) {
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
      body: graphql,
    };

    try {
      const query = await fetch(GraphGL, requestOptions);
      const result = await query.json();
      const data = result.data?.advertisePostPinned;

      if (!data || data?.status === "error") {
        throw new Error(
          data?.ResponseCode
            ? userfriendlymsg(data.ResponseCode)
            : "Failed to boost post"
        );
      }

      updatePostData(data);

      if (STATE.isFromPopup) {
        await closeViewpostModal();
      }

      shiftPostToTop();
      addPinnedButtonToShiftedPost();
      updateStep4Display(data);
      showStep(4);

      STATE.BALANCE = await currentliquidity("token_balance");
    } catch (error) {
      console.error("AdvertisePostPinned failed:", error);
      alert("Failed to boost post. Please try again.");
    }
  }

  function updatePostData(data) {
    if (POSTS?.listPosts?.affectedRows) {
      const postIndex = POSTS.listPosts.affectedRows.findIndex(
        (p) => p.id === STATE.postid
      );
      if (postIndex !== -1) {
        POSTS.listPosts.affectedRows[postIndex].isAd = true;
      }
    }
    STATE.adEndTime = data.affectedRows[0]?.timeframeEnd;
  }

  async function closeViewpostModal() {
    const viewpost = document.querySelector(".viewpost");
    if (viewpost) {
      const closeBtn = viewpost.querySelector(".btClose");
      if (closeBtn) {
        closeBtn.click();
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  function shiftPostToTop() {
    const parentElement = document.getElementById("allpost");
    const cardEl = document.getElementById(STATE.postid);

    if (!parentElement || !cardEl) return;

    cardEl.classList.add("PINNED");
    parentElement.prepend(cardEl);

    const allCards = parentElement.querySelectorAll(".card");
    allCards.forEach((el) => {
      if (el.id === STATE.postid && el !== cardEl) {
        el.remove();
      }
    });
  }

  function addPinnedButtonToShiftedPost() {
    const shiftedCard = document.getElementById(STATE.postid);
    if (!shiftedCard) return;

    const usernameEl = shiftedCard.querySelector(".post-userName");
    const username = usernameEl ? usernameEl.textContent.trim() : "unknown";
    insertPinnedButton(shiftedCard, username, "profile");
  }

  function updateStep4Display(data) {
    const adPostCreatedAtTime = document.getElementById("adPostCreatedAtTime");

    if (!adPostCreatedAtTime || !data.affectedRows[0]?.timeframeEnd) return;

    const endDate = new Date(
      data.affectedRows[0].timeframeEnd.replace(" ", "T")
    );
    adPostCreatedAtTime.textContent = endDate
      .toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", " at");
  }

  function hideBoostedCards() {
    const cards = DOM.listPosts.querySelectorAll(".card.PINNED");
    cards.forEach((card) => card.classList.add("none"));
  }

  function showBoostedCards() {
    const cards = DOM.listPosts.querySelectorAll(".card.PINNED");
    cards.forEach((card) => card.classList.remove("none"));
  }

  function attachCardListeners() {
    const cards = DOM.listPosts.querySelectorAll(".card");
    cards.forEach((card) => {
      if (card.dataset.boostListenerAdded) return;

      card.addEventListener(
        "click",
        function (e) {
          if (DOM.listPosts.classList.contains("boostActive")) {
            e.stopImmediatePropagation();

            if (!isPostBoosted(card.id)) {
              selectCardForBoosting(card);
            }
          }
        },
        { capture: true }
      );

      card.dataset.boostListenerAdded = true;
    });
  }

  function setupModalEventListeners() {
    DOM.modal.addEventListener("click", function (e) {
      if (e.target.classList.contains("next-btn")) {
        handleNextButton();
      }

      if (e.target.classList.contains("back-btn")) {
        handleBackButton();
      }

      if (e.target.classList.contains("close-btn")) {
        handleCloseButton();
      }

      if (e.target.classList.contains("goToProfile-btn")) {
        handleGoToProfileButton(e);
      }

      if (e.target.classList.contains("goToPost-btn")) {
        handleGoToPostButton();
      }
    });
  }

  function handleNextButton() {
    if (STATE.currentStep === 3) {
      advertisePostPinned();
    } else {
      showStep(STATE.currentStep + 1);
    }
  }

  function handleBackButton() {
    if (STATE.currentStep > 1) {
      showStep(STATE.currentStep - 1);
    }
  }

  function handleCloseButton() {
    DOM.modal.classList.add("none");
    resetModalState();
  }

  function handleGoToProfileButton(e) {
    e.stopPropagation();
    setTimeout(() => {
      window.location.reload();
    }, 0);
  }

  function handleGoToPostButton() {
    DOM.modal.classList.add("none");
    deactivateBoostMode();

    if (!STATE.selectedCard || !isPostBoosted(STATE.selectedCard.id)) {
      resetModalState();
      return;
    }

    const usernameEl = STATE.selectedCard.querySelector(".post-userName");
    const username = usernameEl ? usernameEl.textContent.trim() : "unknown";
    const cardToClick = getCardToClick();

    if (cardToClick) {
      cardToClick.click();
      setupPostViewHandlers(cardToClick, username);
    }

    resetModalState();
  }

  function getCardToClick() {
    if (!STATE.isFromPopup) {
      return STATE.selectedCard;
    }

    const viewpost = document.querySelector(".viewpost");
    const postIdFromView =
      viewpost?.getAttribute("postid") ||
      viewpost?.dataset.postid ||
      viewpost?.id;

    if (postIdFromView) {
      const popupCard = document.getElementById(postIdFromView);
      if (popupCard) {
        return popupCard;
      }
    }

    return STATE.selectedCard;
  }

  function setupPostViewHandlers(card, username) {
    setTimeout(() => {
      insertPinnedButton(card, username, "post");

      const viewpost = document.querySelector(".viewpost");
      if (!viewpost) return;

      setupViewpostObserver(viewpost);
      setupCloseButtonHandler(viewpost);
    }, 150);
  }

  function setupViewpostObserver(viewpost) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target;
          if (
            target.classList.contains("none") ||
            target.style.display === "none"
          ) {
            window.location.reload();
          }
        }

        if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach((node) => {
            if (node === viewpost || node.contains?.(viewpost)) {
              window.location.reload();
            }
          });
        }
      });
    });

    observer.observe(viewpost, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    observer.observe(viewpost.parentElement, {
      childList: true,
    });
  }

  function setupCloseButtonHandler(viewpost) {
    const closePostBtn = viewpost.querySelector(".btClose");
    if (!closePostBtn) return;

    closePostBtn.onclick = null;

    const newCloseBtn = closePostBtn.cloneNode(true);
    closePostBtn.parentNode.replaceChild(newCloseBtn, closePostBtn);

    newCloseBtn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.reload();
      },
      { capture: true }
    );
  }

  function resetModalState() {
    STATE.currentStep = 1;
    STATE.selectedCard = null;
    STATE.postid = null;
    STATE.isFromPopup = false;

    DOM.advertisePost.innerText = "Pay";
    DOM.advertisePost.classList.add("next-btn");
    DOM.advertisePost.classList.remove("goToProfile-btn");

    const adMessageEl = document.querySelector(".ad_message");
    if (adMessageEl) {
      adMessageEl.classList.remove("error");
      adMessageEl.innerText =
        "All set! Your ad is ready to go - click 'Pay' to launch your ad.";
    }
  }

  function activateBoostMode() {
    DOM.profileBox.classList.add("boostActive");
    DOM.listPosts.classList.add("boostActive");
    DOM.cancelBtn.classList.remove("none");
    DOM.boostPostDescription.classList.remove("none");
    DOM.adsStats.classList.add("none");

    attachCardListeners();
    hideBoostedCards();
  }

  function deactivateBoostMode() {
    DOM.profileBox.classList.remove("boostActive");
    DOM.listPosts.classList.remove("boostActive");
    DOM.cancelBtn.classList.add("none");
    DOM.boostPostDescription.classList.add("none");
    DOM.adsStats.classList.remove("none");

    showBoostedCards();
  }

  function setupPromoteButtons() {
    if (DOM.promoteBtn) {
      DOM.promoteBtn.addEventListener("click", activateBoostMode);
    }

    if (DOM.cancelBtn) {
      DOM.cancelBtn.addEventListener("click", deactivateBoostMode);
    }
  }

  function setupDropdownToggle() {
    if (!DOM.dropdownContainer || !DOM.dropdownWrapper) return;

    DOM.dropdownContainer.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !expanded);
      DOM.dropdownWrapper.classList.toggle("open", !expanded);
      DOM.dropdownWrapper.hidden = expanded;
    });

    document.addEventListener("click", function (e) {
      if (
        !e.target.closest(".boost_adsStats_container") &&
        !e.target.closest(".boost_dropdown_wrapper")
      ) {
        DOM.dropdownContainer.setAttribute("aria-expanded", "false");
        DOM.dropdownWrapper.classList.remove("open");
        DOM.dropdownWrapper.hidden = true;
      }
    });
  }

  function initializePinnedButtons() {
    const cards = DOM.listPosts.querySelectorAll(".card");
    cards.forEach((card) => {
      const postId = card.id || card.getAttribute("id");
      if (!isPostBoosted(postId)) return;

      card.classList.add("PINNED");
      const usernameEl = card.querySelector(".post-userName");
      const username = usernameEl ? usernameEl.textContent.trim() : "unknown";
      insertPinnedButton(card, username, "profile");
    });
  }

  async function setupBoostFromPopup() {
    if (!DOM.boostPostFromPopup) return;
    DOM.boostPostFromPopup.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        // Ensure we're on the profile page
        const isProfilePage = !!document.querySelector(".profile_header");
        if (!isProfilePage) {
          return alert("You can only boost posts from your profile page.");
        }

        // Find the post being viewed
        const viewpost = document.querySelector(".viewpost");
        if (!viewpost) return;

        const postIdFromView =
          viewpost.getAttribute("postid") ||
          viewpost.dataset.postid ||
          viewpost.id;

        if (!postIdFromView) {
          console.warn("No post ID found in viewpost.");
          return;
        }

        // Check visibility status
        const visibilityStatus = viewpost.dataset.visibilty || viewpost.getAttribute("data-visibilty");
        let screen = 1;

        if (visibilityStatus === "NORMAL") {
          const confirmation = await warnig(
            "Your post is currently hidden",
            "Your post has been reported and is temporarily hidden. Your promotion won’t be visible for all. Do you still want to promote?",
            false,
            '<i class="peer-icon peer-icon-warning red-text"></i>',
            "Promote anyway"
          );

          if (!confirmation || confirmation.button === 0) return false;
          screen = 2;
        }

        // Locate the card in DOM
        let card =
          DOM.listPosts.querySelector(`.card[id="${postIdFromView}"]`) ||
          document.getElementById(postIdFromView);

        if (!card) {
          return alert("Could not find the original post card.");
        }

        // Prevent duplicate boosting
        if (isPostBoosted(card.id)) {
          return alert("This post is already boosted.");
        }

        // Mark state and trigger boosting
        STATE.isFromPopup = true;
        selectCardForBoosting(card, screen);
        
      } catch (error) {
        console.error("Boosting failed:", error);
        console.error("Something went wrong while boosting the post. Please try again.");
      }
    });
  }

  function initialize() {
    setupModalEventListeners();
    setupPromoteButtons();
    setupDropdownToggle();
    setupBoostFromPopup();

    if (POSTS?.listPosts?.affectedRows) {
      initializePinnedButtons();
    }

    window.insertPinnedBtn = insertPinnedButton;
  }

  initialize();
});
