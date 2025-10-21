// likeCost, dislikeCost, commentCost and postCost are global variables and updated in getActionPrices();
let likeCost = 0.3,
  dislikeCost = 0.5,
  commentCost = 0.05,
  postCost = 2;


let baseUrl;

if (location.hostname === "localhost") {
  baseUrl = `${location.origin}${location.pathname.split('/')[1] ? '/' + location.pathname.split('/')[1] + '/' : '/'}`;
} else {
  baseUrl = `${location.origin}/`;
}
//console.log(baseUrl);
// below variable used in wallet module
// need to declare in global scope
let storedUserInfo, balance = null;
// Global variable to hold tokenomics data
window.tokenomicsData = null;

///////////////////////////////
document.addEventListener("DOMContentLoaded", async () => {
  const accessToken = getCookie("authToken");
  if (accessToken) {
    hello();
    getUser();
    dailyfree();
    currentliquidity();
    const userData = await getUserInfo();
    fetchTokenomics();
    initOnboarding();
    // #open-onboarding anchor click par popup kholna
    const openBtn = document.querySelector("#open-onboarding");
    if (openBtn) {
      openBtn.addEventListener("click", function (e) {

        e.preventDefault();
        showOnboardingPopup();
      });
    }

    //console.log(userData.userPreferences.onboardingsWereShown);

    if (userData) {
      const onboardings = userData.userPreferences.onboardingsWereShown || [];
      // Example: check if INTROONBOARDING is already shown
      if (!onboardings.includes("INTROONBOARDING")) {
        setTimeout(async () => {
          await updateUserPreferences();
          showOnboardingPopup();
        }, 2000);
      }
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();
    
  }
});

function getHostConfig() {
  const config = document.querySelector("#config");
  
  if (!config) {
    console.error('Config element not found');
    return { domain: 'getpeer.eu', server: 'test' }; // fallback
  }
  
  const host = config.getAttribute('data-host');
  
  if (!host) {
    console.error('data-host attribute not found');
    return { domain: 'getpeer.eu', server: 'test' }; // fallback
  }
  
  // Remove protocol if present (https://, http://)
  const cleanHost = host.replace(/^https?:\/\//, '');

  
  
  let server, domain;
  
  if (cleanHost) {
    
    
    if (cleanHost === 'peernetwork.eu') {
      domain = cleanHost;
      server = "production";
    } else if (cleanHost === 'getpeer.eu') {
      domain = cleanHost;
      server = 'test';
     
    } else {
      domain = cleanHost;
      server = "test";
    }
  } else {
    domain = 'getpeer.eu';
    server = "test";
  }
  
  return { domain, server };
}

function updateOnlineStatus() {
  const online_status = document.querySelectorAll(".online_status");

  online_status.forEach((status) => {
    if (!navigator.onLine) {
      // Wenn offline, Banner anzeigen
      status.classList.add("offline");
      status.textContent = "offline";
    } else {
      // Wenn online, Banner ausblenden
      status.classList.remove("offline");
      status.textContent = "online";
    }
  });
}

function extractWords(str) {
  const words = str.split(" ");

  const hashtags = words.filter((word) => word.startsWith("#")).map((word) => word.slice(1));

  const usernames = words.filter((word) => word.startsWith("@")).map((word) => word.slice(1));

  const normalWords = words.filter((word) => !word.startsWith("#") && !word.startsWith("@"));

  return {
    hashtags,
    usernames,
    normalWords,
  };
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

function isStringLargerThanMB(str, mb) {
  const byteSize = new TextEncoder().encode(str).length;
  const maxBytes = mb * 1024 * 1024; // Umrechnung von MB in Bytes
  return byteSize > maxBytes;
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


function togglePopup(popup) {
  const mediaElements = document.querySelectorAll("video, audio");
  mediaElements.forEach((media) => media.pause());
  if (audioplayer) {
    audioplayer.pause();
    audioplayer = null;
  }
  document.body.classList.toggle("noscroll");
  //const overlay = document.getElementById("overlay");
  //overlay.classList.toggle("none");
  const cc = document.getElementById(popup);
  cc.classList.toggle("none");

  // const imageContainer = document.getElementById("comment-img-container");
  // imageContainer.innerHTML = "";
}

// daily free actions

async function dailyfree() {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query getDailyFreeStatus {
        getDailyFreeStatus {
          status
          ResponseCode
          affectedRows {
            name
            used
            available
          }
        }
    }`,
  });

  // Define request options
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql,
    redirect: "follow",
  };

  try {
    // Send the request and handle the response
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (result.errors) throw new Error(result.errors[0].message);

    result.data.getDailyFreeStatus.affectedRows.forEach((entry) => {
      const used = document.getElementById(entry.name + "used");
      const available = document.getElementById(entry.name + "available");
      const iconContainer = document.querySelector(`.progress-icons[data-type="${entry.name}"]`);
      if (used) {
        used.innerText = entry.used;
      }
      if (available) {
        available.innerText = entry.available;
      }

      if (iconContainer) {
        const icons = iconContainer.querySelectorAll(".icon");
        icons.forEach((icon, index) => {
          if (index < entry.used) {
            icon.classList.add("filled");
          } else {
            icon.classList.remove("filled");
          }
        });
      }
      // console.log("Entry name:", entry.name, iconContainer);

      // console.log(`Name: ${entry.name}, Used: ${entry.used}, Available: ${entry.available}`);
    });

    return result.data.getDailyFreeStatus;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function getLiquiudity() {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query Balance {
          balance {
              status
              ResponseCode
              currentliquidity
          }
        }`,
  });

  // Define request options
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql,
    redirect: "follow",
  };

  try {
    // Send the request and handle the response
    const response = await fetch(GraphGL, requestOptions);

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
    // Check for errors in GraphQL response
    if (result.errors) throw new Error(result.errors[0].message);
    balance = result.data.balance.currentliquidity;
    return balance;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function currentliquidity(targetId = "token") {
  const token = await getLiquiudity();
  const tokenEl = document.getElementById(targetId);

  if (token !== null && tokenEl) {
    tokenEl.innerText = token;
    const formatted = (token * 0.1).toFixed(2).replace(".", ",") + " €";

    const moneyEl = document.getElementById("money");
    if (moneyEl) {
      moneyEl.innerText = formatted;
    }
  }
}


async function getDailyFreeStatus() {
  const accessToken = getCookie("authToken");

  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query Dailyfreestatus {
		getDailyFreeStatus {
		  status
		  ResponseCode
		  affectedRows {
			name
			used
			available
		  }
		}
	  }`,
  });

  // Define request options
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql,
    redirect: "follow",
  };

  try {
    // Send the request and handle the response
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();

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

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (result.errors) throw new Error(result.errors[0].message);
    return result.data.getDailyFreeStatus.affectedRows;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

function calctimeAgo(datetime) {
  // Clean microseconds and treat as UTC
  const cleaned = datetime.replace(/\.\d+$/, '') + 'Z';
  const timestamp = new Date(cleaned);
  const now = Date.now();

  const elapsed = now - timestamp; // in ms

  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} sec`;
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (weeks < 4) return `${weeks}w`;
  if (months < 12) return `${months}m`;
  return `${years} y`;
}

/*------------ View Post Detail Golobal Function -------------*/
/*--------- These functions are called in load_posts.js and guestpost.js ---------*/

function postdetail(objekt, CurrentUserID) {
  const UserID = CurrentUserID || null; // Default to null if not provided

  const postContainer = document.getElementById("viewpost-container");
  const shareLinkBox = document.getElementById("share-link-box");
  const shareUrl = baseUrl + "post/" + objekt.id;

  const shareLinkInput = shareLinkBox.querySelector(".share-link-input");
  if (shareLinkInput) shareLinkInput.value = shareUrl;

  let copyLinkBtn = shareLinkBox.querySelector(".copy-link-btn");

  // remove old listeners - > element clone 
  const newcopyLinkBtn = copyLinkBtn.cloneNode(true);
  copyLinkBtn.parentNode.replaceChild(newcopyLinkBtn, copyLinkBtn);
  copyLinkBtn = newcopyLinkBtn;

  if (copyLinkBtn && shareLinkInput) {
    copyLinkBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(shareLinkInput.value);
        // Optional: user ko feedback dena
        copyLinkBtn.querySelector("span").textContent = "Copied!";
        setTimeout(() => {
          copyLinkBtn.querySelector("span").textContent = "Copy";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
        alert("Copy failed. Please copy manually.");
      }
    });
  }


  const whatsappShare = "https://wa.me/?text=" + encodeURIComponent(shareUrl);
  shareLinkBox.querySelector(".whatsapplink").setAttribute("href", whatsappShare);

  const telegramShare = "https://t.me/share/url?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent(objekt.title);
  shareLinkBox.querySelector(".telegramlink").setAttribute("href", telegramShare);


 let shareAnchor = postContainer.querySelector(".sharelinks a.share");
  // remove old listeners - > element clone 
  const newshareAnchor = shareAnchor.cloneNode(true);
  shareAnchor.parentNode.replaceChild(newshareAnchor, shareAnchor);
  shareAnchor = newshareAnchor;


  shareAnchor.addEventListener("click", (e) => {
    e.preventDefault();
      const sharebox=document.getElementById('share-link-box');
      sharebox.classList.add('active');
   
  });
  const shareClose=document.getElementById('closeSharebox');
  shareClose.addEventListener("click", (e) => {
    e.preventDefault();
      const sharebox=document.getElementById('share-link-box');
      sharebox.classList.remove('active');
   
  });
  

  let donwloadAnchor = postContainer.querySelector(".more a.download");
  // remove old listeners - > element clone 
  const newdonwloadAnchor = donwloadAnchor.cloneNode(true);
  donwloadAnchor.parentNode.replaceChild(newdonwloadAnchor, donwloadAnchor);
  donwloadAnchor = newdonwloadAnchor;
  //donwloadAnchor.setAttribute("href", "");




  donwloadAnchor.addEventListener("click", (e) => {
    e.preventDefault();
    const downloadUrl = e.target.getAttribute("href");
    // console.log(downloadUrl);
    if (downloadUrl != "") {
      //forceDownload(downloadUrl);
    }
    return false;
  });

  let reportpost_btn = postContainer.querySelector(".more a.reportpost");

  // remove old listeners - > element clone 
  const newreportpost_btn = reportpost_btn.cloneNode(true);
  reportpost_btn.parentNode.replaceChild(newreportpost_btn, reportpost_btn);
  reportpost_btn = newreportpost_btn;


  reportpost_btn.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      reportPost(objekt, postContainer);

    }, {
      capture: true
    }
  );


  const containerleft = postContainer.querySelector(".viewpost-left");
  const containerright = postContainer.querySelector(".viewpost-right");
  const post_gallery = containerleft.querySelector(".post_gallery");
  post_gallery.innerHTML = "";
  const post_contentletf = containerleft.querySelector(".post_content");
  if (post_contentletf) post_contentletf.remove();

  const post_contentright = containerright.querySelector(".post_content");

  const array = JSON.parse(objekt.media);
  //const arraycover = JSON.parse(objekt.cover);

  /*--------Card profile Header  -------*/

  const username = objekt.user.username;
  const profile_id = objekt.user.slug;
  const user_img_src = objekt.user.img ? tempMedia(objekt.user.img) : `${baseUrl}svg/noname.svg`;

  user_img_src.onerror = function () {
    this.src = `${baseUrl}svg/noname.svg`;
  };


  const post_userName = postContainer.querySelector(".post-userName");
  post_userName.innerHTML = username;

  const conprofile_id = postContainer.querySelector(".profile_id");
  conprofile_id.innerHTML = "#" + profile_id;

  const post_userImg = postContainer.querySelector(".post-userImg");
  post_userImg.src = user_img_src;
  post_userImg.onerror = function () {
    this.src = `${baseUrl}svg/noname.svg`;
  };

  const followButton = renderFollowButton(objekt, UserID);

  if (followButton) {
    const post_followbtn = postContainer.querySelector(".profile-header-right");
    post_followbtn.innerHTML = "";
    post_followbtn.appendChild(followButton);
  }
  const profile_header_left = postContainer.querySelector(".profile-header-left");

  profile_header_left.addEventListener("click",
    function handledisLikeClick(event) {
      event.stopPropagation();
      event.preventDefault();
      if (UserID && UserID !== null) {
        redirectToProfile(objekt.user.id);
      }

    }
  );

  /*--------END: Card profile Header  -------*/

  /*--------Card Post Title and Text  -------*/
  const cont_post_text = containerright.querySelector(".post_text");
  const cont_post_title = containerright.querySelector(".post_title h2");
  const cont_post_time = containerright.querySelector(".timeagao");
  const cont_post_tags = containerright.querySelector(".hashtags");


  const card_post_text = objekt.mediadescription;
  cont_post_text.innerHTML = card_post_text;

  const post_title = objekt.title;
  const title_text = post_title.trim();
  cont_post_title.innerHTML = title_text;

  const post_time = calctimeAgo(objekt.createdat);
  cont_post_time.innerHTML = post_time;

  // Check if tags exist and are an array
  if (Array.isArray(objekt.tags)) {
    objekt.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "hashtag";
      span.textContent = `#${tag}`;
      cont_post_tags.appendChild(span);
    });
  }
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
      audio_player.id = "audio_player_custom";
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
      if (donwloadAnchor) {

        donwloadAnchor.setAttribute("href", audio.src);
      }
      initAudioplayer("audio_player_custom", audio.src);
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
      video.autoplay = (index === 0); // ✅ Autoplay only for the first video
      video.muted = false;
      video.loop = true;

      let coversrc = 'img/audio-bg.png';
      if (objekt.cover) {
        const cover = JSON.parse(objekt.cover);
        coversrc = tempMedia(cover[0].path);

      }

      const videoContainer = document.createElement("div");
      videoContainer.classList.add("slide_item");
      videoContainer.style.backgroundImage = `url("${coversrc}")`;
      videoContainer.appendChild(video);

      // Thumbnail
      const img = document.createElement("img");

      img.src = coversrc;
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
      if (donwloadAnchor) {
        const video = targetItem.querySelector("video");
        const videoSrc = video ? video.src : null;
        donwloadAnchor.setAttribute("href", videoSrc);
      }

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
    // Swipe logic
      let startX = 0;
      let endX = 0;

      sliderTrack.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
      });

      sliderTrack.addEventListener("touchmove", (e) => {
        endX = e.touches[0].clientX;
      });

      sliderTrack.addEventListener("touchend", () => {
        const diff = startX - endX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
          const totalSlides = sliderTrack.children.length;

          if (diff > 0) {
            currentIndex = (currentIndex + 1) % totalSlides; // Next
          } else {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Prev
          }

          updateSlider(currentIndex);
        }

        startX = 0;
        endX = 0;
      });

  } else if (objekt.contenttype === "text") {
    if (containerleft && post_contentright) {
      containerleft.prepend(post_contentright.cloneNode(true)); // copy the node

      const cont_post_text2 = containerleft.querySelector(".post_text");
      for (const item of array) {
        loadTextFile(tempMedia(item.path), cont_post_text2);
      }
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
                    <div class="thumbs-wrapper">
                      <span class="button nav-button prev_button"><i class="fi fi-rr-angle-left"></i></span>
                      <div class="slider_thumbnails_wrapper">
                        <div class="slider-thumbnails"></div>
                      </div>
                      <span class="button nav-button next_button"><i class="fi fi-rr-angle-right"></i></span>
                    </div>
                  </div>
                `;

    const sliderTrack = post_gallery.querySelector(".slider-track");
    const thumbsWrapper = document.querySelector(".slider_thumbnails_wrapper");
    const sliderThumb = thumbsWrapper.querySelector(".slider-thumbnails");
    const nextBtn = document.querySelector('.next_button');
    const prevBtn = document.querySelector('.prev_button');

    function toggleTheScrollButtons() {
      const totalWidth = sliderThumb.scrollWidth;
      const visibleWidth = thumbsWrapper.clientWidth;
      if (totalWidth > visibleWidth) {
        // Content is overflowing → show arrows depending on scroll position
        if (thumbsWrapper.scrollLeft > 0) {
          prevBtn.classList.remove("none");
        } else {
          prevBtn.classList.add("none");
        }
        if (thumbsWrapper.scrollLeft + visibleWidth < totalWidth) {
          nextBtn.classList.remove("none");
        } else {
          nextBtn.classList.add("none");
        }
      } else {
        // All thumbnails fit → hide both arrows
        nextBtn.classList.add("none");
        prevBtn.classList.add("none");
      }
    }

    nextBtn.addEventListener('click', () => {
      thumbsWrapper.scrollBy({
        left: 150,
        behavior: 'smooth'
      });
    });

    prevBtn.addEventListener('click', () => {
      thumbsWrapper.scrollBy({
        left: -150,
        behavior: 'smooth'
      });
    });

    setTimeout(toggleTheScrollButtons, 0);
    window.addEventListener('resize', toggleTheScrollButtons);
    thumbsWrapper.addEventListener('scroll', toggleTheScrollButtons);
    const imageSrcArray = [];
    array.forEach((item, index) => {
      const image_item = document.createElement("div");
      image_item.classList.add("slide_item");
      //console.log(item)

      const img = document.createElement("img");
      const timg = document.createElement("img");
      const src = tempMedia(item.path);
      img.src = src;
      timg.src = src;
      img.alt = "";
      timg.alt = "";
      image_item.style.backgroundImage = `url("${src}")`;
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
     

      imageSrcArray.push(src);
      // Open modal on click
      zoomElement.addEventListener("click", () => {
        openSliderModal(imageSrcArray, index);
      });
    });

     let currentIndex = 0;

      function updateSlider(index) {
        currentIndex = index;
        const targetItem = sliderTrack.children[index];
        const offsetLeft = targetItem.offsetLeft;
        sliderTrack.style.transform = `translateX(-${offsetLeft}px)`;
        if (donwloadAnchor) {
          const img = targetItem.querySelector("img");
          const imgSrc = img ? img.src : null;
          donwloadAnchor.setAttribute("href", imgSrc);
        }
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

       

      // Swipe logic
      let startX = 0;
      let endX = 0;

      sliderTrack.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
      });

      sliderTrack.addEventListener("touchmove", (e) => {
        endX = e.touches[0].clientX;
      });

      sliderTrack.addEventListener("touchend", () => {
        const diff = startX - endX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
          const totalSlides = sliderTrack.children.length;

          if (diff > 0) {
            currentIndex = (currentIndex + 1) % totalSlides; // Next
          } else {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Prev
          }

          updateSlider(currentIndex);
        }

        startX = 0;
        endX = 0;
      });

  }

  /*const title = document.getElementById("comment-title");
  title.innerText = objekt.title;
  const text = document.getElementById("comment-text");
  text.innerText = objekt.mediadescription;*/

  // let mostliked = [];
  const comments = document.getElementById("comments");
  const commentsContainer = postContainer.querySelector(".comments-container");
  const comment_count = commentsContainer.querySelector(".comment_count");
  comment_count.innerText = objekt.amountcomments;
  const social = postContainer.querySelector(".social");
  const postViews = social.querySelector(".post-view span ");
  postViews.innerText = objekt.amountviews;

  const postComments = social.querySelector(".post-comments span ");
  postComments.innerText = objekt.amountcomments;


  // Zweites -Icon mit #post-like
  const likeContainer = social.querySelector(".post-like ");
  let postlikeIcon = likeContainer.querySelector("i");
  const postLikes = likeContainer.querySelector("span ");
  postLikes.innerText = objekt.amountlikes;
  likeContainer.classList.remove("active");

  if (objekt.isliked) {
    likeContainer.classList.add("active");

  } else if (objekt.user.id !== UserID && UserID !== null) {

    // Purane listeners remove karne ke liye element clone karo
    const newPostlikeIcon = postlikeIcon.cloneNode(true);
    postlikeIcon.parentNode.replaceChild(newPostlikeIcon, postlikeIcon);
    postlikeIcon = newPostlikeIcon;

    postlikeIcon.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
        event.preventDefault();
        like_dislike_post(objekt, "like", likeContainer);

      }, {
        capture: true
      }
    );

  }

  const dislikeContainer = social.querySelector(".post-dislike");
  let postdislikeIcon = dislikeContainer.querySelector("i");
  const postdisLikes = dislikeContainer.querySelector("span");
  postdisLikes.innerText = objekt.amountdislikes;
  dislikeContainer.classList.remove("active");

  if (objekt.isdisliked) {
    dislikeContainer.classList.add("active");

  } else if (objekt.user.id !== UserID && UserID !== null) {
    // Purane listeners remove karne ke liye element clone karo
    const newPostDislikeIcon = postdislikeIcon.cloneNode(true);
    postdislikeIcon.parentNode.replaceChild(newPostDislikeIcon, postdislikeIcon);
    postdislikeIcon = newPostDislikeIcon;

    postdislikeIcon.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
        event.preventDefault();
        like_dislike_post(objekt, "dislike", dislikeContainer);

      }, {
        capture: true
      }
    );
  }

  // document.getElementById("addComment").setAttribute("postID", objekt.id);
  comments.innerHTML = "";
  objekt.comments
    .slice()
    .reverse()
    .forEach(function (c) {
      commentToDom(c);
      // if(UserID){ // add this condition not to call on guest user post
      //   fetchChildComments(c.commentid).then((result) => {
      //     if (!result) return;
      //     result.slice().forEach(function (c2) {
      //       commentToDom(c2, true);
      //     });
      //   });
      // }
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
  async function handleCommentSubmit() {
    const content = newTextarea.value.trim();
    const postID = objekt.id;

    if (!postID) {
      Merror("Error", "Content or Post ID is missing.");
      return;
    }
    if (UserID === null) {

      return;
    }
    if (content.length === 0) {
      newTextarea.focus();
      return; // if no content, return
    }
    if (postComment) {
      postComment.classList.add("disbale_click");

      // 3 second baad remove kar do
      setTimeout(() => {
        postComment.classList.remove("disbale_click");
      }, 3000);
    }

    try {
      // Attempt to change the username after passing validations
      const result = await createComment(postID, content);
      if (result && result.data ?.createComment ?.status === "success") {
        dailyfree();
        commentToDom(result.data.createComment.affectedRows[0], false);
        newTextarea.value = ""; // Clear textarea
      }
      /*else {
        const errorMsg = userfriendlymsg(result.data?.createComment?.ResponseCode) || "Failed to post comment.";
        Merror("Error",errorMsg);
                       
      }*/
    } catch (error) {
      console.error("Error during post comment:", error);
    }
  }

  // Click listener
  newButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleCommentSubmit();
  });

  // Enter key listener
  let isSubmitting = false; // flag
  newTextarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const modal = document.querySelector(".modal-container");
      if (modal) {
        const buttonElements = modal.querySelector(".modal-button");
        if (buttonElements) {
          buttonElements.focus();
          isSubmitting = false; // modal ka case, lock hata do
          return;
        }

      }
      const currentTarget = e.currentTarget; // save here
      if (isSubmitting) return; // agar already process ho raha hai to ignore
      isSubmitting = true; // lock
      handleCommentSubmit()
        .finally(() => {
          // jab complete ho jaye to dobara allow karo
          isSubmitting = false;
          if (currentTarget) {
            currentTarget.focus(); // use saved ref
          }
        });
    }
  });
}

function forceDownload(url) {
  const baseUrl = `${location.protocol}//${location.host}/`;
  window.location.href = baseUrl + "download.php?file=" + encodeURIComponent(url);

}

// ============================================
// GLOBAL.JS - Follow Button Renderer
// ============================================

/**
 * Renders a follow button for a single post/profile
 * @param {Object} objekt - Object containing user data
 * @param {string|null} currentUserId - Current logged-in user's ID
 * @returns {HTMLButtonElement|null} Follow button element or null
 */
function renderFollowButton(objekt, currentUserId) {
  if (!objekt?.user?.id || objekt.user.id === currentUserId || !currentUserId) {
    return null;
  }

  const followButton = document.createElement("button");
  followButton.classList.add("follow-button");
  followButton.dataset.userid = objekt.user.id;

  updateFollowButtonState(followButton, objekt.user.isfollowed, objekt.user.isfollowing);

  followButton.addEventListener("click", async (event) => {
    event.stopPropagation();
    event.preventDefault();
    
    await handleFollowButtonClick(followButton, objekt.user);
  });

  return followButton;
}

/**
 * Updates follow button visual state
 * @param {HTMLButtonElement} button - Button element to update
 * @param {boolean} isfollowed - Whether current user follows this user
 * @param {boolean} isfollowing - Whether this user follows current user
 */
function updateFollowButtonState(button, isfollowed, isfollowing) {
  button.classList.remove("Peer", "btn-blue", "following", "btn-white", "follow", "btn-transparent");

  if (isfollowed && isfollowing) {
    button.classList.add("Peer", "btn-blue");
    button.textContent = "Peer";
    button.setAttribute("aria-label", "Mutual followers");
  } else if (isfollowed) {
    button.classList.add("following", "btn-white");
    button.textContent = "Following";
    button.setAttribute("aria-label", "You follow this user");
  } else {
    button.classList.add("follow", "btn-transparent");
    button.textContent = "Follow +";
    button.setAttribute("aria-label", "Follow this user");
  }
}

/**
 * Handles follow button click
 * @param {HTMLButtonElement} button - Button that was clicked
 * @param {Object} user - User object
 */
async function handleFollowButtonClick(button, user) {
  button.disabled = true;

  try {
    const newStatus = await toggleFollowStatus(user.id);

    if (newStatus !== null) {
      user.isfollowed = newStatus;
      updateFollowButtonState(button, user.isfollowed, user.isfollowing);
      updateFollowingCount(newStatus);
    } else {
      showError("Failed to update follow status. Please try again.");
    }
  } catch (error) {
    console.error("Error toggling follow status:", error);
    showError("An error occurred. Please try again.");
  } finally {
    button.disabled = false;
  }
}

/**
 * Updates the following count in the UI
 * @param {boolean} isFollowing - Whether user is now being followed
 */
function updateFollowingCount(isFollowing) {
  const followerCountSpan = document.getElementById("following");
  if (!followerCountSpan) return;

  let count = parseInt(followerCountSpan.textContent, 10) || 0;
  count = isFollowing ? count + 1 : Math.max(0, count - 1);
  followerCountSpan.textContent = count;
}

/**
 * Shows error message (replace with your error notification system)
 * @param {string} message - Error message to display
 */
function showError(message) {
  if (typeof Merror === "function") {
    Merror(message);
  } else {
    alert(message);
  }
}

function redirectToProfile(userProfileID) {
  window.location.href = `view-profile.php?user=${userProfileID}`;
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
      modalContent.style.maxWidth = `${width}px`;
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
    this.src = `${baseUrl}svg/noname.svg`;
  };

  img.addEventListener("click", function handledisLikeClick(event) {
    event.stopPropagation();
    event.preventDefault();
    if (userID && userID !== "") {
      // redirectToProfile(c, this);
      redirectToProfile(c.userid);
    }
  });

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
  const replyContainer = document.createElement("div");
  if (!c.parentid) {
    replyBtn.setAttribute("id", c.commentid);
    replyBtn.classList.add("reply_btn");
    replyBtn.innerHTML = `Reply `;

    replyBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      event.preventDefault();
      if (userID && userID !== null) {
        handleReply(c);
      }
      // Handle reply button click
    });

    const showReply = document.createElement("span");
    showReply.classList.add("show_reply", "txt-color-gray");
    showReply.innerHTML = `Show <span class="reply_total">${c.amountreplies}</span> replies...`;

    const hideReply = document.createElement("span");
    hideReply.classList.add("hide_reply", "txt-color-gray", "none");
    hideReply.innerHTML = `Hide`;


    showReply.addEventListener('click', function () {
      this.classList.add('none')
      hideReply.classList.remove("none");
      
      // fetchChildComments(c.commentid).then((result) => {
      //   if (!result) return;
      //   result.slice().forEach(function (c2) {
      //     commentToDom(c2, true);
      //   });
      // });
    });


    // hideReply.addEventListener('click', function () {
    //   this.closest('.comment_item').classList.add('none')
    //   console.log(' heir ');
    // });

    replyContainer.classList.add("comment_reply_container");
    replyContainer.append(replyBtn, showReply, hideReply);
  }
  // Body container
  const commentBody = document.createElement("div");
  commentBody.classList.add("comment_body");
  commentBody.append(commenterInfoDiv, commentTextDiv, replyContainer);

  // Like
  const likeContainer = document.createElement("div");
  likeContainer.classList.add("comment_like", "md_font_size");

  const likeIcon = document.createElement("i");
  likeIcon.classList.add("peer-icon", "peer-icon-like");
  likeContainer.appendChild(likeIcon);

  const spanLike = document.createElement("span");
  likeContainer.append(spanLike);

  //console.log( userID);
  if (c.isliked) {
    likeContainer.classList.add("active");
  } else if (c.user.id !== userID && userID !== "") {

    likeIcon.addEventListener(
      "click",
      function (event) {
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
      }, {
        capture: true,
        once: true
      }
    );
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


function getPostIdFromURL() {
  // Try query param first (?postid=...)
  const urlParams = new URLSearchParams(window.location.search);
  let postid = urlParams.get("postid");

  if (!postid) {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    // Find "post" in path
    const postIndex = pathParts.indexOf("post");
    if (postIndex !== -1 && pathParts[postIndex + 1]) {
      postid = pathParts[postIndex + 1];
    }
  }

  return postid;
}

// Reusable function to fetch post details
async function fetchPostByID(postID) {
  try {
    const accessToken = getCookie("authToken"); //  token check

    // if logged in then to "ListPosts", else "GuestListPost"
    const queryName = accessToken ? "ListPosts" : "GuestListPost";
    const fieldName = accessToken ? "listPosts" : "guestListPost";

    const headers = new Headers({
      "Content-Type": "application/json",
    });

    // if logged in then to Authorization header add 
    if (accessToken) {
      headers.append("Authorization", `Bearer ${accessToken}`);
    }

    const query = `
            query ${queryName}($postid: ID!) {
                ${fieldName}(postid: $postid) {
                    status
                    ResponseCode
                    affectedRows {
                        id
                        contenttype
                        title
                        media
                        cover
                        mediadescription
                        createdat
                        amountlikes
                        amountviews
                        amountcomments
                        amountdislikes
                        amounttrending
                        isliked
                        isviewed
                        isreported
                        isdisliked
                        issaved
                        tags
                        url
                        user {
                            id
                            username
                            slug
                            img
                            isfollowed
                            isfollowing
                        }
                        comments {
                            commentid
                            userid
                            postid
                            parentid
                            content
                            createdat
                            amountlikes
                            amountreplies
                            isliked
                            user {
                                id
                                username
                                slug
                                img
                                isfollowed
                                isfollowing
                            }
                        }
                    }
                }
            }
        `;

    const response = await fetch(GraphGL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: query,
        variables: {
          postid: postID
        }
      })
    });

    const result = await response.json();

    if (result.data && result.data[fieldName]) {
      return result.data[fieldName].affectedRows; // ✅ dynamic field handle
    } else {
      console.error("GraphQL Error:", result.errors || "No data received");
      return null;
    }

  } catch (error) {
    console.error("GraphQL request failed", error);
    return null;
  }
}
/*------------ End : View Post Detail Golobal Function -------------*/

