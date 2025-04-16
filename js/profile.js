let currentUserId;
let loggedInUserId;
let updatedProfilePic;
let currentUserName;
let currentUserDetails;
document.addEventListener("DOMContentLoaded", async function () {
  
  document.getElementById("profile-image-upload").addEventListener("change", function (event) {
    const file = event.target.files[0];
        if (file && !file.type.match(/^image\/(jpeg|jpg|png)$/)) {
          Merror("Error", "Invalid file type. Only JPG, JPEG, and PNG are allowed.");
         return;
        }else if(!file){
          return;
        }
        const reader = new FileReader();
        
        reader.onload = function(e) {
            document.getElementById("profile-picture-left").src = e.target.result
            updatedProfilePic = e.target.result
        };
        
        reader.readAsDataURL(file);
  });
  const closeComments = document.getElementById("closeComments");

  closeComments.addEventListener("click", () => {
    togglePopup("cardClicked");
    cancelTimeout();
    document.getElementById("profileHeader").classList.remove("none");
  });

  document.getElementById("profile-picture-right").addEventListener("click", function(){
    location.href = "profile.php?userId=" + loggedInUserId
  })
  
  try{
    restoreFilterSettings();
   await fetchUserDetails();
  }catch{
    document.getElementsByClassName("sidebar")[0].remove();
    document.getElementsByClassName("profile-layout")[0].remove()
    document.getElementById("profileHeader").remove()
    const error = document.getElementById("error");
    const errorText = document.createElement("h1");
    errorText.textContent = "Sorry, this page isn't available."
    error.appendChild(errorText)
    document.getElementsByClassName("main")[0].appendChild(error)
    return;
  }
  document.getElementById("edit-icon").addEventListener("click", function triggerFileUpload(event) {
    if (document.body.classList.contains("editing")) {
        document.getElementById("profile-image-upload").click();
    }
    event.stopPropagation();
  })
  const followBtn = document.getElementById("follow-btn")
  followBtn.addEventListener("click", async ()=>{
    if(!currentUserDetails.isfollowing){
     const res = await followUser(currentUserId)
     if(res.status){
      followBtn.innerText = "Following"
     }
    }
  })
  if (loggedInUserId == currentUserId) {
    if(followBtn){
      followBtn.style.display = "none";
    }
    const button = document.getElementById("edit-profile-btn");
    button.addEventListener("click", async function () {
      const isEditing = document.body.classList.contains("editing");
      const usernameInput = document.querySelector(".editable-input");
      const bioInput = document.querySelector(".editable-textarea");
      const validationMessage = document.getElementById("validationMessage");

      if (isEditing) {
        // Validate Username
        let base64String = bioInput.value;
        await textToBase64File(base64String).then((res) => {
          base64String = res;
        });
        showLoader();
        const response = await updateUserData(
          usernameInput.value,
          "Saicharan@2511",
          base64String
        );
        hideLoader();
        if (response && response.success) {
          // Remove validation errors
          usernameInput.classList.remove("invalid");
          bioInput.classList.remove("invalid");

          // Replace input fields with text elements
          replaceElement(
            usernameInput,
            "h2",
            usernameInput.value,
            "username-left"
          );
          replaceElement(bioInput, "p", bioInput.value, "profile-text");

          button.textContent = "Edit Profile";
          document.body.classList.remove("editing"); // Exit edit mode
          document.getElementById("picture-input").removeAttribute("for");
          document.getElementById("edit-icon").style.display = "none";
          location.reload();
        }
      } else {
        // Enter edit mode
        document.body.classList.add("editing");
        button.textContent = "Save Changes";

        // Convert username to input field
        const usernameElement = document.getElementById("username-left");
        const usernameInput = createInputField(
          usernameElement.textContent,
          "editable-input"
        );
        usernameElement.replaceWith(usernameInput);

        // Convert bio to textarea
        const bioElement = document.getElementById("profile-text");

        const bioInput = createTextarea(
          bioElement.textContent?.trim(),
          "editable-textarea"
        );
        bioElement.replaceWith(bioInput);
        document
          .getElementById("picture-input")
          .setAttribute("for", "profile-image-upload");
        document.getElementById("edit-icon").style.display = "inline-block";
      }
    });
  }else{
    document.getElementById("edit-profile-btn").style.display = "none"
    if(currentUserDetails.isfollowing){
      followBtn.innerText = "Following"
    }
  }

  function createInputField(value, className) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = value;
      input.className = className;
      return input;
  }

  function createTextarea(value, className) {
      const textarea = document.createElement("textarea");
      textarea.className = className;
      textarea.value = value;
      return textarea;
  }

  function replaceElement(oldElement, newTag, text, id) {
      const newElement = document.createElement(newTag);
      newElement.id = id;
      newElement.textContent = text;  // Avoid empty display
      oldElement.replaceWith(newElement);
  }

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        getUserPosts(currentUserId, true);
        console.log("Der Footer ist jetzt im Viewport sichtbar!");
      }
    });
  };
  const footer = document.getElementById("footer");
  const observerOptions = {
    root: null, // null bedeutet, dass der Viewport als root genutzt wird
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
        console.log(`${event.target.name} wurde aktiviert.`);
      } else {
        elements.forEach((element) => {
          element.classList.add("none");
        });
        console.log(`${event.target.name} wurde deaktiviert.`);
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

   
    
});






