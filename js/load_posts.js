// :TODO VIEWS


document.addEventListener("DOMContentLoaded",  () => {
  restoreFilterSettings();
    const postID = getPostIdFromURL(); // define in global.js
    if (postID) {
      setTimeout(async () => { 
         const objekt = await fetchPostByID(postID);
         if (objekt) {
            postClicked(objekt[0]);
        }
      }, 100);   
    }

  const everything = document.getElementById("everything");
  if (everything) {
    everything.addEventListener("click", () => {
      deleteFilter();
      location.reload();
    });
  }
  const closePost = document.getElementById("closePost");
  if (closePost) {
    closePost.addEventListener("click", () => {
      togglePopup("cardClicked");
      window.clearAdBtnBox();
      cancelTimeout();
    });
  }
  const addComment = document.getElementById("addComment");
  if (addComment) {
    addComment.addEventListener("click", (event) => {
      const clickedElement = event.currentTarget;

      // Ein Attribut auslesen, z. B. 'data-id'
      const attributeValue = clickedElement.getAttribute("postID");
      createModal({
        title: "Comment",
        message: "Please enter your comment:",
        buttons: ["send", "quit"],
        type: "info",
        textarea: true,
      }).then((result) => {
        // result hat das Format { button: <index>, value: <textarea Inhalt> }
        if (result !== null && result.button == 0 && result.value !== "") {
          createComment(attributeValue, result.value).then((result) => {
            if (result) {
              if (result.data.createComment.status === "success") {
                commentToDom(result.data.createComment.affectedRows[0], false);
              }
            }
          });
        }
        // console.log("Ergebnis:", result);
      });
      // document.getElementById("commentInput").focus();
      // createComment(attributeValue, "test");
    });
  }

  if (window.matchMedia("(display-mode: standalone)").matches) {
    document.documentElement.requestFullscreen().catch((err) => {
      // console.warn(`Vollbildmodus konnte nicht aktiviert werden: ${err.message}`);
    });
  }

  function initCollapseViewToggle() {
    const collapseBtn = document.querySelector(".collapse-filters");
    const collapsibleBtns = document.querySelectorAll('button[aria-controls="content-options"], ' + 'button[aria-controls="feed-options"], ' + 'button[aria-controls="time-options"], ' + 'button[aria-controls="sort-options"], ' + 'button[aria-controls="general-backbtn"]');
    if (collapseBtn) {
      const siteLayout = document.querySelector(".site_layout");
      let isCollapsed = false;

      function setCollapsedState(collapsed) {
        isCollapsed = collapsed;

        if (collapsed) {
          siteLayout.classList.add("collapsed");
          collapsibleBtns.forEach((btn) => btn.classList.add("collapsed"));
          document.querySelectorAll(".filter-options.open").forEach((sec) => sec.classList.remove("open"));
        } else {
          siteLayout.classList.remove("collapsed");
          collapsibleBtns.forEach((btn) => btn.classList.remove("collapsed"));
        }

        localStorage.setItem("isFiltersCollapsed", JSON.stringify(isCollapsed));
      }

      const savedState = localStorage.getItem("isFiltersCollapsed");
      if (savedState !== null) {
        setCollapsedState(JSON.parse(savedState));
      }

      collapseBtn.addEventListener("click", () => {
        setCollapsedState(!isCollapsed);
      });

      collapsibleBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          if (isCollapsed) {
            setCollapsedState(false);
          }
        });
      });
    }
  }

  initCollapseViewToggle();

  function initFilterToggles(className = "filter-toggle") {
    document.querySelectorAll(`.${className}`).forEach((btn) => {
      btn.addEventListener("click", function () {
        const targetId = btn.getAttribute("aria-controls");
        const section = document.getElementById(targetId);
        const isOpen = btn.getAttribute("aria-expanded") === "true";

        if (isOpen) {
          section.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        } else {
          section.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }

        const arrow = btn.querySelector(".section-arrow");
        if (arrow) arrow.classList.toggle("rotated");
      });
    });
  }
  initFilterToggles();

  function setupFilterLabelSwapping(filterType) {
    const headerBtn = document.querySelector(`.${filterType}.filter-section-header`);
    const optionsContainer = document.querySelector(`#${filterType}-options`);
    const radioInputs = optionsContainer.querySelectorAll(`input[name="${filterType}"]`);

    let labelSpan = headerBtn.querySelector(".section-selected-label");
    if (!labelSpan) {
      labelSpan = document.createElement("span");
      labelSpan.className = "section-selected-label";
      headerBtn.querySelector(".filter-section-container").appendChild(labelSpan);
    }

    // Restore from localStorage or default to "all"
    const stored = localStorage.getItem(`selected-${filterType}`) || "all";
    setSelectedLabel(stored);

    radioInputs.forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) {
          const value = input.value;
          localStorage.setItem(`selected-${filterType}`, value);
          setSelectedLabel(value);
        }
      });
    });

    function setSelectedLabel(value) {
      radioInputs.forEach((input) => {
        const label = input.closest("label");
        const labelText = label.querySelector("span").textContent;

        if (input.value === value) {
          labelSpan.textContent = " " + labelText;
          //label.style.display = "none";
        } else {
          //label.style.display = "";
        }
      });
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
  setupFilterLabelSwapping("feed");
 
  //setupFilterLabelSwapping("time");

  function updateFilterHeaderIcons(sectionId = "content-options", preset = null) {
    const iconMap = {
      IMAGE: "svg/photo.svg",
      VIDEO: "svg/videos.svg",
      TEXT: "svg/text.svg",
      AUDIO: "svg/music.svg",
      LIKES: "svg/post-like.svg",
      COMMENTS: "svg/post-comment.svg",
      VIEWS: "svg/most-views.svg",
      DISLIKES: "svg/most-dislikes.svg",
    };

    const section = document.getElementById(sectionId);
    const header = document.querySelector(`button[aria-controls="${sectionId}"]`);
    if (!section || !header) return;

    const container = header.querySelector(".filter-section-container");
    const arrow = header.querySelector(".section-arrow");

    container.querySelectorAll(".filter-icon-preview").forEach((el) => el.remove());

    const selectedInputs = section.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
    selectedInputs.forEach((input) => {
      const customIcon = input.getAttribute("data-icon");
      const key = input.getAttribute("sortby") || input.name;
      const iconSrc = customIcon || iconMap[key];

      if (iconSrc) {
        const img = document.createElement("img");
        img.src = iconSrc;
        img.classList.add("filter-icon-preview");

        container.appendChild(img);
      }
    });

    arrow.style.display = selectedInputs.length > 2 ? "none" : "";
  }
  updateFilterHeaderIcons("content-options");
  updateFilterHeaderIcons("sort-options");

  const checkboxes = document.querySelectorAll(".filterContainer .filteritem");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      saveFilterSettings();
     
      const selectedTypes = Array.from(checkboxes)
        .filter((cb) => cb.checked && cb.value !== "all")
        .map((cb) => cb.value);
      localStorage.setItem("selectedContentTypes", JSON.stringify(selectedTypes));

      const elements = document.querySelectorAll(`[content="${event.target.name.toLowerCase()}"]`);
      if (event.target.checked) {
        elements.forEach((element) => {
          element.classList.remove("none");
        });
        // console.log(`${event.target.name} wurde aktiviert.`);
      } else {
        elements.forEach((element) => {
          element.classList.add("none");
        });
        // console.log(`${event.target.name} wurde deaktiviert.`);
      }
      location.reload();
    });
  });

  const radio = document.querySelectorAll(".filterContainer .chkMost");
  radio.forEach((item) => {
    let lastSelected = null;
    item.addEventListener("click", function () {
      if (this === lastSelected) {
        this.checked = false;
        lastSelected = null;
        saveFilterSettings();
        location.reload();
      } else {
        lastSelected = this;
      }
    });
    item.addEventListener("change", (event) => {
      saveFilterSettings();
      location.reload();
    });
  });

  const storedTypes = JSON.parse(localStorage.getItem("selectedContentTypes"));
  if (storedTypes) {
    updateFilterHeaderIcons(storedTypes);
  }
  
});

