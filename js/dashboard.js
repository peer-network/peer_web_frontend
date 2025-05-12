// :TODO VIEWS
function extractWords(str) {
  // Zerlege den String in Wörter anhand von Leerzeichen
  const words = str.split(" ");
  // Filtere alle Wörter, die mit einer Raute beginnen
  const hashtags = words.filter((word) => word.startsWith("#")).map((word) => word.slice(1));
  // Filtere alle Wörter, die nicht mit einer Raute beginnen
  const normalWords = words.filter((word) => !word.startsWith("#"));
  // Rückgabe als Objekt mit beiden Arrays
  return { hashtags, normalWords };
}
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
function handleMouseMoveEnd(video) {
  video.play();
}
let mostliked = [];
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
        });
        // console.log("User clicked Comment: " + event.currentTarget.parentElement.id);
        // window.location.href = "profile.html?user=" + c.user.id;
      },
      { capture: true }
    );
  // Benutzername <span>userName</span>
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

document.addEventListener("DOMContentLoaded", () => {
  restoreFilterSettings();
  hello();
  getUser();
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  updateOnlineStatus();
  // const createFilsters = document.getElementById("overlay");
  // createFilsters.addEventListener("change", (event) => {
  //   // Prüfen, ob das Event von einem Radio-Button stammt
  //   if (event.target.type === "radio") {
  //     const fileInput = document.getElementById("file-input");
  //     fileInput.accept = event.target.value;
  //   }
  // });

  // const editProfilPicture = document.getElementById("editProfileImage");
  // editProfilPicture.addEventListener("click", () => {
  //   document.getElementById("profileImageInput").click();
  //   document.getElementById("cropButton").classList.remove("none");
  //   const profileImageInput = document.getElementById("profileImageInput");
  //   const image = document.getElementById("profilbild");
  //   const cropContainer = document.getElementById("cropContainer");
  //   const result = document.getElementById("result");

  //   // Globale Variablen für Translation und Zoom
  //   let offsetX = 0,
  //     offsetY = 0;
  //   let currentZoom = 1;

  //   // Variablen für Dragging
  //   let isDragging = false,
  //     startX = 0,
  //     startY = 0;

  //   // Variablen für Touch-Pinch
  //   let isPinching = false;
  //   let lastTouchDistance = 0;

  //   // Aktualisiert die Transformation des Bildes (Translation & Scale)
  //   function updateTransform() {
  //     image.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${currentZoom})`;
  //   }

  //   // Bild laden
  //   profileImageInput.addEventListener("change", function (e) {
  //     const file = e.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = function (evt) {
  //         image.src = evt.target.result;
  //         image.style.display = "block";
  //         // Reset initial values
  //         offsetX = 0;
  //         offsetY = 0;
  //         currentZoom = 1;
  //         updateTransform();
  //         image.onload = function () {
  //           // Optional: Bild innerhalb des Containers zentrieren
  //           offsetX = (cropContainer.clientWidth - image.naturalWidth) / 2;
  //           offsetY = (cropContainer.clientHeight - image.naturalHeight) / 2;
  //           updateTransform();
  //         };
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   });

  //   // ------------------- Maussteuerung -------------------
  //   image.addEventListener("mousedown", function (e) {
  //     isDragging = true;
  //     startX = e.clientX;
  //     startY = e.clientY;
  //     e.preventDefault();
  //   });

  //   document.addEventListener("mousemove", function (e) {
  //     if (!isDragging) return;
  //     const dx = e.clientX - startX;
  //     const dy = e.clientY - startY;
  //     startX = e.clientX;
  //     startY = e.clientY;
  //     offsetX += dx;
  //     offsetY += dy;
  //     updateTransform();
  //   });

  //   document.addEventListener("mouseup", function () {
  //     isDragging = false;
  //   });

  //   // Zoom via Mausrad – Setzt transform-origin anhand der Mausposition
  //   cropContainer.addEventListener("wheel", function (e) {
  //     e.preventDefault();
  //     const rect = cropContainer.getBoundingClientRect();
  //     // Mausposition relativ zum Container
  //     const mouseX = e.clientX - rect.left;
  //     const mouseY = e.clientY - rect.top;
  //     // Berechne den Punkt im Bild (unter Berücksichtigung der aktuellen Verschiebung)
  //     const originX = mouseX - offsetX;
  //     const originY = mouseY - offsetY;
  //     image.style.transformOrigin = `${originX}px ${originY}px`;

  //     // Aktualisiere den Zoomfaktor
  //     if (e.deltaY < 0) {
  //       currentZoom *= 1.1;
  //     } else {
  //       currentZoom /= 1.1;
  //     }
  //     // Begrenzung des Zooms
  //     currentZoom = Math.min(Math.max(currentZoom, 0.5), 3);
  //     updateTransform();
  //   });

  //   // ------------------- Touch-Steuerung -------------------
  //   image.addEventListener(
  //     "touchstart",
  //     function (e) {
  //       if (e.touches.length === 1) {
  //         // Ein Finger: Beginne Dragging
  //         isDragging = true;
  //         startX = e.touches[0].clientX;
  //         startY = e.touches[0].clientY;
  //       } else if (e.touches.length === 2) {
  //         // Zwei Finger: Beginne Pinch-Zoom
  //         isPinching = true;
  //         isDragging = false; // Deaktiviere Dragging während des Pinch-Zooms
  //         const [touch1, touch2] = e.touches;
  //         lastTouchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
  //       }
  //       e.preventDefault();
  //     },
  //     { passive: false }
  //   );

  //   image.addEventListener(
  //     "touchmove",
  //     function (e) {
  //       if (isDragging && e.touches.length === 1) {
  //         // Verschiebe das Bild mit einem Finger (Drag)
  //         const touch = e.touches[0];
  //         const dx = touch.clientX - startX;
  //         const dy = touch.clientY - startY;
  //         startX = touch.clientX;
  //         startY = touch.clientY;
  //         offsetX += dx;
  //         offsetY += dy;
  //         updateTransform();
  //       } else if (isPinching && e.touches.length === 2) {
  //         // Pinch-Zoom mit zwei Fingern
  //         const [touch1, touch2] = e.touches;
  //         const newDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
  //         // Berechne den Mittelpunkt der beiden Finger relativ zum Container
  //         const rect = cropContainer.getBoundingClientRect();
  //         const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
  //         const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
  //         // Berechne den Punkt im Bild (unter Berücksichtigung der Verschiebung)
  //         const originX = centerX - offsetX;
  //         const originY = centerY - offsetY;
  //         image.style.transformOrigin = `${originX}px ${originY}px`;

  //         // Aktualisiere den Zoomfaktor anhand des Abstands
  //         const zoomFactor = newDistance / lastTouchDistance;
  //         currentZoom *= zoomFactor;
  //         currentZoom = Math.min(Math.max(currentZoom, 0.5), 3);
  //         lastTouchDistance = newDistance;
  //         updateTransform();
  //       }
  //       e.preventDefault();
  //     },
  //     { passive: false }
  //   );

  //   image.addEventListener(
  //     "touchend",
  //     function (e) {
  //       // Wenn alle Finger weg sind, beende alle Gesten
  //       if (e.touches.length === 0) {
  //         isDragging = false;
  //         isPinching = false;
  //       }
  //       // Falls noch ein Finger übrig ist, wird wieder Dragging aktiviert
  //       if (e.touches.length === 1) {
  //         isPinching = false;
  //         isDragging = true;
  //         startX = e.touches[0].clientX;
  //         startY = e.touches[0].clientY;
  //       }
  //       e.preventDefault();
  //     },
  //     { passive: false }
  //   );

  //   // ------------------- Ergebnisanzeige -------------------
  //   document.getElementById("cropButton").addEventListener("click", function () {
  //     const clonedCrop = cropContainer.cloneNode(true);
  //     const clonedImage = clonedCrop.querySelector("img");
  //     if (clonedImage) {
  //       clonedImage.style.cursor = "default";
  //     }
  //     result.innerHTML = "";
  //     result.appendChild(clonedCrop);
  //   });
  //   // alert("Please use the profile page to edit your profile picture.");
  // });

  const everything = document.getElementById("everything");
  everything.addEventListener("click", () => {
    deleteFilter();
    location.reload();
  });
  const closeComments = document.getElementById("closeComments");
  closeComments.addEventListener("click", () => {
    togglePopup("cardClicked");
    cancelTimeout();
    document.getElementById("header").classList.remove("none");
  });
  const addComment = document.getElementById("addComment");
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
          if (result.data.createComment.status === "success") {
            commentToDom(result.data.createComment.affectedRows[0], false);
          }
        });
      }
      // console.log("Ergebnis:", result);
    });
    // document.getElementById("commentInput").focus();
    // createComment(attributeValue, "test");
  });

  if (window.matchMedia("(display-mode: standalone)").matches) {
    document.documentElement.requestFullscreen().catch((err) => {
      // console.warn(`Vollbildmodus konnte nicht aktiviert werden: ${err.message}`);
    });
  }

  const imgContainer = document.getElementById("comment-img-container");

  const footer = document.getElementById("footer");
  // Funktion erstellen, die aufgerufen wird, wenn der Footer in den Viewport kommt
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        postsLaden();
        // console.log("Der Footer ist jetzt im Viewport sichtbar!");
      }
    });
  };
  const observerOptions = {
    root: null, // null bedeutet, dass der Viewport als root genutzt wird
    rootMargin: "0px 0px 100% 0px",
    threshold: 0.1, // 10% des Footers müssen im Viewport sein, um die Funktion auszulösen
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  observer.observe(footer);

  function isStringLargerThanMB(str, mb) {
    const byteSize = new TextEncoder().encode(str).length;
    const maxBytes = mb * 1024 * 1024; // Umrechnung von MB in Bytes
    return byteSize > maxBytes;
  }

  document.getElementById("btAddPost").addEventListener("click", function startAddPost() {
    header.classList.add("none");
    togglePopup("addPost");
  });
  const closeAddPost = document.getElementById("closeAddPost");
  closeAddPost.addEventListener("click", () => {
    header.classList.remove("none");
    togglePopup("addPost");
  });
  document.getElementById("createPostNotes").addEventListener("click", async function createPost(event) {
    event.preventDefault(); // Prevent form reload
    const title = document.getElementById("titleNotes").value;
    const textareaValue = document.getElementById("descriptionNotes").value;
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(textareaValue);
    const base64String = btoa(String.fromCharCode(...encodedData));
    const base64WithMime = [`data:text/plain;base64,${base64String}`];
    const tags = tag_getTagArray();

    const gesamtLaenge = base64WithMime.reduce((summe, aktuellerString) => summe + aktuellerString.length, 0);
    const maxBytes = 4 * 1024 * 1024;
    if (gesamtLaenge > maxBytes) {
      Merror("Error", "The text is too large. Please upload a smaller text.");
      return;
    }
    if (
      await sendCreatePost({
        title: title,
        media: base64WithMime,
        contenttype: "text",
        tags: tags,
      })
    ) {
      togglePopup("addPost");
      location.reload();
    }
  });
  document.getElementById("createPostImage").addEventListener("click", async function createPost(event) {
    event.preventDefault(); // Prevent form reload
    const title = document.getElementById("titleImage").value;
    const beschreibung = document.getElementById("descriptionImage").value;
    const imageWrappers = document.querySelectorAll(".create-img");
    const tags = tag_getTagArray();

    const combinedBase64 = Array.from(imageWrappers)
      .map((img) => img.src) // Bildquelle (src) abrufen
      .filter((src) => src.startsWith("data:image/"));
    // // const combinedHTML = Array.from(imageWrappers)
    //   .map((wrapper) => wrapper.outerHTML.trim()) // Get the innerHTML of each element and trim whitespace
    //   .join(" "); // Concatenate the HTML content with a space in between
    const gesamtLaenge = combinedBase64.reduce((summe, aktuellerString) => summe + aktuellerString.length, 0);
    const maxBytes = 4 * 1024 * 1024;
    if (gesamtLaenge > maxBytes) {
      Merror("Error", "The image(s) is too large. Please upload a smaller image(s).");
      return;
    }
    if (
      await sendCreatePost({
        title: title,
        media: combinedBase64,
        mediadescription: beschreibung,
        contenttype: "image",
        tags: tags,
      })
    ) {
      togglePopup("addPost");
      location.reload();
    }
  });
  document.getElementById("createPostAudio").addEventListener("click", async function createPost(event) {
    event.preventDefault(); // Prevent form reload
    const title = document.getElementById("titleAudio").value;
    const beschreibung = document.getElementById("descriptionImage").value;
    const imageWrappers = document.querySelectorAll(".create-audio");
    const tags = tag_getTagArray();

    const combinedBase64 = Array.from(imageWrappers)
      .map((img) => img.src) // Bildquelle (src) abrufen
      .filter((src) => src.startsWith("data:audio/"));

    const gesamtLaenge = combinedBase64.reduce((summe, aktuellerString) => summe + aktuellerString.length, 0);
    const maxBytes = 4 * 1024 * 1024;
    if (gesamtLaenge > maxBytes) {
      Merror("Error", "The audio is too large. Please upload a smaller audio.");
      return;
    }
    const canvas = document.querySelector("#preview-audio > div > canvas");
    const cover = document.querySelector("#preview-cover > div > img");
    let dataURL;
    if (cover) {
      dataURL = [cover.src];
    } else {
      dataURL = [canvas.toDataURL("image/webp", 0.8)];
    }
    if (
      await sendCreatePost({
        title: title,
        media: combinedBase64,
        cover: dataURL,
        mediadescription: beschreibung,
        contenttype: "audio",
        tags: tags,
      })
    ) {
      togglePopup("addPost");

      location.reload();
    }
  });

  document.getElementById("createPostVideo").addEventListener("click", async function createPost(event) {
    event.preventDefault(); // Prevent form reload
    const title = document.getElementById("titleVideo").value;
    const beschreibung = document.getElementById("descriptionVideo").value;
    const imageWrappers = document.querySelectorAll(".create-video");
    const tags = tag_getTagArray();

    const combinedBase64 = Array.from(imageWrappers)
      .map((img) => img.src) // Bildquelle (src) abrufen
      .filter((src) => src.startsWith("data:video/"));
    // .join(" ");
    const gesamtLaenge = combinedBase64.reduce((summe, aktuellerString) => summe + aktuellerString.length, 0);
    const maxBytes = 4 * 1024 * 1024;
    if (gesamtLaenge > maxBytes) {
      Merror("Error", "The video is too large. Please upload a smaller video.");
      return;
    }
    if (
      await sendCreatePost({
        title: title,
        media: combinedBase64,
        mediadescription: beschreibung,
        contenttype: "video",
        tags: tags,
      })
    ) {
      togglePopup("addPost");
      location.reload();
    }
  });

  const textsearch = document.getElementById("searchText");
  textsearch.addEventListener("input", () => {
    const { hashtags, normalWords } = extractWords(textsearch.value.toLowerCase());
    const parentElements = document.querySelectorAll(".card");

    parentElements.forEach((element) => {
      const h1 = element.querySelector("h1");
      const tags = element.getAttribute("tags").split(",");
      const isTitle = !normalWords.length || normalWords.some((word) => h1.innerText.toLowerCase().includes(word.toLowerCase()));
      const isTag = !hashtags.length || tags.some((tag) => tag.includes(hashtags));
      if (isTitle && isTag) {
        element.classList.remove("none");
      } else {
        element.classList.add("none");
      }
    });
    localStorage.setItem("tags", document.getElementById("searchText").value);
    postsLaden();
  });
  const checkboxes = document.querySelectorAll("#filter .filteritem");
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
  const radio = document.querySelectorAll("#filter .chkMost");
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
  // window.addEventListener("resize", () => {
  //   if (window.innerWidth >= 768) {
  //     header.style.top = "0"; // Stelle sicher, dass der Header sichtbar bleibt
  //   }
  // });

  const main = document;
  // let lastScrollPosition = 0;
  // // let offset=0;
  // main.addEventListener("scroll", (e) => {
  //   e = e;
  //   const currentScrollTop = main.scrollingElement.scrollTopMax;
  //   if (window.innerWidth < 9999) {
  //     if (currentScrollTop > lastScrollPosition) {
  //       // Runterscrollen: Header verschwindet
  //       // offset = Math.max( offset - (currentScrollTop - lastScrollPosition),-80);
  //       // header.style.top = `${offset}px`;
  //       header.classList.add("none");
  //     } else if (currentScrollTop < lastScrollPosition) {
  //       // Hochscrollen: Header erscheint wieder
  //       // offset = Math.min( offset - (currentScrollTop - lastScrollPosition),-0);
  //       // header.style.top = `${offset}px`;
  //       header.classList.remove("none");
  //     }
  //   }
  //   // Aktuelle Scroll-Position speichern
  //   lastScrollPosition = currentScrollTop;
  // });
  // let lastScrollTop = 0;

  // window.addEventListener(
  //   "scroll",
  //   function () {
  //     let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  //     if (currentScroll > lastScrollTop) {
  //       // Runter gescrollt
  //       header.classList.add("none");
  //       // console.log("Runter gescrollt");
  //     } else {
  //       // Hoch gescrollt
  //       header.classList.remove("none");
  //       // console.log("Hoch gescrollt");
  //     }

  //     lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Für negative Werte korrigieren
  //   },
  //   false
  // );
  let lastScrollTop = 0;

  window.addEventListener(
    "scroll",
    debounce(function () {
      let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > lastScrollTop) {
        // Runter gescrollt
        header.classList.add("none");
      } else {
        // Hoch gescrollt
        header.classList.remove("none");
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, 100) // 100 Millisekunden Verzögerung
  );

  // Liste der Dropzonen und Input-Elemente
  const zones = [
    {
      dropArea: document.getElementById("drop-area-image"),
      fileInput: document.getElementById("file-input-image"),
    },
    {
      dropArea: document.getElementById("drop-area-audio"),
      fileInput: document.getElementById("file-input-audio"),
    },
    {
      dropArea: document.getElementById("drop-area-video"),
      fileInput: document.getElementById("file-input-video"),
    },
    {
      dropArea: document.getElementById("drop-area-cover"),
      fileInput: document.getElementById("file-input-cover"),
    },
  ];

  // Gemeinsame Funktionen für die Event-Listener
  function handleClick(fileInput) {
    fileInput.click();
  }

  function handleDragOver(e, dropArea) {
    e.preventDefault();
    dropArea.classList.add("hover");
  }

  function handleDragLeave(dropArea) {
    dropArea.classList.remove("hover");
  }

  async function handleDrop(e, dropArea, processFiles) {
    e.preventDefault();
    dropArea.classList.remove("hover");

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFiles(files, e.currentTarget.id);
    }
  }

  async function handleFileChange(e, processFiles) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await processFiles(files, e.currentTarget.id);
    }
  }

  // Iteration über die Zonen
  zones.forEach(({ dropArea, fileInput }) => {
    // Click-Event für das Öffnen des Dateidialogs
    dropArea.addEventListener("click", () => handleClick(fileInput));

    // Drag-and-Drop-Events
    dropArea.addEventListener("dragover", (e) => handleDragOver(e, dropArea));
    dropArea.addEventListener("dragleave", () => handleDragLeave(dropArea));
    dropArea.addEventListener("drop", (e) => handleDrop(e, dropArea, processFiles));

    // File-Input-Change-Event
    fileInput.addEventListener("change", (e) => handleFileChange(e, processFiles));
  });

  //   const dropArea = document.getElementById("drop-area");
  //   const fileInput = document.getElementById("file-input");

  //   dropArea.addEventListener("click", () => fileInput.click());

  //   dropArea.addEventListener("dragover", (e) => {
  //     e.preventDefault();
  //     dropArea.classList.add("hover");
  //   });

  //   dropArea.addEventListener("dragleave", () => {
  //     dropArea.classList.remove("hover");
  //   });

  //   dropArea.addEventListener("drop", async (e) => {
  //     e.preventDefault();
  //     dropArea.classList.remove("hover");

  //     const files = Array.from(e.dataTransfer.files);
  //     if (files.length > 0) {
  //       processFiles(files);
  //     }
  //   });

  //   fileInput.addEventListener("change", async (e) => {
  //     const files = Array.from(e.target.files);
  //     if (files.length > 0) {
  //       processFiles(files);
  //     }
  //   });
  // postsLaden();
  // postsLaden();
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
    //   const scrollableContainer = event.target.closest(".blockscroll");
    //   if (!scrollableContainer) return; // Nur in bestimmten Containern scrollen
    if (event.currentTarget.className === "scrollable") stopscroll = true;
    event.stopPropagation();
    if (event.currentTarget.id === "main" && stopscroll) {
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

function updateOnlineStatus() {
  const statusBanner = document.getElementById("h1");
  if (!navigator.onLine) {
    // Wenn offline, Banner anzeigen
    statusBanner.classList.add("offline");
    statusBanner.textContent = "offline";
  } else {
    // Wenn online, Banner ausblenden
    statusBanner.classList.remove("offline");
    statusBanner.textContent = "Dashboard";
  }
}

function appendPost(json) {
  const parentElement = document.getElementById("parent-id"); // Das übergeordnete Element
  const letztesDiv = parentElement.lastElementChild;
}

async function postsLaden() {
  const UserID = getCookie("userID");
  if (postsLaden.offset === undefined) {
    postsLaden.offset = 0; // Initialwert
  }

  const form = document.querySelector("#filter");

  const checkboxes = form.querySelectorAll(".filteritem:checked");

  // Die Werte der angehakten Checkboxen sammeln
  const values = Array.from(checkboxes).map((checkbox) => checkbox.name);

  // Werte als komma-getrennte Zeichenkette zusammenfügen
  // const result = values.join(" ");

  // Ergebnis ausgeben
  const cleanedArray = values.map((values) => values.replace(/^"|"$/g, ""));
  // const textsearch = document.getElementById("searchText").value;
  const { hashtags, normalWords } = extractWords(document.getElementById("searchText").value.toLowerCase());
  const textsearch = normalWords.join(" ");
  const tags = hashtags.join(" ");
  const sortby = document.querySelectorAll('#filter input[type="radio"]:checked');
  const posts = await getPosts(postsLaden.offset, 20, cleanedArray, textsearch, tags, sortby.length ? sortby[0].getAttribute("sortby") : "NEWEST");
  // console.log(cleanedArray);
  const debouncedMoveEnd = debounce(handleMouseMoveEnd, 300);
  // Übergeordnetes Element, in das die Container eingefügt werden (z.B. ein div mit der ID "container")
  const parentElement = document.getElementById("main"); // Das übergeordnete Element
  let audio, video;
  // Array von JSON-Objekten durchlaufen und für jedes Objekt einen Container erstellen
  // posts.data.getallposts.affectedRows.forEach((objekt) => {
  posts.data.listPosts.affectedRows.forEach((objekt) => {
    // Haupt-<section> erstellen
    const card = document.createElement("section");
    card.id = objekt.id;
    card.classList.add("card");
    card.setAttribute("tabindex", "0");
    card.setAttribute("content", objekt.contenttype);
    card.setAttribute("tags", objekt.tags.join(","));
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
        card.addEventListener("mousemove", function (event) {
          const video = this.getElementsByTagName("video")[0];

          if (video.readyState >= 2) {
            const rect = video.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const relativePosition = mouseX / rect.width;

            if (!video.duration) return;

            video.currentTime = relativePosition * video.duration;
            if (video.paused || video.currentTime === 0) video.play();
          }

          // debouncedMoveEnd(video);
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
        const h1 = document.createElement("h1");
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
    userImg.src = objekt.user.img ? tempMedia(objekt.user.img.replace("media/", "")) : "svg/noname.svg";
    const h1 = document.createElement("h1");
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
  // postsLaden.offset += posts.data.getallposts.affectedRows.length;
  postsLaden.offset += posts.data.listPosts.affectedRows.length;
}
function togglePopup(popup) {
  const mediaElements = document.querySelectorAll("video, audio");
  mediaElements.forEach((media) => media.pause());
  if (audioplayer) {
    audioplayer.pause();
    audioplayer = null;
  }
  document.body.classList.toggle("noscroll");
  const overlay = document.getElementById("overlay");
  overlay.classList.toggle("none");
  const cc = document.getElementById(popup);
  cc.classList.toggle("none");

  const imageContainer = document.getElementById("comment-img-container");
  imageContainer.innerHTML = "";
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
  document.getElementById("header").classList.add("none");
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

// let isDragging = false;
// let startX = 0;
// let startY = 0;
// let offsetX = 0;
// let offsetY = 0;
// let scale = 1;
// let dragimg;

// function setCSSVariables() {
//   dragimg.style.setProperty("--translate-x", `${offsetX}px`);
//   dragimg.style.setProperty("--translate-y", `${offsetY}px`);
//   dragimg.style.setProperty("--scale", scale);
// }
// function getAbsolutePosition(element) {
//   const rect = element.getBoundingClientRect();
//   const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
//   const scrollTop = window.scrollY || document.documentElement.scrollTop;

//   return {
//     top: rect.top + scrollTop,
//     left: rect.left + scrollLeft,
//   };
// }
// function getAbsolutePosition2(element) {
//   let x = 0,
//     y = 0;

//   while (element) {
//     // Addiere die Position relativ zum Eltern-Element
//     x += element.offsetLeft - element.scrollLeft + element.clientLeft;
//     y += element.offsetTop - element.scrollTop + element.clientTop;

//     // Wechsle zum übergeordneten Element
//     element = element.offsetParent;
//   }

//   return { x, y };
// }

// function extractFromGrid() {
//   const rect = dragimg.getBoundingClientRect();
//   startX = rect.left;
//   startY = rect.top;
//   offsetX = 0;
//   offsetY = 0;
//   scale = 1;
//   // dragimg.style.setProperty("--left", `${rect.left}px`);
//   // dragimg.style.setProperty("--top", `${rect.top}px`);
//   dragimg.style.setProperty("--translate-x", `${offsetX}px`);
//   dragimg.style.setProperty("--translate-y", `${offsetY}px`);
//   dragimg.style.setProperty("--scale", scale);
//   // dragimg.classList.add("absolute");
// }
// function showImg(img) {
//   dragimg = img;
//   extractFromGrid();

//   dragimg.addEventListener("mousedown", (e) => {
//     isDragging = true;
//     startX = e.clientX;
//     startY = e.clientY;
//     dragimg.style.cursor = "grabbing";
//   });

//   document.addEventListener("mousemove", (e) => {
//     if (!isDragging) return;

//     offsetX = e.clientX - startX;
//     offsetY = e.clientY - startY;
//     dragimg.style.setProperty("--translate-x", `${offsetX}px`);
//     dragimg.style.setProperty("--translate-y", `${offsetY}px`);
//   });

//   document.addEventListener("mouseup", () => {
//     isDragging = false;
//     dragimg.style.cursor = "grab";
//   });
//   dragimg.addEventListener("wheel", (e) => {
//     e.preventDefault();

//     const zoomIntensity = 0.01;
//     const rect = dragimg.getBoundingClientRect();

//     // Aktuelle Mausposition relativ zum Bild
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     // Berechnung von transform-origin basierend auf Mausposition
//     const originX = (mouseX / rect.width) * 100;
//     const originY = (mouseY / rect.height) * 100;

//     dragimg.style.setProperty("--transform-origin-x", `${originX}%`);
//     dragimg.style.setProperty("--transform-origin-y", `${originY}%`);

//     // Zoom anpassen
//     scale += e.deltaY > 0 ? -zoomIntensity : zoomIntensity;
//     scale = Math.min(Math.max(scale, 0.5), 3); // Begrenzung des Zooms
//     dragimg.style.setProperty("--scale", scale);
//   });
// }

// // Beispiel:
// const element = document.querySelector("#comment-img-container");
// const position = getAbsolutePosition(element);
// console.log("Absolute Position:", position);

// postsLaden();
// Das Footer-Element auswählen

const header = document.getElementById("header");
// let lastScrollPosition = 0;

// function handleScroll() {
//   const main = document.getElementById("main");
//   // Überprüfen, ob die Bildschirmbreite die Bedingung erfüllt
//   if (window.innerWidth < 1200) {
//     // Beispiel: Nur auf größeren Bildschirmen
//     const currentScrollPosition = main.scrollY;

//     // Header aus dem Viewport scrollen lassen
//     if (currentScrollPosition > lastScrollPosition) {
//       // Runterscrollen: Header verschwindet
//       header.style.top = `-${header.offsetHeight}px`;
//     } else {
//       // Hochscrollen: Header erscheint wieder
//       header.style.top = "0";
//     }

//     // Aktuelle Scroll-Position speichern
//     lastScrollPosition = currentScrollPosition;
//   } else {
//     // Auf kleinen Bildschirmen: Header bleibt sichtbar
//     header.style.top = "0";
//   }
// }

// const main = document.getElementById("main");
// // Scroll-Event-Listener hinzufügen
// main.addEventListener("scroll", handleScroll);

// Responsiveness: Prüfen bei Fensteränderungen

async function processFiles(files, id) {
  const lastDashIndex = id.lastIndexOf("-");
  id = id.substring(lastDashIndex + 1);

  const previewContainer = document.getElementById("preview-" + id);
  let previewItem;
  const maxSizeMB = 4 / 1.3; // Maximale Größe in MB mit umwandlung in base64 (/1.3)
  let size = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    size += file.size;
    if (size > maxSizeMB * 1024 * 1024) {
      Merror("Error", "The file is too large. Please select a file(s) under 4MB.");
      return;
    }
  }
  files.forEach(async (file) => {
    // if (!file.type.startsWith("image/")) {
    //   info("Information", `${file.name} ist keine Bilddatei.`);
    //   return;
    // }

    previewItem = document.createElement("div");
    previewItem.className = "preview-item";
    const type = file.type.substring(0, 5);
    if (type === "audio") {
      previewItem.classList.add("audio-item");
      previewItem.innerHTML = `
      <p>${file.name}</p><canvas id="${file.name}"></canvas>
      <button id="play-pause">Play</button>
      <audio class="image-wrapper create-audio none" alt="Vorschau" controls=""></audio>
      <img src="svg/logo_farbe.svg" class="loading" alt="loading">
      <img src="svg/plus2.svg" class="none btClose deletePost" alt="delete">`;
    } else if (type === "image") {
      previewItem.innerHTML = `
      <p>${file.name}</p>
      <img class="image-wrapper create-img none" alt="Vorschau" />
      <img src="svg/logo_farbe.svg" class="loading" alt="loading">
      <img src="svg/plus2.svg" class="none btClose deletePost" alt="delete">`;
    } else if (type === "video") {
      previewItem.classList.add("video-item");
      previewItem.innerHTML = `
      <p>${file.name}</p>
      <video id="${file.name}" class="image-wrapper create-video none" alt="Vorschau" controls=""></video>
      <img src="svg/logo_farbe.svg" class="loading" alt="loading">
      <img src="svg/plus2.svg" class="none btClose deletePost" alt="delete">`;
    }

    previewContainer.appendChild(previewItem);
    let element;
    if (type === "image") {
      element = previewItem.querySelector("img");
    } else if (type === "audio") {
      element = previewItem.querySelector("audio");
    } else if (type === "video") {
      element = previewItem.querySelector("video");
    }
    const base64 = await convertImageToBase64(file);
    element.src = base64;
    // imageElement.style.display = "block";
    element.classList.remove("none");
    element.nextElementSibling.remove();
    element.nextElementSibling.classList.remove("none");
    if (type === "audio") {
      initAudioplayer(file.name, base64);
    } else if (type === "video") {
      element.autoplay = true;
      element.loop = true;
      element.muted = true; // Optional: Video ohne Ton abspielen
    }
  });
  document.querySelectorAll(".deletePost").forEach(addDeleteListener);
}
function addMediaListener(mediaElement) {
  if (!mediaElement) return; // Sicherheitshalber prüfen, ob das Element existiert

  mediaElement.addEventListener("play", () => {
    // Selektiere alle vorhandenen Medienelemente auf der Seite
    const allMediaElements = document.querySelectorAll("audio, video");
    allMediaElements.forEach((otherMedia) => {
      if (otherMedia !== mediaElement && !otherMedia.paused) {
        otherMedia.pause();
      }
    });
  });
}

// Funktion, die dem Element den Event-Listener hinzufügt
function addDeleteListener(element) {
  // Entfernt eventuelle alte Event-Listener, indem eine benannte Funktion verwendet wird
  element.removeEventListener("click", handleDelete);

  // Fügt den neuen Event-Listener hinzu
  element.addEventListener("click", handleDelete);
}

// Die Funktion, die beim Event aufgerufen wird
function handleDelete(event) {
  event.preventDefault(); // Verhindert Standardverhalten (z. B. Link-Weiterleitung)
  // console.log("Post löschen:", event.target);
  event.target.parentElement.remove();
  // document.getElementById("file-input").value = ""; // Datei-Auswahl zurücksetzen
}
function isFileLargerThanMB(file, mb) {
  const maxBytes = mb * 1024 * 1024; // Umrechnung von MB in Bytes
  return file.size > maxBytes;
}
async function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const type = file.type.substring(0, 5);
    if (type === "audio") {
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file as Base64."));
    } else if (type === "video") {
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file as Base64."));
    } else if (type === "image") {
      const img = new Image();
      reader.onload = () => {
        img.src = reader.result;
      };
      reader.onerror = reject;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // Konvertiere zu WebP und hole die Base64-Daten
        const webpDataUrl = canvas.toDataURL("image/webp");
        resolve(webpDataUrl);
        // resolve(webpDataUrl.split(",")[1]); // Base64-Teil zurückgeben
      };
    }

    reader.readAsDataURL(file);
  });
}
async function fetchTags(searchStr) {
  // if (failedSearches.has(searchStr)) {
  //   return [];
  // }
  for (let failed of failedSearches) {
    if (searchStr.includes(failed)) {
      return [];
    }
  }
  const accessToken = getCookie("authToken");
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });
  const query = `
      query searchTags($searchstr: String!) {
          searchTags(tagname: $searchstr, limit: 10) {
              status
              counter
              ResponseCode
              affectedRows {
                name
            }
          }
      }
  `;

  const variables = { searchstr: searchStr };

  try {
    const response = await fetch(GraphGL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (result.errors) throw new Error(userfriendlymsg(result.data.searchTags.ResponseCode));
    if (!result.data.searchTags.affectedRows.length) {
      failedSearches.add(searchStr);
    }
    return result.data.searchTags.affectedRows;
  } catch (error) {
    // console.error("Error fetching tags:", error);
    return [];
  }
}
const failedSearches = new Set();
const tagInput = document.getElementById("tag-input");
const tagContainer = document.getElementById("tagsContainer");
const dropdownMenu = document.getElementById("dropdownMenu");
if (tagInput) {
  tagInput.addEventListener("input", async function () {
    const searchStr = tagInput.value.trim();
    if (/^[a-zA-Z0-9]+$/.test(tagInput.value.trim())) {
      if (searchStr.length < 3) {
        dropdownMenu.innerHTML = "";
        dropdownMenu.classList.add("none");
        return;
      }
    } else {
      info("Information", "Nur Buchstaben und Zahlen sind erlaubt.");
      return;
    }

    const tags = await fetchTags(searchStr);
    dropdownMenu.innerHTML = "";
    const existingTags = Array.from(tagContainer.children).map((tag) => tag.textContent);

    tags.forEach((tag) => {
      if (!existingTags.includes(tag.name + "X")) {
        const option = document.createElement("div");
        option.textContent = tag.name;
        option.classList.add("dropdown-item");
        option.addEventListener("click", () => {
          tagInput.value = tag.name;
          tag_addTag(tagInput.value.trim());
          tagInput.value = "";
          tagInput.focus();
          dropdownMenu.classList.toggle("none");
        });
        dropdownMenu.appendChild(option);
      }
    });

    dropdownMenu.classList.toggle("none", tags.length == 0);
  });
}