function timeAgo(datetime) {
  const now = Date.now(); // Aktuelle Zeit in Millisekunden
  const timestamp = new Date(datetime.replace(" ", "T")).getTime(); // ISO-konforme Umwandlung
  const elapsed = now - timestamp - 3600000; // Verstrichene Zeit in Millisekunden

  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // Durchschnittlicher Monat mit 30 Tagen
  const years = Math.floor(days / 365); // Durchschnittliches Jahr mit 365 Tagen

  if (seconds < 60) return `${seconds} second` + (seconds > 1 ? "s ago" : " ago");
  if (minutes < 60) return `${minutes} minute` + (minutes > 1 ? "s ago" : " ago");
  if (hours < 24) return `${hours} hour` + (hours > 1 ? "s ago" : " ago");
  if (days < 7) return `${days} day` + (days > 1 ? "s ago" : " ago");
  if (weeks < 4) return `${weeks} week` + (weeks > 1 ? "s ago" : " ago");
  if (months < 12) return `${months} month` + (months > 1 ? "s ago" : " ago");
  return `${years} year` + (years > 1 ? "s ago" : " ago");
}

async function fetchUserDetails(){
  const currentUser = await fetchHelloData(userProfileId);
  const loggedInUser = await fetchHelloData();
  loggedInUserId = loggedInUser.data.hello.currentuserid;
  const profileLink = document.createElement("a")
  profileLink.id = "profile-link"
  profileLink.textContent = loggedInUser.data.profile.affectedRows.username
  profileLink.href = "profile.php?userId=" + loggedInUserId;
  profileLink.style.textDecoration = "none";
  profileLink.style.color = "white"
  document.getElementById("username-right").appendChild(profileLink)
  //document.getElementById("username-right").innerText = loggedInUser.data.profile.affectedRows.username;
  document.getElementById("slug-right").innerText = "#" +  loggedInUser.data.profile.affectedRows.slug;
  document.getElementById("profile-picture-right").src = tempMedia(loggedInUser.data.profile.affectedRows.img);
  document.getElementById("amountposts-right").innerText = loggedInUser.data.profile.affectedRows.amountposts
  document.getElementById("amountfollower-right").innerText = loggedInUser.data.profile.affectedRows.amountfollower
  document.getElementById("amountfollowed-right").innerText = loggedInUser.data.profile.affectedRows.amountfollowed



  if (!currentUser || currentUser?.data?.profile?.status == "error") {
    throw Error("Invalid");
  } else {
    currentUserDetails = currentUser.data.profile.affectedRows;
    currentUserId = currentUser.data.profile.affectedRows.id;
    currentUserName = currentUser.data.profile.affectedRows.username;
    document.getElementById("username-left").innerText =
      currentUser.data.profile.affectedRows.username;
    document.getElementById("slug-left").innerText =
      "#" + currentUser.data.profile.affectedRows.slug;
    document.getElementById("profile-picture-left").src = tempMedia(
      currentUser.data.profile.affectedRows.img
    );
    document.getElementById("amountposts-left").innerText =
      currentUser.data.profile.affectedRows.amountposts;
    document.getElementById("amountfollower-left").innerText =
      currentUser.data.profile.affectedRows.amountfollower;
    document.getElementById("amountfollowed-left").innerText =
      currentUser.data.profile.affectedRows.amountfollowed;
    const bioTxt = tempMedia(currentUser.data.profile.affectedRows.biography);
    fetch(bioTxt)
      .then((response) => {
        if (!response.ok) {
          // Check if status is not 200-299
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        document.getElementById("profile-text").innerText = data;
      })
      .catch((error) => {
        console.error("Fetch error:", error); // Log error message
        document.getElementById("profile-text").innerText = "";
      });

    await getUserPosts(userProfileId);

    const mutualResponse = await getUserFriends(20, 0);
     
      
    let connectionsDiv = document.getElementById("connection-list");
    let latestConnections = mutualResponse.status
      ? mutualResponse.response
      : [];
    if (latestConnections.length) {
      latestConnections.forEach((user) => {
        const connectionDiv = document.createElement("div");
        connectionDiv.className = "connection";
        const profilePic = document.createElement("img");
        profilePic.src = tempMedia(user.img);
        profilePic.className = "connections-profile-pic";
        profilePic.alt = user.username;
        profilePic.onerror = function () {
          this.onerror = null; // Prevent infinite loop if fallback also fails
          this.src = "svg/noname.svg";
        };
        const username = document.createElement("p");
        username.className = "connections-username";
        username.innerText = user.username;
        connectionDiv.appendChild(profilePic);
        connectionDiv.appendChild(username);
        connectionsDiv.appendChild(connectionDiv);
      });
    } else {
      let text = document.createElement("p");
      text.innerText = "No friends found";
      text.classList.add("no-friends");
      connectionsDiv.appendChild(text);
    }
  }
  
}

async function getUserPosts(userId, offset) {
  if (getUserPosts.offset === undefined) {
    getUserPosts.offset = 0; // Initialwert
  }

  const form = document.querySelector("#filter");

  // Alle Checkboxen innerhalb des Formulars abrufen
  const checkboxes = form.querySelectorAll(".filteritem:checked");

  // Die Werte der angehakten Checkboxen sammeln
  const values = Array.from(checkboxes).map((checkbox) => checkbox.name);

  console.log(values);
  const cleanedArray = values.map((values) => values.replace(/^"|"$/g, ""));
  const sortby = document.querySelectorAll('#filter input[type="radio"]:checked');
  const userPosts = await getPosts(getUserPosts.offset, 48, cleanedArray, "", null, sortby.length ? sortby[0].getAttribute("sortby") : "NEWEST");
  console.log(cleanedArray);
  let data = userPosts.data.getallposts.affectedRows?.filter(x => x.user.id == userId)
  if(!data.length && !offset){
    let noPostDiv = document.createElement("h1")
    noPostDiv.textContent = "No Posts Yet";
    noPostDiv.classList.add("no-post")
    document.getElementsByClassName("profile-right")[0].appendChild(noPostDiv)
    document.getElementById("footer").style.display = "none"
  }
  data.forEach(async post => {
    const postContainer = document.createElement("div");
    postContainer.classList.add("post-container");
    postContainer.style.width = post.contenttype === "image" ? "100%" : "45%";

    const postHeader = document.createElement("div");
    postHeader.classList.add("post-header");
    const profilePic = document.createElement("img");
    profilePic.src = tempMedia(post.user.img);
    profilePic.id = "profile-pic";
    profilePic.alt = post.user.username;
    profilePic.classList.add("profile-pic");
    profilePic.onerror = function () {
        this.onerror = null; // Prevent infinite loop if fallback also fails
        this.src = "svg/noname.svg"; 
    };
    postHeader.innerHTML = `
        <div>
            <h3>${post.user.username}</h3>
            <p>${timeAgo(post.createdat)}</p>
        </div>
    `;
    postHeader.prepend(profilePic);
    postContainer.appendChild(postHeader);

    const postContent = document.createElement("div");
    postContent.classList.add("post-content");
    const array = JSON.parse(post.media);
    let cover = null;
    if (post.cover) {
      cover = JSON.parse(post.cover);
    }
    if (post.contenttype === "image") {
      postContainer.classList.add("image-post");
      const images = JSON.parse(post.media);
      postContent.innerHTML = `<p>${post.title}</p>`;
  
      const carousel = document.createElement("div");
      carousel.classList.add("carousel");
  
      const imgContainer = document.createElement("div");
      imgContainer.classList.add("carousel-images");
      if (images.length > 1) {
        imgContainer.classList.add("multiple-images");
      }
      images.forEach(img => {
          const imgElement = document.createElement("img");
          imgElement.src = tempMedia(img.path);
          imgContainer.appendChild(imgElement);
          imgElement.style.width = images.length == 1 ? "100%" : "50%"
      });
  
      carousel.appendChild(imgContainer);
      postContent.appendChild(carousel);
  }else if (post.contenttype === "audio") {
      if (cover) {
        img = document.createElement("img");
        img.onload = () => {
          img.setAttribute("height", img.naturalHeight);
          img.setAttribute("width", img.naturalWidth);
        };
        img.src = tempMedia(cover[0].path);
        img.alt = "Cover";
        postContent.appendChild(img);
      }
      for (const item of array) {
        audio = document.createElement("audio");
        audio.id = item.path;
        audio.src = tempMedia(item.path);
        audio.controls = true;
        audio.className = "custom-audio";
        addMediaListener(audio);
        postContent.appendChild(audio);
      }
    }else if (post.contenttype === "video") {
      for (const item of array) {
        if (item.cover) {
          img = document.createElement("img");
          img.onload = () => {
            img.setAttribute("height", img.naturalHeight);
            img.setAttribute("width", img.naturalWidth);
          };
          img.src = tempMedia(item.cover);
          img.alt = "Cover";
          postContent.appendChild(img);
        }
        video = document.createElement("video");
        video.id = extractAfterComma(item.path);
        video.src = tempMedia(item.path);
        video.controls = true;
        video.className = "video-post";
        addMediaListener(video);
        postContent.appendChild(video);
      }
    }else if (post.contenttype === "text") {
      for (const item of array) {
        const div = document.createElement("div");
        div.id = post.id;
        const n = await fetch(tempMedia(item.path))
        const text = await n.text();
        div.innerText = text;
        div.className = "custom-note";
        postContent.appendChild(div);
      }
    }
    // const shadowDiv = document.createElement("div");
    // shadowDiv.classList.add("shadow");
    // postContent.appendChild(shadowDiv);
    const inhaltDiv = document.createElement("div");
  inhaltDiv.classList.add("post-desc");
  const h1 = document.createElement("h1");
  h1.textContent = post.title;
  const p = document.createElement("p");
  p.classList.add("post-text");
  p.textContent = post.mediadescription;
  inhaltDiv.appendChild(h1);
  inhaltDiv.appendChild(p);
    postContainer.appendChild(postContent);
    postContainer.appendChild(inhaltDiv)

    const postFooter = document.createElement("div");
        postFooter.classList.add("post-footer");
        postFooter.innerHTML = `
            <span>👁️ <p>${post.amountviews}</p></span>
            <span>❤️ <p>${post.amountlikes}</p></span>
            <span>💬 <p>${post.amountcomments}</p></span>
        `;
        postContent.addEventListener("click", function handleCardClick() {
          postClicked(post);
        });
        postContainer.appendChild(postFooter);
    document.getElementById("user-posts").appendChild(postContainer);
    getUserPosts.offset++;


});
}

function onPictureError(id)
{
  Array.from(document.getElementsByClassName(id)).forEach(ele =>{
    ele.src = "svg/noname.svg";
  })
}

function saveFilterSettings() {
  let filterSettings = {};
  let checkboxes = document.querySelectorAll('#filter input[type="checkbox"], #filter input[type="radio"]');

  checkboxes.forEach((checkbox) => {
    filterSettings[checkbox.id] = checkbox.checked; // Speichert Name und Zustand
  });
  localStorage.setItem("filterSettings", JSON.stringify(filterSettings)); // In localStorage speichern
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

async function updateUserData(userName, password, bio) {
  const accessToken = getCookie("authToken");
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });
  // Send both requests in parallel
  try {
    let status = true;
    let statusCode = ""
    if(currentUserName != userName){
      const updateNameMutation = {
        query: `
            mutation {
                updateName(username: "${userName}", password: "") {
                    status
                    ResponseCode
                }
            }
        `
      };
      await fetch(GraphGL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(updateNameMutation),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data.updateName.status !== "success") {
            status = false;
            statusCode = "UserName";
            Merror("Error", data.data.updateName.ResponseCode);
          }
        });
    }
    if (!["", null, undefined].includes(bio)) {
      const updateBiographyMutation = {
        query: `
                  mutation {
                      updateBiography(biography: "${bio}") {
                          status
                          ResponseCode
                      }
                  }
              `,
      };
      await fetch(GraphGL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(updateBiographyMutation),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data.updateBiography.status !== "success") {
            status = false;
            statusCode = "Biography";
            Merror("Error", data.data.updateBiography.ResponseCode);
          }
        });
    }
    if (!["", null, undefined].includes(updatedProfilePic)) {
      const updateProfilePictureMutation = {
        query: `
                mutation UpdateProfilePicture {
          updateProfilePicture(img: "${updatedProfilePic}") {
              status
              ResponseCode
          }
      }
            `,
      };
      await fetch(GraphGL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(updateProfilePictureMutation),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data.updateProfilePicture.status !== "success") {
            status = false;
            statusCode = "Profile Picture";
            Merror("Error", data.data.updateProfilePicture.ResponseCode);
          }
        });
    }
      return {success : status}
  } catch (error) {
      return { success: false, error: error };
  }
}
document.addEventListener("blur", function (event) {
  if (event.target.classList.contains("editable-input")) {
    let usernameInput = event.target;

    if (!usernameInput.value.trim()) {  
      usernameInput.classList.add("invalid");
    } else {
      usernameInput.classList.remove("invalid");
    }
  }
}, true);