async function addScrollBlocker(element) {
    let isAnimating = false;
    let lastTouchX = 0;
    let lastTouchY = 0;
    element.addEventListener(
      "wheel",
      (event) => {
        handleScroll(event, "mouse", element);
      },
      { passive: false }
    );
    document.addEventListener("touchend", () => {
      lastTouchX = null;
      lastTouchY = null;
    });
    element.addEventListener(
      "touchmove",
      (event) => {
        handleScroll(event, "touch", element);
      },
      { passive: false }
    );
    let stopscroll = false;
    function handleScroll(event, inputType, el) {
      // console.log("handleScroll called ");
      //   const scrollableContainer = event.target.closest(".blockscroll");
      //   if (!scrollableContainer) return; // Nur in bestimmten Containern scrollen
      // console.log("handleScroll");
      if (event.currentTarget.className === "scrollable") stopscroll = true;
      event.stopPropagation();
      if (event.currentTarget.id === "main" && stopscroll) {
        // console.log("stopscroll");
        event.preventDefault();
      }
      if (event.currentTarget.className === "scrollable") return;
      // event.preventDefault(); // Standard-Scrollverhalten blockieren
      // event.stopPropagation();

      // Bewegung erfassen
      // let deltaX = 0,
      //   deltaY = 0,
      //   tempo = 1;
      // if (inputType === "mouse") {
      //   deltaX = event.deltaX * tempo;
      //   deltaY = event.deltaY * tempo;
      //   el.scrollLeft += deltaX - deltaY;
      //   el.scrollTop += deltaY;
      // } else if (inputType === "touch") {
      //   const touch = event.touches[0];
      //   deltaX = lastTouchX ? touch.clientX - lastTouchX : 0;
      //   deltaY = lastTouchY ? touch.clientY - lastTouchY : 0;

      //   // Speichere die aktuelle Touch-Position
      //   lastTouchX = touch.clientX;
      //   lastTouchY = touch.clientY;
      //   el.scrollLeft -= deltaX;
      //   el.scrollTop -= deltaY;
      // }

      // el.scrollBy({
      //   left: deltaX,
      //   top: deltaY,
      //   behavior: 'smooth'
      // });
      // if (isScrollSnapEnabled(el)) {
      //   ensureSnap(el);
      // }
    }
}