/*----------- Start : FeedbackPopup Logic --------------*/

// function setCookie(name, value, days = 365) {
//   const expires = new Date(Date.now() + days * 864e5).toUTCString();
//   document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
// }

// function getCookie(name) {
//   return document.cookie.split('; ').reduce((r, v) => {
//     const parts = v.split('=');
//     return parts[0] === name ? decodeURIComponent(parts[1]) : r
//   }, '');
// }

const POPUP_KEY = 'feedbackPopupData';

function getPopupData() {
  const stored = getCookie(POPUP_KEY);
  return stored ? JSON.parse(stored) : {
    count: 0,
    lastClosed: 0,
    disabled: false
  };
}

function setPopupData(data) {
  setCookie(POPUP_KEY, JSON.stringify(data));
}

function showFeedbackPopup() {
  const popup = document.getElementById('feebackPopup');
  popup.classList.remove('none');
  setTimeout(() => {
    popup.querySelector('.feeback_popup_container').classList.add('open');
  }, 100);

  // Increment display count
  const data = getPopupData();
  data.count++;
  setPopupData(data);
}

function closeFeedbackPopup(increment = false) {
  const popup = document.getElementById('feebackPopup');
  popup.querySelector(".feeback_popup_container").classList.remove('open');

  setTimeout(() => {
    popup.classList.add('none');
  }, 200);

  const data = getPopupData();
  if (increment) data.count++;

  data.lastClosed = Date.now();

  const dontShowCheckbox = popup.querySelector('input[name="dont_show_feedbackPopup"]');
  if (dontShowCheckbox ?.checked) {
    data.disabled = true;
  }

  setPopupData(data);
}