if (tagInput) {
  tagInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && tagInput.value.trim() !== "") {
      if (/^[a-zA-Z0-9]+$/.test(tagInput.value.trim())) {
        tag_addTag(tagInput.value.trim());
        tagInput.value = "";
      } else {
        info("Information", "Nur Buchstaben und Zahlen sind erlaubt.");
      }
    }
  });
}

window.addEventListener("click", function (event) {
  if (!tagInput.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.remove("show");
  }
});
////////////// Tag-System
// const tag_input = document.getElementById("tag-input");
// const tagContainer = document.getElementById("tagsContainer");
// const tag_createButton = document.getElementById("tagCreate");

// tag_input.addEventListener("keypress", function (event) {
//   if (event.key === "Enter" && tag_input.value.trim() !== "") {
//     if (/^[a-zA-Z0-9]+$/.test(tag_input.value.trim())) {
//       tag_addTag(tag_input.value.trim());
//       tag_input.value = "";
//     } else {
//       info("Information", "Nur Buchstaben und Zahlen sind erlaubt.");
//     }
//   }
// });
// async function fetchTags(searchStr) {
//   const query = `
//       query Tagsearch($searchstr: String!) {
//           tagsearch(tagname: $searchstr, limit: 20) {
//               status
//               counter
//               ResponseCode
//               affectedRows
//           }
//       }
//   `;