function isScrollSnapEnabled(container) {
  // Prüfe, ob scroll-snap-type aktiviert ist
  const style = window.getComputedStyle(container);
  return style.scrollSnapType && style.scrollSnapType !== "none";
}

function ensureSnap(container) {
  setTimeout(() => {
    // Snap-Positionen für horizontal und vertikal berechnen
    const snapPositionsX = Array.from(container.children).map((child) => child.offsetLeft);
    const snapPositionsY = Array.from(container.children).map((child) => child.offsetTop);

    const currentScrollX = container.scrollLeft;
    const currentScrollY = container.scrollTop;

    // Nächste Snap-Position für beide Richtungen finden
    const closestSnapX = snapPositionsX.reduce((prev, curr) => (Math.abs(curr - currentScrollX) < Math.abs(prev - currentScrollX) ? curr : prev));
    const closestSnapY = snapPositionsY.reduce((prev, curr) => (Math.abs(curr - currentScrollY) < Math.abs(prev - currentScrollY) ? curr : prev));

    // Scrolle sanft zur nächsten Snap-Position
    container.scrollTo({
      left: closestSnapX,
      top: closestSnapY,
      behavior: "smooth",
    });
  }, 100); // Warte, bis die Bewegung abgeschlossen ist
}

  
function appendPost(json) {
  const parentElement = document.getElementById("parent-id"); // Das übergeordnete Element
  const letztesDiv = parentElement.lastElementChild;
}