function shouldShowPopup() {
  const data = getPopupData();
  const now = Date.now();
  const fiveDays = 5 * 24 * 60 * 60 * 1000;

  //const fiveDays =  60 * 1000; // 1 mint for testing

  const sessionShown = sessionStorage.getItem('popupShown') === 'true';
  const closedRecently = (now - data.lastClosed) < fiveDays;



  if (data.disabled || data.count >= 3 || sessionShown || closedRecently) {

    return false;
  }
  return true;
}

window.addEventListener('load', () => {

  const accessToken = getCookie("authToken");
  if (accessToken) {
    if (shouldShowPopup()) {
      setTimeout(() => {
        showFeedbackPopup();
        sessionStorage.setItem('popupShown', 'true');
      }, 30 * 1000); // 30 seconds
    }
  }

  // Close button
  const closeBtn = document.querySelector('#feebackPopup .close');
  closeBtn ?.addEventListener('click', () => {
    closeFeedbackPopup(); // Do not increment count here, already incremented on show
  });

  // "Share Feedback" button
  const shareBtn = document.querySelector('#feebackPopup a[href*="docs.google.com"]');
  shareBtn ?.addEventListener('click', () => {
    closeFeedbackPopup(false); // Do not increment count here, already incremented on show
  });
});
/*----------- End  : FeedbackPopup Logic --------------*/
// getUserInfo() used in wallet module
// need to declare in global scope
async function getUserInfo() {
  const accessToken = getCookie("authToken");
  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `query GetUserInfo {
    getUserInfo {
        status
        ResponseCode
        affectedRows {
            userid
            liquidity
            amountposts
            amountblocked
            amountfollower
            amountfollowed
            amountfriends
            updatedat
            invited
            userPreferences {
                contentFilteringSeverityLevel
                onboardingsWereShown
            }
        }
      }
    }`,
  });

  // Define request options
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql
  };

  try {
    // Send the request and handle the response
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();
    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    // Check for errors in GraphQL response
    if (result.errors) throw new Error(result.errors[0].message);
    const userData = result.data.getUserInfo.affectedRows;
    isInvited = userData ?.invited;
    localStorage.setItem("userData", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}


// function to render users in the modal
// used in list_follow.js and posts.js for rendering followers and following lists
// ============================================
// GLOBAL.JS - User List Renderer
// ============================================

/**
 * Renders a list of users in a container
 * @param {Array} users - Array of user objects
 * @param {HTMLElement} container - Container element to render users into
 */
function renderUsers(users, container) {
  container.innerHTML = "";
  const currentUserId = getCookie("userID");

  if (!users || users.length === 0) {
    container.innerHTML = "<p>No users found.</p>";
    return;
  }

  users.forEach(user => {
    const userItem = createUserItem(user, currentUserId);
    container.appendChild(userItem);
  });
}

/**
 * Creates a single user item element
 * @param {Object} user - User data object
 * @param {string} currentUserId - Current logged-in user's ID
 * @returns {HTMLElement} User item element
 */
function createUserItem(user, currentUserId) {
  const userId = user.id || user.userid;
  const userimg = user.img ? tempMedia(user.img.replace("media/", "")) : "svg/noname.svg";

  const item = document.createElement("div");
  item.className = "dropdown-item clickable-user";
  item.innerHTML = `
    <div class="profilStats">
      <img src="${userimg}" alt="${user.username || 'User'}" />
      <div class="user_info">
        <span class="user_name">${user.username || 'Unknown'}</span>
        <span class="user_slug">#${user.slug || 'unknown'}</span>
      </div>
    </div>
  `;

  const imgElement = item.querySelector("img");
  imgElement.onerror = () => {
    imgElement.src = "svg/noname.svg";
  };

  item.addEventListener("click", () => {
    window.location.href = `view-profile.php?user=${userId}`;
  });

  // Add follow button if not viewing own profile
  if (userId !== currentUserId) {
    const followButton = createModalFollowButton(user, currentUserId);
    item.appendChild(followButton);
  }

  return item;
}

/**
 * Creates a follow button for modal user lists
 * @param {Object} user - User data object
 * @param {string} currentUserId - Current logged-in user's ID
 * @returns {HTMLButtonElement} Follow button element
 */
function createModalFollowButton(user, currentUserId) {
  const userId = user.id || user.userid;
  const followButton = document.createElement("button");
  followButton.classList.add("follow-button");
  followButton.dataset.userid = userId;

  // Determine follow status - use isfollowed/isfollowing consistently
  const youFollowThem = user.isfollowed ?? false;
  const theyFollowYou = user.isfollowing ?? false;

  updateFollowButtonState(followButton, youFollowThem, theyFollowYou);

  followButton.addEventListener("click", async (event) => {
    event.stopPropagation();
    event.preventDefault();

    await handleModalFollowButtonClick(followButton, user);
  });

  return followButton;
}

/**
 * Handles follow button click in modal
 * @param {HTMLButtonElement} button - Button that was clicked
 * @param {Object} user - User object
 */
async function handleModalFollowButtonClick(button, user) {
  const userId = user.id || user.userid;
  button.disabled = true;

  try {
    const newStatus = await toggleFollowStatus(userId);

    if (newStatus !== null) {
      user.isfollowed = newStatus;

      updateFollowingCount(newStatus);
      updateAllUserButtons(userId, user.isfollowed, user.isfollowing);
    } else {
      showError("Failed to update follow status. Please try again.");
    }
  } catch (error) {
    console.error("Error toggling follow status:", error);
    showError("An error occurred. Please try again.");
  } finally {
    button.disabled = false;
  }
}

/**
 * Updates all buttons for a specific user across the modal
 * @param {string} userId - User ID to update buttons for
 * @param {boolean} isfollowed - Whether current user follows this user
 * @param {boolean} isfollowing - Whether this user follows current user
 */
function updateAllUserButtons(userId, isfollowed, isfollowing) {
  const buttons = document.querySelectorAll(`.follow-button[data-userid="${userId}"]`);
  buttons.forEach(btn => {
    updateFollowButtonState(btn, isfollowed, isfollowing);
  });
}

/*----------- Start : Onboarding screens Logic --------------*/
function initOnboarding() {
  const onboardingScreens = document.querySelector("#site-onboarding-screens");
  if (!onboardingScreens) return;

  const inner = onboardingScreens.querySelector(".onboarding-inner");
  const slides = inner.querySelectorAll(".onboarding-slide");
  const close_btns = inner.querySelectorAll(".onboarding-close-button");


    // Get Server
    const config = getHostConfig();
    //console.log('Domain:', config.domain);
    //console.log('Server:', config.server);

 
  // Get userid from localStorage
  let userId = null;
  try {
    const parsed = JSON.parse(localStorage.getItem("userData"));
    userId = parsed ?.userid || null;
  } catch (e) {
    console.error("Error parsing userData", e);
  }
  
  // Set the user ID in GA
  if (typeof firebase !== 'undefined' && config.server!=='test') {
    if (userId) {
      //console.log(userId);
      firebase.analytics().setUserId(userId);
    }
  }

  if (close_btns) {
    close_btns.forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        onboardingScreens.classList.add('none'); // popup hide
        inner.classList.remove('open');
        // Log onboarding skipped event
       try {
          if (typeof firebase !== 'undefined' && firebase.analytics && config.server!=='test') {
                firebase.analytics().logEvent('onboarding', {
                  skipped: 1 // 1 = true
                });
                //console.log("skipped event fire");
              }
          } catch (error) {
          console.error('Firebase analytics error:', error);
        }
      });
    });
  }

  if (slides.length === 0) return;

  // Dot navigation wrapper
  const nav = document.createElement("div");
  nav.classList.add("onboarding-dots");

  slides.forEach((slide, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");

    if (slide.classList.contains("active")) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {
      showSlide(index, slides, nav);
    });

    nav.appendChild(dot);

    // --- Next/Prev button events ---
    const nextBtn = slide.querySelector(".next-btn");
    const prevBtn = slide.querySelector(".prev-btn");
    const completeBtn = slide.querySelector(".onboarding-complete-button");

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (index < slides.length - 1) {
          showSlide(index + 1, slides, nav);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (index > 0) {
          showSlide(index - 1, slides, nav);
        }
      });
    }

    if (completeBtn) {
      completeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        onboardingScreens.classList.add('none');
        inner.classList.remove('open');

         // Log onboarding completed
        try {
          if (typeof firebase !== 'undefined' && firebase.analytics && config.server!=='test') {
                firebase.analytics().logEvent('onboarding', {
                  skipped: 0 // 0 = false
                });
                //console.log("Complete Fired");
              }
              if(config.server=='test') {
                console.log("Firebase event not fired on "+config.server);
              }else{

                console.log("Firebase event fired on "+config.server);
              }
          } catch (error) {
          console.error('Firebase analytics error:', error);
        }
       

      });
    }

  });

  // Append nav dots
  inner.appendChild(nav);
}