//   const variables = { searchstr: searchStr };

//   try {
//     const response = await fetch("YOUR_GRAPHQL_ENDPOINT", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query, variables }),
//     });

//     const result = await response.json();
//     return result.data.tagsearch;
//   } catch (error) {
//     console.error("Error fetching tags:", error);
//     return [];
//   }
// }
// tag_createButton.addEventListener("click", function () {
//   if (tag_input.value.trim() !== "") {
//     if (/^[a-zA-Z0-9]+$/.test(tag_input.value.trim())) {
//       tag_addTag(tag_input.value.trim());
//       tag_input.value = "";
//     } else {
//       info("Information", "Nur Buchstaben und Zahlen sind erlaubt.");
//     }
//   }
// });

function tag_addTag(tagText) {
  if (tagContainer.children.length >= 10) {
    info("Information", "Es dürfen maximal 10 Tags erstellt werden.");
    return;
  }
  if (tagContainer.children.length >= 1) {
    const existingTags = Array.from(tagContainer.children).map((tag) => tag.textContent);

    if (existingTags.includes(tagText + "X")) {
      info("Information", "Tag existiert bereits.");
      return;
    }
  }
  const tag = document.createElement("span");
  tag.classList.add("tag");
  tag.textContent = tagText;

  const tag_removeBtn = document.createElement("button");
  tag_removeBtn.textContent = "X";
  tag_removeBtn.classList.add("remove-tag");
  tag_removeBtn.addEventListener("click", function () {
    tagContainer.removeChild(tag);
  });

  tag.appendChild(tag_removeBtn);
  tagContainer.appendChild(tag);
}

