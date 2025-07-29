document.addEventListener("DOMContentLoaded", () => {
  const MAX_TAGS = 10;

  // DOM references
  const tagInput = document.getElementById("tag-input");
  const tagContainer = document.getElementById("tagsContainer");
  const selectedContainer = document.getElementById("tagsSelected");
  const clearTagHistoryBtn = document.getElementById("clearTagHistory");
  const descEl = document.getElementById("descriptionNotes");
  const titleEl = document.getElementById("titleNotes");

  updateTagUIVisibility(); // suggestions + selected
  /********************* Preview posts functionality ******************************/

  function previewPost(objekt) {
	  currentPostData = objekt;    
    const postContainer = document.getElementById("preview-post-container");

    const array = objekt.media || [];

    const containerleft = postContainer.querySelector(".viewpost-left");
    const containerright = postContainer.querySelector(".viewpost-right");
    const post_gallery = containerleft.querySelector(".post_gallery");
    post_gallery.innerHTML="";
    const post_contentletf=containerleft.querySelector(".post_content");
    if(post_contentletf)   post_contentletf.remove();

    const post_contentright=containerright.querySelector(".post_content");

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
    
    
    const profile_header_left=postContainer.querySelector(".profile-header-left");
   
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

      if (objekt.tags?.length > 0) {
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

      return { sliderTrack, sliderThumbs, updateSlider };
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
        audioContainer.appendChild(audio);
        // 5. Füge das <div> in das Dokument ein (z.B. ans Ende des Body)
        post_gallery.appendChild(audioContainer);
        //console.log(audio.src);

        initAudioplayer("preview-audio-block", audio.src);
      }
    } else if (objekt.contenttype === "video") {
      post_gallery.className = "post_gallery video";
    if (array.length > 1) post_gallery.classList.add("multi");

    const { sliderTrack, sliderThumbs, updateSlider } = makeSlider("video");

    array.forEach((media, index) => {
      const slide = document.createElement("div");
      slide.className = "slide_item";

      const video = document.createElement("video");
      video.src = media;
      video.controls = true;
      video.loop = true;
      video.autoplay = index === 0;
      video.muted = false;
      video.className = "custom-video";

      slide.appendChild(video);
      sliderTrack.appendChild(slide);

      const thumb = document.createElement("div");
      thumb.className = "timg";
      thumb.innerHTML = `<i class="fi fi-sr-play"></i><img src="img/audio-bg.png" alt="">`;
      sliderThumbs.appendChild(thumb);

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
  }else {
    post_gallery.className = "post_gallery images";
    if (array.length > 1) post_gallery.classList.add("multi");

    const { sliderTrack, sliderThumbs, updateSlider } = makeSlider("image");

    array.forEach((media, index) => {
      const slide = document.createElement("div");
      slide.classList.add("slide_item");

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
  title.innerHTML = objekt.title || "";
  description.textContent = objekt.description || "";
  hashtags.innerHTML = (objekt.tags || []).map(tag => `#${tag}`).join(" ");
  collapsedCard.classList.remove("multi-video", "double-card");
  collapsedCard.removeAttribute("content");

  const oldVideoPlayer = inhaltDiv.querySelector(".video-player");
  if (oldVideoPlayer) oldVideoPlayer.remove();

  const oldImageCounter = inhaltDiv.querySelector(".image_counter");
  if (oldImageCounter) oldImageCounter.remove();

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
      if (objekt.cover?.[index]) {
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

      slide.addEventListener("mouseleave", function () {
        const videoCover = this.querySelector(".video-cover");
        if (videoCover) videoCover.classList.remove("none");

        const videos = this.querySelectorAll("video");
        videos.forEach(vid => { if (!vid.paused) vid.pause(); });
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
      if (objekt.options?.ratio === '16:9') {
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

      if (objekt.cover?.[index]) {
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
    const postContent = inhaltDiv?.querySelector(".post-content");
    if (postContent) {
      const imageCounter = document.createElement("div");
      imageCounter.classList.add("image_counter");

      mediaArray.forEach((_, i) => {
        const span = document.createElement("span");
        span.textContent = i + 1;
        if (i === 0) span.classList.add("active");
        span.addEventListener("click", () => switchSlide(i));
        imageCounter.appendChild(span);
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

    let postMedia;
    let cover;
    let postDescription = "";

    switch (post_type) {
      case "text":
        {
          // Convert to base64
          const base64String = btoa(new TextEncoder().encode(description).reduce((acc, val) => acc + String.fromCharCode(val), ""));
          const base64WithMime = [`data:text/plain;base64,${base64String}`];

          postMedia = base64WithMime;
        }
        break;
      case "image":
        {
          const imageWrappers = document.querySelectorAll(".create-img");
          const combinedBase64 = Array.from(imageWrappers)
            .map((img) => img.src)
            .filter((src) => src.startsWith("data:image/"));

          postMedia = combinedBase64;
          postDescription = description;
        }
        break;
      case "audio":
        {
          let combinedBase64 = [];
          const recordedAudio = document.getElementById("recorded-audio");
          //  Priority: Use recorded audio if it exists and is blob
          if (recordedAudio && recordedAudio.src.startsWith("blob:")) {
            const base64 = await convertBlobUrlToBase64(recordedAudio.src);
            if (base64) combinedBase64.push(base64);
          } else {
            //  Fallback: Use uploaded audio if no recorded audio found
            const audioWrappers = document.querySelectorAll(".create-audio");
            combinedBase64 = Array.from(audioWrappers)
              .map((audio) => audio.src)
              .filter((src) => src.startsWith("data:audio/"));
          }

          const coverWrapper = document.getElementById("audio-cover-image-preview");
          const coverImg = coverWrapper.querySelector("img.create-img");
          
          const emptyBase64img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

          cover = coverImg ? [coverImg.src] : [emptyBase64img];
          
          
          postMedia = combinedBase64;
          postDescription = description;

        }
        break;
      case "video":
        {
          const videoWrappers = document.querySelectorAll(".create-video");
          const combinedBase64 = Array.from(videoWrappers)
            .map((vid) => vid.src)
            .filter((src) => src.startsWith("data:video/"));

          const coverWrapper = document.getElementById("preview-video");
          const coverImg = coverWrapper.querySelector("img.create-img");
          cover = coverImg ? [coverImg.src] : "";

          postMedia = combinedBase64;
          postDescription = description;
        }
        break;
      default:
        console.warn("Unsupported post type:", post_type);
      break;
    }
 

    hasError=pre_post_form_validation(post_type,postMedia); // check form validation
    // If any error, stop
    if (hasError) return;

    submitButton.disabled = true;
    try {
      const result = await sendCreatePost({
        title,
        media: postMedia,
        cover,
        mediadescription: postDescription,
        contenttype: post_type,
        tags,
      });

      //console.log(result.createPost);
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
    } catch (error) {
      console.error("Error during create post request:", error);
    } finally {
      // Re-enable the form and hide loading indicator
      submitButton.disabled = false;
    }
  });

  function pre_post_form_validation(post_type,postMedia){
    const tagErrorEl = document.getElementById("tagError");
    const titleErrorEl = document.getElementById("titleError");
    const descErrorEl = document.getElementById("descriptionError");
    const imgErrorEl = document.getElementById("imageError");
    const audioErrorEl = document.getElementById("audioError");
    const videoErrorEl = document.getElementById("videoError");

    // Clear old errors
    titleErrorEl.textContent = "";
    descErrorEl.textContent = "";
    tagErrorEl.textContent = "";
    imgErrorEl.textContent = "";
    audioErrorEl.textContent = "";
    videoErrorEl.textContent = "";

    const title = titleEl.value.trim();
    const description = descEl.value.trim();

    // Validation
    let hasError = false;

     const title_char_count=setupCharCounter(titleEl);
    if (!title) {
      titleErrorEl.textContent = "Title is required.";
      hasError = true;
    } else if (title.length < 2) {
      titleErrorEl.textContent = "Title must be at least 2 character.";
      hasError = true;
    }else if(!title_char_count){
       hasError = true;
      
    }
    const dec_char_count=setupCharCounter(descEl);
    if (!description) {
      descErrorEl.textContent = "Description is required.";
      hasError = true;
    //} else if (description.length < 10) {
      //descErrorEl.textContent = "Description must be at least 10 characters.";
      //hasError = true;
    }else if(!dec_char_count){
       hasError = true;
      
    }

    /*if (tags.length === 0) {
      tagErrorEl.textContent = "Please add at least one tag.";
      hasError = true;
    }*/

    switch (post_type) {
      case "text":
        {
          if (postMedia.join("").length > 4 * 1024 * 1024) {
            descErrorEl.textContent = "The text is too large. Please upload a smaller text.";
            hasError = true;
          }
        }
        break;
      case "image":
        {
          if (postMedia.length === 0) {
            imgErrorEl.textContent = "Please select at least one image.";

            hasError = true;
          } else if (postMedia.join("").length > 4 * 1024 * 1024) {
            imgErrorEl.textContent = "The image(s) are too large.";
            hasError = true;
          } 
        }
        break;
      case "audio":
        {
          if (postMedia.length === 0) {
            audioErrorEl.textContent = "Please upload audio or record audio.";

            hasError = true;
          } else if (postMedia.join("").length > 4 * 1024 * 1024) {
            audioErrorEl.textContent = "The audio is too large.";
            hasError = true;
          } 
        }
        break;
      case "video":
        {
          if (postMedia.length === 0) {
            videoErrorEl.textContent = "Please select video.";

            hasError = true;
          } else if (postMedia.join("").length > 4 * 1024 * 1024) {
            videoErrorEl.textContent = "The video is too large.";
            hasError = true;
          }
        }
        break;
      default:
        console.warn("Unsupported post type:", post_type);
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

    
    let hasError = false;
    let objekt;

    switch (post_type) {
      case "text":
        {
          // Convert to base64
          const base64String = btoa(new TextEncoder().encode(description).reduce((acc, val) => acc + String.fromCharCode(val), ""));
          const base64WithMime = [`data:text/plain;base64,${base64String}`];

          media = base64WithMime;

          objekt = {
            id: "preview-text-post",  
            contenttype: "text",
            title,
            description,
            tags,
            media: [],
          };

        }
        break;
      case "image":
        {
          const imageContainer = document.getElementById("preview-image");
          const imageWrappers = imageContainer.querySelectorAll(".create-img");
          const combinedBase64 = Array.from(imageWrappers)
            .map((img) => img.src)
            .filter((src) => src.startsWith("data:image/"));

          media = combinedBase64;
          
          objekt = {
            contenttype: "image",
            title,
            description,
            tags,
            media, 
          };
          
        }
        break;
      case "audio":
        {
          let combinedBase64 = [];
          const recordedAudio = document.getElementById("recorded-audio");
          //  Priority: Use recorded audio if it exists and is blob
          if (recordedAudio && recordedAudio.src.startsWith("blob:")) {
            const base64 = await convertBlobUrlToBase64(recordedAudio.src);
            if (base64) combinedBase64.push(base64);
          } else {
            //  Fallback: Use uploaded audio if no recorded audio found
            const audioWrappers = document.querySelectorAll(".create-audio");
            combinedBase64 = Array.from(audioWrappers)
              .map((audio) => audio.src)
              .filter((src) => src.startsWith("data:audio/"));
          }
          const coverWrapper = document.getElementById("audio-cover-image-preview");
          const coverImg = coverWrapper.querySelector("img.create-img");
          
          const emptyBase64img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

          cover = coverImg ? [coverImg.src] : [emptyBase64img];


          media = combinedBase64;

          objekt = {
            title,
            description,
            tags,
            media,
            cover,
            contenttype: "audio",
          };
          

        }
        break;
      case "video":
        {
          const videoWrappers = document.querySelectorAll(".create-video");
          const combinedBase64 = Array.from(videoWrappers)
            .map((vid) => vid.src)
            .filter((src) => src.startsWith("data:video/"));

          media = combinedBase64;

          objekt = {
            title,
            description,
            tags,
            media,
            contenttype: "video",
          };
        }
        break;
      default:
        console.warn("Unsupported post type:", post_type);
      break;
    }

    hasError=pre_post_form_validation(post_type,media); // check form validation
    // If any error, stop
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


  window.addEventListener("DOMContentLoaded", () => {
    const fullView = document.getElementById("preview-post-container");
    const collapsedView = document.querySelector("section");

    fullView.style.display = "none";
    collapsedView.style.display = "none";
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

  async function convertBlobUrlToBase64(blobUrl) {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Error converting blob to base64:", err);
      return null;
    }
  }
  /******************************************************************** */
  
  descEl.addEventListener("keyup", (e) => {
    setupCharCounter(e.target);
  });
  titleEl.addEventListener("keyup", (e) => {
    setupCharCounter(e.target);
  });
  function setupCharCounter(El){
    let text = El.value;
    
    const Error= El.closest(".input-wrapper").querySelector(".response_msg");
    Error.textContent="";
    const char_count = El.closest(".input-wrapper").querySelector("span.char-counter .char_count");
    let char_limit = El.closest(".input-wrapper").querySelector("span.char-counter .char_limit").textContent;

    char_limit =char_limit *1;
    //console.log(char_limit);
    char_count.textContent = text.length;
    if (text.length > char_limit) {
      Error.textContent="Char Maximum length exceeded!";
      //text = text.substr(0, char_limit);
      //descEl.value = text;
        return false;
    }else{
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
      if (e.key === "Enter") {
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
        alert("Only letters and numbers allowed.");
        return;
      }

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

  // ===== CREATE CUSTOM TAG OPTION =====
  function renderCreateTagOption(input) {
    const clean = input.replace(/^#+/, "").toLowerCase().trim();
    const existsInSuggestions = tagContainer.querySelector(`[data-tag="${clean}"]`);
    const existsInSelected = selectedContainer.querySelector(`[data-tag="${clean}"]`);
    const existsInHistory = getTagHistory().some((tag) => tag.toLowerCase().trim() === clean);
    if (existsInSuggestions || existsInSelected || existsInHistory) return; // ✅ Prevent duplicate create
    tagContainer.innerHTML = "";
    const el = document.createElement("span");
    el.classList.add("tag", "create-tag");
    el.textContent = `+ Create tag: #${clean}`;
    el.setAttribute("data-tag", clean);
    el.addEventListener("mousedown", (e) => e.preventDefault());
    el.addEventListener("click", () => {
      tag_addTag(clean);
      tagInput.value = "";
      clearTagContainer();
      updateTagUIVisibility();
    });
    tagContainer.appendChild(el);
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
        header.textContent = labels[post_type] ;
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
      if (id === "preview-notes" ){
        char_limit.textContent="20000";
      }else{
        char_limit.textContent="500";
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
  zones.forEach(({ dropArea, fileInput }) => {
    // Click-Event für das Öffnen des Dateidialogs
    // if (dropArea) {
    //   dropArea.addEventListener("click", () => handleClick(fileInput));
    // }
    // Drag-and-Drop-Events
    if (dropArea) {
      dropArea.addEventListener("click", () => handleClick(fileInput));
      dropArea.addEventListener("dragover", (e) => handleDragOver(e, dropArea));
      dropArea.addEventListener("dragleave", () => handleDragLeave(dropArea));
      dropArea.addEventListener("drop", (e) => handleDrop(e, dropArea, processFiles));
    }
    // File-Input-Change-Event
    if (fileInput) {
      fileInput.addEventListener("change", (e) => handleFileChange(e, processFiles));
    }
  });

  document.getElementById("more-images_upload").addEventListener("click", function () {
    const fileInput = document.querySelector("#drop-area-image input[type='file']");
    if (fileInput) fileInput.click();
  });

  // function tag_getTagArray() {
  //   return Array.from(tagContainer.children).map((tag) => tag.textContent.slice(0, -1));
  // }

  // function tag_removeAllTags() {
  //   tagContainer.innerHTML = "";
  // }

  async function processFiles(files, id) {
    const types = ["video", "audio", "image"];
    const uploadtype = types.find((wort) => id.includes(wort));
    const lastDashIndex = id.lastIndexOf("-");
    shortid = id.substring(lastDashIndex + 1);
    const ErrorCont =document.querySelector("#preview-" + uploadtype + " .response_msg");
    ErrorCont.innerHTML="";
    let previewContainer;
    if (uploadtype === "image") {
      previewContainer = document.querySelector("#preview-" + uploadtype + " .preview-track");
    } else {
      previewContainer = document.getElementById("preview-" + uploadtype);
    }
    let previewItem;
    const maxSizeMB = 4 / 1.3; // Maximale Größe in MB mit umwandlung in base64 (/1.3)
    let size = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      size += file.size;
      if (size > maxSizeMB * 1024 * 1024) {
       // Merror("Error", "The file is too large. Please select a file(s) under 5MB.");
       //ErrorCont.innerHTML="The file is too large. Please select a file(s) under 5MB.";
        //return;
      }
    }
    for (let file of files) {
      // if (!file.type.startsWith("image/")) {
      //   info("Information", `${file.name} ist keine Bilddatei.`);
      //   return;
      // }
      previewItem = "";
      previewItem = document.createElement("div");
      previewItem.className = "preview-item dragable";
      const type = file.type.substring(0, 5);
      if (uploadtype === "audio") {
        if (id.includes("audiobackground")) {
          
          previewItem.innerHTML = `
          <p>${file.name}</p>
          <img class="image-wrapper create-img none" alt="Vorschau" />
          <img src="svg/logo_farbe.svg" class="loading" alt="loading">
          <img src="svg/edit.svg" class="editImage " alt="edit">
          <img src="svg/plus2.svg" id="deletecover" class="btClose deletePost" alt="delete">`;
          const insertPosition = document.getElementById("audio-cover-image-preview");
          
          insertPosition.innerHTML = ""; // Removes any existing children
          insertPosition.appendChild(previewItem); // Adds the new one
          
        }else{
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
        document.getElementById("drop-area-videocover").classList.add("none");
      } else if (uploadtype === "video") {
        if (id.includes("cover")) {
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
          previewItem.classList.add("video-item");
          previewItem.classList.add(id);

          previewItem.innerHTML = `
          <p>${file.name}</p>
          <video id="${file.name}" class="image-wrapper create-video none " alt="Vorschau" controls=""></video>
          <img src="svg/logo_farbe.svg" class="loading" alt="loading">
          <img src="svg/edit.svg" class="editVideo " alt="edit">
          <img src="svg/plus2.svg" id="${id.includes("short") ? "deleteshort" : "deletelong"}" class="btClose deletePost" alt="delete">`;
          
          if (id.includes("short")) {
             const insertPosition = document.getElementById("drop-area-videoshort");
            insertPosition.insertAdjacentElement("afterend", previewItem);
           
            document.getElementById("drop-area-videoshort").classList.add("none");
          } else {
            const insertPosition = document.getElementById("drop-area-videolong");
            insertPosition.insertAdjacentElement("afterend", previewItem);
            if (!document.getElementById("deletecover")) {
              document.getElementById("drop-area-videocover").classList.remove("none");
            }
            if (!document.getElementById("deleteshort")) {
              document.getElementById("drop-area-videoshort").classList.remove("none");
            }
            document.getElementById("drop-area-videolong").classList.add("none");
          }
        }
      }
      const base64 = await convertImageToBase64(file);
            // Create a global map to store images
      const base64ImagesMap = new Map();
      let element = null;
      if (type === "image") {
        sessionStorage.setItem(file.name, base64);
        element = previewItem.querySelector("img.create-img");
        

      } else if (type === "audio") {
        element = previewItem.querySelector("audio");
      } else if (type === "video") {
        element = previewItem.querySelector("video");
        //sessionStorage.setItem(file.name, base64);
        // Store base64
        base64ImagesMap.set(file.name, base64);
      }



      element.src = base64;
      element.classList.remove("none");
      element.nextElementSibling?.remove();
      element.nextElementSibling?.classList.remove("none");
      if (type === "audio") {
        //initAudioplayer(file.name, base64);
        initAudioplayer("audio_upload_block", base64);
        document.querySelector(".audiobackground_uploader")?.classList.remove("none");
        document.querySelector(".recodring-block")?.classList.add("none");
         const audio_upload_block = document.getElementById("audio_upload_block");
        const audio_del_btn = audio_upload_block.querySelector(".preview-item .deletePost");
        if (audio_del_btn) {
          audio_del_btn.addEventListener("click", () => {
            document.querySelector(".audiobackground_uploader")?.classList.add("none");
            document.querySelector(".recodring-block")?.classList.remove("none");
            const dropareaaudio = document.getElementById("drop-area-audio");
            dropareaaudio.classList.remove("none");
          });
        }

      } else if (type === "video") {
        element.autoplay = true;
        element.loop = true;
        element.muted = true; // Optional: Video ohne Ton abspielen
      }
    }
     if (uploadtype === "audio") {
      const voiceRecordWrapper = document.getElementById("voice-record-wrapper");
      const preview_del_btn = voiceRecordWrapper.querySelector(".preview-item .deletePost");
      const img = voiceRecordWrapper.querySelector(".preview-item img.create-img");
      if (img) {
        img.onload = function (e) {
          //console.log(e.target.src);
        voiceRecordWrapper.setAttribute('style', `background-image:url(${e.target.src})`);
        };
      }
      if (preview_del_btn) {
        preview_del_btn.addEventListener("click", () => {
          voiceRecordWrapper.removeAttribute('style');
        });
      }
    }
    

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
      console.log("Is first item visible?", isElementInViewportX(track, container));
      imageItemCount();
      
    }

    // Call once on load
    setTimeout(toggleScrollButtons, 200);

    // Optionally recheck on window resize or DOM change
    window.addEventListener('resize', toggleScrollButtons);
    container.addEventListener('scroll', toggleScrollButtons);
    
    function imageItemCount(){
      const imageItemCount = previewContainer.querySelectorAll(".preview-item").length;
        console.log("Total preview items:", imageItemCount);
        if(imageItemCount > 0){
          document.getElementById("preview-image").classList.add("image_added");
        }else{
          document.getElementById("preview-image").classList.remove("image_added");
        }
    }

  }
});

const video = document.getElementById("videoTrim");
const timeline = document.getElementById("videoTimeline");

const THUMB_COUNT = 10; // beliebig wählbar
let videoElement = null; // Wird später gesetzt, wenn das Video geladen ist
async function videoTrim(id) {
  videoElement = document.getElementById(id);
  if (!videoElement) {
    console.error(`Video element with ID ${id} not found.`);
    return;
  }
  // Reset the timeline
  timeline.innerHTML = "";
  // Set the video source
  if (sessionStorage.getItem(id)) {
    video.src = sessionStorage.getItem(id);
  } else {
    video.src = videoElement.src;
  }

  // Show the trim container
  document.getElementById("videoTrimContainer").classList.remove("none");
  document.getElementById("videoTrimContainer").classList.add("active");
}
const trimWindow = document.getElementById("trim-window");
const overlayLeft = document.getElementById("overlay-left");
const overlayRight = document.getElementById("overlay-right");
const handleLeft = document.getElementById("handle-left");
const handleRight = document.getElementById("handle-right");

// ----------- THUMBNAILS GENERIEREN (wie vorher) ----------

video.addEventListener("loadedmetadata", async () => {
  const duration = video.duration;
  const times = [];
  for (let i = 0; i < THUMB_COUNT; i++) {
    times.push((duration * i) / (THUMB_COUNT - 1));
  }
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 90;
  const ctx = canvas.getContext("2d");
  for (let t of times) {
    video.currentTime = t;
    await new Promise((res) => video.addEventListener("seeked", res, { once: true }));
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/jpeg");
    timeline.appendChild(img);
  }
  // Nach Thumbnail-Generierung: Trim-Fenster und Overlays initialisieren
  setupTrim();
});
let startPercent = 0; // Anfang 0%
let endPercent = 1; // Ende 100%
const MIN_DURATION = 3; // Sekunden

function setupTrim() {
  // Zeitleisten-Breite und Position
  const wrapper = document.querySelector(".timeline-wrapper");
  const timelineRect = timeline.getBoundingClientRect();
  const wrapperRect = wrapper.getBoundingClientRect();

  // Werte in Prozent (für Responsivität)

  let windowStartPercent = 0;
  let windowEndPercent = 0;
  let dragging = null; // 'left' | 'right' | null
  let dragStartX = 0;

  positionElements();

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
    overlayLeft.style.left = "0";
    overlayLeft.style.width = left + "px";
    overlayLeft.style.top = timeline.offsetTop + "px";
    overlayLeft.style.height = timeline.offsetHeight + "px";
    overlayRight.style.left = right + "px";
    overlayRight.style.width = w - right + "px";
    overlayRight.style.top = timeline.offsetTop + "px";
    overlayRight.style.height = timeline.offsetHeight + "px";
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
    video.pause();
    const x = e.clientX;
    const p = percentFromX(x);
    if (dragging === "left") {
      let nextStart = Math.min(p, endPercent - MIN_DURATION / video.duration);
      nextStart = Math.max(0, Math.min(nextStart, 1));
      startPercent = nextStart;
      video.currentTime = video.duration * startPercent;
    } else if (dragging === "right") {
      let nextEnd = Math.max(p, startPercent + MIN_DURATION / video.duration);
      nextEnd = Math.max(0, Math.min(nextEnd, 1));
      endPercent = nextEnd;
      video.currentTime = video.duration * endPercent;
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
      video.currentTime = video.duration * startPercent;
    }
    startPercent = Math.max(0, Math.min(startPercent, 1));
    endPercent = Math.max(0, Math.min(endPercent, 1));
    positionElements();
  });
  window.addEventListener("pointerup", (e) => {
    if (dragging) {
      dragging = null;
      document.body.style.cursor = "";
    }
  });

  // Bei Fenstergröße ändern → alles nachjustieren
  window.addEventListener("resize", () => {
    positionElements();
  });

  // Initial-Positionierung
  positionElements();
}
const trimBtn = document.getElementById("trimBtn");
const trimQuitBtn = document.getElementById("trimQuit");
trimQuitBtn.onclick = () => {
  document.getElementById("videoTrimContainer").classList.add("none");
  document.getElementById("videoTrimContainer").classList.remove("active");
};
// const downloadLink = document.getElementById("download-link");

// Beachte: Diese Variablen (startPercent, endPercent) sind im Trim-Code definiert!
// let startPercent = 0.15;
// let endPercent = 0.85;

// Funktion für den Schnitt
trimBtn.onclick = async () => {
  // Stelle sicher, dass Metadaten da sind
  if (!video.duration) {
    alert("Video ist noch nicht geladen!");
    return;
  }

  // Schnitt-Zeiten berechnen
  const startTime = video.duration * startPercent;
  const endTime = video.duration * endPercent;

  // Sicherstellen, dass keine Wiedergabe läuft
  video.pause();

  // Canvas zum Capturen des Videos
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  let mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : MediaRecorder.isTypeSupported("video/webm;codecs=vp8") ? "video/webm;codecs=vp8" : MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : MediaRecorder.isTypeSupported("video/mp4") ? "video/mp4" : ""; // leer = Default, aber meist WebM

  // Canvas streamen
  const stream = canvas.captureStream();
  const rec = new MediaRecorder(stream, { mimeType });
  let chunks = [];
  rec.ondataavailable = (e) => e.data && chunks.push(e.data);

  // Trim Vorgang
  video.currentTime = startTime;
  await new Promise((res) => (video.onseeked = res));

  // Start Aufnahme
  rec.start();
  video.play();

  // Frame für Frame auf das Canvas kopieren, bis zur Endzeit
  let animationId;
  function drawFrame() {
    if (video.currentTime >= endTime || video.ended) {
      video.pause();
      rec.stop();
      cancelAnimationFrame(animationId);
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    animationId = requestAnimationFrame(drawFrame);
  }
  drawFrame();

  // Nach Aufnahme: Download anbieten
  rec.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const base64 = await blobToBase64(blob);
    videoElement.src = base64; // Update video source to trimmed video
    document.getElementById("videoTrimContainer").classList.add("none");
  };
};
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // gibt ein Data-URL-String zurück (inkl. "data:video/webm;base64,...")
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}