function showOnboardingPopup() {
  const OnboardingPopup = document.getElementById('site-onboarding-screens');
  OnboardingPopup.classList.remove('none');
  setTimeout(() => {
    OnboardingPopup.querySelector('.onboarding-inner').classList.add('open');
  }, 100);

}

// Helper function: show slide by index for initOnboarding()
function showSlide(index, slides, nav) {
  slides.forEach((s, i) => {
    s.classList.remove("active");
    s.classList.add("none");
  });


  setTimeout(() => {
    slides[index].classList.add("active");
  }, 100);
  slides[index].classList.remove("none");

  // Update dots
  nav.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.remove("active");
    if (i === index) d.classList.add("active");
  });
}

/*----------- End  : Onboarding screens Logic --------------*/


// Function to fetch Tokenomics
async function fetchTokenomics() {

  const accessToken = getCookie("authToken");
  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });


  const graphql = JSON.stringify({
    query: `query GetTokenomics {
      getTokenomics {
        status
        ResponseCode
        actionTokenPrices {
          postPrice
          likePrice
          dislikePrice
          commentPrice
        }
        actionGemsReturns {
          viewGemsReturn
          likeGemsReturn
          dislikeGemsReturn
          commentGemsReturn
        }
        mintingData {
          tokensMintedYesterday
        }
      }
    }`,
  });

  const requestOptions = {
    method: "POST",
    headers,
    body: graphql,
    redirect: "follow",
  };

  try {
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();

    if (response.ok && result.data && result.data.getTokenomics) {
      window.tokenomicsData = result.data.getTokenomics;
      /*-- Action Prices --*/
      const extra_post_price = document.getElementById("extra_post_price");
      const extra_like_price = document.getElementById("extra_like_price");
      const extra_comment_price = document.getElementById("extra_comment_price");
      const dislike_price = document.getElementById("dislike_price");

      if (extra_post_price)
        extra_post_price.innerText = result.data.getTokenomics.actionTokenPrices.postPrice;
      if (extra_like_price)
        extra_like_price.innerText = result.data.getTokenomics.actionTokenPrices.likePrice;
      if (extra_comment_price)
        extra_comment_price.innerText = result.data.getTokenomics.actionTokenPrices.commentPrice;
      if (dislike_price)
        dislike_price.innerText = result.data.getTokenomics.actionTokenPrices.dislikePrice;

      /*-- Gems Return Prices --*/
      const gems_return_like = document.getElementById("gems_return_like");
      const gems_return_dislike = document.getElementById("gems_return_dislike");
      const gems_return_comment = document.getElementById("gems_return_comment");
      const gems_return_view = document.getElementById("gems_return_view");
      const likeReturn = result.data.getTokenomics.actionGemsReturns.likeGemsReturn;
      const dislikeReturn = result.data.getTokenomics.actionGemsReturns.dislikeGemsReturn;
      const commentReturn = result.data.getTokenomics.actionGemsReturns.commentGemsReturn;
      const viewReturn = result.data.getTokenomics.actionGemsReturns.viewGemsReturn;
      if (gems_return_like)
        gems_return_like.innerText = likeReturn > 0 ? `+${likeReturn}` : `${likeReturn}`;
      if (gems_return_dislike)
        gems_return_dislike.innerText = dislikeReturn > 0 ? `+${dislikeReturn}` : `${dislikeReturn}`;
      if (gems_return_comment)
        gems_return_comment.innerText = commentReturn > 0 ? `+${commentReturn}` : `${commentReturn}`;
      if (gems_return_view)
        gems_return_view.innerText = viewReturn > 0 ? `+${viewReturn}` : `${viewReturn}`;




      //console.log("Tokenomics loaded:", window.tokenomicsData);
    } else {
      console.error("Failed to load tokenomics:", result);
    }
  } catch (error) {
    console.error("Tokenomics API error:", error);
  }
}

