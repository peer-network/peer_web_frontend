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
  const closeComments = document.getElementById("closeComments");
  if (closeComments) {
    closeComments.addEventListener("click", () => {
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

  const imgContainer = document.getElementById("comment-img-container");

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

  const comment = document.createElement("div");
  comment.classList.add("comment");
  comment.id = c.commentid;
  const postID = document.getElementById("addComment").getAttribute("postID");
  // Benutzerbild <img src="userImage" alt="user image">
  const img = document.createElement("img");
  img.onerror = function () {
    this.src = "svg/noname.svg";
  };
  img.src = c.user && c.user.img ? tempMedia(c.user.img.replace("media/", "")) : "svg/noname.svg";
  img.alt = "user image";
  if (!c.parentid)
    img.addEventListener(
      "click",
      function handleCommentClick(event) {
        event.stopPropagation();
        event.preventDefault();
        const clickedElement = event.currentTarget.parentElement;

        // Ein Attribut auslesen, z. B. 'data-id'
        const attributeValue = clickedElement.getAttribute("postID");
        const parentId = event.currentTarget.parentElement.id;
        createModal({
          title: "Comment",
          message: "Please enter your comment:",
          buttons: ["send", "quit"],
          type: "info",
          textarea: true,
        }).then((result) => {
          // result hat das Format { button: <index>, value: <textarea Inhalt> }
          if (result !== null && result.button == 0 && result.value !== "") {
            createComment(postID, result.value, parentId).then((result) => {
              if (result.data.createComment.status === "success") {
                commentToDom(result.data.createComment.affectedRows[0], false);
              }
            });
          }
          // console.log("Ergebnis:", result);
          // console.log("User clicked Comment: " + event.currentTarget.parentElement.id);
          // window.location.href = "profile.html?user=" + c.user.id;
        });
      },
      { capture: true }
    );
  // Benutzername <span>userName</span>
  //console.log(c);
  let mostliked = [];
  const userNameSpan = document.createElement("span");
  userNameSpan.classList.add("commentUser");
  userNameSpan.textContent = c.user.username;

  // Kommentar-Text <p>commentText</p>
  const commentParagraph = document.createElement("p");
  commentParagraph.textContent = c.content;

  const existingEntry = mostliked.find((entry) => entry.key === c.commentid);

  if (existingEntry) {
    // Wenn der Eintrag existiert, erhöhe den liked-Wert
    existingEntry.liked += c.amountlikes;
  } else {
    // Wenn der Eintrag nicht existiert, füge einen neuen hinzu
    mostliked.push({
      key: c.commentid,
      liked: c.amountlikes,
      img: c.user.img,
      name: c.user.username,
    });
  }

  const svgNS = "http://www.w3.org/2000/svg";
  const likeContainer = document.createElement("div");
  likeContainer.classList.add("likeComment");
  const svgLike = document.createElementNS(svgNS, "svg");
  // svgLike.setAttribute("id", c.commentid);

  if (c.isliked) {
    // svgLike.addEventListener("click", function () {
    //   dislikePost(objekt.id);
    // });
    svgLike.classList.add("fill-red"); // Rot hinzufügen
  } else if (c.user.id !== userID) {
    svgLike.addEventListener(
      "click",
      function handleLikeClick(event) {
        event.stopPropagation();
        event.preventDefault();
        // svgLike.removeEventListener("click", handleLikeClick);
        likeComment(c.commentid).then((result) => {
          if (result) {
            c.isliked = true;
            c.amountlikes++;
            let e = document.getElementById(c.commentid);
            e = e.querySelector(":scope > * > svg");
            e.classList.add("fill-red");

            // Prüfen, ob das <span> "K" oder "M" enthält
            if (e.nextElementSibling.textContent.includes("K") || e.nextElementSibling.textContent.includes("M")) {
              return; // Wenn ja, wird das Hochzählen übersprungen
            } else {
              let currentCount = parseInt(e.nextElementSibling.textContent);
              currentCount++;
              e.nextElementSibling.textContent = formatNumber(currentCount);
            }
          }
        });
      },
      { capture: true, once: true }
    );
  }
  const useLike = document.createElementNS(svgNS, "use");
  useLike.setAttribute("href", "#post-like");
  svgLike.appendChild(useLike);
  likeContainer.appendChild(svgLike);
  const spanLike = document.createElement("span");
  spanLike.textContent = formatNumber(c.amountlikes ? c.amountlikes : 0);
  likeContainer.appendChild(spanLike);

  const commentDate = document.createElement("span");
  commentDate.textContent = "  •  " + timeAgo(c.createdat);
  commentDate.classList.add("commentDate");
  likeContainer.appendChild(commentDate);

  const commentHeader = document.createElement("div");

  // Zusammenfügen der Elemente
  comment.appendChild(img);
  commentHeader.appendChild(userNameSpan);
  commentHeader.appendChild(commentDate);
  commentHeader.classList.add("commentNameTime");

  comment.appendChild(commentHeader);

  // comment.appendChild(commentUser);
  comment.appendChild(commentParagraph);
  comment.appendChild(likeContainer);
  if (c.parentid) {
    const parent = document.getElementById(c.parentid);
    comment.classList.add("comment-reply");
    parent.insertAdjacentElement("afterend", comment);
    // else parent.insertBefore(comment, comments.firstChild);
  } else {
    if (append) comments.appendChild(comment);
    else comments.insertBefore(comment, comments.firstChild);
  }
  // if (objekt.contenttype === "audio") createTemporaryAudioElement(document.getElementById(objekt.media));
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
let postoffset = 0;

async function postsLaden(postbyUserID = null) {
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
  let posts;
  if (postbyUserID != null) {
    posts = await getPosts(postoffset, 20, cleanedArray, tagInput, tags, sortby.length ? sortby[0].getAttribute("sortby") : "NEWEST", postbyUserID);
  } else {
    posts = await getPosts(postoffset, 20, cleanedArray, tagInput, tags, sortby.length ? sortby[0].getAttribute("sortby") : "NEWEST");
  }

  //console.log(posts);
  const debouncedMoveEnd = debounce(handleMouseMoveEnd, 300);
  // Übergeordnetes Element, in das die Container eingefügt werden (z.B. ein div mit der ID "container")
  const parentElement = document.getElementById("allpost"); // Das übergeordnete Element
  let audio, video;
  // Array von JSON-Objekten durchlaufen und für jedes Objekt einen Container erstellen
  posts.data.listPosts.affectedRows.forEach((objekt) => {
    // Haupt-<section> erstellen
    const card = document.createElement("section");
    card.id = objekt.id;
    card.classList.add("card");
    card.setAttribute("tabindex", "0");
    card.setAttribute("content", objekt.contenttype);
    // card.setAttribute("tags", objekt.tags.join(","));
    // <div class="post"> erstellen und Bild hinzufügen

    let postDiv;
    let img;
    postDiv = document.createElement("div");
    postDiv.classList.add("post");
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
      }
    } else if (objekt.contenttype === "video") {
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
                video.play().catch((err) => {
                  if (err.name !== "AbortError") console.warn("Play error:", err);
                });
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
      }
    } else if (objekt.contenttype === "text") {
      for (const item of array) {
        div = document.createElement("div");
        // div.id = objekt.id;
        loadTextFile(tempMedia(item.path), div);
        div.className = "custom-text";
        const h1 = document.createElement("h3");
        h1.textContent = objekt.title;
        postDiv.appendChild(h1);
        postDiv.appendChild(div);
      }
      card.addEventListener("mousemove", function (event) {
        const ctext = this.getElementsByClassName("custom-text")[0];
        // const rect = this.getBoundingClientRect();
        // const mouseY = event.clientY - rect.top;
        // const relativePosition = mouseY / rect.height;
        // setScrollPercent(ctext, relativePosition, true);
        ctext.classList.add("scroll-shadows");
      });
      card.addEventListener("mouseleave", function (e) {
        const ctext = this.getElementsByClassName("custom-text")[0];
        ctext.classList.remove("scroll-shadows");
      });
    }

    const shadowDiv = document.createElement("div");
    shadowDiv.classList.add("shadow");
    postDiv.appendChild(shadowDiv);

    const inhaltDiv = document.createElement("div");
    inhaltDiv.classList.add("post-inhalt");
    const userNameSpan = document.createElement("span");
    userNameSpan.classList.add("post-userName");
    userNameSpan.textContent = objekt.user.username;
    const time_ago = document.createElement("span");
    time_ago.classList.add("post-userName", "timeAgo");
    time_ago.textContent = timeAgo(objekt.createdat);
    const userImg = document.createElement("img");
    userImg.classList.add("post-userImg");
    userImg.onerror = function () {
      this.src = "svg/noname.svg";
    };
    const redirectToProfile = () => {
      window.location.href = `view-profile.php?user=${objekt.user.id}`;
    };

    userNameSpan.addEventListener("click", redirectToProfile);
    userImg.addEventListener("click", redirectToProfile);

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
        const response = await fetch(GraphGL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ query, variables }),
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
      if (objekt.user.id === currentUserId) return;

      const followButton = document.createElement("button");
      followButton.classList.add("follow-button");

      const followerCountSpan = document.getElementById("following");

      if (objekt.user.isfollowed) {
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

          if (followerCountSpan) {
            let count = parseInt(followerCountSpan.textContent, 10) || 0;
            count = newStatus ? count + 1 : Math.max(0, count - 1);
            followerCountSpan.textContent = count;
          } else {
            followButton.textContent = newStatus ? "Following" : "Follow +";
          }

          followButton.textContent = newStatus ? "Following" : "Follow +";
          followButton.classList.toggle("following", newStatus);
        } else {
          alert("Failed to update follow status. Please try again.");
        }
      });

      inhaltDiv.appendChild(followButton);
    }
    renderFollowButton(objekt, UserID);

    userImg.src = objekt.user.img ? tempMedia(objekt.user.img.replace("media/", "")) : "svg/noname.svg";
    const h1 = document.createElement("h3");
    h1.textContent = objekt.title;
    const p = document.createElement("p");
    p.classList.add("post-text");
    p.textContent = objekt.mediadescription;
    inhaltDiv.appendChild(userImg);
    inhaltDiv.appendChild(userNameSpan);
    inhaltDiv.appendChild(time_ago);
    if (objekt.contenttype === "text") {
      // const customText = postDiv.querySelector(".custom-text");
      // customText.prepend(h1);
    } else {
      inhaltDiv.appendChild(h1);
    }
    inhaltDiv.appendChild(p);

    const svgNS = "http://www.w3.org/2000/svg";
    // <div class="social"> erstellen mit Social-Icons und leeren <span>
    const socialDiv = document.createElement("div");
    socialDiv.classList.add("social");
    const viewContainer = document.createElement("div");

    // Erstes SVG-Icon mit #post-view
    const svgView = document.createElementNS(svgNS, "svg");
    const useView = document.createElementNS(svgNS, "use");
    useView.setAttribute("href", "#post-view");
    svgView.appendChild(useView);
    viewContainer.appendChild(svgView);

    // Leeres <span> für #post-view
    const spanView = document.createElement("span");
    spanView.textContent = formatNumber(objekt.amountviews);
    viewContainer.appendChild(spanView);
    socialDiv.appendChild(viewContainer);

    // Zweites SVG-Icon mit #post-like
    const likeContainer = document.createElement("div");

    const svgLike = document.createElementNS(svgNS, "svg");
    // svgLike.setAttribute("id", objekt.id);

    if (objekt.isliked) {
      // svgLike.addEventListener("click", function () {
      //   dislikePost(objekt.id);
      // });
      svgLike.classList.add("fill-red"); // Rot hinzufügen
    } else if (objekt.user.id !== UserID) {
      svgLike.addEventListener(
        "click",
        function handleLikeClick(event) {
          // event.currentTarget.removeEventListener("click", handleLikeClick);
          event.stopPropagation();
          event.preventDefault();
          likePost(objekt.id).then((success) => {
            if (success) {
              objekt.isliked = true;
              let e = document.getElementById(objekt.id);
              const Svg = e.querySelector(".social div:nth-of-type(2) svg");
              Svg.classList.add("fill-red");

              // Prüfen, ob das <span> "K" oder "M" enthält
              if (Svg.nextElementSibling.textContent.includes("K") || Svg.nextElementSibling.textContent.includes("M")) {
                return; // Wenn ja, wird das Hochzählen übersprungen
              } else {
                let currentCount = parseInt(Svg.nextElementSibling.textContent);
                if (currentCount !== currentCount) currentCount = 1;
                else currentCount++;
                Svg.nextElementSibling.textContent = formatNumber(currentCount);
                objekt.amountlikes = currentCount;
              }
            }
          });
        },
        { capture: true, once: true }
      );
    }
    const useLike = document.createElementNS(svgNS, "use");
    useLike.setAttribute("href", "#post-like");
    svgLike.appendChild(useLike);
    likeContainer.appendChild(svgLike);
    const spanLike = document.createElement("span");
    spanLike.textContent = formatNumber(objekt.amountlikes);
    likeContainer.appendChild(spanLike);
    socialDiv.appendChild(likeContainer);

    const commentContainer = document.createElement("div");
    const svgComment = document.createElementNS(svgNS, "svg");
    const useComment = document.createElementNS(svgNS, "use");
    useComment.setAttribute("href", "#post-comment");
    svgComment.appendChild(useComment);
    commentContainer.appendChild(svgComment);

    // Leeres <span> für #post-comment
    const spanComment = document.createElement("span");
    spanComment.textContent = objekt.amountcomments;
    commentContainer.appendChild(spanComment);

    socialDiv.appendChild(commentContainer);

    // Alles in die Haupt-<section> hinzufügen
    card.appendChild(postDiv);
    card.appendChild(inhaltDiv);
    card.appendChild(socialDiv);
    card.addEventListener("click", function handleCardClick() {
      postClicked(objekt);
    });
    // Die <section class="card"> in das übergeordnete Container-Element hinzufügen
    parentElement.appendChild(card);
  });
  postoffset += posts.data.listPosts.affectedRows.length;
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
  //    document.getElementById("header").classList.add("none");
  const imageContainer = document.getElementById("comment-img-container");
  // imageContainer.innerHTML = "";
  const array = JSON.parse(objekt.media);

  if (objekt.contenttype === "audio") {
    for (const item of array) {
      const audio = document.createElement("audio");
      audio.id = "audio2";
      audio.src = tempMedia(item.path);
      audio.controls = true;
      audio.className = "custom-audio";

      // 1. Erzeuge das <div>-Element
      const audioContainer = document.createElement("div");
      audioContainer.id = "audio-container"; // Setze die ID

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
      audioContainer.appendChild(canvas);
      audioContainer.appendChild(button);
      // audioContainer.appendChild(audio);
      // 5. Füge das <div> in das Dokument ein (z.B. ans Ende des Body)
      imageContainer.appendChild(audioContainer);

      initAudioplayer("waveform-preview", audio.src);
    }
  } else if (objekt.contenttype === "video") {
    for (const item of array) {
      const video = document.createElement("video");
      video.id = "video2";
      video.src = tempMedia(extractAfterComma(item.path));
      video.controls = true;
      video.className = "custom-video";
      video.autoplay = true; // Autoplay aktivieren
      video.muted = false; // Stummschaltung aktivieren (wichtig für Autoplay)
      video.loop = true; // Video in Endlosschleife abspielen

      // 1. Erzeuge das <div>-Element
      const videoContainer = document.createElement("div");
      videoContainer.appendChild(video);
      videoContainer.id = "video-container"; // Setze die ID

      // videoContainer.appendChild(video);
      // 5. Füge das <div> in das Dokument ein (z.B. ans Ende des Body)
      imageContainer.appendChild(videoContainer);
    }
  } else if (objekt.contenttype === "text") {
    for (const item of array) {
      const div = document.createElement("div");
      div.id = "text";

      let card = document.getElementById(objekt.id);
      const textcontainer = card.querySelector(".custom-text");

      div.innerHTML = textcontainer.innerHTML;
      div.className = "custom-text clicked";
      imageContainer.appendChild(div);
    }
  } else {
    let img;
    imageContainer.classList.add("comment-img");
    if (array.length > 1) imageContainer.classList.add("multi");
    else imageContainer.classList.remove("multi");
    for (const item of array) {
      img = document.createElement("img");
      img.src = tempMedia(item.path);
      img.alt = "";
      // img.addEventListener("click", function () {
      //   showImg(img);
      // });
      imageContainer.appendChild(img);
    }
  }

  const title = document.getElementById("comment-title");
  title.innerText = objekt.title;
  const text = document.getElementById("comment-text");
  text.innerText = objekt.mediadescription;

  let mostliked = [];
  const comments = document.getElementById("comments");
  document.getElementById("comment-sum").innerText = objekt.amountcomments;
  document.getElementById("addComment").setAttribute("postID", objekt.id);
  document.getElementById("postViews").innerText = objekt.amountviews;
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
  mostliked.sort((a, b) => b.liked - a.liked);
  // console.log(mostliked);
  const mostlikedcontainer = document.getElementById("mostliked");
  mostlikedcontainer.innerHTML = "";
  for (let i = 0; i < 3 && i < mostliked.length; i++) {
    const img = document.createElement("img");

    img.src = mostliked[i].img ? tempMedia(mostliked[i].img.replace("media/", "")) : "svg/noname.svg";
    mostlikedcontainer.appendChild(img);
  }
  // const topcommenter = document.createElement("span");
  // topcommenter.textContent = mostliked.length ? mostliked[0].name + " and " + objekt.amountlikes + " others liked" : "no one liked";
  // mostlikedcontainer.appendChild(topcommenter);
  document.getElementById("postViews").innerText = objekt.amountviews;
  document.getElementById("postLikes").innerText = objekt.amountlikes;
  const svgLike = document.getElementById("postLikes").previousElementSibling;
  svgLike.classList = "";
  if (objekt.isliked) {
    svgLike.classList = "fill-red";
  } else if (objekt.user.id !== UserID) {
    svgLike.addEventListener(
      "click",
      function handleLikeClick(event) {
        // event.currentTarget.removeEventListener("click", handleLikeClick);
        event.stopPropagation();
        event.preventDefault();
        likePost(objekt.id).then((success) => {
          if (success) {
            objekt.isliked = true;
            let e = document.getElementById(objekt.id);
            const Svg = e.querySelector(".social div:nth-of-type(2) svg");
            Svg.classList.add("fill-red");

            // Prüfen, ob das <span> "K" oder "M" enthält
            if (Svg.nextElementSibling.textContent.includes("K") || Svg.nextElementSibling.textContent.includes("M")) {
              return; // Wenn ja, wird das Hochzählen übersprungen
            } else {
              let currentCount = parseInt(Svg.nextElementSibling.textContent);
              if (currentCount !== currentCount) currentCount = 1;
              else currentCount++;
              Svg.nextElementSibling.textContent = formatNumber(currentCount);
            }
            svgLike.classList = "fill-red";
            if (svgLike.nextElementSibling.textContent.includes("K") || svgLike.nextElementSibling.textContent.includes("M")) {
              return; // Wenn ja, wird das Hochzählen übersprungen
            } else {
              let currentCount = parseInt(svgLike.nextElementSibling.textContent);
              if (currentCount !== currentCount) currentCount = 1;
              else currentCount++;
              svgLike.nextElementSibling.textContent = formatNumber(currentCount);
            }
          }
        });
      },
      { capture: true, once: true }
    );
  }
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
  if (window.location.pathname.endsWith("dashboard.html")) {
    const searchTagElem = document.getElementById("searchTag");
    if (searchTagElem) {
      searchTagElem.value = localStorage.getItem("tagInput") || "";
    }
  }
  // document.getElementById("searchTag").value = localStorage.getItem("tagInput") || ""; // Tags wiederherstellen
}
