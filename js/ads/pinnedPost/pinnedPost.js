document.addEventListener("DOMContentLoaded", () => {
  // function for the boost post posts button & cancel boost post button
  const promoteBtn = document.querySelector(".promote_posts");
  const cancelBtn = document.querySelector(".promote_posts_cancel");
  const profileBox = document.querySelector(".profile_header");
  const boostPostDescription = document.querySelector(".boost_post_description");
  const listPosts = document.querySelector(".list_all_post");
  const modal = document.getElementById('boostModal');
  const adsStats = document.querySelector('.ads_container_wrap');
  const advertisePost = document.getElementById('advertisePost');
  let currentStep = 1;
  let postid = null;

  // ----------------- Show Step Function -----------------
  function showStep(step) {
    document.querySelectorAll('.modal-step').forEach(el => {
      el.classList.remove('active');
    });
    const stepEl = document.querySelector(`.modal-step[data-step="${step}"]`);
    if (stepEl) stepEl.classList.add('active');
    currentStep = step;
  }

  // ----------------- Boost Card Click -----------------
  function boostCardClick(card) {
    window.lastBoostedCard = card;
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
        pinnedBtn.innerHTML = `<a class="button btn-blue"> <img src="svg/pin.svg" alt="pin"> <span class="ad_username bold">@${username}</span> <span class="ad_duration txt-color-gray">00:00</span></a>`;
        postInhalt.insertBefore(pinnedBtn, social);
      }

      previewBoostedPost.appendChild(clonedCard);
    }
 
    modal.classList.remove('none');
    showStep(1);
  }

  showStep(3);
  currentliquidity("token_balance");


  // ----------------- Insert Pinned Button in Opened Post -----------------
  function insertPinnedBtnToOpenedPost(card, username, mode = "post") {
    const viewpost = document.querySelector(".viewpost");
    if (!viewpost) return;

    const pinnedBtn = document.createElement("div");
    pinnedBtn.classList.add("pinedbtn");
    pinnedBtn.innerHTML = `
      <a class="button btn-blue">
        <img src="svg/pin.svg" alt="pin">
        <span class="ad_username bold">@${username}</span>
        <span class="ad_duration txt-color-gray">23h</span>
      </a>
    `;

    const footer = viewpost.querySelector(".postview_footer");
    const comments = viewpost.querySelector(".post-comments");
    const postInhalt = card.querySelector(".post-inhalt");
    const social = card.querySelector(".social");

    if (!footer || footer.querySelector(".pinedbtn")) return;

    if (mode === "post") {
      if (footer && comments) {
        comments.insertAdjacentElement("afterend", pinnedBtn);
      }
    }

    if (mode === "profile") {
      if (postInhalt && social) {
        postInhalt.insertBefore(pinnedBtn, social);
      }
    }
  }

  // ----------------- Mark Card as Boosted -----------------
  // function markCardAsBoosted(card) {
  //   console.log('inside markCardAsBoosted')
  //   card.classList.add("boosted");

  //   // Wrap card content in front/back container if not already wrapped
  //   if (!card.querySelector(".post-card-inner")) {
  //     const inner = document.createElement("div");
  //     inner.classList.add("post-card-inner");

  //     const front = document.createElement("div");
  //     front.classList.add("post-card-front");
  //     front.append(...Array.from(card.childNodes));

  //     const back = document.createElement("div");
  //     back.classList.add("post-card-back", "bold", "xl_font_size");
  //     back.textContent = "This Post has already been boosted";

  //     inner.appendChild(front);
  //     inner.appendChild(back);
  //     card.appendChild(inner);
  //   }
  // }

  // ----------------- Modal Buttons -----------------
  modal.addEventListener('click', function (e) {
    if (e.target.classList.contains('next-btn')) {
      showStep(currentStep + 1);
    }
    if (e.target.classList.contains('back-btn')) {
      if (currentStep > 1) showStep(currentStep - 1);
    }
    if (e.target.classList.contains('close-btn')) {
      modal.classList.add('none');
    }

    if (e.target.classList.contains('goToProfile-btn')) {
      profileBox.classList.remove('boostActive');
      listPosts.classList.remove('boostActive');
      cancelBtn.classList.add("none");
      boostPostDescription.classList.add("none");
      modal.classList.add('none');

      if (window.lastBoostedCard) {
        const usernameEl = window.lastBoostedCard.querySelector(".post-userName");
        const username = usernameEl ? usernameEl.textContent.trim() : "unknown";

        insertPinnedBtn(window.lastBoostedCard, username, "profile");
        // markCardAsBoosted(window.lastBoostedCard);
      }
    }

    if (e.target.classList.contains('goToPost-btn')) {
      profileBox.classList.remove('boostActive');
      listPosts.classList.remove('boostActive');
      modal.classList.add('none');
      cancelBtn.classList.add("none");
      boostPostDescription.classList.add("none");

      if (window.lastBoostedCard) {
        const usernameEl = window.lastBoostedCard.querySelector(".post-userName");
        const username = usernameEl ? usernameEl.textContent.trim() : "unknown";

        insertPinnedBtn(window.lastBoostedCard, username, "profile");
        // markCardAsBoosted(window.lastBoostedCard);

        window.lastBoostedCard.click();
        insertPinnedBtnToOpenedPost(window.lastBoostedCard, username, "post"); // the called function was already commented out
      }
    }

    if (e.target === modal) {
      modal.classList.add('none');
    }
  });

  function hideAdCards() {
    const cards = listPosts.querySelectorAll(".card");
      cards.forEach((card, i) => {
        const isAd = POSTS.listPosts.affectedRows[i]?.isAd;
        if (isAd) card.classList.add('none');
    });
  }

  function showAdCards() {
    const cards = listPosts.querySelectorAll(".card");
    console.log('POSTS ', POSTS)
    cards.forEach((card, i) => {
      const isAd = POSTS.listPosts.affectedRows[i]?.isAd;
      if (isAd) card.classList.remove('none');
    });
  }

  function attachWrapperListeners() {
    const cards = listPosts.querySelectorAll(".card");
    cards.forEach((card, i) => {
      if (!card.dataset.listenersAdded) {
        card.addEventListener(
          "click",
          function (e) {
            if (listPosts.classList.contains("boostActive")) {
              e.stopImmediatePropagation();
              postid = this.id;
              if (!card.classList.contains("boosted")) boostCardClick(card);

              // if (card.classList.contains("boosted")) {
                // markCardAsBoosted(card);
                // card.classList.add("flipped");

                // setTimeout(() => {
                //   card.classList.remove("flipped");
                // }, 2000);
              // } else {
              //   boostCardClick(card);
              // }
            
            }
          }, {
            capture: true
          }
        );
        card.dataset.listenersAdded = true;
      }
    });
  }

  // ----------------- Promote / Cancel Buttons -----------------
  if (promoteBtn) {
    promoteBtn.addEventListener("click", () => {
      profileBox.classList.add("boostActive");
      listPosts.classList.add("boostActive");
      cancelBtn.classList.remove("none");
      boostPostDescription.classList.remove("none");
      adsStats.classList.add('none');

      attachWrapperListeners();
      hideAdCards();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      profileBox.classList.remove("boostActive");
      listPosts.classList.remove("boostActive");
      cancelBtn.classList.add("none");
      boostPostDescription.classList.add("none");
      adsStats.classList.remove('none');
      showAdCards();
    });
  }

  // ----------------- Dropdown trigger for boost/Ads buttons -----------------

  const container = document.querySelector('.boost_adsStats_container');
  const dropdownWrapper = document.querySelector('.boost_dropdown_wrapper');

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

  // Api call for AdvertisePostPinned endpoint
  advertisePost.addEventListener('click', advertisePostPinned);

  async function advertisePostPinned() {
    const accessToken = getCookie("authToken");
    // Create headers
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    var graphql = JSON.stringify({
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

    var requestOptions = {
      method: "POST",
      headers: headers,
      body: graphql,
    };

    try {
      const query = await fetch(GraphGL, requestOptions);
      const result = await query.json();
      const data = result.data?.advertisePostPinned;
      if (!data) throw new Error("Invalid response structure");
      if (data.status === "error") {
        throw new Error(userfriendlymsg(data.ResponseCode));
      }
      shiftPostToTop();
      return true;
    } catch {
      console.error("AdvertisePostPinned failed");
      return false;
    }
  }

  function shiftPostToTop() {
    const parentElement = document.getElementById("allpost");
    const cardEl = document.getElementById(`${postid}`);
    if (parentElement && cardEl) {
      // move card to top
      parentElement.prepend(cardEl);
      // remove duplicate cards with the same ID (after the first one)
      parentElement.querySelectorAll(`.card#${postid}`).forEach((el, index) => {
        if (index > 0) el.remove();
      });
    }
  }

  window.clearAdBtnBox = function () {
    const cardPopup = document.getElementById('cardClicked');
    const adBtn = cardPopup.querySelector('.pinedbtn');
    if (adBtn) {
      adBtn.remove()
    }
  }
});