async function updateUserPreferences() {
  const accessToken = getCookie("authToken");
  if (!accessToken) {
    throw new Error("Auth token is missing or invalid.");
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const graphql = JSON.stringify({
    query: `mutation UpdateUserPreferences {
      updateUserPreferences(
        userPreferences: { shownOnboardings: [INTROONBOARDING] }
      ) {
        status
        ResponseCode
        affectedRows {
          onboardingsWereShown
        }
      }
    }`,
  });

  const requestOptions = {
    method: "POST",
    headers,
    body: graphql,
  };

  try {
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (result.errors) throw new Error(result.errors[0].message);
    const {
      status,
      ResponseCode,
      affectedRows
    } = result.data.updateUserPreferences;

    if (ResponseCode !== "11014" && status !== "success") console.warn("Error Message:", userfriendlymsg(ResponseCode));

    return affectedRows;
  } catch (error) {
    console.error("Error updating User preferences:", error);
  }
}
/*----------- End  :  fetch Tokenomics --------------*/


const accessToken = getCookie("authToken");
const refreshToken = getCookie("refreshToken");
const storedEmail = getCookie("userEmail");

function scheduleSilentRefresh(accessToken, refreshToken) {
  if (!refreshToken) {
    return;
  }
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    // Original expiry time (from backend)
    let exp = payload.exp * 1000;
    // const buffer = 0.5 * 60 * 1000; // refresh 3 minutes before expiry
    // Override for testing (refresh in 2 minutes instead of 45)
    // const isTesting = false;
    // if (isTesting) {
    //   exp = Date.now() + buffer; // 30 seconds from now
    //   console.warn(" TEST MODE: Overriding token expiry to 30 seconds from now");
    // }

    const refreshIn = exp - Date.now();
    if (refreshIn <= 0) {
      console.warn(" refreshIn is <= 0 — skipping setTimeout");
      return;
    }

    setTimeout(async () => {
      console.log("Refreshing token now...");
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        //const newRefreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
        const newRefreshToken = getCookie("refreshToken");
        scheduleSilentRefresh(newAccessToken, newRefreshToken);
        // console.log("New AuthToken:", newAccessToken);
      }
    }, refreshIn);
  } catch (err) {
    console.error("Error in scheduling token refresh:", err);
  }
}