let timerId = null;
function cancelTimeout() {
  clearTimeout(timerId);
}

async function postClicked(objekt) {
  const UserID = getCookie("userID");
  if (!objekt.isviewed && objekt.user.id !== UserID) timerId = setTimeout(() => viewed(objekt), 1000);
  togglePopup("cardClicked");
  document.getElementById("profileHeader").classList.add("none");
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

      // 2. Erzeuge das <canvas>-Element
      const canvas = document.createElement("canvas");
      canvas.id = "waveform-preview"; // Setze die ID für das Canvas

      // 3. Erzeuge das <button>-Element
      const button = document.createElement("button");
      button.id = "play-pause"; // Setze die ID für den Button
      button.textContent = "Play"; // Setze den Textinhalt des Buttons

      // 4. Füge die Kinder-Elemente (Canvas und Button) in das <div> ein
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
      div = document.createElement("div");
      div.id = objekt.id;
      const n = await fetch(tempMedia(item.path))
      const text = await n.text();
      div.innerText = text;
      div.className = "custom-note-clicked";
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
  console.log(mostliked);
  const mostlikedcontainer = document.getElementById("mostliked");
  mostlikedcontainer.innerHTML = "";
  for (let i = 0; i < 3 && i < mostliked.length; i++) {
    const img = document.createElement("img");

    img.src = mostliked[i].img ? tempMedia(mostliked[i].img.replace("media/", "")) : "svg/noname.svg";
    mostlikedcontainer.appendChild(img);
  }
  const topcommenter = document.createElement("span");
  topcommenter.textContent = mostliked.length ? mostliked[0].name + " and " + objekt.amountlikes + " others liked" : "no one liked";
  mostlikedcontainer.appendChild(topcommenter);
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

async function getUserFriends(limit, offset){
  const friendsMutations ={
    query: `query Friends {
    friends(limit: ${limit}, offset: ${offset}) {
        status
        counter
        ResponseCode
        affectedRows {
            userid
            img
            username
            slug
            biography
            updatedat
        }
    }
}`
  } 

const accessToken = getCookie("authToken");
const headers = new Headers({
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
});
try {
       return fetch(GraphGL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(friendsMutations)
        }).then(res => res.json()).then(res =>{
          if(res && res.data){
            return {status: res.data.friends.affectedRows.length ? true : false, response: res.data.friends.affectedRows } 
          }else{
            return {status: false, response: [] } ;
          }
        })
} catch (error) {
    return {status: false, response: [] } ;
}
}

function textToBase64File(text) {
  return new Promise((resolve, reject) => {
      if (text.trim() === "") {
       text = "  "; // Added two spaces if empty
      }
      let blob = new Blob([text], { type: 'text/plain' });
      let reader = new FileReader();
      reader.onloadend = function () {
          resolve(reader.result);
      };
      reader.onerror = reject;

      reader.readAsDataURL(blob);
  });
}

function followUser(userId){
  const accessToken = getCookie("authToken");
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });
  
  const followUserMutation = {
    query: `mutation UserFollow {
    userFollow(userid: "${userId}") {
        status
        ResponseCode
        isfollowing
    }
}`
  }

  try {
    return fetch(GraphGL, {
         method: "POST",
         headers: headers,
         body: JSON.stringify(followUserMutation)
     }).then(res => res.json()).then(res =>{
       if(res && res.data.userFollow.status == "success"){
         return {status: true }; 
       }else{
         return {status: false} ;
       }
     })
} catch (error) {
 return {status: false} ;
}
}








      