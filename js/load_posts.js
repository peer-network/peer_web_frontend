// :TODO VIEWS



document.addEventListener("DOMContentLoaded", () => {
  restoreFilterSettings();


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
            if (result){
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

  

  const checkboxes = document.querySelectorAll(".filterContainer .filteritem");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      saveFilterSettings();
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
 

});


function commentToDom(c, append = true) {
  const userID = getCookie("userID");
  const commentsContainer = document.getElementById("comments");
  //console.log(c);
  // Already existing list to track liked comments
  let mostliked = [];

  const comment = document.createElement("div");
  comment.classList.add("comment_item");
  comment.id = c.commentid;

  // Profile Picture
  const img = document.createElement("img");
  img.classList.add("profile-picture");
  img.src = c.user && c.user.img ? tempMedia(c.user.img.replace("media/", "")) : "svg/noname.svg";
  img.alt = "user image";
  img.onerror = function () {
    this.src = "svg/noname.svg";
  };
  img.addEventListener("click",
        function handledisLikeClick(event) {
          event.stopPropagation();
          event.preventDefault();
          redirectToProfile(c, this);
        }  
      );

  const imgDiv = document.createElement("div");
  imgDiv.classList.add("commenter-pic");
  imgDiv.appendChild(img);
  comment.appendChild(imgDiv);

  // Username + Profile ID + Time
  const usernameSpan = document.createElement("span");
  usernameSpan.classList.add("cmt_userName", "md_font_size", "bold");
  usernameSpan.textContent = c.user.username;

  const profileIdSpan = document.createElement("span");
  profileIdSpan.classList.add("cmt_profile_id", "txt-color-gray");
  profileIdSpan.textContent = "#" + c.user.slug;

  const timeAgoSpan = document.createElement("span");
  timeAgoSpan.classList.add("timeagao", "txt-color-gray");
  timeAgoSpan.textContent = calctimeAgo(c.createdat);

  const commenterInfoDiv = document.createElement("div");
  commenterInfoDiv.classList.add("commenter_info");
  commenterInfoDiv.append(usernameSpan, profileIdSpan, timeAgoSpan);

  // Comment Text
  const commentTextDiv = document.createElement("div");
  commentTextDiv.classList.add("comment_text");
  commentTextDiv.textContent = c.content;

  // Reply container
  const replyBtn = document.createElement("span");
  replyBtn.classList.add("reply_btn");
  replyBtn.innerHTML = `<a href="#" class="md_font_size bold">Reply<span></span></a>`;

  const showReply = document.createElement("span");
  showReply.classList.add("show_reply", "txt-color-gray");
  showReply.innerHTML = `Show <span class="reply_total">${c.amountreplies}</span> replies...`;

  const replyContainer = document.createElement("div");
  replyContainer.classList.add("comment_reply_container");
  replyContainer.append(replyBtn, showReply);

  // Body container
  const commentBody = document.createElement("div");
  commentBody.classList.add("comment_body");
  commentBody.append(commenterInfoDiv, commentTextDiv, replyContainer);

  // Like 
  
  const likeContainer = document.createElement("div");
  likeContainer.classList.add("comment_like","md_font_size");

  

  const likeIcon = document.createElement("i");
  likeIcon.classList.add("fi","fi-rr-heart");
  likeContainer.appendChild(likeIcon);

  const spanLike = document.createElement("span");
 likeContainer.append(spanLike);

  if (c.isliked) {
    
    likeContainer.classList.add("active");
  } else if (c.user.id !== userID) {
    likeContainer.addEventListener("click", function (event) {
      event.stopPropagation();
      event.preventDefault();
      likeComment(c.commentid).then((result) => {
        if (result) {
          c.isliked = true;
          c.amountlikes++;
          likeContainer.classList.add("active");
          if (!spanLike.textContent.includes("K") && !spanLike.textContent.includes("M")) {
            let current = parseInt(spanLike.textContent);
            spanLike.textContent = formatNumber(current + 1);
          }
        }
      });
    }, { capture: true, once: true });
  }

  
  spanLike.textContent = formatNumber(c.amountlikes || 0);
  

  // Final append all parts
  comment.appendChild(commentBody);
  comment.appendChild(likeContainer);

  // Insert based on parent
  if (c.parentid) {
    const parent = document.getElementById(c.parentid);
    comment.classList.add("comment-reply");
    if (parent) parent.insertAdjacentElement("afterend", comment);
  } else {
    if (append) commentsContainer.appendChild(comment);
    else commentsContainer.insertBefore(comment, commentsContainer.firstChild);
  }

  // Update `mostliked`
  const existingEntry = mostliked.find((entry) => entry.key === c.commentid);
  if (existingEntry) {
    existingEntry.liked += c.amountlikes;
  } else {
    mostliked.push({
      key: c.commentid,
      liked: c.amountlikes,
      img: c.user.img,
      name: c.user.username,
    });
  }
}





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
      console.log("handleScroll called ");
      //   const scrollableContainer = event.target.closest(".blockscroll");
      //   if (!scrollableContainer) return; // Nur in bestimmten Containern scrollen
      console.log("handleScroll");
      if (event.currentTarget.className === "scrollable") stopscroll = true;
      event.stopPropagation();
      if (event.currentTarget.id === "main" && stopscroll) {
        console.log("stopscroll");
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

  //let manualLoad = false;
  let postoffset=0;

  async function postsLaden(postbyUserID=null) {
    const UserID = getCookie("userID");
    if (postsLaden.offset === undefined) {
      postsLaden.offset = 0; // Initialwert
    }
    //console.log("✅ postsLaden() was triggered", manualLoad ? "(manual)" : "(observer)");
    //manualLoad = false;


    const form = document.querySelector(".filterContainer");

    const checkboxes = form.querySelectorAll(".filteritem:checked");

    // Die Werte der angehakten Checkboxen sammeln
    const values = Array.from(checkboxes).map((checkbox) => checkbox.name);

    // Werte als komma-getrennte Zeichenkette zusammenfügen
    // const result = values.join(" ");

    // Ergebnis ausgeben
    const cleanedArray = values.map((values) => values.replace(/^"|"$/g, ""));
    // // const textsearch = document.getElementById("searchText").value;
    // let normalWords = [];
    // let hashtags = [];
    // const searchTag = document.getElementById("searchTag");
    // if (searchTag) {
    //   const { hashtags } = extractWords(searchTag.value.toLowerCase());
    // }
   
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
    const sortby = document.querySelectorAll('.filterContainer input[type="radio"]:checked');
    let  posts;
    if(postbyUserID!=null){
        posts = await getPosts(postoffset, 20, cleanedArray, tagInput, tags, sortby.length ? sortby[0].getAttribute("sortby") : "NEWEST",postbyUserID);
    }else{
      posts = await getPosts(postoffset, 20, cleanedArray, tagInput, tags, sortby.length ? sortby[0].getAttribute("sortby") : "NEWEST");
    }
	
    //console.log(postoffset);
    const debouncedMoveEnd = debounce(handleMouseMoveEnd, 300);
    // Übergeordnetes Element, in das die Container eingefügt werden (z.B. ein div mit der ID "container")
    const parentElement = document.getElementById("allpost"); // Das übergeordnete Element
    let audio, video;
    // Array von JSON-Objekten durchlaufen und für jedes Objekt einen Container erstellen
    posts.data.listPosts.affectedRows.forEach((objekt,i) => {
      // Haupt-<section> erstellen
      const card = document.createElement("section");
      card.id = objekt.id;
      card.classList.add("card");
      card.setAttribute("tabindex", "0");
      card.setAttribute("idno", i);
      card.setAttribute("content", objekt.contenttype);
      // card.setAttribute("tags", objekt.tags.join(","));
      // <div class="post"> erstellen und Bild hinzufügen
      //console.log(objekt.id);

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
      


      card_header_left.addEventListener("click",
        function handledisLikeClick(event) {
          event.stopPropagation();
          event.preventDefault();
          redirectToProfile(objekt, this);
        }  
      );

      card_header.appendChild(card_header_left);
      

      

      const followButton = renderFollowButton(objekt, UserID);
      if (followButton) {
        const card_header_right = document.createElement("div");
        card_header_right.classList.add("card-header-right");
        card_header_right.appendChild(followButton);
        card_header.appendChild(card_header_right);
      }

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
        if (array.length > 1) postDiv.classList.add("multi");
        for (const item of array) {
          img = document.createElement("img");
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
        for (const item of array) {
          if (item.cover) {
            img = document.createElement("img");
            img.onload = () => {
              img.setAttribute("height", img.naturalHeight);
              img.setAttribute("width", img.naturalWidth);
            };
            img.src = tempMedia(item.cover);
            img.alt = "Cover";
            postDiv.appendChild(img);
          }
          video = document.createElement("video");
          video.muted = true;
          video.id = extractAfterComma(item.path);
          video.src = tempMedia(item.path);
          video.preload = "metadata";
          video.controls = false;
          video.className = "custom-video";
          addMediaListener(video);
          postDiv.appendChild(video);
          /* On mouse move over the card, scrub through the video based on cursor position
          / Only trigger if the video is ready, and play it safely if needed*/
          card.addEventListener("mousemove", function (event) {
          const video = this.getElementsByTagName("video")[0];

          if (video.readyState >= 2) {
            const rect = video.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const relativePosition = mouseX / rect.width;

            if (!video.duration) return;

            video.currentTime = relativePosition * video.duration;
            /* Wait a tick before trying to play the video Helps avoid timing issues if the video isn't quite ready yet*/
            requestAnimationFrame(() => {
            if (video.paused || video.currentTime === 0) 
              video.play().catch(err => { if (err.name !== "AbortError") console.warn("Play error:", err) });
              });
            }
          });

          card.addEventListener("mouseleave", function (e) {
            const allMediaElements = document.querySelectorAll("video");
            allMediaElements.forEach((otherMedia) => {
              if (!otherMedia.paused) otherMedia.pause();
            });
            // const video = this.getElementsByTagName("video")[0];
            // video.pause();
          });

          const ratio = document.createElement("span");
          ratio.classList.add("video-ratio");
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
       viewIcon.classList.add("fi","fi-rr-eye");
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
      likeIcon.classList.add("fi","fi-rr-heart");
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
      dislikeIcon.classList.add("fi","fi-rr-heart-crack");
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
      commentIcon.classList.add("fi","fi-rr-comment-dots");
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
      
      card.addEventListener("click", function handleCardClick() {
        postClicked(objekt);
      });
      // Die <section class="card"> in das übergeordnete Container-Element hinzufügen
      parentElement.appendChild(card);
    });
    //console.log(posts.data.listPosts.affectedRows.length);
    postoffset += posts.data.listPosts.affectedRows.length;

     const post_loader = document.getElementById("post_loader");
    const no_post_found = document.getElementById("no_post_found");
    //console.log(posts.data.listPosts.counter +"---"+posts.data.listPosts.affectedRows.length);
    if(posts.data.listPosts.counter==0 && posts.data.listPosts.affectedRows.length==0) // no  post found 
    { 
      no_post_found.classList.add("active");
      post_loader.classList.add("hideloader");
    }else{
      no_post_found.classList.remove("active");
      post_loader.classList.remove("hideloader");
    }
	 
}

async function toggleFollowStatus(userid) {
        const accessToken = getCookie("authToken");
        const query = `
          mutation ToggleUserFollowStatus($userid: ID!) {
            toggleUserFollowStatus(userid: $userid) {
              status
              ResponseCode
              isfollowing
            }
          }
        `;

        const variables = { userid };

        try {
          const response = await fetch(GraphGL,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ query, variables })
          });

          const result = await response.json();

          if (result.data && result.data.toggleUserFollowStatus) {
            return result.data.toggleUserFollowStatus.isfollowing;
          } else {
            console.error("GraphQL error:", result.errors);
            return null;
          }
        } catch (error) {
          console.error("Network error:", error);
          return null;
        }
}

function renderFollowButton(objekt, currentUserId) {
        if (objekt.user.id === currentUserId) return null;

        const followButton = document.createElement("button");
        followButton.classList.add("follow-button");

        const followerCountSpan = document.getElementById("following");

        // Check for peer status initially
        if (objekt.user.isfollowed && objekt.user.isfollowing) {
          followButton.classList.add("following");
          followButton.textContent = "Peer";
        } else if (objekt.user.isfollowed) {
          followButton.classList.add("following");
          followButton.textContent = "Following";
        } else {
          followButton.textContent = "Follow +";
        }

        followButton.addEventListener("click", async function (event) {
          event.stopPropagation();
          event.preventDefault();

          const newStatus = await toggleFollowStatus(objekt.user.id);

          if (newStatus !== null) {
            objekt.user.isfollowed = newStatus;

            const isfollowed = objekt.user.isfollowed;
            const isfollowing = objekt.user.isfollowing;

            if (followerCountSpan) {
              let count = parseInt(followerCountSpan.textContent, 10) || 0;
              count = newStatus ? count + 1 : Math.max(0, count - 1);
              followerCountSpan.textContent = count;
            }

            followButton.classList.toggle("following", isfollowed);

            if (isfollowed && isfollowing) {
              followButton.textContent = "Peer";
            } else if (isfollowed) {
              followButton.textContent = "Following";
            } else {
              followButton.textContent = "Follow +";
            }
          } else {
            alert("Failed to update follow status. Please try again.");
          }
        });
        return followButton;
}

function like_dislike_post(objekt, action, el) {
  const isLike = action === "like";
  const apiCall = isLike ? likePost : dislikePost;
  const className = "active";
  const span = el.querySelector("span");
  const keyIsClicked = isLike ? "isliked" : "isdisliked";
  const keyAmount = isLike ? "amountlikes" : "amountdislikes";

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

function  redirectToProfile (objekt, el) {
  window.location.href = `view-profile.php?user=${objekt.user.id}`;
}
  
let timerId = null;
function cancelTimeout() {
  clearTimeout(timerId);
}

async function viewed(object) {
  viewPost(object.id);
  object.isviewed = true;
  // console.log(object.id);
}

async function postClicked(objekt) {
    const UserID = getCookie("userID");
    if (!objekt.isviewed && objekt.user.id !== UserID) timerId = setTimeout(() => viewed(objekt), 1000);
    togglePopup("cardClicked");

    document.getElementById("cardClicked").setAttribute("postID", objekt.id);
    document.getElementById("cardClicked").setAttribute("content", objekt.contenttype);
    

    const postContainer = document.getElementById("viewpost-container");

    const containerleft = postContainer.querySelector(".viewpost-left");
    const containerright = postContainer.querySelector(".viewpost-right");
    const post_gallery = containerleft.querySelector(".post_gallery");
    post_gallery.innerHTML="";
    const post_contentletf=containerleft.querySelector(".post_content");
    if(post_contentletf)   post_contentletf.remove();

    const post_contentright=containerright.querySelector(".post_content");
    
    const array = JSON.parse(objekt.media);
    //const arraycover = JSON.parse(objekt.cover);
    let card = document.getElementById(objekt.id);
    /*--------Card profile Header  -------*/
    const card_header =card.querySelector(".card-header");
    const username = card_header.querySelector(".post-userName:not(.profile_id)")?.textContent.trim();
    const profile_id = card_header.querySelector(".post-userName.profile_id")?.textContent.trim();
    const user_img_src = card_header.querySelector(".post-userImg")?.getAttribute("src");
    //const followbutton = card_header.querySelector(".card-header-right")?.outerHTML ?? "";

    const post_userName=postContainer.querySelector(".post-userName");
    post_userName.innerHTML=username;

    const conprofile_id =postContainer.querySelector(".profile_id");
    conprofile_id.innerHTML=profile_id;

    const post_userImg=postContainer.querySelector(".post-userImg");
    post_userImg.src=user_img_src;

    const followButton = renderFollowButton(objekt, UserID);
    if (followButton) {
      const post_followbtn=postContainer.querySelector(".profile-header-right");
      post_followbtn.innerHTML="";
      post_followbtn.appendChild(followButton);
    }
    const profile_header_left=postContainer.querySelector(".profile-header-left");
   
    profile_header_left.addEventListener("click",
        function handledisLikeClick(event) {
          event.stopPropagation();
          event.preventDefault();
          redirectToProfile(objekt, this);
        }  
      );

    /*--------END: Card profile Header  -------*/
    
    /*--------Card Post Title and Text  -------*/
    

    const cont_post_text=containerright.querySelector(".post_text");
    const cont_post_title=containerright.querySelector(".post_title h2");
    const cont_post_time=containerright.querySelector(".timeagao");
    const cont_post_tags=containerright.querySelector(".hashtags");


    
    const card_post_text = card.querySelector(".post-text");
    cont_post_text.innerHTML = card_post_text.innerHTML;

    const post_title = card.querySelector(".post-title");
    const title_text = post_title.childNodes[0].textContent.trim();
    cont_post_title.innerHTML = title_text;

    const post_time = card.querySelector(".timeAgo");
    cont_post_time.innerHTML = post_time.innerHTML;

    const hashtags = card.querySelector(".hashtags");
    cont_post_tags.innerHTML = hashtags.innerHTML;

    /*--------END : Card Post Title and Text  -------*/

    
    
    

    if (objekt.contenttype === "audio") {
      post_gallery.classList.add("audio");
      post_gallery.classList.remove("multi");
      post_gallery.classList.remove("images");
      post_gallery.classList.remove("video");
      for (const item of array) {
        const audio = document.createElement("audio");
        audio.id = "audio2";
        audio.src = tempMedia(item.path);
        audio.controls = true;
        audio.className = "custom-audio";

        // 1. Erzeuge das <div>-Element
        const audioContainer = document.createElement("div");
        //audioContainer.id = "audio-container"; // Setze die ID
         audioContainer.classList.add("audio-item");

        if (objekt.cover) {
          const cover = JSON.parse(objekt.cover);
          img = document.createElement("img");
          img.classList.add("cover");
          img.onload = () => {
            img.setAttribute("height", img.naturalHeight);
            img.setAttribute("width", img.naturalWidth);
          };
          img.src = tempMedia(cover[0].path);
          img.alt = "Cover";
          audioContainer.appendChild(img);
        }
        // 2. Erzeuge das <canvas>-Element
        const canvas = document.createElement("canvas");
        canvas.id = "waveform-preview"; // Setze die ID für das Canvas

        // 3. Erzeuge das <button>-Element
        const button = document.createElement("button");
        button.id = "play-pause"; // Setze die ID für den Button
        // button.textContent = "Play"; // Setze den Textinhalt des Buttons

        // 4. Füge die Kinder-Elemente (Canvas und Button) in das <div> ein
        let cover = null;
        if (objekt.cover) {
          cover = JSON.parse(objekt.cover);
        }
        const audio_player = document.createElement("div");
        audio_player.className = "audio_player_con";
        const timeinfo = document.createElement("div");
        timeinfo.className = "time-info";
        timeinfo.innerHTML = `
          <span id="current-time">0:00</span> / <span id="duration">0:00</span>
        `;
        audio_player.appendChild(timeinfo);
        audio_player.appendChild(canvas);
        audio_player.appendChild(button);
        
        audioContainer.appendChild(audio_player);
        // audioContainer.appendChild(audio);
        // 5. Füge das <div> in das Dokument ein (z.B. ans Ende des Body)
        post_gallery.appendChild(audioContainer);

        initAudioplayer("waveform-preview", audio.src);
      }
    } else if (objekt.contenttype === "video") {
      post_gallery.classList.add("video");
      if (array.length > 1) post_gallery.classList.add("multi");
      else post_gallery.classList.remove("multi");
      post_gallery.classList.remove("images");
      post_gallery.classList.remove("audio");

        post_gallery.innerHTML = `
            <div class="slider-wrapper">
              <div class="slider-track"></div>
              <div class="slider-thumbnails"></div>
              </div>
          `;
      const sliderTrack = post_gallery.querySelector(".slider-track");
      const sliderThumb = post_gallery.querySelector(".slider-thumbnails");
      let currentIndex = 0;

      for (const [index, item] of array.entries()) {

        const video = document.createElement("video");
        video.id = "video2";
        video.src = tempMedia(extractAfterComma(item.path));
        video.controls = true;
        video.className = "custom-video";
        video.autoplay = (index === 0);  // ✅ Autoplay only for the first video
        video.muted = false;
        video.loop = true;
        
        const videoContainer = document.createElement("div");
        videoContainer.classList.add("slide_item");
        videoContainer.appendChild(video);

        // Thumbnail
        const img = document.createElement("img");
        const src = 'img/audio-bg.png';
        img.src = src;
        img.alt = "";

        const timg = document.createElement("div");
        timg.classList.add("timg");

        const playicon = document.createElement("i");
        playicon.classList.add("fi", "fi-sr-play");

        timg.appendChild(playicon);
        timg.appendChild(img);
        sliderThumb.appendChild(timg);
        sliderTrack.appendChild(videoContainer);
      }

      // === Slider Control Logic Outside the Loop === //

      function updateSlider(index) {
        currentIndex = index;

        const targetItem = sliderTrack.children[index];
        const offsetLeft = targetItem.offsetLeft;

        sliderTrack.style.transform = `translateX(-${offsetLeft}px)`;

        // Manage active class
        sliderThumb.querySelectorAll(".timg").forEach((thumb, i) => {
          thumb.classList.toggle("active", i === index);
        });

        // Play the current video and pause others
        sliderTrack.querySelectorAll("video").forEach((vid, i) => {
          //console.log(index +'--'+i);
          if (i === index) {
            vid.play();
          } else {
            vid.pause();
            vid.currentTime = 0;
          }
        });
      }

      // Initialize
      setTimeout(() => updateSlider(0), 50);

      // Add click listeners
      sliderThumb.querySelectorAll(".timg").forEach((thumb, index) => {
        thumb.addEventListener("click", () => {
          updateSlider(index);
        });
      });

    } else if (objekt.contenttype === "text") {
      
      if (containerleft && post_contentright) {
        containerleft.prepend(post_contentright.cloneNode(true)); // copy the node
      }

      for (const item of array) {
      }
    } else {
      let img;
      post_gallery.classList.add("images");
      post_gallery.classList.remove("video");
      post_gallery.classList.remove("audio");
      if (array.length > 1) post_gallery.classList.add("multi");
      else post_gallery.classList.remove("multi");

      
        post_gallery.innerHTML = `
            <div class="slider-wrapper">
              <div class="slider-track"></div>
              <div class="slider-thumbnails"></div>
              </div>
          `;

      const sliderTrack = post_gallery.querySelector(".slider-track");
      const sliderThumb = post_gallery.querySelector(".slider-thumbnails");
      const imageSrcArray = [];
      array.forEach((item, index) => {
        const image_item = document.createElement("div");
        image_item.classList.add("slide_item");

        const img = document.createElement("img");
        const timg = document.createElement("img");
        const src = tempMedia(item.path);
        img.src = src;
        timg.src = src;
        img.alt = "";
        timg.alt = "";

        
        
        image_item.appendChild(timg);

         const timg2 = document.createElement("div");
         timg2.classList.add("timg");
          timg2.appendChild(img);
        sliderThumb.appendChild(timg2);

        const zoomElement = document.createElement("span");
        zoomElement.className = "zoom";
        zoomElement.innerHTML = `<i class="fi fi-sr-expand"></i>`;
        image_item.appendChild(zoomElement);
       
        sliderTrack.appendChild(image_item);


        let currentIndex = 0;

        function updateSlider(index) {
          currentIndex = index;

          const targetItem = sliderTrack.children[index];
          const offsetLeft = targetItem.offsetLeft;

          sliderTrack.style.transform = `translateX(-${offsetLeft}px)`;

          // Manage active class
          sliderThumb.querySelectorAll(".timg").forEach((thumb, i) => {
            thumb.classList.toggle("active", i === index);
          });
        }

        // Initialize active thumbnail
        updateSlider(0);

        // Add click listener to each thumbnail
        sliderThumb.querySelectorAll(".timg").forEach((thumb, index) => {
          thumb.addEventListener("click", () => {
            updateSlider(index);
          });
        });



        imageSrcArray.push(src);

        // Open modal on click
        zoomElement.addEventListener("click", () => {
          openSliderModal(imageSrcArray, index);
        });
        

      });
    }

    /*const title = document.getElementById("comment-title");
    title.innerText = objekt.title;
    const text = document.getElementById("comment-text");
    text.innerText = objekt.mediadescription;*/

    let mostliked = [];
    const comments = document.getElementById("comments");
    const commentsContainer =postContainer.querySelector(".comments-container");
    const comment_count=commentsContainer.querySelector(".comment_count");
    comment_count.innerText = objekt.amountcomments;

    const social =postContainer.querySelector(".social");
    const postViews=social.querySelector(".post-view span ");
    postViews.innerText = objekt.amountviews;

    const postComments=social.querySelector(".post-comments span ");
    postComments.innerText = objekt.amountcomments;

    
    // Zweites -Icon mit #post-like
    const likeContainer = social.querySelector(".post-like ");
    const postLikes=likeContainer.querySelector("span ");
    postLikes.innerText = objekt.amountlikes;    
    
    if (objekt.isliked) {
      likeContainer.classList.add("active");
      
    } else if (objekt.user.id !== UserID) {
      likeContainer.addEventListener(
        "click",
        function handleLikeClick(event) {
          event.stopPropagation();
          event.preventDefault();
          like_dislike_post(objekt, "like", this);
        },
        { capture: true}
      );
    }
      
    const dislikeContainer = social.querySelector(".post-dislike");
    const postdisLikes=dislikeContainer.querySelector("span");
    postdisLikes.innerText = objekt.amountdislikes;
    
    if (objekt.isdisliked) {
      dislikeContainer.classList.add("active");
      
    } else if (objekt.user.id !== UserID) {
      dislikeContainer.addEventListener(
        "click",
        function handleLikeClick(event) {
          event.stopPropagation();
          event.preventDefault();
          like_dislike_post(objekt, "dislike", this);
        },
        { capture: true}
      );
    }



   // document.getElementById("addComment").setAttribute("postID", objekt.id);
    
    comments.innerHTML = "";
	
    objekt.comments
      .slice()
      .reverse()
      .forEach(function (c) {
		  
		  //console.log(c);
        commentToDom(c);
        fetchChildComments(c.commentid).then((result) => {
          if (!result) return;
          result.slice().forEach(function (c2) {
            commentToDom(c2, true);
          });
        });
      });
      /*
    mostliked.sort((a, b) => b.liked - a.liked);
    // console.log(mostliked);
    const mostlikedcontainer = document.getElementById("mostliked");
    mostlikedcontainer.innerHTML = "";
    for (let i = 0; i < 3 && i < mostliked.length; i++) {
      const img = document.createElement("img");

      img.src = mostliked[i].img ? tempMedia(mostliked[i].img.replace("media/", "")) : "svg/noname.svg";
      mostlikedcontainer.appendChild(img);
    }*/


  const postComment = document.getElementById("post_comment");
    const textarea = postComment.querySelector("textarea");
    const button = postComment.querySelector("button");

    // Clean up previous listeners (optional but safer)
    button.replaceWith(button.cloneNode(true));
    textarea.replaceWith(textarea.cloneNode(true));

    const newTextarea = postComment.querySelector("textarea");
    const newButton = postComment.querySelector("button");

    // Submit handler
    function handleCommentSubmit() {
      const content = newTextarea.value.trim();
      const postID = objekt.id;

      if (!content || !postID) {
        Merror("Error","Content or Post ID is missing.");
        return;
      }

      createComment(postID, content).then((result) => {
        if (result && result.data?.createComment?.status === "success") {
          commentToDom(result.data.createComment.affectedRows[0], false);
          newTextarea.value = ""; // Clear textarea
        } else {
          const errorMsg = result?.errors?.[0]?.message || "Failed to post comment.";
          Merror("Error",errorMsg);
        }
      });
    }

    // Click listener
    newButton.addEventListener("click", (e) => {
      e.preventDefault();
      handleCommentSubmit();
    });

    // Enter key listener
    newTextarea.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleCommentSubmit();
      }
    });


}


  function openSliderModal(images, startIndex = 0) {
    const modal = document.getElementById("sliderModal");
    const track = modal.querySelector(".modal-slider-track");
    const closeBtn = modal.querySelector(".close-modal");
    const modalContent = modal.querySelector(".slider-modal-content");
    const thumbnailContainer = modal.querySelector(".modal-thumbnails");

    // Reset track
    track.innerHTML = "";
    thumbnailContainer.innerHTML = "";

    images.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.classList.add("modal-image");
       if (index === startIndex) img.classList.add("active");
      track.appendChild(img);
    });
    // Add thumbnails
    images.forEach((src, index) => {
      const thumb = document.createElement("img");
      thumb.src = src;
      thumb.classList.add("modal-thumbnail");
      if (index === startIndex) thumb.classList.add("active");
      thumb.addEventListener("click", () => {
        current = index;
        update();
      });
      thumbnailContainer.appendChild(thumb);
    });


    let current = startIndex;
    const total = images.length;
    const imageElements = track.querySelectorAll(".modal-image");
    const thumbnailElements = thumbnailContainer.querySelectorAll(".modal-thumbnail");

    function update() {
      imageElements.forEach((img, i) => {
      img.classList.remove("active");
      });

      const activeImg = imageElements[current];
      activeImg.classList.add("active");

      // Wait for image to load before getting dimensions
      if (activeImg.complete) {
        setModalWidth(activeImg);
      } else {
        activeImg.onload = () => setModalWidth(activeImg);
      }
      // Highlight active thumbnail
      thumbnailElements.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === current);
      });
      
    }
    function setModalWidth(img) {
    
    if (img) {
       const width = img.naturalWidth;
      modalContent.style.maxWidth  = `${width}px`;
      track.style.transform = `translateX(-${current * 100}%)`;
    }
  }

    modal.querySelector(".modal-nav.prev").onclick = () => {
      current = (current - 1 + total) % total;
      update();
    };

    modal.querySelector(".modal-nav.next").onclick = () => {
      current = (current + 1) % total;
      update();
    };

    closeBtn.onclick = () => modal.classList.add("hidden");
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    };

    update();
    const navPrev = modal.querySelector(".modal-nav.prev");
  const navNext = modal.querySelector(".modal-nav.next");

  // Hide navigation if only one image
  if (total <= 1) {
    navPrev.style.display = "none";
    navNext.style.display = "none";
    thumbnailContainer.style.display = "none";
  } else {
    navPrev.style.display = "flex";
    navNext.style.display = "flex";
    thumbnailContainer.style.display = "flex";
  }
    modal.classList.remove("hidden");
  }


  function deleteFilter() {
    localStorage.removeItem("filterSettings");
    localStorage.removeItem("tags");
  }

  function saveFilterSettings() {
    let filterSettings = {};
    let checkboxes = document.querySelectorAll('.filterContainer input[type="checkbox"], .filterContainer input[type="radio"]');

    checkboxes.forEach((checkbox) => {
      filterSettings[checkbox.id] = checkbox.checked; // Speichert Name und Zustand
    });
    localStorage.setItem("filterSettings", JSON.stringify(filterSettings)); // In localStorage speichern
	if(document.getElementById("searchGroup")){
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
    if (window.location.pathname.endsWith('dashboard.php')) {
      const searchTagElem = document.getElementById("searchTag");
      if (searchTagElem) {
        searchTagElem.value = localStorage.getItem("tagInput") || "";
      }
    }
    // document.getElementById("searchTag").value = localStorage.getItem("tagInput") || ""; // Tags wiederherstellen
  } 
 