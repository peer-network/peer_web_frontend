'use strict';

let isInvited = "";
const toggleCheckBox = document.getElementById("toggle");
const contentRestored = document.getElementById("contentRestored");
const returnToLogin = document.getElementById("returnToLogin");
const svg1 = `
  <svg xmlns="http://www.w3.org/2000/svg" width="186" height="186" viewBox="0 0 186 186" fill="none">
    <path d="M93.0001 131.75C97.2803 131.75 100.75 135.22 100.75 139.5C100.75 143.78 97.2803 147.25 93.0001 147.25C88.7199 147.25 85.2501 143.78 85.2501 139.5C85.2501 135.22 88.7199 131.75 93.0001 131.75Z" fill="#FF3B3B"/>
    <path d="M93.0001 38.75C95.0555 38.75 97.0262 39.5671 98.4796 41.0205C99.933 42.4739 100.75 44.4445 100.75 46.5V108.5C100.75 110.555 99.933 112.526 98.4796 113.979C97.0262 115.433 95.0555 116.25 93.0001 116.25C90.9447 116.25 88.974 115.433 87.5206 113.979C86.0672 112.526 85.2501 110.555 85.2501 108.5V46.5C85.2501 44.4445 86.0672 42.4739 87.5206 41.0205C88.974 39.5671 90.9447 38.75 93.0001 38.75Z" fill="#FF3B3B"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M93.0001 0C117.657 0.0266683 141.295 9.83454 158.73 27.2696C176.165 44.7047 185.973 68.343 186 92.9999C186 111.393 180.544 129.373 170.325 144.667C160.106 159.96 145.582 171.88 128.588 178.919C111.595 185.958 92.8962 187.802 74.8563 184.214C56.8162 180.625 40.2457 171.767 27.2396 158.76C14.2334 145.754 5.3748 129.184 1.78635 111.144C-1.80202 93.1038 0.0421432 74.4051 7.08083 57.4118C14.1198 40.4183 26.0397 25.8939 41.3335 15.6749C56.6272 5.45602 74.6066 8.76668e-06 93.0001 0ZM122.658 21.3999C108.497 15.5341 92.9137 13.9998 77.8802 16.9901C62.847 19.9805 49.0369 27.3599 38.1985 38.1983C27.3601 49.0367 19.9807 62.8467 16.9903 77.88C14 92.9135 15.5344 108.496 21.4001 122.658C27.2659 136.819 37.1998 148.923 49.9446 157.439C62.6892 165.954 77.6724 170.5 93.0001 170.5C113.547 170.477 133.246 162.304 147.775 147.775C162.304 133.245 170.477 113.547 170.5 92.9999C170.5 77.6721 165.954 62.689 157.439 49.9444C148.923 37.1996 136.819 27.2657 122.658 21.3999Z" fill="#FF3B3B"/>
  </svg>
`;
const svg2 = `
<svg xmlns="http://www.w3.org/2000/svg" width="186" height="186" viewBox="0 0 186 186" fill="none">
  <path d="M93 186C80.135 186 68.045 183.559 56.73 178.676C45.415 173.794 35.5725 167.167 27.2025 158.798C18.8325 150.428 12.2063 140.585 7.32375 129.27C2.44125 117.955 0 105.865 0 93C0 80.135 2.44125 68.045 7.32375 56.73C12.2063 45.415 18.8325 35.5725 27.2025 27.2025C35.5725 18.8325 45.415 12.2063 56.73 7.32375C68.045 2.44125 80.135 0 93 0C100.44 0 107.686 0.8525 114.739 2.5575C121.791 4.2625 128.572 6.7425 135.083 9.9975C137.408 11.2375 138.919 13.0975 139.616 15.5775C140.314 18.0575 139.887 20.3825 138.337 22.5525C136.788 24.7225 134.734 26.1175 132.176 26.7375C129.619 27.3575 127.1 27.0475 124.62 25.8075C119.66 23.4825 114.506 21.7 109.159 20.46C103.811 19.22 98.425 18.6 93 18.6C72.385 18.6 54.8312 25.8463 40.3387 40.3387C25.8463 54.8312 18.6 72.385 18.6 93C18.6 113.615 25.8463 131.169 40.3387 145.661C54.8312 160.154 72.385 167.4 93 167.4C113.615 167.4 131.169 160.154 145.661 145.661C160.154 131.169 167.4 113.615 167.4 93C167.4 91.76 167.361 90.5588 167.284 89.3962C167.206 88.2337 167.09 87.0325 166.935 85.7925C166.625 83.1575 167.129 80.6387 168.446 78.2363C169.764 75.8337 171.74 74.245 174.375 73.47C176.855 72.695 179.18 72.9275 181.35 74.1675C183.52 75.4075 184.76 77.2675 185.07 79.7475C185.38 81.9175 185.613 84.0875 185.768 86.2575C185.923 88.4275 186 90.675 186 93C186 105.865 183.559 117.955 178.676 129.27C173.794 140.585 167.167 150.428 158.798 158.798C150.428 167.167 140.585 173.794 129.27 178.676C117.955 183.559 105.865 186 93 186ZM79.98 109.74L166.47 23.0175C168.175 21.3125 170.306 20.4212 172.864 20.3438C175.421 20.2663 177.63 21.1575 179.49 23.0175C181.195 24.7225 182.048 26.8925 182.048 29.5275C182.048 32.1625 181.195 34.3325 179.49 36.0375L86.49 129.27C84.63 131.13 82.46 132.06 79.98 132.06C77.5 132.06 75.33 131.13 73.47 129.27L46.965 102.765C45.26 101.06 44.4075 98.89 44.4075 96.255C44.4075 93.62 45.26 91.45 46.965 89.745C48.67 88.04 50.84 87.1875 53.475 87.1875C56.11 87.1875 58.28 88.04 59.985 89.745L79.98 109.74Z" fill="#AAFF67"/>
</svg>`;

