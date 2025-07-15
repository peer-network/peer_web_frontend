document.addEventListener("DOMContentLoaded", () => {
  const MAX_TAGS = 10;

  // DOM references
  const tagInput = document.getElementById("tag-input");
  const tagContainer = document.getElementById("tagsContainer");
  const selectedContainer = document.getElementById("tagsSelected");
  const clearTagHistoryBtn = document.getElementById("clearTagHistory");
  const descEl = document.getElementById("descriptionNotes");

  updateTagUIVisibility(); // suggestions + selected

  /********************* Preview posts functionality ******************************/

  function previewPost(objekt) {

    
    const postContainer = document.getElementById("preview-post-container");
    const array = objekt.media || [];

    const containerleft = postContainer.querySelector(".viewpost-left");
    const containerright = postContainer.querySelector(".viewpost-right");
    const post_gallery = containerleft.querySelector(".post_gallery");
    post_gallery.innerHTML="";
    const post_contentletf=containerleft.querySelector(".post_content");
    if(post_contentletf)   post_contentletf.remove();

    const post_contentright=containerright.querySelector(".post_content");
    
    
    const profile_header_left=postContainer.querySelector(".profile-header-left");
   
    profile_header_left.addEventListener("click",
        function handledisLikeClick(event) {
          event.stopPropagation();
          event.preventDefault();
        }  
      );

    /*--------END: Card profile Header  -------*/
    
    /*--------Card Post Title and Text  -------*/
    

    const cont_post_text = containerright.querySelector(".post_text");
    const cont_post_title = containerright.querySelector(".post_title h2");
    const cont_post_time = containerright.querySelector(".timeagao");
    const cont_post_tags = containerright.querySelector(".hashtags");

    if (document.querySelector(".post_text")) {
      cont_post_text.innerHTML = document.querySelector(".post_text").innerHTML;
    } else if (objekt.description) {
      cont_post_text.innerHTML = objekt.description;
    }

    if (document.querySelector(".post_title")) {
      const title_text = document.querySelector(".post_title").childNodes[0].textContent.trim();
      cont_post_title.innerHTML = title_text;
    } else if (objekt.title) {
      cont_post_title.innerHTML = objekt.title;
    }

    if (document.querySelector(".timeagao")) {
      cont_post_time.innerHTML = document.querySelector(".timeagao").innerHTML;
    } else {
      cont_post_time.innerHTML = "1 sec ago";
    }

    if (document.querySelector(".hashtags")) {
      cont_post_tags.innerHTML = document.querySelector(".hashtags").innerHTML;
    } else if (objekt.tags?.length > 0) {
      cont_post_tags.innerHTML = objekt.tags.map(tag => `<span>#${tag}</span>`).join(" ");
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
      for (const item of array) {
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
    post_gallery.innerHTML = ""; // Clear gallery if any
    post_gallery.className = "post_gallery"; // Reset classes

    if (containerleft && containerright) {
      // Clone content area
      const textContent = document.createElement("div");
      textContent.className = "post_content";

      // Create title
      const titleEl = document.createElement("div");
      titleEl.className = "post_title";
      const h2 = document.createElement("h2");
      h2.textContent = objekt.title || "";
      titleEl.appendChild(h2);

      // Create description
      const textEl = document.createElement("div");
      textEl.className = "post_text";
      textEl.innerHTML = objekt.description || "";

      // Create hashtags
      const tagEl = document.createElement("div");
      tagEl.className = "hashtags";
      if (objekt.tags && objekt.tags.length) {
        tagEl.innerHTML = objekt.tags.map(tag => `<span>#${tag}</span>`).join(" ");
      }

      // Create time (optional)
      const timeEl = document.createElement("div");
      timeEl.className = "timeagao";
      timeEl.textContent = "Just now";

      // Append all to textContent
      textContent.appendChild(titleEl);
      textContent.appendChild(textEl);
      textContent.appendChild(tagEl);
      textContent.appendChild(timeEl);

      // Insert into container
      containerleft.prepend(textContent.cloneNode(true));
    }
  } else {
    post_gallery.className = "post_gallery images";
    if (array.length > 1) post_gallery.classList.add("multi");

    const { sliderTrack, sliderThumbs, updateSlider } = makeSlider("image");

    array.forEach((media, index) => {
      const slide = document.createElement("div");
      slide.className = "slide_item";

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


  const previewButtons = document.querySelectorAll('#addPostSection .preview-button');
  const previewSection = document.getElementById('previewSection');
  const addPostSection = document.getElementById('addPostSection');

  previewButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
        addPostSection.classList.add('none');
        previewSection.classList.remove('none');
    });
  });

  const backToEditBtn = document.getElementById('backToEdit');
    if (backToEditBtn) {
      backToEditBtn.addEventListener('click', function () {
        addPostSection.classList.remove('none');
        previewSection.classList.add('none');
    });
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

            // Call your custom content-switching logic if needed (e.g. loadImageForm(), loadVideoForm())
            // You may already have something like that in your JS handling post type switch.
        });
    });

    
  /**********************************************************************/


  document.getElementById("create_new_post").addEventListener("submit", async (event) => {
    event.preventDefault();
    // Elements
    const post_type = event.target.getAttribute('data-post-type');
    const titleEl = document.getElementById("titleNotes");

    const tagErrorEl = document.getElementById("tagError");
    const titleErrorEl = document.getElementById("titleError");
    const descErrorEl = document.getElementById("descriptionError");
    const imgErrorEl = document.getElementById("imageError");
    const audioErrorEl = document.getElementById("audioError");
    const videoErrorEl = document.getElementById("videoError");


    const createPostError = document.getElementById("createPostError");

    const submitButton = document.getElementById("submitPost");

    //console.log(post_type);
    const title = titleEl.value.trim();
    const description = descEl.value.trim();
    const tags = getTagHistory();

    // Clear old errors
    titleErrorEl.textContent = "";
    descErrorEl.textContent = "";
    tagErrorEl.textContent = "";
    imgErrorEl.textContent = "";
    audioErrorEl.textContent = "";
    videoErrorEl.textContent = "";
    createPostError.innerHTML = "";

    // Validation
    let hasError = false;

    let postMedia;
    let cover;
    let postDescription = "";
    if (post_type == "text") {

      // Convert to base64
      const base64String = btoa(new TextEncoder().encode(description).reduce((acc, val) => acc + String.fromCharCode(val), ""));
      const base64WithMime = [`data:text/plain;base64,${base64String}`];

      if (base64WithMime.join("").length > 4 * 1024 * 1024) {
        descErrorEl.textContent = "The text is too large. Please upload a smaller text.";
        hasError = true;
      } else {
        postMedia = base64WithMime;
      }

    }
    if (post_type == "image") {
      const imageWrappers = document.querySelectorAll(".create-img");
      const combinedBase64 = Array.from(imageWrappers)
        .map((img) => img.src)
        .filter((src) => src.startsWith("data:image/"));

      if (combinedBase64.length === 0) {
        imgErrorEl.textContent = "Please select  least one image.";

        hasError = true;
      } else if (combinedBase64.join("").length > 4 * 1024 * 1024) {

        imgErrorEl.textContent = "The image(s) are too large.";
        hasError = true;
      } else {
        postMedia = combinedBase64;
        postDescription = description;
      }
    }
    if (post_type == "audio") {
      const audioWrappers = document.querySelectorAll(".create-audio");
      const combinedBase64 = Array.from(audioWrappers)
        .map((audio) => audio.src)
        .filter((src) => src.startsWith("data:audio/"));

      const coverImg = document.querySelector("#preview-cover img");
      const canvas = document.querySelector("#preview-audio canvas");
      cover = coverImg ? [coverImg.src] : [canvas ?.toDataURL("image/webp", 0.8)];

      if (combinedBase64.length === 0) {
        audioErrorEl.textContent = "Please select audio.";

        hasError = true;
      } else if (combinedBase64.join("").length > 4 * 1024 * 1024) {

        audioErrorEl.textContent = "The audio is too large.";
        hasError = true;
      } else {
        postMedia = combinedBase64;
        postDescription = description;
      }
    }

    if (post_type == "video") {
      const videoWrappers = document.querySelectorAll(".create-video");
      const combinedBase64 = Array.from(videoWrappers)
        .map((vid) => vid.src)
        .filter((src) => src.startsWith("data:video/"));

      if (combinedBase64.length === 0) {
        videoErrorEl.textContent = "Please select video.";

        hasError = true;
      } else if (combinedBase64.join("").length > 4 * 1024 * 1024) {

        videoErrorEl.textContent = "The video is too large.";
        hasError = true;
      } else {
        postMedia = combinedBase64;
        postDescription = description;
      }
    }

    if (!title) {
      titleErrorEl.textContent = "Title is required.";
      hasError = true;
    } else if (title.length < 5) {
      titleErrorEl.textContent = "Title must be at least 5 characters.";
      hasError = true;
    }

    if (!description) {
      descErrorEl.textContent = "Description is required.";
      hasError = true;
    } else if (description.length < 10) {
      descErrorEl.textContent = "Description must be at least 10 characters.";
      hasError = true;
    }

    /*if (tags.length === 0) {
      tagErrorEl.textContent = "Please add at least one tag.";
      hasError = true;
    }*/

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
        tags
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

  /**********************************************************************/
  /** TEXT POST PREVIEW **/
  const previewTextPost = document.getElementById("previewTextPost");
  if (previewTextPost) {
    previewTextPost.addEventListener("click", () => {
      const title = document.getElementById("titleNotes")?.value.trim() || "";
      const description = document.getElementById("descriptionNotes")?.value.trim() || "";
      const tags = getTagHistory(); // Should return an array like ['fun', 'update']

      const objekt = {
        id: "preview-text-post",  
        contenttype: "text",
        title,
        description,
        tags,
        media: [],
      };

      previewPost(objekt);
    });
  }



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


  /**********************************************************************/
  /** IMAGE POST PREVIEW **/
  const previewImagePost = document.getElementById("previewImagePost");

  if (previewImagePost) {
    previewImagePost.addEventListener("click", () => {
      const title = document.getElementById("titleImage")?.value.trim() || "";
      const description = document.getElementById("descriptionImage")?.value.trim() || "";
      const tags = tag_getTagArray();

      // Get all images inside .create-img wrappers
      const imageWrappers = document.querySelectorAll(".create-img img");
      const media = Array.from(imageWrappers)
        .map((img) => img.src)
        .filter((src) => src.startsWith("data:image/"));

      const objekt = {
        contenttype: "image",
        title,
        description,
        tags,
        media, // array of image data URLs
      };

      previewPost(objekt);
    });
  }




  /**********************************************************************/
  /** AUDIO POST PREVIEW **/
  const previewAudioPost = document.getElementById("previewAudioPost");
  if (previewAudioPost) {
    previewAudioPost.addEventListener("click", () => {
      const title = document.getElementById("titleAudio")?.value.trim() || "";
      const description = document.getElementById("descriptionAudio")?.value.trim() || "";
      const audioWrappers = document.querySelectorAll(".create-audio");
      const tags = tag_getTagArray();

      const media = Array.from(audioWrappers)
        .map((audio) => audio.src)
        .filter((src) => src.startsWith("data:audio/"));

      const coverImg = document.querySelector("#preview-cover img");
      const canvas = document.querySelector("#preview-audio canvas");
      const cover = coverImg ? [coverImg.src] : [canvas?.toDataURL("image/webp", 0.8)];

      const objekt = {
        title,
        description,
        tags,
        media,
        cover,
        contenttype: "audio",
      };

      previewPost(objekt);
    });
  }

  /**********************************************************************/
  /** VIDEO POST PREVIEW **/
  const previewVideoPost = document.getElementById("previewVideoPost");
  if (previewVideoPost) {
    previewVideoPost.addEventListener("click", () => {
      const title = document.getElementById("titleVideo")?.value.trim() || "";
      const description = document.getElementById("descriptionVideo")?.value.trim() || "";
      const videoWrappers = document.querySelectorAll(".create-video");
      const tags = tag_getTagArray();

      const media = Array.from(videoWrappers)
        .map((vid) => vid.src)
        .filter((src) => src.startsWith("data:video/"));

      const objekt = {
        title,
        description,
        tags,
        media,
        contenttype: "video",
      };

      previewPost(objekt);
    });
  }


  /******************************************************************** */
  descEl.addEventListener("keyup", (e) => {
    let text = descEl.value;
    const span = document.querySelector('span.char-counter');
    if (text.length > 250) {
      Merror("Warning", "Maximum length exceeded!");
      text = text.substr(0, 250);
      descEl.value = text;
    }
    span.textContent = `${text.length}/250`;
  });

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

      // Get target form ID from clicked <a> id (e.g., createNotes => newNotesPost)
      const id = this.id.replace("create", "new") + "Post";
      const form = document.getElementById(id);
      if (form) form.classList.add('active');
      const postform = document.getElementById('create_new_post');
      if (postform) {
        const post_type = e.target.getAttribute('data-post-type');
        postform.setAttribute('data-post-type', post_type);
      }
      // Check if it's the audio form (music) and init
      if (id === 'newAudioPost') initAudioEvents(); // attach mic click handler
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
      dropArea: document.getElementById("drop-area-cover"),
      fileInput: document.getElementById("file-input-cover"),
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
        Merror("Error", "The file is too large. Please select a file(s) under 4MB.");
        return;
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
        previewItem.classList.add("audio-item");
        previewItem.innerHTML = `
        <p>${file.name}</p><canvas id="${file.name}"></canvas>
        <span class="button" id="play-pause">Play</span>
        <audio class="image-wrapper create-audio none" alt="Vorschau" controls=""></audio>
        <img src="svg/logo_farbe.svg" class="loading" alt="loading">
        <img src="svg/plus2.svg" class=" btClose deletePost" alt="delete">`;
        previewContainer.appendChild(previewItem);
      } else if (uploadtype === "image") {
        previewItem.draggable = true;
        previewItem.classList.add("dragable");
        previewItem.innerHTML = `
        <p>${file.name}</p>
        <img class="image-wrapper create-img none" alt="Vorschau" />
        <img src="svg/logo_farbe.svg" class="loading" alt="loading">
        <img src="svg/edit.svg" class="editImage " alt="delete">
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
          <img src="svg/edit.svg" class="editImage " alt="delete">
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
          <img src="svg/plus2.svg" id="${id.includes("short") ? "deleteshort" : "deletelong"}" class="btClose deletePost" alt="delete">`;
          if (id.includes("short")) {
            previewContainer.appendChild(previewItem);
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
      let element = null;
      if (type === "image") {
        sessionStorage.setItem(file.name, base64);
        element = previewItem.querySelector("img.create-img");
      } else if (type === "audio") {
        element = previewItem.querySelector("audio");
      } else if (type === "video") {
        element = previewItem.querySelector("video");
      }
      element.src = base64;
      element.classList.remove("none");
      element.nextElementSibling ?.remove();
      element.nextElementSibling ?.classList.remove("none");
      if (type === "audio") {
        initAudioplayer(file.name, base64);
      } else if (type === "video") {
        element.autoplay = true;
        element.loop = true;
        element.muted = true; // Optional: Video ohne Ton abspielen
      }
    }
   
    document.querySelectorAll(".editImage").forEach(addEditImageListener);

    if (uploadtype === "image") {
      document.querySelectorAll(".deletePost").forEach(el => {
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

      scrollToIndex(currentIndex);
    }

  }
});