function tag_removeAllTags() {
  tagContainer.innerHTML = "";
}
function tag_getTagArray() {
  return Array.from(tagContainer.children).map((tag) => tag.textContent.slice(0, -1));
}
function deleteFilter() {
  localStorage.removeItem("filterSettings");
  localStorage.removeItem("tags");
}

function saveFilterSettings() {
  let filterSettings = {};
  let checkboxes = document.querySelectorAll('#filter input[type="checkbox"], #filter input[type="radio"]');

  checkboxes.forEach((checkbox) => {
    filterSettings[checkbox.id] = checkbox.checked; // Speichert Name und Zustand
  });
  localStorage.setItem("filterSettings", JSON.stringify(filterSettings)); // In localStorage speichern
  localStorage.setItem("tags", document.getElementById("searchText").value);
}
function restoreFilterSettings() {
  let filterSettings = JSON.parse(localStorage.getItem("filterSettings")); // Aus localStorage laden

  if (filterSettings) {
    let checkboxes = document.querySelectorAll('#filter input[type="checkbox"], #filter input[type="radio"]');
    checkboxes.forEach((checkbox) => {
      if (filterSettings[checkbox.id] !== undefined) {
        checkbox.checked = filterSettings[checkbox.id]; // Zustand setzen
      }
    });
  }
  localStorage.getItem("tags"); // Tags wiederherstellen
  if (localStorage.getItem("tags")) { 
    document.getElementById("searchText").value = localStorage.getItem("tags");
  }
  
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister().then(function (success) {
          if (success) {
            // console.log("Service Worker erfolgreich abgemeldet.");
          } else {
            // console.warn("Service Worker konnte nicht abgemeldet werden.");
          }
        });
      }
    })
    .catch(function (error) {
      // console.error("Fehler beim Abrufen der Registrierungen:", error);
    });
}
// function connectImagesWithGradient(container, img1, img2) {
//   // Container und Bilder auswählen
//   const containerEl = document.querySelector(container);
//   const img1El = document.querySelector(img1);
//   const img2El = document.querySelector(img2);