// initialize the checkbox with pre-stored status
async function init() {
  if (!storedUserInfo || storedUserInfo === null) storedUserInfo = await getUserInfo()
  isInvited = storedUserInfo ?.invited;
  const contentFilteringSeverityLevel = storedUserInfo ?.userPreferences ?.contentFilteringSeverityLevel;
  toggleCheckBox.checked = contentFilteringSeverityLevel == "MYGRANDMAHATES" ? false : true;
}

// updating modal text-content
function updateCheckBoxStatus(flag = null) {
  if (flag !== null && flag === true) {
    contentRestored.querySelector("h3").textContent = "Content restored";
    contentRestored.querySelector("p").textContent = "Reported posts are now visible in your feed";
  } else {
    contentRestored.querySelector("h3").textContent = "Hidden successfully";
    contentRestored.querySelector("p").textContent = "Reported posts have been removed from your feed";
  }
}

window.addEventListener('DOMContentLoaded', init);
// checkbox event
toggleCheckBox.addEventListener('click', async function () {
  let status, response = null;
  const prevStatus = this.checked ? false : true;

  if (this.checked === true) {
    status = "MYGRANDMALIKES"
    response = await confirm(
      "Show reported content?",
      "You're about to see all reported posts in your feed.",
      false,
      "reportedContentToggle",
      svg1
    );

    updateCheckBoxStatus(true);
  } else {
    status = "MYGRANDMAHATES";
    response = await confirm(
      "Hide all reported posts?",
      "You're about to hide all reported posts from your feed.",
      false,
      "reportedContentToggle",
      svg1
    );

    updateCheckBoxStatus(false);
  };

  if (response ?.button) {
    const loader = document.getElementById("post_loader");
    if (loader) loader.classList.remove("none");
    try {
      await updateReportedContent(status);
      await waitAndDo();

      contentRestored.classList.remove("none");
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      if (loader) loader.classList.add("none");
    }
    return
  } 
   
  this.checked = prevStatus;
});

returnToLogin.addEventListener("click", () => clearCacheAndSession());

async function updateReportedContent(contentFilteringSeverityLevel) {
  const accessToken = getCookie("authToken");
  if (!accessToken) {
    throw new Error("Auth token is missing or invalid.");
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const graphqlbody = JSON.stringify({
    query: `
      mutation UpdateUserPreferences {
        updateUserPreferences(
          userPreferences: {
            contentFilteringSeverityLevel: ${contentFilteringSeverityLevel}
          }
        ) {
          status
          ResponseCode
          affectedRows {
            contentFilteringSeverityLevel
          }
        }
      }
    `
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: graphqlbody,
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

    if (ResponseCode !== "11014") console.warn("Error Message:", userfriendlymsg(ResponseCode));
    return status;
  } catch (error) {
    console.error("Error updating preferences:", error.message);
    throw error;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitAndDo() {
  await sleep(211);
}