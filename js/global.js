// likeCost, dislikeCost, commentCost and postCost are global variables and updated in getActionPrices();
let likeCost = 0.3,
  dislikeCost = 0.5,
  commentCost = 0.05,
  postCost = 2;

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
  const now = Date.now(); // Aktuelle Zeit in Millisekunden
  const timestamp = new Date(adjustForDSTAndFormat(datetime)); // ISO-konforme Umwandlung

  const elapsed = now - timestamp - 3600000; // Verstrichene Zeit in Millisekunden

  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // Durchschnittlicher Monat mit 30 Tagen
  const years = Math.floor(days / 365); // Durchschnittliches Jahr mit 365 Tagen

  if (seconds < 60) return `${seconds} sec`;
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (weeks < 4) return `${weeks}w`;
  if (months < 12) return `${months}m`;
  return `${years} y`;
}


/*----------- Start : FeedbackPopup Logic --------------*/

const POPUP_KEY = 'feedbackPopupData';

function getPopupData() {
  const stored = localStorage.getItem(POPUP_KEY);
  return stored ? JSON.parse(stored) : {
    count: 0,
    lastClosed: 0,
    disabled: false
  };
}

function setPopupData(data) {
  localStorage.setItem(POPUP_KEY, JSON.stringify(data));
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
  //const fiveDays = 5 * 24 * 60 * 60 * 1000;

  const fiveDays =  60 * 1000; // 1 mint for testing

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
      sessionStorage.setItem('popupShown', 'false');
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
/*----------- End : FeedbackPopup Logic --------------*/