//   // Sicherstellen, dass Elemente existieren
//   if (!containerEl || !img1El || !img2El) {
//     console.error("Eines der Elemente wurde nicht gefunden.");
//     return;
//   }

//   // Sicherstellen, dass der Container relativ positioniert ist
//   const computedStyle = getComputedStyle(containerEl);
//   if (computedStyle.position === "static") {
//     containerEl.style.position = "relative";
//   }

//   // SVG erstellen
//   const svgNS = "http://www.w3.org/2000/svg";
//   const svg = document.createElementNS(svgNS, "svg");
//   const defs = document.createElementNS(svgNS, "defs");
//   const gradient = document.createElementNS(svgNS, "linearGradient");
//   const path = document.createElementNS(svgNS, "path");

//   // Gradient definieren
//   gradient.setAttribute("id", "gradient");
//   gradient.setAttribute("x1", "0%");
//   gradient.setAttribute("y1", "0%");
//   gradient.setAttribute("x2", "100%");
//   gradient.setAttribute("y2", "0%");

//   // Farbverlauf von Weiß zu Transparent
//   const stop1 = document.createElementNS(svgNS, "stop");
//   stop1.setAttribute("offset", "0%");
//   stop1.setAttribute("stop-color", "white");
//   stop1.setAttribute("stop-opacity", "1");