const hiddenUserHTML = `
  <div class="hidden_userfeed_frame">
    <div class="hidden_content">
    <i class="peer-icon peer-icon-eye-close md_font_size"></i>
      <div class="hidden_header">
        <div class="hidden_title bold">Sensitive content</div>
        <div class="hidden_description">Click to see</div>
      </div>
      
    </div>
  </div>
`;
//let manualLoad = false;
let postoffset = 0;
let  POSTS;
async function postsLaden(postbyUserID=null) {
    const UserID = getCookie("userID");
    const checkboxes = document.querySelectorAll(".filterContainer .filteritem:checked");
    const values = Array.from(checkboxes).filter((checkbox) => checkbox.checked && checkbox.value !== "all").map((checkbox) => checkbox.value);
    const cleanedArray = values.map((values) => values.replace(/^"|"$/g, ""));

    let tagInput = "";
    let tags = "";
    const tagElement = document.getElementById("searchTag");
    if (tagElement) {
      const { hashtags } = extractWords(tagElement.value.toLowerCase());
      tags = hashtags.join(" ");
    }
    //console.log(tags);
    const titleElement = document.getElementById("searchTitle");
    if (titleElement) {
      const { normalWords } = extractWords(titleElement.value.toLowerCase());
      tagInput = normalWords.join(" ");
    }
    const sortby = document.querySelectorAll('.filterContainer.sortby input[type="radio"]:checked');
 

    if (postbyUserID!=null){
      POSTS = await getPosts(postoffset, 20, cleanedArray, tagInput, tags, sortby.length ? sortby[0].getAttribute("sortby") : "NEWEST",postbyUserID);
    } else {
      POSTS = await getPosts(postoffset, 20, cleanedArray, tagInput, tags, sortby.length ? sortby[0].getAttribute("sortby") : "NEWEST");
    }

    const parentElement = document.getElementById("allpost"); 
    let audio, video;
    
    

    const elShopDetect = document.querySelector('.site_layout.view-profile');
    const onShopProfilepage = elShopDetect?.dataset?.peershop === 'true';
    POSTS.listPosts.affectedRows.forEach((objekt,i) => {
     
      const card = document.createElement("section");
      card.id = objekt.id;
      card.classList.add("card");
      card.setAttribute("tabindex", "0");
      card.setAttribute("idno", i);
      card.setAttribute("content", objekt.contenttype);

      if(onShopProfilepage || PEER_SHOP_ID==objekt.user.id){ //PEER_SHOP_ID is global variable define in global.js on top
        card.classList.add("card-shop-product");
      }
  
      if(objekt.hasActiveReports==true) {   
        card.classList.add("reported_post");
        card.setAttribute("data-hasReported", objekt.hasActiveReports);
      }

      if(objekt.visibilityStatus){
        card.classList.add("visibilty_"+objekt.visibilityStatus.toLowerCase());
        card.setAttribute("data-visibilty", objekt.visibilityStatus);
      }

      if(objekt.isHiddenForUsers){
        card.classList.add("visibilty_hidden");
        card.setAttribute("data-visibilty", 'HIDDEN');
      }


      let postDiv;
      let img;
      postDiv = document.createElement("div");
      postDiv.classList.add("post");

      const shadowDiv = document.createElement("div");
      shadowDiv.classList.add("shadow");
      postDiv.appendChild(shadowDiv);

      const inhaltDiv = document.createElement("div");
      inhaltDiv.classList.add("post-inhalt");
      const userNameSpan = document.createElement("span");
      userNameSpan.classList.add("post-userName");
      userNameSpan.textContent = objekt.user.username;
      const userprofileID = document.createElement("span");
      userprofileID.classList.add("post-userName", "profile_id");
      userprofileID.textContent = `#${objekt.user.slug}`;
      const userImg = document.createElement("img");
      userImg.classList.add("post-userImg","profile-picture");
      userImg.onerror = function () {
        this.src = "svg/noname.svg";
      };

      userImg.src = objekt.user.img ? tempMedia(objekt.user.img.replace("media/", "")) : "svg/noname.svg";

      const title = document.createElement("h3");
      title.textContent = objekt.title;
      title.classList.add("post-title","md_font_size","bold");
      
      const time_ago = document.createElement("span");
      time_ago.classList.add("timeAgo");
      time_ago.textContent = calctimeAgo(objekt.createdat);
      title.appendChild(time_ago);

      const card_header = document.createElement("div");
      card_header.classList.add("card-header");

      const card_header_left = document.createElement("div");
      card_header_left.classList.add("card-header-left");
      card_header_left.appendChild(userImg);
      const user_slug_span = document.createElement("span");
      user_slug_span.classList.add("username-slug");
      user_slug_span.appendChild(userNameSpan);
      user_slug_span.appendChild(userprofileID);
      card_header_left.appendChild(user_slug_span);
      
      
      card_header_left.addEventListener("click", function handledisLikeClick(event) {
          event.stopPropagation();
          event.preventDefault();
          redirectToProfile(objekt.user.id); 
		  });

      card_header.appendChild(card_header_left);

      const card_header_right = document.createElement("div");
      card_header_right.classList.add("card-header-right");
      
      const followButton = renderFollowButton(objekt, UserID);
      if (followButton) {
        card_header_right.appendChild(followButton);
      }

      if(onShopProfilepage){
        objekt.productprice=500;// assume price in object
        const product_price = document.createElement("div");
        product_price.classList.add("product_price","bold","md_font_size");
        product_price.innerText=objekt.productprice;
        card_header_right.appendChild(product_price);
       
      }
      card_header.appendChild(card_header_right);

      inhaltDiv.appendChild(card_header);
       const postaudioplayerDiv = document.createElement("div");
       const postvideoplayerDiv = document.createElement("div");
      if (objekt.contenttype === "audio") {
        postaudioplayerDiv.classList.add("audio-player");
        const imga = document.createElement("img");
        imga.src = 'img/mucis-player.png';
        imga.alt = "audio player";
        postaudioplayerDiv.appendChild(imga);
        inhaltDiv.appendChild(postaudioplayerDiv);
      }

      if (objekt.contenttype === "video") {
        postvideoplayerDiv.classList.add("video-player");
        const imga = document.createElement("img");
        imga.src = 'svgnew/play-btn.svg';
        imga.alt = "Play";
        postvideoplayerDiv.appendChild(imga);
        inhaltDiv.appendChild(postvideoplayerDiv);
      }
      

      const postContent = document.createElement("div");
      postContent.classList.add("post-content");
      postContent.appendChild(title);

      const post_text_div = document.createElement("div");
      post_text_div.classList.add("post-text");
      if (objekt.contenttype != "text") {
        post_text_div.textContent = objekt.mediadescription;
      } 

      const divtag = document.createElement("div");
          divtag.className = "hashtags";

          // Check if tags exist and are an array
          if (Array.isArray(objekt.tags)) {
            objekt.tags.forEach((tag) => {
              const span = document.createElement("span");
              span.className = "hashtag";
              span.textContent = `#${tag}`;
              divtag.appendChild(span);
            });
          }
      postContent.appendChild(post_text_div);
      postContent.appendChild(divtag);
      inhaltDiv.appendChild(postContent);

      const array = JSON.parse(objekt.media);
      let cover = null;
      if (objekt.cover) {
        cover = JSON.parse(objekt.cover);
      }
      if (objekt.contenttype === "image") {
       if (array.length > 1) {
          postDiv.classList.add("multi");
          const divmulti_img_indicator = document.createElement("div");
          divmulti_img_indicator.classList.add("image_counter");

          for (let a = 0; a < array.length; a++) {
            const img_indicator = document.createElement("span");
            if((a+1)==1){
              img_indicator.classList.add("active");
            }
            img_indicator.textContent=a+1;
            
            divmulti_img_indicator.appendChild(img_indicator);
             
          }
          let current = 0; // Shared index for both click and auto-swap
          let autoSwapInterval = null;
          divmulti_img_indicator.querySelectorAll("span").forEach((span, index) => {
            span.addEventListener("click", (event) => {
               event.stopPropagation();
                event.preventDefault();
                 current = index; // Update current index to clicked
              const images = postDiv.querySelectorAll("img");
              const indicators = divmulti_img_indicator.querySelectorAll("span");

              images.forEach((img, i) => {
                // Show only matching image index (match with class image1, image2, etc.)
                if (i === index) {
                  
                  img.classList.add("active");
                } else {
                  
                  img.classList.remove("active");
                }
              });

              // Update active indicator
              indicators.forEach(s => s.classList.remove("active"));
              span.classList.add("active");
            });
          });

          

          // Wrap this in a function if you're doing multiple posts
          card.addEventListener("mouseenter", () => {
            const images = postDiv.querySelectorAll("img");
            const indicators = divmulti_img_indicator.querySelectorAll("span");
            
            if (images.length <= 1) return; // no need to auto swap

             
            autoSwapInterval = setInterval(() => {
              current = (current + 1) % images.length;

              images.forEach((img, i) => {
                img.classList.toggle("active", i === current);
              });

              indicators.forEach((span, i) => {
                span.classList.toggle("active", i === current);
              });
            }, 1500); // change image every 1.5 seconds
          });

          card.addEventListener("mouseleave", () => {
            clearInterval(autoSwapInterval);
            autoSwapInterval = null;
          });

          inhaltDiv.insertBefore(divmulti_img_indicator, postContent);
          
        }
        let i=0;
        for (const item of array) { 
          i++;
          img = document.createElement("img");
          img.classList.add("image"+i);
          if (i === 1) {
            img.classList.add("active");
          }
          img.onload = () => {
            img.setAttribute("height", img.naturalHeight);
            img.setAttribute("width", img.naturalWidth);
          };
          img.onerror = (error) => {};

          img.src = tempMedia(item.path);
          img.alt = "";
          postDiv.appendChild(img);
        }
      } else if (objekt.contenttype === "audio") {
        if (cover) {
          img = document.createElement("img");
          img.onload = () => {
            img.setAttribute("height", img.naturalHeight);
            img.setAttribute("width", img.naturalWidth);
          };
          img.src = tempMedia(cover[0].path);
          img.alt = "Cover";
          postDiv.appendChild(img);
        }
        for (const item of array) {
          audio = document.createElement("audio");
          audio.id = item.path;
          audio.src = tempMedia(item.path);
          audio.controls = true;
          audio.className = "custom-audio";
          addMediaListener(audio);
          postDiv.appendChild(audio);
          const durationspan = document.createElement("span");
          durationspan.textContent = item.options.duration;
          postaudioplayerDiv.appendChild(durationspan);
        }
      } else if (objekt.contenttype === "video") {
        //console.log(objekt);
        if (array.length > 1) {
          card.classList.add("multi-video");
        }
        if (cover) {
          img = document.createElement("img");
          img.classList.add("video-cover");
          img.onload = () => {
            img.setAttribute("height", img.naturalHeight);
            img.setAttribute("width", img.naturalWidth);
          };
          img.src = tempMedia(cover[0].path);
          img.alt = "Video Cover";
          postDiv.appendChild(img);
        }
        let i = 0;
        for (const item of array) {
           i++;
          video = document.createElement("video");
          video.classList.add("video_"+i);
          video.muted = true;
          video.id = extractAfterComma(item.path);
          video.src = tempMedia(item.path);
          video.preload = "metadata";
          video.controls = false;
          video.classList.add("custom-video");
          addMediaListener(video);
          postDiv.appendChild(video);
          
          /* On mouse move over the card, scrub through the video based on cursor position
          / Only trigger if the video is ready, and play it safely if needed*/
          card.addEventListener("mousemove", function (event) {

          const videoCover = this.querySelector(".video-cover");
          if(videoCover)  videoCover.classList.add("none");
          const video = this.querySelector(".video_1");
          if (video?.readyState >= 2 ) {
            // const rect = video.getBoundingClientRect();
            // const mouseX = event.clientX - rect.left;
            // const relativePosition = mouseX / rect.width;
            video.currentTime = 0;
            /* Wait a tick before trying to play the video Helps avoid timing issues if the video isn't quite ready yet*/
            requestAnimationFrame(() => {
            if (video.paused || video.currentTime === 0) 
              video.play().catch(err => { if (err.name !== "AbortError") console.warn("Play error:", err) });
              });
            }
          });

          card.addEventListener("mouseleave", function (e) {
            const videoCover = this.querySelector(".video-cover");
            if(videoCover)  videoCover.classList.remove("none");
            const allMediaElements = this.querySelectorAll("video");
            allMediaElements.forEach((otherMedia) => {
              if (!otherMedia.paused) otherMedia.pause();
            });
            // const video = this.getElementsByTagName("video")[0];
            // video.pause();
          });

          const ratio = document.createElement("span");
          ratio.classList.add("video-ratio");
          ratio.classList.add("video-ratio-"+i);
          if(item.options.ratio=='16:9'){
            ratio.textContent = 'Long';
            card.classList.add("double-card");
            postDiv.appendChild(video);
          }else{
            ratio.textContent = 'Short';
          }
          postvideoplayerDiv.appendChild(ratio);
          
          
        }
      } else if (objekt.contenttype === "text") {
          for (const item of array) {
          loadTextFile(tempMedia(item.path), post_text_div);
        
        }
      }
      // <div class="social"> erstellen mit Social-Icons und leeren <span>
      const socialDiv = document.createElement("div");
      socialDiv.classList.add("social","md_font_size");
      const viewContainer = document.createElement("div");
      viewContainer.classList.add("post-view");

       const viewIcon = document.createElement("i");
       viewIcon.classList.add("peer-icon","peer-icon-eye-open");
       viewContainer.appendChild(viewIcon);


      // Leeres <span> für #post-view
      const spanView = document.createElement("span");
      spanView.textContent = formatNumber(objekt.amountviews);
      viewContainer.appendChild(spanView);
      socialDiv.appendChild(viewContainer);

      // Zweites SVG-Icon mit #post-like
      const likeContainer = document.createElement("div");
      likeContainer.classList.add("post-like");

      const likeIcon = document.createElement("i");
      likeIcon.classList.add("peer-icon","peer-icon-like");
      likeContainer.appendChild(likeIcon);
      
      
      if (objekt.isliked) {
        likeContainer.classList.add("active");
        
      } else if (objekt.user.id !== UserID) {
        likeContainer.addEventListener(
          "click",
          function handleLikeClick(event) {
            // event.currentTarget.removeEventListener("click", handleLikeClick);
            event.stopPropagation();
            event.preventDefault();
            like_dislike_post(objekt, "like", this);
            
          },
          { capture: true}
        );
      }
      
      const spanLike = document.createElement("span");
      spanLike.textContent = formatNumber(objekt.amountlikes);
      likeContainer.appendChild(spanLike);
      socialDiv.appendChild(likeContainer);


      
      // Zweites SVG-Icon mit #post-dislike
      const dislikeContainer = document.createElement("div");
      dislikeContainer.classList.add("post-dislike");
      const dislikeIcon = document.createElement("i");
      dislikeIcon.classList.add("peer-icon","peer-icon-dislike");
      dislikeContainer.appendChild(dislikeIcon);

      if (objekt.isdisliked) {
        
        dislikeContainer.classList.add("active"); // Rot hinzufügen
      } else if (objekt.user.id !== UserID) {
        dislikeContainer.addEventListener(
          "click",
          function handledisLikeClick(event) {
            // event.currentTarget.removeEventListener("click", handleLikeClick);
            event.stopPropagation();
            event.preventDefault();
            like_dislike_post(objekt, "dislike", this);
          },
          { capture: true}
        );
      }
      
      const spandisLike = document.createElement("span");
      spandisLike.textContent = formatNumber(objekt.amountdislikes);
      dislikeContainer.appendChild(spandisLike);
      socialDiv.appendChild(dislikeContainer);



      const commentContainer = document.createElement("div");
      commentContainer.classList.add("post-comments");
      const commentIcon = document.createElement("i");
      commentIcon.classList.add("peer-icon","peer-icon-comment-alt");
      commentContainer.appendChild(commentIcon);

      

      // Leeres <span> für #post-comment
      const spanComment = document.createElement("span");
      spanComment.textContent = objekt.amountcomments;
      commentContainer.appendChild(spanComment);

      socialDiv.appendChild(commentContainer);

      inhaltDiv.appendChild(socialDiv);
      // Alles in die Haupt-<section> hinzufügen
      card.appendChild(postDiv);
      card.appendChild(inhaltDiv);

      /*---Hidden && Illegal User Frame */
      userProfileVisibilty(UserID,objekt.user,card_header_left);  
      /*---End Hidden && Illegal User Frame */
      
      card.addEventListener("click", function handleCardClick() {
        postClicked(objekt);
      });
      // Die <section class="card"> in das übergeordnete Container-Element hinzufügen
      parentElement.appendChild(card);
      if (objekt.isAd) {
        card.classList.add("PINNED");
        insertPinnedBtn(card, objekt.user.username, "profile");
      }

      /*---Hidden Frame content */
        if(objekt.visibilityStatus=='HIDDEN' || objekt.visibilityStatus=='hidden' || objekt.isHiddenForUsers == true){
            const hiddenContentHTML = `
            <div class="hidden_content_frame">
              <div class="hidden_content">
                <div class="icon_hidden"><i class="peer-icon peer-icon-eye-close"></i></div>
                <div class="hidden_title md_font_size bold">Sensitive content</div>
                <div class="hidden_description">
                  This content may be sensitive or abusive.<br>
                  Do you want to view it anyway?
                </div>
                <div class="view_content">
                  <a href="#" class="button btn-transparent">View content</a>
                </div>
              </div>
            </div>
          `;

          if(objekt.user.id != UserID ){
            //console.log(objekt.user.id,UserID);
            inhaltDiv.insertAdjacentHTML("beforeend", hiddenContentHTML);
          

            // Select all inserted hidden frames and attach "View content" listeners
            inhaltDiv.querySelectorAll(".hidden_content_frame").forEach(frame => {
              const viewBtn = frame.querySelector(".view_content a");
              if (viewBtn) {
                viewBtn.addEventListener("click", (e) => {
                  e.preventDefault();
                  frame.remove(); // remove that specific frame
                  card.classList.remove('visibilty_hidden');
                });
              }
            });
          }else{ //else mean logged in user viewing own post 
            const hiddenContentBadge = `<div class="hidden_badge"><i class="peer-icon peer-icon-eye-close"></i> Hidden</div>`;
            inhaltDiv.querySelector(".post-content").insertAdjacentHTML("beforebegin", hiddenContentBadge);

          }
        }
      /*---End Hidden Frame content */

      /*---illegal Frame content */
        if(objekt.visibilityStatus=='ILLEGAL' || objekt.visibilityStatus=='illegal'){
            
          const illegalContentHTML = `
          <div class="illegal_content_frame">
            <div class="illegal_content">
              <div class="icon_illegal"><i class="peer-icon peer-icon-illegal"></i></div>
              <div class="illegal_title bold">This content was removed as illegal</div>
            </div>
          </div>`;
          
          card.innerHTML="";
          card.insertAdjacentHTML("beforeend", illegalContentHTML);
        }

      /*---End illegal Frame content */

      /*---Content isreported badge ---*/
        if( objekt.hasActiveReports==true ){
            
            const reportContentBadge = `<div class="reported_badge"><i class="peer-icon peer-icon-flag-fill"></i> Reported</div>`;
            inhaltDiv.querySelector(".post-content").insertAdjacentHTML("beforebegin", reportContentBadge);
        }
      /*---End Content isreported badge */


    });
    // console.log(posts.listPosts.affectedRows.length);
    postoffset += POSTS.listPosts.affectedRows.length;
    // console.log("postoffset ", postoffset)

     const post_loader = document.getElementById("post_loader");
    const no_post_found = document.getElementById("no_post_found");
    //console.log(postoffset+"---"+POSTS.listPosts.affectedRows.length);
    if(postoffset==0 && POSTS.listPosts.affectedRows.length==0) // no  post found 
    { 
      no_post_found.classList.add("active");
      post_loader.classList.add("hideloader");
    }else if(POSTS.listPosts.counter<20){
      post_loader.classList.add("hideloader");
    }else{
      no_post_found.classList.remove("active");
      post_loader.classList.remove("hideloader");
    }
	 const cards = document.querySelectorAll(".card");

  const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const sources = entry.target.querySelectorAll(".post video, .post audio, .post img");
    if(!sources) return;
    sources.forEach(el => {
      if (entry.isIntersecting) {
        // Element ist im Viewport → wieder laden
        if (!el.src) {
          el.src = el.dataset.src;
          // el.muted ??= true;            // für Autoplay auf Mobile
          el.playsInline ??= true;
          el.load?.(); // nur für <video> relevant
          
        }
      } else {
        // Element ist nicht im Viewport → entladen
        if (el.tagName === "VIDEO" || el.tagName === "AUDIO") {
          

          el.pause();
          if(!el.dataset.src && el.src) {
            el.dataset.src = el.src; // Quelle zwischenspeichern
          }
          if (el.src) {
            el.removeAttribute("src");
            el.load(); // wichtig, um Speicher freizugeben
          }
        } else if (el.tagName === "IMG") {
          if(!el.dataset.src && el.src) {
            el.dataset.src = el.src; // Quelle zwischenspeichern
          }
          el.removeAttribute("src");
        }
      }
    });
  });
}, {
  root: null,        // Viewport     
  rootMargin: "100% 0px 100% 0px",
  threshold: 0       // sobald auch nur ein Pixel sichtbar ist
});

