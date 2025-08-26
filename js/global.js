// likeCost, dislikeCost, commentCost and postCost are global variables and updated in getActionPrices();
let likeCost = 0.3,
  dislikeCost = 0.5,
  commentCost = 0.05,
  postCost = 2;

// below variable used in wallet module
// need to declare in global scope
let storedUserInfo, balance = null;

///////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  hello();
  getUser();
  dailyfree();
  currentliquidity();
  getUserInfo();

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  updateOnlineStatus();
});

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

async function currentliquidity() {
  const token = await getLiquiudity();
  const tokenEl = document.getElementById("token");

  if (token !== null && tokenEl) {
    tokenEl.innerText = token;
    const formatted = (token * 0.1).toFixed(2).replace(".", ",") + " €";
    document.getElementById("money").innerText = formatted;
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

function postdetail(objekt,CurrentUserID) {
  const UserID  = CurrentUserID || null; // Default to null if not provided
    
          const postContainer = document.getElementById("viewpost-container");
          const shareLinkBox = document.getElementById("share-link-box");
          const shareUrl = window.location.origin + "/post/" + objekt.id;

          const shareLinkInput = shareLinkBox.querySelector(".share-link-input");
          if (shareLinkInput)  shareLinkInput.value = shareUrl;

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
          

          const containerleft = postContainer.querySelector(".viewpost-left");
          const containerright = postContainer.querySelector(".viewpost-right");
          const post_gallery = containerleft.querySelector(".post_gallery");
          post_gallery.innerHTML="";
          const post_contentletf=containerleft.querySelector(".post_content");
          if(post_contentletf)   post_contentletf.remove();

          const post_contentright=containerright.querySelector(".post_content");
          
          const array = JSON.parse(objekt.media);
          //const arraycover = JSON.parse(objekt.cover);
          
          /*--------Card profile Header  -------*/
          
          const username = objekt.user.username;
          const profile_id = objekt.user.slug;
          const user_img_src = objekt.user.img ? tempMedia(objekt.user.img) : "svg/noname.svg";
          

          const post_userName=postContainer.querySelector(".post-userName");
          post_userName.innerHTML=username;

          const conprofile_id =postContainer.querySelector(".profile_id");
          conprofile_id.innerHTML="#"+profile_id;

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
              redirectToProfile(objekt.user.id);
            }  
          );

          /*--------END: Card profile Header  -------*/
          
          /*--------Card Post Title and Text  -------*/
          const cont_post_text=containerright.querySelector(".post_text");
          const cont_post_title=containerright.querySelector(".post_title h2");
          const cont_post_time=containerright.querySelector(".timeagao");
          const cont_post_tags=containerright.querySelector(".hashtags");
         
          
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
              video.autoplay = (index === 0);  // ✅ Autoplay only for the first video
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

              const cont_post_text2=containerleft.querySelector(".post_text");
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
          let postlikeIcon = likeContainer.querySelector("i");
          const postLikes=likeContainer.querySelector("span ");
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
                
              },
              { capture: true}
            );
           
          }
            
          const dislikeContainer = social.querySelector(".post-dislike");
          let postdislikeIcon = dislikeContainer.querySelector("i");
          const postdisLikes=dislikeContainer.querySelector("span");
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
                
              },
              { capture: true }
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

            if ( !postID) {
              Merror("Error","Content or Post ID is missing.");
              return;
            }
            if (!content || UserID === null) {
              return;
            }

            createComment(postID, content).then((result) => {
              if (result && result.data?.createComment?.status === "success") {
                dailyfree();
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
function renderFollowButton(objekt, currentUserId) {
  if (objekt.user.id === currentUserId || currentUserId==null) return null;
  
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

function  redirectToProfile (userProfileID) {
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
  img.addEventListener("click", function handledisLikeClick(event) {
    event.stopPropagation();
    event.preventDefault();
    redirectToProfile(c, this);
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
      handleReply(c);
      // Handle reply button click
    });

    const showReply = document.createElement("span");
    showReply.classList.add("show_reply", "txt-color-gray");
    showReply.innerHTML = `Show <span class="reply_total">${c.amountreplies}</span> replies...`;

    
    replyContainer.classList.add("comment_reply_container");
    replyContainer.append(replyBtn, showReply);
  }
  // Body container
  const commentBody = document.createElement("div");
  commentBody.classList.add("comment_body");
  commentBody.append(commenterInfoDiv, commentTextDiv, replyContainer);

  // Like

  const likeContainer = document.createElement("div");
  likeContainer.classList.add("comment_like", "md_font_size");

  const likeIcon = document.createElement("i");
  likeIcon.classList.add("fi", "fi-rr-heart");
  likeContainer.appendChild(likeIcon);

  const spanLike = document.createElement("span");
  likeContainer.append(spanLike);

  if (c.isliked) {
    likeContainer.classList.add("active");
  } else if (c.user.id !== userID) {

    likeContainer.addEventListener(
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
      },
      { capture: true, once: true }
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

/*------------ End : View Post Detail Golobal Function -------------*/

/*----------- Start : FeedbackPopup Logic --------------*/

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '');
}

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
  if (dontShowCheckbox?.checked) {
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
  
  if (shouldShowPopup()) {
    setTimeout(() => {
      showFeedbackPopup();
      sessionStorage.setItem('popupShown', 'true');
    }, 30 * 1000); // 30 seconds
  }

  // Close button
  const closeBtn = document.querySelector('#feebackPopup .close');
  closeBtn?.addEventListener('click', () => {
    closeFeedbackPopup(); // Do not increment count here, already incremented on show
  });

  // "Share Feedback" button
  const shareBtn = document.querySelector('#feebackPopup a[href*="docs.google.com"]');
  shareBtn?.addEventListener('click', () => {
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

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
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
function renderUsers(users, container) {
  container.innerHTML = "";
  const avatar = "https://media.getpeer.eu";
  const currentUserId = getCookie("userID");

  users.forEach(user => {
    const item = document.createElement("div");
    item.className = "dropdown-item clickable-user";
    item.innerHTML = `
      <div class="profilStats">
        <img src="${avatar}/${user.img}" alt="${user.username}" />
        <div class="user_info">
          <span class="user_name">${user.username}</span>  <span class="user_slug">#${user.slug}</span>
        </div>
      </div>
    `;

    item.querySelector("img").onerror = () => { item.querySelector("img").src = "svg/noname.svg"; };

    item.addEventListener("click", () => {
      window.location.href = `view-profile.php?user=${user.id || user.userid}`;
    });

    if ((user.id || user.userid) !== currentUserId) {
      const followButton = document.createElement("button");
      followButton.classList.add("follow-button");
      followButton.dataset.userid = user.id || user.userid;

      if (user.isfollowed && user.isfollowing) {
        followButton.textContent = "Peer";
        followButton.classList.add("following", "peer");
      } else if (user.isfollowed) {
        followButton.textContent = "Following";
        followButton.classList.add("following", "just-following");
      } else {
        followButton.textContent = "Follow +";
      }

      followButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const targetUserId = user.id || user.userid;
        const newStatus = await toggleFollowStatus(user.id || user.userid);

        if (newStatus !== null) {
          user.isfollowed = newStatus;

          const followerCountSpan = document.getElementById("following");
          if (followerCountSpan) {
            let count = parseInt(followerCountSpan.textContent, 10) || 0;
            count = newStatus ? count + 1 : Math.max(0, count - 1);
            followerCountSpan.textContent = count;
          }

          document.querySelectorAll(`.follow-button[data-userid="${targetUserId}"]`).forEach(btn => {
            btn.classList.toggle("following", newStatus);

            if (newStatus && user.isfollowing) {
              btn.textContent = "Peer";
              btn.classList.add("peer");
              btn.classList.remove("just-following");
            } else if (newStatus) {
              btn.textContent = "Following";
              btn.classList.add("just-following");
              btn.classList.remove("peer");
            } else {
              btn.textContent = "Follow +";
              btn.classList.remove("following", "just-following", "peer");
            }
          });
        } else {
          Merror("Failed to update follow status. Please try again.");
        }
      });

      item.appendChild(followButton);
    }

    container.appendChild(item);
  });
}