//   const stop2 = document.createElementNS(svgNS, "stop");
//   stop2.setAttribute("offset", "100%");
//   stop2.setAttribute("stop-color", "white");
//   stop2.setAttribute("stop-opacity", "0");

//   gradient.appendChild(stop1);
//   gradient.appendChild(stop2);
//   defs.appendChild(gradient);

//   // SVG-Eigenschaften setzen
//   svg.style.position = "absolute";
//   svg.style.top = "0";
//   svg.style.left = "0";
//   svg.style.width = "100%";
//   svg.style.height = "100%";
//   svg.style.pointerEvents = "none"; // SVG nicht anklickbar machen
//   svg.appendChild(defs);
//   svg.appendChild(path);
//   containerEl.appendChild(svg);

//   // Path für den Bogen setzen
//   const rect1 = img1El.getBoundingClientRect();
//   const rect2 = img2El.getBoundingClientRect();
//   const containerRect = containerEl.getBoundingClientRect();

//   // Koordinaten relativ zum Container berechnen
//   const x1 = rect1.x + rect1.width / 2 - containerRect.x + containerEl.scrollLeft;
//   const y1 = rect1.y + rect1.height / 2 - containerRect.y + containerEl.scrollTop;
//   const x2 = rect2.x + rect2.width / 2 - containerRect.x + containerEl.scrollLeft;
//   const y2 = rect2.y + rect2.height / 2 - containerRect.y + containerEl.scrollTop;

//   // Kontrollpunkt für den Bogen berechnen (Mitte zwischen Punkten, leicht nach oben versetzt)
//   const controlX = (x1 + x2) / 2;
//   const controlY = Math.min(y1, y2) - 50;

//   const d = `M ${x1},${y1} Q ${controlX},${controlY} ${x2},${y2}`;
//   path.setAttribute("d", d);
//   path.setAttribute("fill", "none");
//   path.setAttribute("stroke", "url(#gradient)");
//   path.setAttribute("stroke-width", 2);
// }