cards.forEach(post => observer.observe(post));
}


function like_dislike_post(objekt, action, el) {
  const isLike = action === "like";
  const apiCall = isLike ? likePost : dislikePost;
  const className = "active";
  const span = el.querySelector("span");
  const keyIsClicked = isLike ? "isliked" : "isdisliked";
  const keyAmount = isLike ? "amountlikes" : "amountdislikes";

    // Check nearest parent with .card OR .viewpost
    const parentel = el.closest(".card, .viewpost");
    
    if (parentel) {
      parentel.classList.add("disbale_click");

      // 3 second baad remove kar do
      setTimeout(() => {
        parentel.classList.remove("disbale_click");
      }, 3000);
    }
  
  

  apiCall(objekt.id).then((success) => {
    if (success) {
      objekt[keyIsClicked] = true;
      el.classList.add(className);

      if (span.textContent.includes("K") || span.textContent.includes("M")) {
        return; // Skip incrementing if shorthand
      }

      let currentCount = parseInt(span.textContent);
      if (isNaN(currentCount)) {
        currentCount = 1;
      } else {
        currentCount++;
      }

      span.textContent = formatNumber(currentCount);
      objekt[keyAmount] = currentCount;
    }
  });
}

function reportPost(objekt, el) {
    // Check nearest parent with .card OR .viewpost
    const parentel = el.closest(".viewpost");
    const postCardId = document.getElementById(objekt.id);
    
    if (parentel) {
      parentel.classList.add("disbale_click");

      // 3 second baad remove kar do
      setTimeout(() => {
        parentel.classList.remove("disbale_click");
      }, 3000);
    }
  
  reportPostAPIcall(objekt.id).then((success) => {
      if (success) {
        //togglePopup("cardClicked");
        cancelTimeout();
        // Add animation class
        postCardId.classList.add("reported_post");

        const reportContentBadge = `<div class="reported_badge"><i class="peer-icon peer-icon-flag-fill"></i> Reported</div>`;
        postCardId.querySelector(".post-content").insertAdjacentHTML("beforebegin", reportContentBadge);

        const postview_footer = el.querySelector(".postview_footer");
        postview_footer.insertAdjacentHTML("beforeend", reportContentBadge);

      }
  });
}