async function refreshAccessToken(refreshToken) {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const graphql = JSON.stringify({
    query: `mutation RefreshToken {
      refreshToken(refreshToken: "${refreshToken}") {
        status
        ResponseCode
        accessToken
        refreshToken
      }
    }`,
  });

  const requestOptions = {
    method: "POST",
    headers,
    body: graphql,
    redirect: "follow",
  };

  try {
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();

    if (response.ok && result.data && result.data.refreshToken) {
      const {
        status,
        ResponseCode,
        accessToken,
        refreshToken: newRefreshToken
      } = result.data.refreshToken;

      if (status !== "success" && (ResponseCode == "10801" || ResponseCode == "10901")) {
        throw new Error("Refresh failed with code: " + ResponseCode);
      }
      // Store updated tokens
      // Save updated tokens back into cookies
      updateCookieValue("authToken", accessToken); // keep same lifetime
      updateCookieValue("refreshToken", newRefreshToken);
      return accessToken;
    } else {
      throw new Error("Invalid response from refresh mutation");
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = date.toUTCString(); // just store date
  }
  document.cookie = `${name}=${encodeURIComponent(value || "")}; expires=${expires}; path=/; Secure; SameSite=Strict`;

  // Save expiry separately for later reuse
  if (days) {
    localStorage.setItem(name + "_expiry", expires);
  }
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}
// Update value but keep expiry
function updateCookieValue(name, value) {
  const expiry = localStorage.getItem(name + "_expiry");
  if (expiry) {
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expiry}; path=/; Secure; SameSite=Strict`;
  } else {
    setCookie(name, value);
  }
}

function eraseCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure; SameSite=Strict`;
  localStorage.removeItem(name + "_expiry");
}

scheduleSilentRefresh(accessToken, refreshToken);

  // ----------------- Insert Pinned Button -----------------
  window.insertPinnedBtn = function(card, username, mode = "profile", time = '23') {
    if (!card) return;
    if (card.querySelector(".pinedbtn") && mode != 'post') return;
    const pinnedBtn = document.createElement("div");
    pinnedBtn.classList.add("pinedbtn");
    pinnedBtn.innerHTML = `
      <a class="button btn-blue">
        <img src="svg/pin.svg" alt="pin">
        <span class="ad_username bold">@${username}</span>
        <span class="ad_duration txt-color-gray">${time}</span>
      </a>
    `;

    const postInhalt = card.querySelector(".post-inhalt");
    const social = card.querySelector(".social");
    const viewpost = document.querySelector(".viewpost");
    const footer = viewpost ?.querySelector(".postview_footer");
    const comments = viewpost ?.querySelector(".post-comments");

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
