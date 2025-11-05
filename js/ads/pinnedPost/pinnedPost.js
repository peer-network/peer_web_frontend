// =========================
// Boost Post / Promote Post Feature
// =========================

document.addEventListener("DOMContentLoaded", async () => {

  // ---------- GLOBALS ----------
  const ADPOSTPRICE = 200;

  let BALANCE = 0;
  let currentStep = 1;
  let postid = null;
  let selectedCard = null;
  let adEndTime = null;
  let isFromPopup = false;

  // ---------- DOM ELEMENTS ----------
  const promoteBtn = document.querySelector(".promote_posts");
  const cancelBtn = document.querySelector(".promote_posts_cancel");
  const profileBox = document.querySelector(".profile_header");
  const boostPostDescription = document.querySelector(".boost_post_description");
  const listPosts = document.querySelector(".list_all_post");
  const modal = document.getElementById("boostModal");
  const adsStats = document.querySelector(".ads_container_wrap");
  const advertisePost = document.getElementById("advertisePost");
  const container = document.querySelector(".boost_adsStats_container");
  const dropdownWrapper = document.querySelector(".boost_dropdown_wrapper");
  const boostPostFromPopup = document.getElementById("boostPostFromPopup");

  if (!listPosts || !modal || !promoteBtn) {
    console.warn("Boost script: Required DOM elements not found, aborting.");
    return;
  }

  // ---------- INIT BALANCE ----------
  try {
    BALANCE = await currentliquidity("token_balance");
  } catch (err) {
    console.error("Failed to fetch token balance:", err);
  }

  // =========================
  // HELPERS
  // =========================

  function getUsernameFromCard(card) {
    const usernameEl = card.querySelector(".post-userName");
    return usernameEl ? usernameEl.textContent.trim() : "unknown";
  }

  function isPostBoosted(postId) {
    if (!POSTS?.listPosts?.affectedRows) return false;
    const post = POSTS.listPosts.affectedRows.find(p => p.id === postId);
    return post?.isAd === true;
  }

  // =========================
  // UI FUNCTIONS
  // =========================

  function showStep(step) {
    document.querySelectorAll(".modal-step").forEach(el => el.classList.remove("active"));
    const stepEl = document.querySelector(`.modal-step[data-step="${step}"]`);
    if (stepEl) stepEl.classList.add("active");
    currentStep = step;

    if (step === 3) checkAdPostEligibility();
  }

  function checkAdPostEligibility() {
    const adMessageEl = document.querySelector(".ad_message");

    const hasEnough = BALANCE >= ADPOSTPRICE;
    advertisePost.innerText = hasEnough ? "Pay" : "Go to profile";
    advertisePost.classList.toggle("next-btn", hasEnough);
    advertisePost.classList.toggle("goToProfile-btn", !hasEnough);

    if (adMessageEl) {
      adMessageEl.classList.toggle("error", !hasEnough);
      adMessageEl.innerText = hasEnough
        ? "All set! Your ad is ready to go - click 'Pay' to launch your ad."
        : "You don't have enough Peer Tokens to start this promotion.";
    }
  }

  function resetModalState() {
    currentStep = 1;
    selectedCard = null;
    postid = null;
    isFromPopup = false;

    advertisePost.innerText = "Pay";
    advertisePost.classList.add("next-btn");
    advertisePost.classList.remove("goToProfile-btn");

    const adMessageEl = document.querySelector(".ad_message");
    if (adMessageEl) {
      adMessageEl.classList.remove("error");
      adMessageEl.innerText = "All set! Your ad is ready to go - click 'Pay' to launch your ad.";
    }
  }

  function activateBoostMode() {
    profileBox?.classList.add("boostActive");
    listPosts.classList.add("boostActive");
    cancelBtn?.classList.remove("none");
    boostPostDescription?.classList.remove("none");
    adsStats?.classList.add("none");

    attachCardListeners();
    hideBoostedCards();
  }

  function deactivateBoostMode() {
    profileBox?.classList.remove("boostActive");
    listPosts.classList.remove("boostActive");
    cancelBtn?.classList.add("none");
    boostPostDescription?.classList.add("none");
    adsStats?.classList.remove("none");

    showBoostedCards();
  }

  // =========================
  // CARD / POST FUNCTIONS
  // =========================

  function selectCardForBoosting(card) {
    selectedCard = card;
    postid = card.id;

    const previewBoostedPost = document.getElementById("preview_boostedPost");
    if (previewBoostedPost) {
      previewBoostedPost.innerHTML = "";

      const clonedCard = card.cloneNode(true);
      const username = getUsernameFromCard(card);

      const postInhalt = clonedCard.querySelector(".post-inhalt");
      const social = clonedCard.querySelector(".social");

      if (postInhalt && social) {
        const pinnedBtn = document.createElement("div");
        pinnedBtn.classList.add("pinedbtn");
        pinnedBtn.innerHTML = `
          <a class="button btn-blue">
            <img src="svg/pin.svg" alt="pin">
            <span class="ad_username bold">@${username}</span>
          </a>`;
        postInhalt.insertBefore(pinnedBtn, social);
      }

      previewBoostedPost.appendChild(clonedCard);
    }

    modal.classList.remove("none");
    showStep(1);
  }

  function insertPinnedButton(card, username, mode = "profile") {
    const postId = card.id || card.getAttribute("id");
    if (!isPostBoosted(postId)) return;

    card.classList.add("PINNED");
    const pinnedBtn = document.createElement("div");
    pinnedBtn.classList.add("pinedbtn");
    pinnedBtn.innerHTML = `
      <a class="button btn-blue">
        <img src="svg/pin.svg" alt="pin">
        <span class="ad_username bold">@${username}</span>
      </a>`;

    if (mode === "profile") {
      const postInhalt = card.querySelector(".post-inhalt");
      const social = card.querySelector(".social");
      if (postInhalt && social && !postInhalt.querySelector(".pinedbtn")) {
        postInhalt.insertBefore(pinnedBtn, social);
      }
    }
  }

  function hideBoostedCards() {
    listPosts?.querySelectorAll(".card.PINNED").forEach(c => c.classList.add("none"));
  }

  function showBoostedCards() {
    listPosts?.querySelectorAll(".card.PINNED").forEach(c => c.classList.remove("none"));
  }

  function attachCardListeners() {
    if (!listPosts) return;
    listPosts.querySelectorAll(".card").forEach(card => {
      if (!card.dataset.boostListenerAdded) {
        card.addEventListener("click", e => {
          if (listPosts.classList.contains("boostActive")) {
            e.stopImmediatePropagation();
            if (!isPostBoosted(card.id)) selectCardForBoosting(card);
          }
        }, { capture: true });
        card.dataset.boostListenerAdded = true;
      }
    });
  }

  // =========================
  // API CALL
  // =========================

  async function advertisePostPinned() {
    const accessToken = getCookie("authToken");
    if (!accessToken || !postid) {
      console.error("Missing auth or postid");
      return;
    }

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    const body = JSON.stringify({
      query: `mutation AdvertisePostPinned {
        advertisePostPinned(postid: "${postid}", advertisePlan: PINNED) {
          status
          ResponseCode
          affectedRows { id timeframeEnd }
        }
      }`,
    });

    try {
      const response = await fetch(GraphGL, { method: "POST", headers, body });
      const result = await response.json();
      const data = result.data?.advertisePostPinned;

      if (!data || data.status === "error") {
        throw new Error(userfriendlymsg(data?.ResponseCode) || "Failed to boost post");
      }

      const targetPost = POSTS?.listPosts?.affectedRows?.find(p => p.id === postid);
      if (targetPost) targetPost.isAd = true;

      adEndTime = data.affectedRows[0]?.timeframeEnd;
      shiftPostToTop();
      updateStep4Display(adEndTime);
      showStep(4);

      BALANCE = await currentliquidity("token_balance");

    } catch (err) {
      console.error("AdvertisePostPinned failed:", err);
      alert("Failed to boost post. Please try again.");
    }
  }

  function shiftPostToTop() {
    const parent = document.getElementById("allpost");
    const card = document.getElementById(postid);
    if (parent && card) {
      card.classList.add("PINNED");
      parent.prepend(card);
    }
  }

  function updateStep4Display(endTime) {
    const adPostCreatedAtTime = document.getElementById("adPostCreatedAtTime");
    if (!adPostCreatedAtTime || !endTime) return;

    const endDate = new Date(endTime.replace(" ", "T"));
    adPostCreatedAtTime.textContent = endDate.toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).replace(",", " at");
  }

  // =========================
  // EVENT HANDLERS
  // =========================

  // Promote / Cancel
  promoteBtn.addEventListener("click", activateBoostMode);
  cancelBtn?.addEventListener("click", deactivateBoostMode);

  // Modal Buttons
  modal.addEventListener("click", e => {
    const t = e.target;

    if (t.classList.contains("next-btn")) {
      return currentStep === 3 ? advertisePostPinned() : showStep(currentStep + 1);
    }
    if (t.classList.contains("back-btn") && currentStep > 1) return showStep(currentStep - 1);
    if (t.classList.contains("close-btn") || t === modal) {
      modal.classList.add("none");
      resetModalState();
      return;
    }
    if (t.classList.contains("goToProfile-btn")) {
      modal.classList.add("none");
      deactivateBoostMode();
      if (selectedCard && isPostBoosted(selectedCard.id)) {
        insertPinnedButton(selectedCard, getUsernameFromCard(selectedCard), "profile");
      }
      resetModalState();
    }
  });

  // Dropdown toggle
  if (container && dropdownWrapper) {
    container.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !expanded);
      dropdownWrapper.classList.toggle("open", !expanded);
      dropdownWrapper.hidden = expanded;
    });

    document.addEventListener("click", e => {
      if (!e.target.closest(".boost_adsStats_container") &&
          !e.target.closest(".boost_dropdown_wrapper")) {
        container.setAttribute("aria-expanded", "false");
        dropdownWrapper.classList.remove("open");
        dropdownWrapper.hidden = true;
      }
    });
  }

  // Boost Post from Popup
  if (boostPostFromPopup) {
    boostPostFromPopup.addEventListener("click", e => {
      e.preventDefault();
      if (!document.querySelector(".profile_header")) {
        alert("You can only boost posts from your profile page.");
        return;
      }

      const viewpost = document.querySelector(".viewpost");
      const postIdFromView = viewpost?.getAttribute("postid") || viewpost?.id;
      const card = listPosts.querySelector(`.card[id="${postIdFromView}"]`);

      if (!card) {
        alert("Could not find the original post card.");
        return;
      }
      if (isPostBoosted(card.id)) {
        alert("This post is already boosted.");
        return;
      }

      isFromPopup = true;
      selectCardForBoosting(card);
    });
  }

  // Initialize pinned buttons
  if (POSTS?.listPosts?.affectedRows) {
    listPosts.querySelectorAll(".card").forEach(card => {
      const postId = card.id || card.getAttribute("id");
      if (isPostBoosted(postId)) {
        card.classList.add("PINNED");
        insertPinnedButton(card, getUsernameFromCard(card), "profile");
      }
    });
  }

  // Global export
  window.insertPinnedBtn = insertPinnedButton;

});