let timerId = null;
function cancelTimeout() {
  clearTimeout(timerId);
}

async function viewed(object) {
  await viewPost(object.id);
  object.isviewed = true;
  // console.log(object.id);
}

async function postClicked(objekt) {
  const UserID = getCookie("userID");
  if (!objekt.isviewed && objekt.user.id !== UserID) {
    timerId = setTimeout(async () => await viewed(objekt), 1000);
  }

  togglePopup("cardClicked");
  document.getElementById("cardClicked").setAttribute("postID", objekt.id);
  document.getElementById("cardClicked").setAttribute("content", objekt.contenttype);

  postdetail(objekt, UserID); //this funtion  define in global.js and used for guest post as well.
  if (objekt.isAd) {
    const cardEl = document.getElementById(`${objekt.id}`);
    cardEl.classList.add("PINNED");
    insertPinnedBtn(cardEl, objekt.user.username, "post");
  }
}

function deleteFilter() {
  localStorage.removeItem("filterSettings");
  localStorage.removeItem("tags");
}

function saveFilterSettings() {
  let filterSettings = {};
  let selectedContentTypes = [];
  let checkboxes = document.querySelectorAll('.filterContainer input[type="checkbox"], .filterContainer input[type="radio"]');

  checkboxes.forEach((checkbox) => {
    filterSettings[checkbox.id] = checkbox.checked; // Speichert Name und Zustand
    if (checkbox.closest(".content-options") && checkbox.checked) {
      selectedContentTypes.push(checkbox.value); // use value, not id
    }
  });
  localStorage.setItem("filterSettings", JSON.stringify(filterSettings)); // In localStorage speichern
  localStorage.setItem("selectedContentTypes", JSON.stringify(selectedContentTypes));
  if (document.getElementById("searchGroup")) {
    localStorage.setItem("tags", document.getElementById("searchGroup").value);
  }
}
function restoreFilterSettings() {
  let filterSettings = JSON.parse(localStorage.getItem("filterSettings")); // Aus localStorage laden


  if (filterSettings) {
    let checkboxes = document.querySelectorAll('.filterContainer input[type="checkbox"], .filterContainer input[type="radio"]');
    checkboxes.forEach((checkbox) => {
      if (filterSettings[checkbox.id] !== undefined) {
        checkbox.checked = filterSettings[checkbox.id]; // Zustand setzen
      }
    });
  }
  if (window.location.pathname.endsWith("dashboard.php")) {
    const searchTagElem = document.getElementById("searchTag");
    if (searchTagElem) {
      searchTagElem.value = localStorage.getItem("tagInput") || "";
    }

    // document.getElementById("searchTag").value = localStorage.getItem("tagInput") || ""; // Tags wiederherstellen
  } 

}

