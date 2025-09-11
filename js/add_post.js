let cropOrg = null;
let seekedFinished = true;

document.addEventListener("DOMContentLoaded", () => {
  const MAX_TAGS = 10;

  // DOM references
  const tagInput = document.getElementById("tag-input");
  const tagContainer = document.getElementById("tagsContainer");
  const tagErrorEl = document.getElementById("tagError");
  const selectedContainer = document.getElementById("tagsSelected");
  const clearTagHistoryBtn = document.getElementById("clearTagHistory");
  const descEl = document.getElementById("descriptionNotes");
  const titleEl = document.getElementById("titleNotes");
  const video = document.getElementById("videoTrim");
  const timeline = document.getElementById("videoTimeline");
  // const THUMB_COUNT = 10; // beliebig wählbar
  const trimWindow = document.getElementById("trim-window");
  const overlayLeft = document.getElementById("overlay-left");
  const overlayRight = document.getElementById("overlay-right");
  const handleLeft = document.getElementById("handle-left");
  const handleRight = document.getElementById("handle-right");
  let startPercent = 0.0000; // Anfang 0%
  let endPercent = 1.0000; // Ende 100%
  const MIN_DURATION = 3; // Sekunden
  const trimBtn = document.getElementById("trimBtn");
  const trimQuitBtn = document.getElementById("trimQuit");



  video.addEventListener("seeked", () => {
    seekedFinished = true;
    // Jetzt ist das Bild an der richtigen Position
  });
  const {
    FFmpeg
  } = FFmpegWASM; // UMD exposes FFmpegWASM
  // let ffmpeg = null;



  let videoElement = null; // Wird später gesetzt, wenn das Video geladen ist
  window.uploadedFilesMap = new Map();
  const modal = document.getElementById('videoloading');

  updateTagUIVisibility(); // suggestions + selected
  /********************* Preview posts functionality ******************************/

  const fullView = document.getElementById("preview-post-container");
  const collapsedView = document.querySelector("section");

  fullView.style.display = "none";
  collapsedView.style.display = "none";

  function previewPost(objekt) {
    currentPostData = objekt;
    const postContainer = document.getElementById("preview-post-container");

    const array = objekt.media || [];

    const containerleft = postContainer.querySelector(".viewpost-left");
    const containerright = postContainer.querySelector(".viewpost-right");
    const post_gallery = containerleft.querySelector(".post_gallery");
    post_gallery.innerHTML = "";
    post_gallery.className = "post_gallery";

    post_gallery.querySelectorAll(".custom-audio, .audio-item, .audio_player_con, canvas, button").forEach(el => el.remove());
    const oldCover = post_gallery.querySelector(".cover");
    if (oldCover) oldCover.remove();

    const oldSlider = post_gallery.querySelector(".slide_item");
    if (oldSlider) oldSlider.remove();

    const post_contentletf = containerleft.querySelector(".post_content");
    if (post_contentletf) post_contentletf.remove();

    const post_contentright = containerright.querySelector(".post_content");

    if (post_contentright) {
      const title = post_contentright.querySelector(".post_title h2");
      const text = post_contentright.querySelector(".post_text");
      const tags = post_contentright.querySelector(".hashtags");
      const time = post_contentright.querySelector(".timeagao");

      if (title) title.innerHTML = "";
      if (text) text.innerHTML = "";
      if (tags) tags.innerHTML = "";
      if (time) time.innerHTML = "";
    }

    const fullView = document.getElementById("preview-post-container");
    const collapsedView = document.querySelector("section");

    if (fullView && collapsedView) {
      fullView.style.display = "";
      collapsedView.style.display = "none";
    }

    document.querySelectorAll(".switch-btn").forEach(btn => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-view") === "full") {
        btn.classList.add("active");
      }
    });


    const profile_header_left = postContainer.querySelector(".profile-header-left");

    profile_header_left.addEventListener("click",
      function handledisLikeClick(event) {
        event.stopPropagation();
        event.preventDefault();
      }
    );
    /*--------END: Card profile Header  -------*/

    /*--------Card Post Title and Text  -------*/
    if (objekt.contenttype !== "text") {
      const cont_post_text = post_contentright.querySelector(".post_text");
      const cont_post_title = post_contentright.querySelector(".post_title h2");
      const cont_post_time = post_contentright.querySelector(".timeagao");
      const cont_post_tags = post_contentright.querySelector(".hashtags");

      if (objekt.description) {
        cont_post_text.innerHTML = objekt.description;
      } else {
        cont_post_text.innerHTML = "";
      }

      if (objekt.title) {
        cont_post_title.innerHTML = objekt.title;
      } else {
        cont_post_title.innerHTML = "";
      }

      cont_post_time.innerHTML = "1 sec ago";

      if (objekt.tags ?.length > 0) {
        cont_post_tags.innerHTML = objekt.tags.map(tag => `#${tag}`).join(" ");
      } else {
        cont_post_tags.innerHTML = "";
      }
    }
    /*--------END : Card Post Title and Text  -------*/

    const makeSlider = (type) => {
      const sliderWrapper = document.createElement("div");
      const sliderTrack = document.createElement("div");
      const sliderThumbs = document.createElement("div");

      sliderWrapper.className = "slider-wrapper";
      sliderTrack.className = "slider-track";
      sliderThumbs.className = "slider-thumbnails";

      sliderWrapper.appendChild(sliderTrack);
      sliderWrapper.appendChild(sliderThumbs);
      post_gallery.appendChild(sliderWrapper);

      const updateSlider = (index) => {
        if (!sliderTrack.children[index]) return;
        const offset = sliderTrack.children[index].offsetLeft;
        sliderTrack.style.transform = `translateX(-${offset}px)`;

        sliderThumbs.querySelectorAll(".timg").forEach((t, i) => {
          t.classList.toggle("active", i === index);
        });

        if (type === "video") {
          sliderTrack.querySelectorAll("video").forEach((v, i) => {
            if (i === index) v.play();
            else {
              v.pause();
              v.currentTime = 0;
            }
          });
        }
      };

      return {
        sliderTrack,
        sliderThumbs,
        updateSlider
      };
    };

    if (objekt.contenttype === "audio") {
      post_gallery.classList.add("audio");
      post_gallery.classList.remove("multi");
      post_gallery.classList.remove("images");
      post_gallery.classList.remove("video");
      for (media of array) {
        const audio = document.createElement("audio");
        audio.id = "audio2";
        audio.src = media;
        audio.controls = true;
        audio.className = "custom-audio";

        // 1. Erzeuge das <div>-Element
        const audioContainer = document.createElement("div");
        //audioContainer.id = "audio-container"; // Setze die ID
        audioContainer.classList.add("audio-item");

        if (objekt.cover) {
          const cover = objekt.cover;
          img = document.createElement("img");
          img.classList.add("cover");
          img.onload = () => {
            img.setAttribute("height", img.naturalHeight);
            img.setAttribute("width", img.naturalWidth);
          };
          img.src = cover[0];
          img.alt = "Cover";
          audioContainer.appendChild(img);
        }
        // 2. Erzeuge das <canvas>-Element
        const canvas = document.createElement("canvas");
        canvas.id = "waveform-preview2"; // Setze die ID für das Canvas

        // 3. Erzeuge das <button>-Element
        const button = document.createElement("button");
        button.id = "play-pause"; // Setze die ID für den Button
        // button.textContent = "Play"; // Setze den Textinhalt des Buttons

        // 4. Füge die Kinder-Elemente (Canvas und Button) in das <div> ein
        let cover = null;
        if (objekt.cover) {
          cover = objekt.cover;
        }
        const audio_player = document.createElement("div");
        audio_player.className = "audio_player_con";
        audio_player.id = "preview-audio-block"; // Setze die ID für das Canvas

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
        initAudioplayer("preview-audio-block", audio.src);
      }
    } else if (objekt.contenttype === "video") {
      post_gallery.className = "post_gallery video";
      if (array.length > 1) post_gallery.classList.add("multi");

      const {
        sliderTrack,
        sliderThumbs,
        updateSlider
      } = makeSlider("video");

      array.forEach((media, index) => {
        const slide = document.createElement("div");
        slide.className = "slide_item";

        let coverSrc;
        if (objekt.cover && objekt.cover.length > 0) {
          coverSrc = objekt.cover[0];
        } else {
          coverSrc = 'img/audio-bg.png';
        }

        const video = document.createElement("video");
        video.src = media;
        video.controls = true;
        video.loop = true;
        video.autoplay = index === 0;
        video.muted = false;
        video.className = "custom-video";
        slide.style.backgroundImage = `url("${coverSrc}")`;

        slide.appendChild(video);
        sliderTrack.appendChild(slide);

        const videoContainer = document.createElement("div");
        videoContainer.classList.add("video-item");

        const img = document.createElement("img");
        img.classList.add("cover");
        img.onload = () => {
          img.setAttribute("height", img.naturalHeight);
          img.setAttribute("width", img.naturalWidth);
        };
        img.src = coverSrc;
        img.alt = "Cover";
        videoContainer.appendChild(img);

        const thumb = document.createElement("div");
        thumb.className = "timg";
        thumb.innerHTML = `<i class="fi fi-sr-play">`;
        sliderThumbs.appendChild(thumb);
        thumb.appendChild(img);

        thumb.addEventListener("click", () => updateSlider(index));
      });

      requestAnimationFrame(() => updateSlider(0));
    } else if (objekt.contenttype === "text") {
      // Clear the gallery area
      post_gallery.innerHTML = "";
      post_gallery.className = "post_gallery";

      // Create a fresh post_content container
      const textContent = document.createElement("div");
      textContent.className = "post_content";

      // Create title
      const titleEl = document.createElement("div");
      titleEl.className = "post_title";

      const h2 = document.createElement("h2");
      h2.className = "xxl_font_size";
      h2.textContent = objekt.title || "";

      const time = document.createElement("span");
      time.className = "timeagao txt-color-gray";
      time.textContent = "1 sec ago";

      titleEl.appendChild(h2);
      titleEl.appendChild(time);

      // Create description
      const textEl = document.createElement("div");
      textEl.className = "post_text";
      textEl.innerHTML = objekt.description || "";

      // Create hashtags
      const tagEl = document.createElement("div");
      tagEl.className = "hashtags";
      if (objekt.tags && objekt.tags.length) {
        tagEl.innerHTML = objekt.tags.map(tag => `#${tag}`).join(" ");
      }

      textContent.appendChild(titleEl);
      textContent.appendChild(textEl);
      textContent.appendChild(tagEl);

      containerleft.prepend(textContent);
    } else {
      post_gallery.className = "post_gallery images";
      if (array.length > 1) post_gallery.classList.add("multi");

      const {
        sliderTrack,
        sliderThumbs,
        updateSlider
      } = makeSlider("image");

      array.forEach((media, index) => {
        const slide = document.createElement("div");
        slide.classList.add("slide_item");

        slide.style.backgroundImage = `url("${media}")`;

        const img = document.createElement("img");
        img.src = media;
        img.alt = "";

        const zoom = document.createElement("span");
        zoom.className = "zoom";
        zoom.innerHTML = `<i class="fi fi-sr-expand"></i>`;

        slide.appendChild(img);
        slide.appendChild(zoom);
        sliderTrack.appendChild(slide);

        const thumb = document.createElement("div");
        thumb.className = "timg";
        thumb.innerHTML = `<img src="${media}" alt="">`;
        sliderThumbs.appendChild(thumb);

        thumb.addEventListener("click", () => updateSlider(index));
      });

      requestAnimationFrame(() => updateSlider(0));
    }

  }

  function previewPostCollapsed(objekt) {
    const collapsedCard = document.querySelector('section .card');
    const postBox = collapsedCard.querySelector(".post");
    const title = collapsedCard.querySelector(".post-title");
    const description = collapsedCard.querySelector(".post-text");
    const hashtags = collapsedCard.querySelector(".hashtags");
    const inhaltDiv = collapsedCard.querySelector(".post-inhalt");

    postBox.innerHTML = "";
    postBox.style.backgroundImage = "";
    const oldSlider = collapsedCard.querySelector(".collapsed-slider");
    if (oldSlider) oldSlider.remove();

    const oldAudioPlayer = inhaltDiv.querySelector(".audio-player");
    if (oldAudioPlayer) oldAudioPlayer.remove();

    const oldVideoPlayer = inhaltDiv.querySelector(".video-player");
    if (oldVideoPlayer) oldVideoPlayer.remove();

    collapsedCard.querySelectorAll(".cover").forEach(c => c.remove());

    const oldImageCounter = inhaltDiv.querySelector(".image_counter");
    if (oldImageCounter) oldImageCounter.remove();

    inhaltDiv.querySelectorAll(".collapsed-slide").forEach(slide => {
      slide.style.backgroundImage = "";
      slide.style.backgroundSize = "";
      slide.style.backgroundPosition = "";
    });

    title.innerHTML = objekt.title || "";
    description.textContent = objekt.description || "";
    hashtags.innerHTML = (objekt.tags || []).map(tag => `#${tag}`).join(" ");
    collapsedCard.classList.remove("multi-video", "double-card");
    collapsedCard.removeAttribute("content");

    const shadowDiv = document.createElement("div");
    shadowDiv.classList.add("shadow");
    postBox.appendChild(shadowDiv);

    const contentType = objekt.contenttype;
    const mediaArray = objekt.media || [];
    const hasMultiple = mediaArray.length > 1;

    if (!mediaArray.length || contentType === "text") {
      postBox.style.backgroundImage = "";
      return;
    }

    collapsedCard.setAttribute("content", contentType);

    const slider = document.createElement("div");
    slider.className = "collapsed-slider";

    mediaArray.forEach((mediaURL, index) => {
      const slide = document.createElement("div");
      slide.className = "collapsed-slide";
      if (index === 0) slide.classList.add("active");

      if (contentType === "image") {
        postBox.classList.add("multi");

        slide.style.backgroundImage = `url('${mediaURL}')`;
        slide.style.backgroundSize = "cover";
        slide.style.backgroundPosition = "center";
      }

      if (contentType === "video") {
        if (hasMultiple) collapsedCard.classList.add("multi-video");

        const videoCover = document.createElement("div");
        videoCover.classList.add("video-cover");

        const video = document.createElement("video");
        video.src = mediaURL;
        video.className = "video-preview";

        slide.appendChild(videoCover);
        slide.appendChild(video);

        // Cover overlay
        if (objekt.cover ?. [index]) {
          const img = document.createElement("img");
          img.classList.add("cover");
          img.src = objekt.cover[index];
          img.alt = "Cover";

          img.onload = () => {
            img.setAttribute("height", img.naturalHeight);
            img.setAttribute("width", img.naturalWidth);
          };

          videoCover.appendChild(img);
        }

        collapsedCard.addEventListener("mousemove", function (event) {
          const videoCover = this.querySelector(".video-cover");
          if (videoCover) videoCover.classList.add("none");
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
                video.play().catch(err => {
                  if (err.name !== "AbortError") console.warn("Play error:", err)
                });
            });
          }
        });

        collapsedCard.addEventListener("mouseleave", function () {
          const videoCover = this.querySelector(".video-cover");
          if (videoCover) videoCover.classList.remove("none");

          const videos = this.querySelectorAll("video");
          videos.forEach(vid => {
            if (!vid.paused) vid.pause()
          });
        });

        let postvideoplayerDiv = inhaltDiv.querySelector(".video-player");
        if (!postvideoplayerDiv) {
          postvideoplayerDiv = document.createElement("div");
          postvideoplayerDiv.classList.add("video-player");

          const imga = document.createElement("img");
          imga.src = 'svgnew/play-btn.svg';
          imga.alt = "Play";
          postvideoplayerDiv.appendChild(imga);

          const cardHeader = inhaltDiv.querySelector(".card-header");
          if (cardHeader) {
            inhaltDiv.insertBefore(postvideoplayerDiv, cardHeader.nextSibling);
          } else {
            inhaltDiv.appendChild(postvideoplayerDiv);
          }
        } else {
          postvideoplayerDiv.querySelectorAll(".video-ratio").forEach(el => el.remove());
        }

        const ratio = document.createElement("span");
        ratio.classList.add("video-ratio", `video-ratio-${index}`);
        if (objekt.options ?.ratio === '16:9') {
          ratio.textContent = 'Long';
          collapsedCard.classList.add("double-card");
        } else {
          ratio.textContent = 'Short';
        }
        postvideoplayerDiv.appendChild(ratio);
      }

      if (contentType === "audio") {
        const audio = document.createElement("audio");
        audio.src = mediaURL;
        slide.appendChild(audio);

        if (objekt.cover ?. [index]) {
          slide.style.backgroundImage = `url('${objekt.cover[index]}')`;
          slide.style.backgroundSize = "cover";
          slide.style.backgroundPosition = "center";
        }

        let postaudioplayerDiv = inhaltDiv.querySelector(".audio-player");
        if (!postaudioplayerDiv) {
          postaudioplayerDiv = document.createElement("div");
          postaudioplayerDiv.classList.add("audio-player");

          const imga = document.createElement("img");
          imga.src = 'img/mucis-player.png';
          imga.alt = "audio player";
          postaudioplayerDiv.appendChild(imga);

          const cardHeader = inhaltDiv.querySelector(".card-header");
          if (cardHeader) {
            inhaltDiv.insertBefore(postaudioplayerDiv, cardHeader.nextSibling);
          } else {
            inhaltDiv.appendChild(postaudioplayerDiv);
          }
        }
      }

      slider.appendChild(slide);
    });

    postBox.appendChild(slider);

    // Dots for image slides
    if (contentType === "image" && hasMultiple) {
      const postContent = inhaltDiv ?.querySelector(".post-content");
      if (postContent) {
        const imageCounter = document.createElement("div");
        imageCounter.classList.add("image_counter");

        mediaArray.forEach((_, i) => {
          const img_indicator = document.createElement("span");
          img_indicator.textContent = i + 1;
          if (i === 0) img_indicator.classList.add("active");
          imageCounter.appendChild(img_indicator);
        });

        let current = 0; // Shared index for both click and auto-swap
        let autoSwapInterval = null;
        imageCounter.querySelectorAll("span").forEach((span, index) => {
          span.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            current = index; // Update current index to clicked
            const images = postBox.querySelectorAll(".collapsed-slide");
            const indicators = imageCounter.querySelectorAll("span");

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

        collapsedCard.addEventListener("mouseenter", () => {
          const images = postBox.querySelectorAll(".collapsed-slide");
          const indicators = imageCounter.querySelectorAll("span");
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

        collapsedCard.addEventListener("mouseleave", () => {
          clearInterval(autoSwapInterval);
          autoSwapInterval = null;
        });


        inhaltDiv.insertBefore(imageCounter, postContent);
      }
    }
  }

  const previewSection = document.getElementById('previewSection');
  const addPostSection = document.getElementById('addPostSection');

  function resetPreview() {
    previewSection.classList.add("none");
    addPostSection.classList.remove("none");
  }

  const backToEditBtn = document.getElementById('backToEdit');
  if (backToEditBtn) {
    backToEditBtn.addEventListener('click', resetPreview);
  }

  const cancelEditBtn = document.getElementById('cancel_Btn');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', resetPreview);
  }

  const sidebarTabs = document.querySelectorAll('.form-tab-js a');
  sidebarTabs.forEach(tab => {
    tab.addEventListener('click', function (e) {
      e.preventDefault();

      // Hide preview, show add-post
      previewSection.classList.add('none');
      addPostSection.classList.remove('none');

      // Optionally: toggle active class for UI
      document.querySelectorAll('.form-tab-js').forEach(item => item.classList.remove('active'));
      this.closest('.form-tab-js').classList.add('active');
    });
  });

  /**********************************************************************/
  document.getElementById("create_new_post").addEventListener("submit", async (event) => {
    event.preventDefault();
    let token, uploadedFiles;
    let files = [];
    const post_type = event.target.getAttribute("data-post-type");
    const createPostError = document.getElementById("createPostError");
    const submitButton = document.getElementById("submitPost");
    const title = titleEl.value.trim();
    const description = descEl.value.trim();
    //const tags = getTagHistory();
    const tags = Array.from(selectedContainer.querySelectorAll(".tag"))
      .map(tag => tag.getAttribute("data-tag"));

    createPostError.innerHTML = "";
    // Validation
    let hasError = false;
    // let postMedia;
    let cover;
    let postDescription = "";
    const videoWrappers = document.querySelectorAll(".create-video");

    //before
    // switch (post_type) {
    //   case "text": {
    //     // Convert to base64
    //     const base64String = btoa(new TextEncoder().encode(description).reduce((acc, val) => acc + String.fromCharCode(val), ""));
    //     const base64WithMime = [`data:text/plain;base64,${base64String}`];

    //     postMedia = base64WithMime;
    //   }
    //   break;
    // case "image": {
    //   const imageWrappers = document.querySelectorAll(".create-img");
    //   const combinedBase64 = Array.from(imageWrappers)
    //     .map((img) => img.src)
    //     .filter((src) => src.startsWith("data:image/"));

    //   postMedia = combinedBase64;
    //   postDescription = description;
    // }
    // break;
    // case "audio": {
    //   let combinedBase64 = [];
    //   const recordedAudio = document.getElementById("recorded-audio");
    //   //  Priority: Use recorded audio if it exists and is blob
    //   if (recordedAudio && recordedAudio.src.startsWith("blob:")) {
    //     const base64 = await convertBlobUrlToBase64(recordedAudio.src);
    //     if (base64) combinedBase64.push(base64);
    //   } else {
    //     //  Fallback: Use uploaded audio if no recorded audio found
    //     const audioWrappers = document.querySelectorAll(".create-audio");
    //     combinedBase64 = Array.from(audioWrappers)
    //       .map((audio) => audio.src)
    //       .filter((src) => src.startsWith("data:audio/"));
    //   }

    //   const coverWrapper = document.getElementById("audio-cover-image-preview");
    //   const coverImg = coverWrapper.querySelector("img.create-img");
    //   const emptyBase64img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    //   cover = coverImg ? [coverImg.src] : [emptyBase64img];
    //   postMedia = combinedBase64;
    //   postDescription = description;
    // }
    // break;
    // case "video": {
    //   const videoWrappers = document.querySelectorAll(".create-video");
    //   const combinedBase64 = Array.from(videoWrappers)
    //     .map((vid) => vid.src)
    //     .filter((src) => src.startsWith("data:video/"));

    //   const coverWrapper = document.getElementById("preview-video");
    //   const coverImg = coverWrapper.querySelector("img.create-img");
    //   cover = coverImg ? [coverImg.src] : null;

    //   postMedia = combinedBase64;
    //   postDescription = description;
    // }
    // break;
    // default:
    //   console.warn("Unsupported post type:", post_type);
    //   break;
    // }

    // updated: multipart-scenario-handling
    switch (post_type) {
      case "text": {
        // create a temporary text file from description
        const textBlob = new Blob([description], {
          type: "text/plain"
        });
        const textFile = new File([textBlob], "post.txt", {
          type: "text/plain"
        });
        files = [textFile];
        postDescription = description;
      }
      break;

    case "image": {
      const imageWrappers = document.querySelectorAll(".create-img");
      files = await Promise.all(
        Array.from(imageWrappers)
        .map(async (img, index) => {
          const response = await fetch(img.src);
          const blob = await response.blob();
          return new File([blob], `image${index}.png`, {
            type: blob.type
          });
        })
      );
      postDescription = description;
    }

    break;
    case "audio": {
      let audioFiles = [];

      // Priority: recorded audio
      const recordedAudio = document.getElementById("recorded-audio");
      if (recordedAudio ?.src ?.startsWith("blob:")) {
        const response = await fetch(recordedAudio.src);
        const blob = await response.blob();
        // Give a valid name & MIME type for backend
        audioFiles.push(new File([blob], "recording.mp3", {
          type: "audio/mpeg"
        }));
      }

      // Fallback: other <audio> elements
      const audioElements = document.querySelectorAll(".create-audio");
      for (const audio of audioElements) {
        if (audio === recordedAudio) continue; // skip already added
        if (audio ?.src ?.startsWith("blob:")) {
          const response = await fetch(audio.src);
          const blob = await response.blob();
          audioFiles.push(new File([blob], "recording.mp3", {
            type: "audio/mpeg"
          }));
        }
      }

      // Only take the first file if needed (or send all)
      files = audioFiles[0] || null;

      // Optional cover image
      const coverWrapper = document.getElementById("audio-cover-image-preview");
      const coverImg = coverWrapper ?.querySelector("img.create-img");
      const emptyCover = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      cover = coverImg ? await blobUrlToBase64(coverImg.src) : [emptyCover];
      postDescription = description;
    }
    break;
    case "video": {
      files = await getFilesFromVideos(videoWrappers);
      const coverWrapper = document.getElementById("preview-video");
      const coverImg = coverWrapper ?.querySelector("img.create-img");
      cover = coverImg ? await blobUrlToBase64(coverImg.src) : null;
      postDescription = description;
    }
    break;
    default:
      console.warn("Unsupported post type:", post_type);
      break;
    }
    hasError = pre_post_form_validation(post_type, files); // check form validation
    // If any error, stop
    if (hasError) return;
    submitButton.disabled = true;

    try {
      token = await checkEligibility();
    } catch (err) {
      console.error("Eligibility check failed:", err);
      createPostError.innerHTML = "You are not eligible to create a post.";
      submitButton.disabled = false;
      return; // stop here
    }

    try {
      modal.showModal();
      uploadedFiles = await uploadFiles(token, files);
    } catch (err) {
      console.error("File upload failed:", err);
      createPostError.innerHTML = "Failed to upload files. Please try again.";
      submitButton.disabled = false;
      return; // stop here
    } finally {
      modal.close();
    }

    try {
      const result = await sendCreatePost({
        title: title,
        mediadescription: postDescription,
        contenttype: post_type,
        uploadedFiles: uploadedFiles,
        cover: cover,
        tags: tags,
      });

      if (result.createPost.ResponseCode == "11513" || result.createPost.ResponseCode == "11508") {
        if (result.createPost.status === "success") {
          createPostError.classList.add(result.createPost.status);
          createPostError.innerHTML = userfriendlymsg(result.createPost.ResponseCode);
          setTimeout(() => {
            window.location.href = "./profile.php";
          }, 1000);
        } else {
          createPostError.classList.add(result.createPost.status);
          createPostError.innerHTML = userfriendlymsg(result.createPost.ResponseCode);
        }
      }
    } catch (error) {
      console.error("Error during create post request:", error);
    } finally {
      // Re-enable the form and hide loading indicator
      submitButton.disabled = false;
    }
  });

  async function getFilesFromVideos(videoWrappers) {
    const files = [];
    for (const vid of videoWrappers) {
      if (vid.src.startsWith("blob:")) {
        const blob = await fetch(vid.src).then(r => r.blob());
        const file = new File([blob], vid.id + ".mp4", {
          type: blob.type
        });
        files.push(file);
      }
    }
    return files;
  }

  //BASE64 approach
  // function pre_post_form_validation(post_type, postMedia) {
  //   const titleErrorEl = document.getElementById("titleError");
  //   const descErrorEl = document.getElementById("descriptionError");
  //   const imgErrorEl = document.getElementById("imageError");
  //   const audioErrorEl = document.getElementById("audioError");
  //   const videoErrorEl = document.getElementById("videoError");

  //   // Clear old errors
  //   titleErrorEl.textContent = "";
  //   descErrorEl.textContent = "";
  //   // tagErrorEl.textContent = "";
  //   imgErrorEl.textContent = "";
  //   audioErrorEl.textContent = "";
  //   videoErrorEl.textContent = "";
  //   const title = titleEl.value.trim();
  //   const description = descEl.value.trim();
  //   // Validation
  //   let hasError = false;
  //   const title_char_count = setupCharCounter(titleEl);
  //   if (!title) {
  //     titleErrorEl.textContent = "Title is required.";
  //     hasError = true;
  //   } else if (title.length < 2) {
  //     titleErrorEl.textContent = "Title must be at least 2 character.";
  //     hasError = true;
  //   } else if (!title_char_count) {
  //     hasError = true;

  //   }
  //   const dec_char_count = setupCharCounter(descEl);
  //   if (!description && post_type == 'text') {
  //     descErrorEl.textContent = "Description is required.";
  //     hasError = true;
  //     //} else if (description.length < 10) {
  //     //descErrorEl.textContent = "Description must be at least 10 characters.";
  //     //hasError = true;
  //   } else if (!dec_char_count) {
  //     hasError = true;
  //   }

  //   /*if (tags.length === 0) {
  //     tagErrorEl.textContent = "Please add at least one tag.";
  //     hasError = true;
  //   }*/

  //   switch (post_type) {
  //     case "text": {
  //       if (postMedia.join("").length > 5 * 1024 * 1024) {
  //         descErrorEl.textContent = "The text size exceeds the 5MB limit. Please upload a smaller text.";
  //         hasError = true;
  //       }
  //     }
  //     break;
  //   case "image": {
  //     if (postMedia.length === 0) {
  //       imgErrorEl.textContent = "Please select at least one image.";
  //       hasError = true;
  //     } else if (postMedia.join("").length > 5 * 1024 * 1024) {
  //       imgErrorEl.textContent = "The image(s) size exceeds the 5MB limit. Please reduce the number or size of the images and try again.";
  //       hasError = true;
  //     } else if (postMedia.length > 20) {
  //       imgErrorEl.textContent = "You can upload up to 20 images per post. Please remove some images and try again.";
  //       hasError = true;
  //     }
  //   }
  //   break;

  //   case "audio": {
  //     if (postMedia.length === 0) {
  //       audioErrorEl.textContent = "Please upload audio or record audio.";
  //       hasError = true;
  //     } else if (postMedia.join("").length > 5 * 1024 * 1024) {
  //       audioErrorEl.textContent = "The audio size exceeds the 5MB limit. Please reduce the  size of the audio and try again.";
  //       hasError = true;
  //     }
  //   }
  //   break;

  //   case "video": {
  //     if (postMedia.length === 0) {
  //       videoErrorEl.textContent = "Please select video.";
  //       hasError = true;
  //     } else if (postMedia.join("").length > 5 * 1024 * 1024) {
  //       videoErrorEl.textContent = "The video(s) size exceeds the 5MB limit. Please reduce the  size of the video and try again.";
  //       hasError = true;
  //     }
  //   }
  //   break;

  //   default:
  //     console.warn("Unsupported post type:", post_type);
  //     break;
  //   }

  //   return hasError;
  // }

  //MULTIPART approach
  function pre_post_form_validation(post_type, files) {
    const titleErrorEl = document.getElementById("titleError");
    const descErrorEl = document.getElementById("descriptionError");
    const imgErrorEl = document.getElementById("imageError");
    const audioErrorEl = document.getElementById("audioError");
    const videoErrorEl = document.getElementById("videoError");
    titleErrorEl.textContent = "";
    descErrorEl.textContent = "";
    imgErrorEl.textContent = "";
    audioErrorEl.textContent = "";
    videoErrorEl.textContent = "";

    const title = titleEl.value.trim();
    const description = descEl.value.trim();
    let hasError = false;

    // Title check
    if (!title) {
      titleErrorEl.textContent = "Title is required.";
      hasError = true;
    } else if (title.length < 2) {
      titleErrorEl.textContent = "Title must be at least 2 characters.";
      hasError = true;
    }

    // Description check for text posts
    if (post_type === "text" && !description) {
      descErrorEl.textContent = "Text content cannot be empty.";
      hasError = true;
    }

    // File check for media posts
    switch (post_type) {
      case "image":
        if (!files || files.length === 0) {
          imgErrorEl.textContent = "Please select at least one image.";
          hasError = true;
        }
        break;
      case "audio":
        if (!files || files.length === 0) {
          audioErrorEl.textContent = "Please upload or record audio.";
          hasError = true;
        }
        break;
      case "video":
        if (!files || files.length === 0) {
          videoErrorEl.textContent = "Please select a video.";
          hasError = true;
        }
        break;
    }

    return hasError;
  }

  document.getElementById("previewButton").addEventListener("click", async function () {
    const previewSection = document.getElementById('previewSection');
    const addPostSection = document.getElementById('addPostSection');
    const title = titleEl.value.trim();
    const description = descEl.value.trim();
    const tags = getTagHistory();
    const form = document.getElementById("create_new_post");
    const post_type = form.getAttribute("data-post-type");

    let media = [];
    let cover = null;
    let objekt = {};
    let hasError = false;

    switch (post_type) {
      case "text":
        objekt = {
          id: "preview-text-post",
          contenttype: "text",
          title,
          description,
          tags,
          media: [],
        };
        break;

      case "image": {
        const imageContainer = document.getElementById("preview-image");
        const imageWrappers = imageContainer.querySelectorAll(".create-img");
        media = Array.from(imageWrappers)
          .map(img => img.src)
          .filter(src => src); // use raw src for preview

        objekt = {
          contenttype: "image",
          title,
          description,
          tags,
          media
        };
        break;
      }

      case "audio": {
        const recordedAudio = document.getElementById("recorded-audio");
        if (recordedAudio && recordedAudio.src !== "") {
          media.push(recordedAudio.src);
        } else {
          const audioWrappers = document.querySelectorAll(".create-audio");
          media = Array.from(audioWrappers)
            .map(audio => audio.src)
            .filter(src => src);
        }

        const coverWrapper = document.getElementById("audio-cover-image-preview");
        const coverImg = coverWrapper.querySelector("img.create-img");
        const emptyCover = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        cover = [coverImg ? coverImg.src : emptyCover];
        objekt = {
          title,
          description,
          tags,
          media,
          cover,
          contenttype: "audio"
        };
        break;
      }

      case "video": {
        const videoWrappers = document.querySelectorAll(".create-video");
        media = Array.from(videoWrappers)
          .map(video => video.src)
          .filter(src => src);

        const coverWrapper = document.getElementById("preview-video");
        const coverImg = coverWrapper.querySelector("img.create-img");
        cover = coverImg ? [coverImg.src] : [];

        objekt = {
          title,
          description,
          tags,
          media,
          cover,
          contenttype: "video"
        };
        break;
      }

      default:
        console.warn("Unsupported post type:", post_type);
        return;
    }

    hasError = pre_post_form_validation(post_type, media);
    if (hasError) return;

    window.currentPreviewObjekt = objekt;
    addPostSection.classList.add('none');
    previewSection.classList.remove('none');

    const fullView = document.getElementById("preview-post-container");
    const collapsedView = document.querySelector("section");
    fullView.style.display = "";
    collapsedView.style.display = "none";

    previewPost(objekt);
  });

  document.querySelectorAll(".switch-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".switch-btn").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const view = button.getAttribute("data-view");

      const fullView = document.getElementById("preview-post-container");
      const collapsedView = document.querySelector("section");

      if (view === "full") {
        fullView.style.display = "";
        collapsedView.style.display = "none";
      } else {
        fullView.style.display = "none";
        collapsedView.style.display = "";

        if (window.currentPreviewObjekt) {
          previewPostCollapsed(window.currentPreviewObjekt);
        }
      }
    });
  });

  document.querySelectorAll(".resettable-form").forEach((form) => {
    form.addEventListener("reset", function (event) {
      const tagInput = event.target.querySelector("#tag-input");
      const tagHistory = event.target.querySelector("#tagHistoryContainer");
      const tagSuggestions = event.target.querySelector("#tagsContainer");
      const selectedTags = event.target.querySelector("#tagsSelected");
      const tagError = event.target.querySelector("#tagError");
      if (tagInput) tagInput.value = "";
      if (tagSuggestions) tagSuggestions.innerHTML = "";
      if (selectedTags) selectedTags.innerHTML = "";
      if (tagError) tagError.textContent = "";
      const historySection = event.target.querySelector("#tag-history-section");
      const suggestionsSection = event.target.querySelector("#tag-suggestions-section");
      const selectedTagsSection = event.target.querySelector("#selected-tags-section");
      if (tagHistory) {
        tagHistory.innerHTML = "";
        if (tagHistory.children.length === 0 && historySection) {
          historySection.classList.add("hidden");
          historySection.classList.remove("visible");
        }
      }
      if (suggestionsSection) {
        suggestionsSection.classList.add("hidden");
        suggestionsSection.classList.remove("visible");
      }
      if (selectedTagsSection) {
        selectedTagsSection.classList.add("hidden");
        selectedTagsSection.classList.remove("is-visible");
      }
    });
  });

  // async function convertBlobUrlToBase64(blobUrl) {
  //   try {
  //     const response = await fetch(blobUrl);
  //     const blob = await response.blob();

  //     return await new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => resolve(reader.result);
  //       reader.onerror = reject;
  //       reader.readAsDataURL(blob);
  //     });
  //   } catch (err) {
  //     console.error("Error converting blob to base64:", err);
  //     return null;
  //   }
  // }
  /******************************************************************** */

  descEl.addEventListener("keyup", (e) => {
    setupCharCounter(e.target);
  });
  titleEl.addEventListener("keyup", (e) => {
    setupCharCounter(e.target);
  });

  function setupCharCounter(El) {
    let text = El.value;

    const Error = El.closest(".input-wrapper").querySelector(".response_msg");
    Error.textContent = "";
    const char_count = El.closest(".input-wrapper").querySelector("span.char-counter .char_count");
    let char_limit = El.closest(".input-wrapper").querySelector("span.char-counter .char_limit").textContent;

    char_limit = char_limit * 1;
    char_count.textContent = text.length;
    if (text.length > char_limit) {
      Error.textContent = "Char Maximum length exceeded!";
      //text = text.substr(0, char_limit);
      //descEl.value = text;
      return false;
    } else {
      return true;
    }
  }

  if (tagInput) {
    tagInput.value = "";

    tagInput.addEventListener("focus", () => {
      const history = getTagHistory();
      if (history.length > 0) renderTagHistory();
      if (tagInput.value.trim().length > 0) updateTagUIVisibility();
    });

    tagInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === "," || e.key === " ") {
        e.preventDefault();
        const val = tagInput.value.trim();
        const formatted = val.replace(/^#+/, "").trim();
        const clean = formatted.toLowerCase();
        const existingTags = getAllUsedTagsSet();
        if (val.length >= 3 && /^[a-zA-Z0-9]+$/.test(val) && !existingTags.has(clean)) {
          tag_addTag(formatted);
          tagInput.value = "";
          clearTagContainer();
          updateTagUIVisibility();
        }
      }
    });

    tagInput.addEventListener("keyup", async (e) => {
      const searchStr = tagInput.value.trim();
      if (searchStr === "") {
        clearTagContainer();
        renderTagHistory();
        updateTagUIVisibility();
        return;
      }

      if (!/^[a-zA-Z0-9]+$/.test(searchStr)) {
        tagErrorEl.textContent = "Only letters and numbers allowed.";
        return;
      }

      //need to clear the error div container
      tagErrorEl.textContent = "";

      if (searchStr.length < 3) return;

      try {
        const tags = await fetchTags(searchStr);
        const existingTags = getAllUsedTagsSet();
        clearTagContainer();
        tags.forEach((tag) => {
          if (tag.count === 0 || tag.records === 0) return;
          const original = tag.name.replace(/^#+/, "").trim();
          const clean = original.toLowerCase();

          if (!existingTags.has(clean)) {
            const el = createTagElement(original, "suggestion");
            tagContainer.appendChild(el);
            existingTags.add(clean);
          }
        });

        updateTagUIVisibility();
      } catch (error) {
        console.error("Tag fetch error:", error);
      }
    });

    clearTagHistoryBtn.addEventListener("click", () => {
      localStorage.removeItem("tagHistory");
      renderTagHistory();
      updateTagUIVisibility();
    });
  }

  // ===== TAG MANAGEMENT =====
  function tag_addTag(tagText, silent = false) {
    const cleanText = tagText.replace(/^#+/, "");

    if (selectedContainer.querySelector(`[data-tag="${cleanText}"]`)) return;

    if (selectedContainer.children.length >= MAX_TAGS) {
      if (!silent) alert("Es dürfen maximal 10 Tags erstellt werden.");
      return;
    }

    const tag = createTagElement(cleanText, "selected");
    selectedContainer.appendChild(tag);

    if (!silent) saveTagToHistory(cleanText);
    updateTagUIVisibility();
  }

  // ===== TAG ELEMENT CREATION =====
  function createTagElement(tagText, source = "suggestion") {
    const cleanText = tagText.replace(/^#+/, "");
    const tag = document.createElement("span");
    tag.classList.add("tag");
    tag.textContent = `#${cleanText}`;
    tag.setAttribute("data-tag", cleanText);
    tag.setAttribute("data-source", source);

    // Only selected tags get the remove button
    if (source === "selected") {
      const removeBtn = document.createElement("span");
      removeBtn.textContent = "X";
      removeBtn.classList.add("remove-tag");
      removeBtn.type = "button";
      removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        tag.classList.add("removing");
        setTimeout(() => {
          tag.remove();
          removeFromHistory(cleanText); // remove from history
          updateTagUIVisibility();
        }, 200);
      });
      tag.appendChild(removeBtn);
    }

    tag.addEventListener("mousedown", (e) => e.preventDefault());

    // Click to select (history or suggestions)
    if (source !== "selected") {
      tag.addEventListener("click", () => {
        if (selectedContainer.querySelector(`[data-tag="${cleanText}"]`)) return;

        const selectedTag = createTagElement(cleanText, "selected");
        selectedContainer.appendChild(selectedTag);
        saveTagToHistory(cleanText);

        tagInput.value = ""; // Reset input immediately

        // Remove from UI
        tag.classList.add("removing");
        setTimeout(() => {
          tag.remove();
          renderTagHistory();
          updateTagUIVisibility();
        }, 200);

        tagInput.value = "";
      });
    }

    requestAnimationFrame(() => tag.classList.add("show"));
    return tag;
  }

  // ===== RENDER HISTORY =====
  function renderTagHistory() {
    const historyContainer = document.getElementById("tagHistoryContainer");
    const historySection = document.getElementById("tag-history-section");
    // Get selected tags from DOM
    const selectedTags = new Set(
      Array.from(selectedContainer.children)
      .map((el) => el.getAttribute("data-tag"))
      .filter(Boolean)
      .map((tag) => tag.toLowerCase().trim())
    );

    // Get suggested tags from DOM
    const suggestedTags = new Set(
      Array.from(tagContainer.children)
      .map((el) => el.getAttribute("data-tag"))
      .filter(Boolean)
      .map((tag) => tag.toLowerCase().trim())
    );

    // Load history from localStorage
    const history = localStorage.getItem("tagHistory");
    const parsed = history ? JSON.parse(history) : [];

    // If corrupted
    if (!Array.isArray(parsed)) {
      historyContainer.innerHTML = "";
      historySection.classList.remove("visible");
      return false;
    }

    // Filter out tags already shown
    const filtered = parsed.filter((tag) => {
      const clean = tag.toLowerCase().trim();
      return !selectedTags.has(clean) && !suggestedTags.has(clean);
    });

    // Update DOM
    historyContainer.innerHTML = "";

    if (filtered.length === 0) {
      historySection.classList.remove("visible");
      return false;
    }

    filtered.forEach((tagText) => {
      const tag = createTagElement(tagText, "history");
      historyContainer.appendChild(tag);
    });

    historySection.classList.add("visible");
    return true;
  }

  // ===== LOCAL STORAGE UTILS =====
  function getTagHistory() {
    const history = localStorage.getItem("tagHistory");
    return history ? JSON.parse(history) : [];
  }

  function saveTagToHistory(tagText) {
    const clean = tagText.replace(/^#+/, "");
    let history = getTagHistory();

    history = history.filter((tag) => tag !== clean); // remove if exists
    history.unshift(clean); // add to front

    if (history.length > 20) {
      history = history.slice(0, 20);
    }

    localStorage.setItem("tagHistory", JSON.stringify(history));
  }

  function removeFromHistory(tagText) {
    const clean = tagText.replace(/^#+/, "");
    const updated = getTagHistory().filter((tag) => tag !== clean);
    localStorage.setItem("tagHistory", JSON.stringify(updated));
  }

  // ===== UI UTILS =====
  function clearTagContainer() {
    tagContainer.innerHTML = "";
  }

  function updateTagUIVisibility() {
    const suggestionSection = document.getElementById("tag-suggestions-section");
    const selectedSection = document.getElementById("selected-tags-section");
    const historySection = document.getElementById("tag-history-section");
    const historyContainer = document.getElementById("tagHistoryContainer");
    const tagContainer = document.getElementById("tagsContainer");
    const tagSuggestionSection = document.getElementById("tag-suggestions-section");

    // ===== Suggestions visibility =====
    if (tagContainer && tagContainer.children.length > 0) {
      suggestionSection.classList.remove("hidden");
      tagContainer.classList.add("is-visible");
      tagSuggestionSection.classList.add("visible");
    } else {
      suggestionSection.classList.add("hidden");
      tagContainer.classList.remove("is-visible");
      tagSuggestionSection.classList.remove("visible");
    }

    // ===== Selected tags visibility =====
    if (selectedContainer && selectedContainer.children.length > 0) {
      selectedSection.classList.remove("hidden");
      selectedSection.classList.add("is-visible");
    } else {
      selectedSection.classList.add("hidden");
      selectedSection.classList.remove("is-visible");
    }

    // ===== History visibility =====
    const hasHistory = historyContainer && historyContainer.children.length > 0;
    if (historySection) {
      if (hasHistory) {
        historySection.classList.add("visible");
      } else {
        historySection.classList.remove("visible");
      }
    }
  }

  function getAllUsedTagsSet() {
    return new Set([
      ...Array.from(selectedContainer.children)
      .map((el) => el.getAttribute("data-tag"))
      .filter(Boolean)
      .map((tag) => tag.toLowerCase().trim()),
      ...getTagHistory().map((tag) => tag.toLowerCase().trim()),
    ]);
  }

  document.querySelectorAll(".form-tab-js a").forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove 'active' from all menu items
      document.querySelectorAll(".form-tab-js").forEach((item) => item.classList.remove("active"));

      // Add 'active' to clicked tab's parent <li>
      this.parentElement.classList.add("active");

      // Hide all forms
      document.querySelectorAll(".upload").forEach((form) => form.classList.remove("active"));

      // Get target form ID from clicked <a> id (e.g., createimage => preview-image)
      const id = this.id.replace("create", "preview-");
      const form = document.getElementById(id);
      if (form) form.classList.add("active");
      const postform = document.getElementById("create_new_post");
      if (postform) {
        const post_type = e.target.getAttribute("data-post-type");
        postform.setAttribute("data-post-type", post_type);
      }
      // Update the <h1 id="h1"> with the selected post type
      const post_type = e.target.getAttribute("data-post-type");
      const header = document.getElementById("h1");

      if (header && post_type) {
        const labels = {
          text: "Text Post",
          image: "Image Post",
          video: "Video Post",
          audio: "Music Post"
        };
        header.textContent = labels[post_type];
      }

      // Clear text inputs when switching tabs
      const titleInput = document.getElementById("titleNotes");
      const descInput = document.getElementById("descriptionNotes");
      const tagInput = document.getElementById("tag-input");
      const tagSelected = document.getElementById("tagsSelected");
      const charCount = document.querySelector(".char-counter .char_count");
      const titleError = document.getElementById("titleError");

      if (titleInput) titleInput.value = "";
      if (descInput) descInput.value = "";
      if (tagInput) tagInput.value = "";
      if (tagSelected) tagSelected.innerHTML = "";
      if (charCount) charCount.textContent = "0";
      if (titleError) titleError.textContent = "";
      // Check if it's the audio form (music) and init
      if (id === "preview-audio") initAudioEvents();
      const char_limit = document.querySelector("#desc_limit_box .char_limit");
      if (id === "preview-notes") {
        char_limit.textContent = "20000";
      } else {
        char_limit.textContent = "500";
      }
      setupCharCounter(descEl);

    });
  });

  async function fetchTags(searchStr) {
    for (let failed of failedSearches) {
      if (searchStr.includes(failed)) return [];
    }

    const accessToken = getCookie("authToken");
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    const query = `
      query searchTags($searchstr: String!) {
        searchTags(tagName: $searchstr, limit: 10) {
          affectedRows {
            name
          }
        }
      }
    `;

    try {
      const response = await fetch(GraphGL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query,
          variables: {
            searchstr: searchStr,
          },
        }),
      });
      const result = await response.json();
      if (!result.data.searchTags.affectedRows.length) {
        failedSearches.add(searchStr);
      }
      return result.data.searchTags.affectedRows;
    } catch {
      return [];
    }
  }

  const failedSearches = new Set();
  const zones = [{
      dropArea: document.getElementById("drop-area-image"),
      fileInput: document.getElementById("file-input-image"),
    },
    {
      dropArea: document.getElementById("drop-area-audio"),
      fileInput: document.getElementById("file-input-audio"),
    },
    {
      dropArea: document.getElementById("drop-area-videoshort"),
      fileInput: document.getElementById("file-input-videoshort"),
    },
    {
      dropArea: document.getElementById("drop-area-videocover"),
      fileInput: document.getElementById("file-input-videocover"),
    },
    {
      dropArea: document.getElementById("drop-area-videolong"),
      fileInput: document.getElementById("file-input-videolong"),
    },
    {
      dropArea: document.getElementById("drop-area-audiobackground"),
      fileInput: document.getElementById("file-input-audiobackground"),
    },
  ];

  function handleClick(input) {
    input.click();
  }

  function handleDragOver(e, area) {
    e.preventDefault();
    area.classList.add("hover");
  }

  function handleDragLeave(area) {
    area.classList.remove("hover");
  }

  async function handleDrop(e, area, processor) {
    e.preventDefault();
    area.classList.remove("hover");
    const files = Array.from(e.dataTransfer.files);
    if (files.length) await processor(files, area.id);
  }

  async function handleFileChange(e, processor) {
    const files = Array.from(e.target.files);
    if (files.length) {
      await processor(files, e.currentTarget.id);
      e.target.value = "";
    }
  }

  // Iteration über die Zonen
  zones.forEach(({
    dropArea,
    fileInput
  }) => {
    if (dropArea) {
      dropArea.addEventListener("click", () => handleClick(fileInput));
      dropArea.addEventListener("dragover", (e) => handleDragOver(e, dropArea));
      dropArea.addEventListener("dragleave", () => handleDragLeave(dropArea));
      dropArea.addEventListener("drop", (e) => handleDrop(e, dropArea, processFiles));
    }
    // File-Input-Change-Event
    if (fileInput)
      fileInput.addEventListener("change", (e) => handleFileChange(e, processFiles));
  });

  document.getElementById("more-images_upload").addEventListener("click", function () {
    const fileInput = document.querySelector("#drop-area-image input[type='file']");
    if (fileInput) fileInput.click();
  });

  async function processFiles(files, id) {
    let previewItem, previewContainer = "";

    modal.showModal();

    const types = ["video", "audio", "image"];
    const uploadtype = types.find((wort) => id.includes(wort));
    const ErrorCont = document.querySelector("#preview-" + uploadtype + " .response_msg");
    ErrorCont.innerHTML = "";
    previewContainer = (uploadtype === "image" ? document.querySelector("#preview-" + uploadtype + " .preview-track") : document.getElementById("preview-" + uploadtype))
    for (let file of files) {
      previewItem = document.createElement("div");
      previewItem.className = "preview-item dragable";
      const type = file.type.substring(0, 5);
      if (uploadtype === "audio") {
        if (id.includes("audiobackground")) {
          if (!validateFileType(file, "image", modal, ErrorCont)) return;
          previewItem.innerHTML = `
          <p>${file.name}</p>
          <img class="image-wrapper create-img none" alt="Vorschau" />
          <img src="svg/logo_farbe.svg" class="loading" alt="loading">
          <img src="svg/edit.svg" class="editImage " alt="edit">
          <img src="svg/plus2.svg" id="deletecover" class="btClose deletePost" alt="delete">`;
          const insertPosition = document.getElementById("audio-cover-image-preview");
          insertPosition.innerHTML = ""; // Removes any existing children
          insertPosition.appendChild(previewItem); // Adds the new one
        } else {
          if (!validateFileType(file, uploadtype, modal, ErrorCont)) return;
          previewItem.classList.add("audio-item");
          previewItem.innerHTML = `
          <p>${file.name}</p>        
          <audio class="image-wrapper create-audio none" alt="Vorschau" controls=""></audio>
          <img src="svg/logo_farbe.svg" class="loading" alt="loading">
          <img src="svg/plus2.svg" class=" btClose deletePost" alt="delete">
          <div class="audio_player_con" ><div class="time-info" >
          <span id="current-time">0:00</span> / <span id="duration">0:00</span>
          </div><canvas id="waveform-preview" width="700" height="130"></canvas><span id="play-pause">Play</span></div>`;

          const insertAudioPosition = document.getElementById("audio_upload_block");
          insertAudioPosition.innerHTML = ""; // Removes any existing children
          insertAudioPosition.appendChild(previewItem);

          const dropareaaudio = document.getElementById("drop-area-audio");
          dropareaaudio.classList.add("none");
        }
      } else if (uploadtype === "image") {
        if (!validateFileType(file, uploadtype, modal, ErrorCont)) return;
        previewItem.draggable = true;
        previewItem.classList.add("dragable");
        previewItem.innerHTML = `
        <p>${file.name}</p>
        <img class="image-wrapper create-img none" alt="Vorschau" />
        <img src="svg/logo_farbe.svg" class="loading" alt="loading">
        <span class="editImage" >
          <svg xmlns="http://www.w3.org/2000/svg" width="61" height="60" viewBox="0 0 61 60" fill="none">
              <circle cx="30.5003" cy="30.0003" r="20.7581" stroke="white" stroke-width="3"/>
              <circle cx="30.4986" cy="29.9986" r="11.0806" stroke="white" stroke-width="3"/>
          </svg>
          Click to crop
        </span>
        <img src="svg/plus2.svg" class=" btClose deletePost" alt="delete">`;
        if (previewContainer.children.length > 0) {
          previewContainer.children[0].insertAdjacentElement("afterend", previewItem);
        } else {
          previewContainer.appendChild(previewItem);
        }
        //document.getElementById("drop-area-videocover").classList.add("none");
      } else if (uploadtype === "video") {
        if (id.includes("cover")) {
          if (!validateFileType(file, 'image', modal, ErrorCont)) return;
          previewItem.innerHTML = `
          <p>${file.name}</p>
          <img class="image-wrapper create-img none" alt="Vorschau" />
          <img src="svg/logo_farbe.svg" class="loading" alt="loading">
          <span class="editImage" >
          <svg xmlns="http://www.w3.org/2000/svg" width="61" height="60" viewBox="0 0 61 60" fill="none">
              <circle cx="30.5003" cy="30.0003" r="20.7581" stroke="white" stroke-width="3"/>
              <circle cx="30.4986" cy="29.9986" r="11.0806" stroke="white" stroke-width="3"/>
          </svg>
          Click to crop
        </span>
          <img src="svg/plus2.svg" id="deletecover" class="btClose deletePost" alt="delete">`;
          const insertPosition = document.getElementById("drop-area-videocover");
          insertPosition.insertAdjacentElement("afterend", previewItem);
          document.getElementById("drop-area-videocover").classList.add("none");
        } else {
          if (!validateFileType(file, uploadtype, modal, ErrorCont)) return;
          previewItem.classList.add("video-item");
          previewItem.classList.add(id);
          previewItem.innerHTML = `
          <p>${file.name}</p>
          <video id="${file.name}" class="image-wrapper create-video none " alt="Vorschau" controls=""></video>
          <img src="svg/logo_farbe.svg" class="loading" alt="loading">
         
          <span class="editVideo" >
            <svg xmlns="http://www.w3.org/2000/svg" width="61" height="60" viewBox="0 0 61 60" fill="none">
                <circle cx="30.5003" cy="30.0003" r="20.7581" stroke="white" stroke-width="3"/>
                <circle cx="30.4986" cy="29.9986" r="11.0806" stroke="white" stroke-width="3"/>
            </svg>
            Click to Trim
          </span>
          <img src="svg/plus2.svg" id="${id.includes("short") ? "deleteshort" : "deletelong"}" class="btClose deletePost" alt="delete">`;

          if (id.includes("short")) {
            const insertPosition = document.getElementById("drop-area-videoshort");
            insertPosition.insertAdjacentElement("afterend", previewItem);
            document.getElementById("drop-area-videoshort").classList.add("none");
          } else {
            const insertPosition = document.getElementById("drop-area-videolong");
            insertPosition.insertAdjacentElement("afterend", previewItem);
            if (!document.getElementById("deletecover"))
              document.getElementById("drop-area-videocover").classList.remove("none");
            if (!document.getElementById("deleteshort"))
              document.getElementById("drop-area-videoshort").classList.remove("none");
            document.getElementById("drop-area-videolong").classList.add("none");
          }
        }
      }

      // const base64 = await convertImageToBase64(file);
      const videoId = id.includes("short") ? "shortVideoTimeline" : "longVideoTimeline";
      console.log('videoId ', videoId)
      const url = URL.createObjectURL(file);
      let element = null;
      if (type === "image") {
        //sessionStorage.setItem(file.name, base64);
        element = previewItem.querySelector("img.create-img");
        uploadedFilesMap.set(file.name, file);
      } else if (type === "audio") {
        element = previewItem.querySelector("audio");
      } else if (type === "video") {
        element = previewItem.querySelector("video");
        //sessionStorage.setItem(file.name, base64);
        // Store base64
        window.uploadedFilesMap.set(file.name, url);
        element.addEventListener("loadedmetadata", async (e) => {
          // generateThumbnails(file.name); before
          generateThumbnailStrip(url, videoId);
        }, {
          once: true
        });
      }

      element.src = url;
      element.classList.remove("none");
      element.nextElementSibling ?.remove();
      element.nextElementSibling ?.classList.remove("none");
      if (type === "audio") {
        //initAudioplayer(file.name, base64);
        // initAudioplayer("audio_upload_block", base64);
        initAudioplayer("audio_upload_block", url);
        document.querySelector(".audiobackground_uploader") ?.classList.remove("none");
        document.querySelector(".recodring-block") ?.classList.add("none");
        const audio_upload_block = document.getElementById("audio_upload_block");
        const audio_del_btn = audio_upload_block.querySelector(".preview-item .deletePost");
        if (audio_del_btn) {
          audio_del_btn.addEventListener("click", () => {
            document.querySelector(".audiobackground_uploader") ?.classList.add("none");
            document.querySelector(".recodring-block") ?.classList.remove("none");
            const dropareaaudio = document.getElementById("drop-area-audio");
            dropareaaudio.classList.remove("none");
          });
        }

      } else if (type === "video") {
        element.autoplay = true;
        element.loop = true;
        element.muted = true; // Optional: Video ohne Ton abspielen
      }
    } // end of for loop

    if (uploadtype === "audio") {
      const voiceRecordWrapper = document.getElementById("voice-record-wrapper");
      const preview_del_btn = voiceRecordWrapper.querySelector(".preview-item .deletePost");
      const img = voiceRecordWrapper.querySelector(".preview-item img.create-img");
      if (img) img.onload = (e) => voiceRecordWrapper.setAttribute('style', `background-image:url(${e.target.src})`);
      if (preview_del_btn) {
        preview_del_btn.addEventListener("click", () => {
          voiceRecordWrapper.removeAttribute('style');
        });
      }
    }
    modal.close();

    document.querySelectorAll(".editImage").forEach(addEditImageListener);
    document.querySelectorAll(".editVideo").forEach(addEditVideoListener);
    if (uploadtype === "image") {
      document.querySelectorAll(".deletePost").forEach((el) => {
        el.removeEventListener("click", handleDelete);
        el.addEventListener("click", handleImageDelete);
      });
    } else {
      document.querySelectorAll(".deletePost").forEach(addDeleteListener);
    }

    let currentIndex = 0;

    function scrollToIndex(index) {
      const previewTrack = document.querySelector("#preview-image .preview-track");
      const previewItems = previewTrack.querySelectorAll(".preview-item");
      if (index < 0 || index >= previewItems.length) return;
      // Sum widths of all items before the target index
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += previewItems[i].offsetWidth + 20; // Add 20px gap
      }
      previewTrack.style.transform = `translateX(-${offset}px)`;
      currentIndex = index;
    }

    document.querySelector(".next-button").addEventListener("click", () => {
      const previewItems = document.querySelectorAll("#preview-image .preview-track .preview-item");
      if (currentIndex < previewItems.length - 1) {
        scrollToIndex(currentIndex + 1);
      }
    });

    document.querySelector(".prev-button").addEventListener("click", () => {
      if (currentIndex > 0) {
        scrollToIndex(currentIndex - 1);
      }
    });

    function handleImageDelete(event) {
      event.preventDefault();
      const previewTrack = document.querySelector("#preview-image .preview-track");
      const previewItem = event.target.closest(".preview-item");
      previewItem.remove();

      const items = previewTrack.querySelectorAll(".preview-item");
      const totalItems = items.length;

      // Clamp index
      if (currentIndex >= totalItems) {
        currentIndex = totalItems - 1;
      }
      setTimeout(toggleScrollButtons, 200);
      imageItemCount();
      scrollToIndex(currentIndex);
    }

    const container = document.querySelector('.preview-track-wrapper');
    const track = container.querySelector('.preview-track');
    const nextBtn = document.querySelector('.next-button');
    const prevBtn = document.querySelector('.prev-button');

    function isElementInViewportX(child, container) {
      const containerRect = container.getBoundingClientRect();
      const childRect = child.getBoundingClientRect();

      return (
        childRect.left >= containerRect.left &&
        childRect.right <= containerRect.right
      );
    }

    function toggleScrollButtons() {
      const isVisible = isElementInViewportX(track, container);
      if (!isVisible) {
        nextBtn.classList.remove('none');
        prevBtn.classList.remove('none');
        document.getElementById("preview-image").classList.add("enbale_more_upload_btn");
      } else {
        nextBtn.classList.add('none');
        prevBtn.classList.add('none');
        document.getElementById("preview-image").classList.remove("enbale_more_upload_btn")
      }
      // console.log("Is first item visible?", isElementInViewportX(track, container));
      imageItemCount();
    }

    // Call once on load
    setTimeout(toggleScrollButtons, 200);

    // Optionally recheck on window resize or DOM change
    window.addEventListener('resize', toggleScrollButtons);
    container.addEventListener('scroll', toggleScrollButtons);

    function imageItemCount() {
      const image_container = document.getElementById("preview-image");
      const imageItemCount = image_container.querySelectorAll(".preview-item").length;
      if (imageItemCount > 0) {
        image_container.classList.add("image_added");
      } else {
        image_container.classList.remove("image_added");
      }
    }
  } // END OF PROCESS-FILES

  function validateFileType(file, uploadType, modal, errorContainer) {
    const allowedTypesMap = {
      audio: {
        types: ["audio/mp3", "audio/m4a", "audio/aac", "audio/wav", "audio/mpeg"],
        message: ".mpeg, .m4a, .aac and .wav files are supported. Please upload a different format for audio."
      },
      image: {
        types: ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif", "image/tiff"],
        message: "Unsupported format file. Please upload a different format for image."
      },
      video: {
        types: ["video/mp4", "video/m4v", "video/mkv", "video/3gp", "video/ogg", "video/avi"],
        message: ".mp4, .m4v, .avi, .ogg, .mkv and .3gp video files are supported."
      }
      //"video/quicktime",
    };

    const config = allowedTypesMap[uploadType];
    if (!config) {
      console.error(`Unknown uploadType: ${uploadType}`);
      return false;
    }

    if (!config.types.includes(file.type)) {
      modal.close();
      errorContainer.textContent = config.message;
      return false;
    }

    errorContainer.textContent = "";
    return true;
  }

  function addEditVideoListener(element) {
    element.removeEventListener("click", handleEditVideo);
    element.addEventListener("click", handleEditVideo);
  }

  async function handleEditVideo(event) {
    event.preventDefault();
    // console.log('e.target.files ', event.target.closest(".editVideo").previousElementSibling)
    const container = document.getElementById('preview-video');
    const videos = container.querySelectorAll('video');

    // Jedes Video pausieren
    videos.forEach(video => {
      video.pause();
    });

    const previewItem = event.target.closest(".preview-item");
    previewItem.classList.add('click_edit');
    // Show the Trim container after a short delay
    // setTimeout(async () => {
    const video_id = previewItem.querySelector("video").getAttribute('id');
    document.getElementById("videoTrimContainer").classList.remove("none");
    await videoTrim(video_id);
    previewItem.classList.remove('click_edit');
    // }, 500);
  }

  async function videoTrim(id) {
    videoElement = document.getElementById(id);
    if (!videoElement) {
      console.error(`Video element with ID ${id} not found.`);
      return;
    }
    // Reset the timeline
    video.setAttribute("data-id", id);

    // Set the video source
    if (window.uploadedFilesMap.has(id)) {
      // video.src = sessionStorage.getItem(id);
      video.src = window.uploadedFilesMap.get(id);
    } else {
      video.src = videoElement.src;
    }

    // Show the trim container
    document.getElementById("videoTrimContainer").classList.remove("none");
    document.getElementById("videoTrimContainer").classList.add("active");
    // generateThumbnailStrip(video.src)
  }

  function addEditImageListener(element) {
    element.removeEventListener("click", handleEditImage);
    element.addEventListener("click", handleEditImage);
  }

  function handleEditImage(event) {
    event.preventDefault();
    cropOrg = event.target.closest(".preview-item").childNodes[3];
    const imageDatasrc = window.uploadedFilesMap.get(event.target.parentElement.childNodes[1].innerText);
    const previewItem = event.target.closest(".preview-item");
    if (previewItem.hasAttribute("data-aspectratio")) {
      aspect_Ratio = previewItem.getAttribute("data-aspectratio");
    } else {
      aspect_Ratio = 1;
    }

    // Now select the matching radio input and mark it as checked
    const radioToCheck = document.querySelector(`#aspectRatioSelect input[name="aspectRatio"][value="${aspect_Ratio}"]`);
    if (radioToCheck) {
      radioToCheck.checked = true;
    }

    if (imageDatasrc) {
      cropImg.src = URL.createObjectURL(imageDatasrc);
    } else {
      cropImg.src = cropOrg.src; // Das Bild aus dem Element holen
    }

    previewItem.classList.add('click_edit');
    // Show the crop container after a short delay
    setTimeout(() => {
      document.getElementById("crop-container").classList.remove("none");
      previewItem.classList.remove('click_edit');
    }, 500);
  }

  function addDeleteListener(element) {
    element.removeEventListener("click", handleDelete);
    element.addEventListener("click", handleDelete);
  }

  function handleDelete(event) {
    event.preventDefault();
    if (event.target.id === "deletecover") {
      document.getElementById("drop-area-videocover").classList.remove("none");
    } else if (event.target.id === "deleteshort") {
      document.getElementById("drop-area-videoshort").classList.remove("none");
    } else if (event.target.id === "deletelong") {
      document.getElementById("drop-area-videolong").classList.remove("none");
    }
    event.target.parentElement.remove();
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
  // ----------- THUMBNAILS GENERIEREN (wie vorher) ----------
  // videothumbs = []; // Globales Objekt für Thumbnails
  // async function generateThumbnails(id) {
  //   const video = document.getElementById(id);
  //   const dataId = video.getAttribute("data-id");
  //   const timeline = document.getElementById("videoTimeline");
  //   timeline.innerHTML = "";
  //   const duration = video.duration;
  //   const times = [];
  //   for (let i = 0; i < THUMB_COUNT; i++) {
  //     times.push((duration * i) / (THUMB_COUNT - 1));
  //   }
  //   const canvas = document.createElement("canvas");
  //   canvas.width = 160;
  //   canvas.height = 90;
  //   const ctx = canvas.getContext("2d");
  //   const videoId = dataId ? dataId : id;

  //   if (!videothumbs[videoId])
  //     videothumbs[videoId] = [];
  //   for (let t of times) {
  //     const img = document.createElement("img");
  //     if (!videothumbs[videoId][t]) {
  //       video.currentTime = t;
  //       await new Promise((res) => video.addEventListener("seeked", res, {
  //         once: true
  //       }));
  //       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  //       img.src = canvas.toDataURL("image/jpeg");
  //       videothumbs[videoId][t] = img.src;
  //     } else {
  //       img.src = videothumbs[videoId][t];
  //     }
  //     if (dataId)
  //     timeline.appendChild(img);
  //   }
  // }

  // Configuration
  async function generateThumbnailStrip(file, timelineId, {
    thumbWidth = 160,
    THUMB_COUNT = 10,
    BATCH_SIZE = 1
  } = {}) {
    const timeline = document.getElementById(timelineId);
    timeline.innerHTML = "";
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = file;

    // modal.showModal()

    await new Promise((res, rej) => {
      video.onloadedmetadata = res;
      video.onerror = rej;
    });

    const duration = video.duration;
    const canvas = document.createElement("canvas");
    canvas.width = thumbWidth;
    canvas.height = Math.round(video.videoHeight / video.videoWidth * thumbWidth);
    const ctx = canvas.getContext("2d");
    const times = Array.from({
      length: THUMB_COUNT
    }, (_, i) => (i * duration) / (THUMB_COUNT - 1));

    // Process in batches
    for (let i = 0; i < times.length; i += BATCH_SIZE) {
      const batch = times.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async t => {
        await new Promise(res => {
          const handler = () => {
            res();
            video.removeEventListener("seeked", handler);
          };
          video.addEventListener("seeked", handler);
          video.currentTime = t;
        });

        const bitmap = await createImageBitmap(video);
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();

        const blob = await new Promise(r => canvas.toBlob(r, "image/jpeg"));
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob);
        img.onload = () => URL.revokeObjectURL(img.src);
        timeline.appendChild(img);
      }));
    }
    // modal.close();
  }

  video.addEventListener("loadedmetadata", async (e) => {
    video.removeEventListener('timeupdate', () => {
      showVideoPos();
    });
    video.addEventListener('timeupdate', () => {
      showVideoPos();
    });
    setupTrim(true);
    // await generateThumbnails("videoTrim");
    // setupTrim();
  });

  async function getBlobSizeFromURL(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    return blob.size;
  }
  async function updateVideoInfo() {
    const durationEL = document.getElementById("video_druration");
    const videostart = document.getElementById("video_start");
    const videoend = document.getElementById("video_end");
    if (durationEL) {
      durationEL.textContent = new Date((video.duration * (endPercent - startPercent)) * 1000).toISOString().substr(11, 8);
      videostart.textContent = new Date((video.duration * startPercent) * 1000).toISOString().substr(11, 8);
      videoend.textContent = new Date((video.duration * endPercent) * 1000).toISOString().substr(11, 8);
    }
    var byteLength = await getBlobSizeFromURL(video.src) * (endPercent - startPercent);
    const sizeEL = document.getElementById("video_MB");
    if (sizeEL) {
      sizeEL.textContent = (byteLength / 1024 / 1024).toFixed(2) + " MB";
    }
  }

  let windowStartPercent = 0;
  let windowEndPercent = 0;
  let dragging = null; // 'left' | 'right' | null
  let dragStartX = 0;
  // const wrapper = document.querySelector(".timeline-wrapper");
  // const timelineRect = timeline.getBoundingClientRect();
  // const wrapperRect = wrapper.getBoundingClientRect();

  function setupTrim(reset = false) {
    if (reset) {
      startPercent = 0.0000;
      endPercent = 1.0000;
      updateVideoInfo();
      positionElements();
      cuttedVideo = null;
    }
    positionElements();
  }

  function positionElements() {
    const w = timeline.offsetWidth;
    // Positionen berechnen
    const left = Math.round(startPercent * w);
    const right = Math.round(endPercent * w);
    // Trim-Fenster
    trimWindow.style.left = left + "px";
    trimWindow.style.width = right - left + "px";
    trimWindow.style.top = timeline.offsetTop + "px";
    trimWindow.style.height = timeline.offsetHeight + "px";
    // Overlays
    overlayLeft.style.left = "0px";
    overlayLeft.style.width = left + "px";
    overlayLeft.style.top = timeline.offsetTop + "px";
    overlayLeft.style.height = timeline.offsetHeight + "px";
    overlayRight.style.left = right + "px";
    overlayRight.style.width = w - right + "px";
    overlayRight.style.top = timeline.offsetTop + "px";
    overlayRight.style.height = timeline.offsetHeight + "px";
    showVideoPos();
  }

  function percentFromX(x) {
    // x relativ zum Timeline-Container
    const rect = timeline.getBoundingClientRect();
    let p = (x - rect.left) / rect.width;
    return Math.min(Math.max(p, 0), 1);
  }

  // Drag-Handler
  handleLeft.addEventListener("pointerdown", (e) => {
    dragging = "left";
    dragStartX = e.clientX;
    document.body.style.cursor = "ew-resize";
    e.preventDefault();
  });
  handleRight.addEventListener("pointerdown", (e) => {
    dragging = "right";
    dragStartX = e.clientX;
    document.body.style.cursor = "ew-resize";
    e.preventDefault();
  });
  trimWindow.addEventListener("pointerdown", (e) => {
    if (e.target === handleLeft || e.target === handleRight) return;
    dragging = "window";
    dragStartX = e.clientX;
    windowStartPercent = startPercent;
    windowEndPercent = endPercent;
    trimWindow.style.cursor = "grabbing";
    document.body.style.cursor = "grabbing";
    e.preventDefault();
  });
  // Haupt-Drag-Events
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    cuttedVideo = null;
    // const wrapper = document.querySelector(".timeline-wrapper");
    const timelineRect = timeline.getBoundingClientRect();
    // const wrapperRect = wrapper.getBoundingClientRect();
    video.pause();
    const x = e.clientX;
    const p = percentFromX(x);
    if (dragging === "left") {
      let nextStart = Math.min(p, endPercent - MIN_DURATION / video.duration);
      nextStart = Math.max(0, Math.min(nextStart, 1));
      startPercent = nextStart;
    } else if (dragging === "right") {
      let nextEnd = Math.max(p, startPercent + MIN_DURATION / video.duration);
      nextEnd = Math.max(0, Math.min(nextEnd, 1));
      endPercent = nextEnd;
    } else if (dragging === "window") {
      const dx = x - dragStartX;
      const w = timelineRect.width;
      const percentShift = dx / w;
      let newStart = windowStartPercent + percentShift;
      let newEnd = windowEndPercent + percentShift;
      // Begrenzung, damit das Fenster im Bereich bleibt
      const winWidth = windowEndPercent - windowStartPercent;
      if (newStart < 0) {
        newStart = 0;
        newEnd = winWidth;
      }
      if (newEnd > 1) {
        newEnd = 1;
        newStart = 1 - winWidth;
      }
      startPercent = newStart;
      endPercent = newEnd;

    }

    const startPos = video.duration * p;
    if (1 || seekedFinished) {
      seekedFinished = false;
      if (dragging === "right") {
        if ("fastSeek" in video) video.fastSeek(video.duration * endPercent);
        else video.currentTime = video.duration * endPercent;
      } else {
        if ("fastSeek" in video) video.fastSeek(startPos);
        else video.currentTime = startPos;
      }
    }
    startPercent = Math.max(0, Math.min(startPercent, 1));
    endPercent = Math.max(0, Math.min(endPercent, 1));
    updateVideoInfo();
    positionElements();
  });

  // window.removeEventListener('pointerup', (e) => {});
  window.addEventListener("pointerup", (e) => {
    if (dragging) {
      dragging = null;
      showVideoPos() ;
      document.body.style.cursor = "";
      // video.currentTime = video.duration * startPercent;
      // trimVideo(true); // Video trimmen
    }
    window.pointerUpRegistered = true;
  });

  // Bei Fenstergröße ändern → alles nachjustieren
  window.addEventListener("resize", () => {
    positionElements();
  });

  // Initial-Positionierung
  positionElements();

  trimQuitBtn.onclick = () => {
    document.getElementById("videoTrimContainer").classList.add("none");
    document.getElementById("videoTrimContainer").classList.remove("active");
  }

  function showVideoPos() {
    const videoPos = document.getElementById("videoPos");
    if (videoPos) {
      videoPos.style.left = (video.currentTime / video.duration) * 100 + "%";
    }
  }
  // const downloadLink = document.getElementById("download-link");
  // Beachte: Diese Variablen (startPercent, endPercent) sind im Trim-Code definiert!
  // let startPercent = 0.15;
  // let endPercent = 0.85;

  // Funktion für den Schnitt
  // let cuttedVideo = null; // Variable für das geschnittene Video
  // async function trimVideo(background = false) {
  //   // Stelle sicher, dass Metadaten da sind
  //   if (!video.duration) {
  //     alert("Video ist noch nicht geladen!");
  //     return;
  //   }
  //   const container = document.getElementById('preview-video');
  //   const videos = container.querySelectorAll('video');
  //   // Jedes Video pausieren
  //   videos.forEach(video => { if( !video.paused ) video.pause() });
  //   if (cuttedVideo) {
  //     // Wenn bereits ein geschnittenes Video vorhanden ist, nutze es direkt
  //     videoElement.src = cuttedVideo;
  //   } else {
  //     const modal = document.getElementById('videocodierung');
  //     if(!background){
  //       modal.showModal();
  //       document.getElementById("nocursor").focus();
  //     }

  //     // console.log('video.duration ', video.duration)
  //     // console.log('startPercent ', startPercent)
  //     // console.log('endPercent ', endPercent)
  //     // console.log('formula ', (startPercent * endPercent))

  //     // Schnitt-Zeiten berechnen
  //     const startTime = video.duration * startPercent;
  //     const endTime = video.duration * endPercent;

  //     // Sicherstellen, dass keine Wiedergabe läuft
  //     video.pause();

  //     // Canvas zum Capturen des Videos
  //     const canvas = document.createElement("canvas");
  //     canvas.width = video.videoWidth;
  //     canvas.height = video.videoHeight;
  //     const ctx = canvas.getContext("2d");
  //     //let mimeType = "video/mp4"; 

  //     // Canvas streamen
  //     const stream = canvas.captureStream();
  //     const get_browser = getBrowser();

  //     let rec;

  //     if (get_browser === "Chrome" || get_browser === "Safari" || get_browser === "Edge") {
  //         rec = new MediaRecorder(stream, { mimeType: "video/mp4" }); // use webm
  //     } else {
  //         rec = new MediaRecorder(stream); // fallback, let browser decide
  //     }

  //     let chunks = [];
  //     rec.ondataavailable = (e) => e.data && chunks.push(e.data);
  //     // Trim Vorgang
  //     video.currentTime = startTime;
  //     await new Promise((res) => (video.onseeked = res));
  //     // Start Aufnahme
  //     rec.start();
  //     //
  //     video.play();
  //     // Frame für Frame auf das Canvas kopieren, bis zur Endzeit
  //     let animationId;
  //     function drawFrame() {
  //       if (video.currentTime >= endTime || video.ended) {
  //         video.pause();
  //         rec.stop();
  //         cancelAnimationFrame(animationId);
  //         return;
  //       }
  //       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  //       animationId = requestAnimationFrame(drawFrame);
  //     }
  //     drawFrame();

  //     // Nach Aufnahme: Download anbieten
  //     rec.onstop = async () => {
  //       const blob = new Blob(chunks, { type: "video/mp4" });
  //       // const url = URL.createObjectURL(blob);
  //       const base64 = await blobToBase64(blob);
  //       cuttedVideo = base64; // Geschnittenes Video in Base64 speichern
  //       if(!background){
  //         videoElement.src = base64; // Update video source to trimmed video
  //         document.getElementById("videoTrimContainer").classList.add("none");
  //         modal.close();
  //         videos.forEach(video => {
  //           video.play();
  //         });
  //       }
  //     };
  //   };
  //   if(!background){
  //       document.getElementById("videoTrimContainer").classList.add("none");
  //       // modal.close();
  //     }
  //     // Jedes Video pausieren
  // }

  async function loadFFmpeg() {
    if (!window.ffmpegInstance) {
      window.ffmpegInstance = new FFmpeg({
        corePath: window.location.origin + "/peer_web_frontend/js/ffmpeg/core/package/dist/umd/ffmpeg-core.js",
        log: true
      });
      await window.ffmpegInstance.load();
    }
    return window.ffmpegInstance;
  }

  /**
   * Trim a video between startPercent and endPercent
   * @param {File} videoFile - Original uploaded video file
   * @param {number} startPercent - Start point (0 to 1)
   * @param {number} endPercent - End point (0 to 1)
   */
  async function trimVideo() {
    if (!video.duration) {
      alert("Video ist noch nicht geladen!");
      return;
    }
    
    // modal.showModal();
    const duration = video.duration;
    const startTime = duration * startPercent;
    // const endTime = duration * endPercent;
    const trimDuration = duration * (endPercent - startPercent);
    const ffmpeg = await loadFFmpeg();
    // let lastUpdate = 0;
      
    try {
      const bar = document.getElementById('bar');
      bar.value = 0;
        
      const pct = document.getElementById('pct');
      pct.textContent = "0%";
      const nocursor = document.getElementById('focus');
      modal.showModal();
      nocursor.focus();

      ffmpeg.on("progress", ({ time }) => {
        // Achtung: manche Builds liefern "time" in Sekunden, andere in ms
        const seconds = typeof time === "number" ? time / 1000000 : parseFloat(time);
        const ratio = seconds / trimDuration;

        const percent = Math.min(100, Math.round(ratio * 100));
        if(seconds <= trimDuration) {
          bar.value = percent;
          pct.textContent = percent + "%";
        }
      });
      // Fetch video data from the existing video element
      const response = await fetch(video.src);
      const arrayBuffer = await response.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      // Write to FFmpeg FS
      await ffmpeg.writeFile("input.mp4", uint8);

      // Trim with fast seek
      await ffmpeg.exec([
        "-ss", String(startTime), // seek to nearest keyframe (fast)
        "-i", "input.mp4",
        "-t", String(trimDuration),
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-c:a", "aac", "-b:a", "160k",
        "output.mp4"
      ]);

      // Read trimmed output
      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([data], {
        type: "video/mp4"
      });

      // Clean up old preview URL
      // if (preview.srcObjectUrl) URL.revokeObjectURL(preview.srcObjectUrl);
      const url = URL.createObjectURL(blob);
      video.src = url;
      video.load();
      videoElement.src = url;
      document.getElementById("videoTrimContainer").classList.add("none");
      document.getElementById('videocodierung').close();
      video.play();

      // UI adjustments
      // document.getElementById("videoTrimContainer").classList.add("none");
      // if (document.getElementById("videocodierung").close) {
      //   document.getElementById("videocodierung").close();
      // }

      // // Revoke blob after playback
      // preview.onended = () => {
      //   URL.revokeObjectURL(url);
      //   preview.srcObjectUrl = null;
      // };

    } catch (err) {
      console.error("Video trimming failed:", err);
      alert("Trimming failed. Check console for details.");
    } finally {
      pct.textContent = "0%";
      modal.close();
    }
  }

  trimBtn.onclick = async () => {
    trimVideo(false);
  };

  // function blobToBase64(blob) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result); // gibt ein Data-URL-String zurück (inkl. "data:video/webm;base64,...")
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // }
  async function blobUrlToBase64(blobUrl) {
    const res = await fetch(blobUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
});