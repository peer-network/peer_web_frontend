
document.addEventListener("DOMContentLoaded", () => {
  const CurrentUserID = getCookie("userID");
  getUser().then(profile2 => {
    const bioPath = profile2.data.getProfile.affectedRows.biography;

    const biography = document.getElementById("biography");

  // Check if bioPath is valid
  if (bioPath && biography) {
  const fullPath = tempMedia(profile2.data.getProfile.affectedRows.biography);


    fetch(fullPath, { cache: "no-store" })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch biography text file");
        }
        return response.text();
      })
      .then(biographyText => {
        //console.log(biographyText);
        document.getElementById("biography").innerText = biographyText;
      })
      .catch(error => {
        console.error("Error loading biography:", error);
        document.getElementById("biography").innerText = "Biography not available";
      });
  } else {
    //document.getElementById("biography").innerText = "No biography found";
  }


  });

     
   
  
   const post_loader = document.getElementById("post_loader");
  // Funktion erstellen, die aufgerufen wird, wenn der Footer in den Viewport kommt
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        postsLaden(CurrentUserID);
        attachWrapperListeners();
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
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(post_loader);
  } else {
    console.warn("⚠️ Post Loader element not found — cannot observe.");
  }
  



  // function for the boost post posts button & cancel boost post button

  const promoteBtn = document.querySelector(".promote_posts");
  const cancelBtn = document.querySelector(".promote_posts_cancel");
  const profileBox = document.querySelector(".profile_header");
  const boostPostDescription = document.querySelector(".boost_post_description");
  const listPosts = document.querySelector(".list_all_post");
  const modal = document.getElementById('boostModal');
  let currentStep = 1;

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
        pinnedBtn.innerHTML = `<a class="button btn-blue"> <img src="svg/pin.svg" alt="pin"> <span class="ad_username bold">@${username}</span> <span class="ad_duration txt-color-gray">23h</span></a>`;
        postInhalt.insertBefore(pinnedBtn, social);
      }

      previewBoostedPost.appendChild(clonedCard);
    }
    modal.classList.remove('none');
    showStep(1);
  }

  showStep(3);
  currentliquidity("token_balance");

  // ----------------- Insert Pinned Button -----------------
  function insertPinnedBtn(card, username, mode = "profile") {
    if (!card) return;
    if (card.querySelector(".pinedbtn")) return; 

    const pinnedBtn = document.createElement("div");
    pinnedBtn.classList.add("pinedbtn");
    pinnedBtn.innerHTML = `
      <a class="button btn-blue">
        <img src="svg/pin.svg" alt="pin">
        <span class="ad_username bold">@${username}</span>
        <span class="ad_duration txt-color-gray">23h</span>
      </a>
    `;

    const postInhalt = card.querySelector(".post-inhalt");
    const social = card.querySelector(".social");
    const viewpost = document.querySelector(".viewpost");
    const footer = viewpost?.querySelector(".postview_footer");
    const comments = viewpost?.querySelector(".post-comments");

    if (mode === "profile") {
      if (postInhalt && social) {
        postInhalt.insertBefore(pinnedBtn, social);
      }
    }

    if (mode === "post") {
      if (footer && comments && !footer.querySelector(".pinedbtn")) {
        comments.insertAdjacentElement("afterend", pinnedBtn);
      }
    }
  }

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
  function markCardAsBoosted(card) {
    card.classList.add("boosted");

    // Wrap card content in front/back container if not already wrapped
    if (!card.querySelector(".post-card-inner")) {
      const inner = document.createElement("div");
      inner.classList.add("post-card-inner");

      const front = document.createElement("div");
      front.classList.add("post-card-front");
      front.append(...Array.from(card.childNodes));

      const back = document.createElement("div");
      back.classList.add("post-card-back", "bold", "xl_font_size");
      back.textContent = "This Post has already been boosted";

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);
    }
  }

  // ----------------- Modal Buttons -----------------
  modal.addEventListener('click', function(e) {
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
        markCardAsBoosted(window.lastBoostedCard); 
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
        markCardAsBoosted(window.lastBoostedCard);

        window.lastBoostedCard.click();
        insertPinnedBtnToOpenedPost(window.lastBoostedCard, username, "post");
      }
    }

    if (e.target === modal) {
      modal.classList.add('none'); 
    }
  });

  function attachWrapperListeners() {
    const cards = listPosts.querySelectorAll(".card");

    cards.forEach(card => {
      if (!card.dataset.listenersAdded) {
        card.addEventListener(
          "click",
          (e) => {
            if (listPosts.classList.contains("boostActive")) {
              e.stopImmediatePropagation();

              if (card.classList.contains("boosted")) {
                markCardAsBoosted(card);
                card.classList.add("flipped"); 

                setTimeout(() => {
                  card.classList.remove("flipped");
                }, 2000);
              } else {
                boostCardClick(card);
              }
            }
          },
          { capture: true }
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

      attachWrapperListeners();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      profileBox.classList.remove("boostActive");
      listPosts.classList.remove("boostActive");
      cancelBtn.classList.add("none");
      boostPostDescription.classList.add("none");
    });
  }

});

