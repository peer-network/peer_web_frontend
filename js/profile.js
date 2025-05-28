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

document.addEventListener("DOMContentLoaded", () => {
  restoreFilterSettings();
  hello();
  getUser().then(profile2 => {
    
   
  const bioPath = profile2.data.getProfile.affectedRows.biography;

  

  // Check if bioPath is valid
  if (bioPath) {
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

  function getUserIdFromUrl() {
    const parts = window.location.pathname.split('/');
    return parts[2]; // ["", "profile", "12345"]
  }

  async function loadProfilePage() {
    const userId = getUserIdFromUrl();
    const profileData = await fetchHelloData(userId);
    // Render profile details...
  }
  loadProfilePage();

  // async function loadProfilePage() {
  //   const userId = getUserIdFromUrl();
  //   console.log('Parsed userId:', userId);

  //   try {
  //     const profileData = await fetchHelloData(userId);
  //     console.log('Fetched profileData:', profileData);

  //     // Check if data exists
  //     if (
  //       profileData &&
  //       profileData.data &&
  //       profileData.data.getProfile &&
  //       profileData.data.getProfile.affectedRows
  //     ) {
  //       // Render profile details...
  //       document.getElementById("username").innerText = profileData.data.getProfile.affectedRows.username;
  //       // ... render the rest
  //     } else {
  //       console.error("Profile data missing or incomplete", profileData);
  //       document.body.innerHTML = "<h2>User not found.</h2>";
  //     }
  //   } catch (error) {
  //     console.error("Failed to load profile:", error);
  //     document.body.innerHTML = "<h2>Failed to load profile.</h2>";
  //   }
  // }



  //window.addEventListener("online", updateOnlineStatus);
  //window.addEventListener("offline", updateOnlineStatus);
  //updateOnlineStatus();


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
  const { hashtags, normalWords } = extractWords(document.getElementById("searchTag").value.toLowerCase());
  const tagInput = normalWords.join(" ");
  const tags = hashtags.join(" ");
  const sortby = document.querySelectorAll('#filter input[type="radio"]:checked');
  const posts = await getPosts(postsLaden.offset, 20, cleanedArray, tagInput, tags, sortby.length ? sortby[0].getAttribute("sortby") : "NEWEST",UserID);
  // console.log(cleanedArray);
  const debouncedMoveEnd = debounce(handleMouseMoveEnd, 300);
  // Übergeordnetes Element, in das die Container eingefügt werden (z.B. ein div mit der ID "container")
  const parentElement = document.getElementById("main"); // Das übergeordnete Element
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
  postsLaden.offset += posts.data.listPosts.affectedRows.length;
}


 
  
});


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
function saveFilterSettings() {
  let filterSettings = {};
  let checkboxes = document.querySelectorAll('#filter input[type="checkbox"], #filter input[type="radio"]');

  checkboxes.forEach((checkbox) => {
    filterSettings[checkbox.id] = checkbox.checked; // Speichert Name und Zustand
  });
  localStorage.setItem("filterSettings", JSON.stringify(filterSettings)); // In localStorage speichern
  localStorage.setItem("tags", document.getElementById("searchGroup").value);
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
  document.getElementById("searchTag").value = localStorage.getItem("tagInput") || ""; // Tags wiederherstellen
}