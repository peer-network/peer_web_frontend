document.addEventListener("DOMContentLoaded", () => {
  hello();
  getUser();
  dailyfree();

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

  return { hashtags, usernames, normalWords };
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
function addEditImageListener(element) {
  element.removeEventListener("click", handleEditImage);
  element.addEventListener("click", handleEditImage);
}
let cropOrg = null;
function handleEditImage(event) {
  event.preventDefault();
  document.getElementById("crop-container").classList.remove("none");
  cropOrg = event.target.parentElement.childNodes[3];
  cropImg.src = cropOrg.src; // Das Bild aus dem Element holen
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

  const imageContainer = document.getElementById("comment-img-container");
  imageContainer.innerHTML = "";
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
      const stat = document.getElementById(entry.name + "Stat");
      if (used) {
        used.innerText = entry.used;
      }
      if (available) {
        available.innerText = entry.available;
      }

      const percentage = entry.available === 0 ? 0 : 100 - (entry.used / (entry.available + entry.used)) * 100;

      if (stat) {
        stat.style.setProperty("--progress", percentage + "%");
      }

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
    return result.data.balance.currentliquidity;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
async function currentliquidity() {
  const token = await getLiquiudity();

  if (token !== null) {
    document.getElementById("token").innerText = token;
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

    // Check for errors in response
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    if (result.errors) throw new Error(result.errors[0].message);
    return result.data.getDailyFreeStatus.affectedRows;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
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