const postSpan = document.querySelector(".post-view span");
if (postSpan) {
  postSpan.addEventListener("click", async () => {
    const viewpost = postSpan.closest(".viewpost");
    const postid = viewpost.getAttribute("postid");
    
    // Scope selectors to THIS specific viewpost element
    const counts = {
      amountviews: parseInt(viewpost.querySelector(".post-view span").textContent) || 0,
      amountlikes: parseInt(viewpost.querySelector(".post-like span").textContent) || 0,
      amountdislikes: parseInt(viewpost.querySelector(".post-dislike span").textContent) || 0
    };
    
    await postInteractionsModal(postid, "VIEW", counts);
  });
}

const likeSpan = document.querySelector(".post-like span");
if (likeSpan) {
  likeSpan.addEventListener("click", async () => {
    const viewpost = likeSpan.closest(".viewpost");
    const postid = viewpost.getAttribute("postid");
    
    const counts = {
      amountviews: parseInt(viewpost.querySelector(".post-view span").textContent) || 0,
      amountlikes: parseInt(viewpost.querySelector(".post-like span").textContent) || 0,
      amountdislikes: parseInt(viewpost.querySelector(".post-dislike span").textContent) || 0
    };
    
    await postInteractionsModal(postid, "LIKE", counts);
  });
}

const dislikeSpan = document.querySelector(".post-dislike span");
if (dislikeSpan) {
  dislikeSpan.addEventListener("click", async () => {
    const viewpost = dislikeSpan.closest(".viewpost");
    const postid = viewpost.getAttribute("postid");
    
    const counts = {
      amountviews: parseInt(viewpost.querySelector(".post-view span").textContent) || 0,
      amountlikes: parseInt(viewpost.querySelector(".post-like span").textContent) || 0,
      amountdislikes: parseInt(viewpost.querySelector(".post-dislike span").textContent) || 0
    };
    
    await postInteractionsModal(postid, "DISLIKE", counts);
  });
}

document.body.addEventListener("click", async (e) => {
  if (e.target.matches(".comment_like span")) {
    const commentItem = e.target.closest(".comment_item");
    const postid = commentItem.getAttribute("id");
    
    const counts = {
      amountlikes: parseInt(e.target.textContent) || 0
    };
    
    await postInteractionsModal(postid, "COMMENTLIKE", counts);
  }
});