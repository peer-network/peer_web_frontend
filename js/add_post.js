document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btAddPost").addEventListener("click", function startAddPost() {
    togglePopup("addPost");
  });
  const closeAddPost = document.getElementById("closeAddPost");
  if (closeAddPost) {
    closeAddPost.addEventListener("click", () => {
      //header.classList.remove("none");
      togglePopup("addPost");
    });
  }
  const createPostNotes = document.getElementById("createPostNotes");
  if (createPostNotes) {
    createPostNotes.addEventListener("click", async function createPost(event) {
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
  }

  const createPostImage = document.getElementById("createPostImage");
  if (createPostImage) {
    createPostImage.addEventListener("click", async function createPost(event) {
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
  }

  const createPostAudio = document.getElementById("createPostAudio");
  if (createPostAudio) {
    createPostAudio.addEventListener("click", async function createPost(event) {
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
  }

  const createPostVideo = document.getElementById("createPostVideo");
  if (createPostVideo) {
    createPostVideo.addEventListener("click", async function createPost(event) {
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
  }

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
    if (dropArea) {
      dropArea.addEventListener("click", () => handleClick(fileInput));
    }

    // Drag-and-Drop-Events
    if (dropArea) {
      dropArea.addEventListener("dragover", (e) => handleDragOver(e, dropArea));
      dropArea.addEventListener("dragleave", () => handleDragLeave(dropArea));
      dropArea.addEventListener("drop", (e) => handleDrop(e, dropArea, processFiles));
    }
    // File-Input-Change-Event
    if (fileInput) {
      fileInput.addEventListener("change", (e) => handleFileChange(e, processFiles));
    }
  });
});

function tag_getTagArray() {
  return Array.from(tagContainer.children).map((tag) => tag.textContent.slice(0, -1));
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
		  searchTags(tagName: $searchstr, limit: 10) {
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
    if (result.errors) throw new Error(result.errors[0]);
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
        <img src="svg/plus2.svg" class=" btClose deletePost" alt="delete">`;
      previewContainer.appendChild(previewItem);
    } else if (type === "image") {
      previewItem.innerHTML = `
        <p>${file.name}</p>
        <img class="image-wrapper create-img none" alt="Vorschau" />
        <img src="svg/logo_farbe.svg" class="loading" alt="loading">
        <img src="svg/edit.svg" class="editImage " alt="delete">
        <img src="svg/plus2.svg" class=" btClose deletePost" alt="delete">`;
      previewContainer.children[0].insertAdjacentElement("afterend", previewItem);
    } else if (type === "video") {
      previewItem.classList.add("video-item");
      previewItem.innerHTML = `
        <p>${file.name}</p>
        <video id="${file.name}" class="image-wrapper create-video none" alt="Vorschau" controls=""></video>
        <img src="svg/logo_farbe.svg" class="loading" alt="loading">
        <img src="svg/plus2.svg" class=" btClose deletePost" alt="delete">`;
      previewContainer.appendChild(previewItem);
    }

    let element;
    if (type === "image") {
      element = previewItem.querySelector("img");
    } else if (type === "audio") {
      element = previewItem.querySelector("audio");
    } else if (type === "video") {
      element = previewItem.querySelector("video");
    }
    const base64 = await convertImageToBase64(file);
    sessionStorage.setItem(file.name, base64);
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
  document.querySelectorAll(".editImage").forEach(addEditImageListener);
}
