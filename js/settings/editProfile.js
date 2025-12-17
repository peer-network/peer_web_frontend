function toggle_profile_blocks(activeId) {
  // Hide all profile widgets
  document.querySelectorAll(".profile-widget").forEach(el => {
    el.classList.add('hide');
    el.classList.remove('active');
  });

  // Show the selected widget
  const backProfileBtn = document.getElementById('profile-back-btn');
  const mainbackProfileBtn = document.getElementById('main-profile-back-btn');
  const activeElement = document.getElementById(activeId);
  if (activeElement) {
    activeElement.classList.remove('hide');
    activeElement.classList.add('active');
    backProfileBtn.classList.remove('hide');
    mainbackProfileBtn.classList.add('hide');
  }
}

/**
 * Enables the button (and adds .btn-style-blue) if all required inputs are non-empty,
 * otherwise disables it (and removes .btn-style-blue).
 */
function updateSubmitButtonState(form, btn) {
  const inputs = Array.from(form.querySelectorAll('input[required]'));
  const allFilled = inputs.every(i => i.value.trim().length > 0);
  btn.disabled = !allFilled;
  btn.classList.toggle('btn-blue', allFilled);
}

document.addEventListener("DOMContentLoaded", () => {
  // find every form you want to auto-enable
  document.querySelectorAll('.form-container').forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"], button');
    // initial state
    updateSubmitButtonState(form, submitBtn);
    // re-check on every input change
    form.querySelectorAll('input[required]').forEach(input => input.addEventListener('keyup', () => updateSubmitButtonState(form, submitBtn)));
  });

  getUser().then(profile2 => {
    const pusername = document.getElementById("pusername");
    pusername.innerText = profile2.data.getProfile.affectedRows.username;
    const userVisibility=profile2.data.getProfile.affectedRows.visibilityStatus;
    console.log(userVisibility);

    const profilesettingsContainer = document.getElementById("profile-settings");

    if(userVisibility=='ILLEGAL' || userVisibility=='illegal'){
      profilesettingsContainer.innerHTML="Illegal Account";
      return;

    }

    const img = document.getElementById("myprofilbild");
    img.onerror = function () {
      this.src = "svg/noname.svg";
    };

    img.src = profile2.data.getProfile.affectedRows.img ? tempMedia(profile2.data.getProfile.affectedRows.img.replace("media/", "")) : "svg/noname.svg";

    const bioPath = profile2.data.getProfile.affectedRows.biography;
    // Check if bioPath is valid
    if (bioPath) {
      const fullPath = tempMedia(profile2.data.getProfile.affectedRows.biography);
      fetch(fullPath, {
          cache: "no-store"
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch biography text file");
          }
          return response.text();
        })
        .then(biographyText => {
          document.getElementById("biography").innerHTML = biographyText;
        })
        .catch(error => {
          console.error("Error loading biography:", error);
          //document.getElementById("biography").innerText = "Biography not available";
        });
    }
  });

  const changeusernamebtn = document.getElementById("changeusernamebtn");
  changeusernamebtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form reload
    toggle_profile_blocks('change-username');
  });

  const changepassbtn = document.getElementById("changePassbtn");
  changepassbtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form reload
    toggle_profile_blocks('change-password');
  });

  const changeemailbtn = document.getElementById("changeEmailbtn");
  changeemailbtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form reload
    toggle_profile_blocks('change-email');
  });

  const uploadBtn = document.getElementById("change-picture");
  const fileInput = document.getElementById("fileInput");
  const modal = document.getElementById("imageModal");
  const closeBtn = document.querySelector(".closeBtn");
  const previewImage = document.getElementById("previewImage");
  const zoomSlider = document.getElementById("zoomSlider");
  const cancelBtn = document.getElementById("cancelBtn");

  uploadBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form reload
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    e.preventDefault(); // Prevent form reload
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        modal.style.display = "flex";
        zoomSlider.value = 1;
        previewImage.style.transform = `scale(1)`;
      };
      reader.readAsDataURL(file);
    }
  });

  let scale = 1;
  zoomSlider.addEventListener("input", (event) => {
    event.preventDefault(); // Prevent form reload
    scale = parseFloat(zoomSlider.value);
    previewImage.style.transform = `scale(${scale})`;
  });

  closeBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form reload
    modal.style.display = "none";
  });

  cancelBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form reload
    modal.style.display = "none";
  });

  // Apply button can be connected to saving or uploading the image to backend
  document.getElementById("applyBtn").addEventListener("click", (event) => {
    event.preventDefault();
    const newImageSrc = previewImage.src;
    document.getElementById("myprofilbild").src = newImageSrc;
    modal.style.display = "none";
  });

  document.getElementById("saveprofileBtn").addEventListener("click", async function (event) {
    event.preventDefault();
    const biographyText = document.getElementById("biography").value.trim();
    const imageWrappers = document.querySelectorAll(".my-profile-picture");
    const base64Image = Array.from(imageWrappers)
      .map((img) => img.src)
      .find((src) => src.startsWith("data:image/"));
    // Encode biography to base64 and format as required
    const base64Biography = biographyText ?
      `data:text/plain;base64,${btoa(unescape(encodeURIComponent(biographyText)))}` :
      '';
    const msgElem = document.getElementById("response_msg_bio");
    msgElem.innerHTML = '';
    msgElem.classList.remove('error');
    msgElem.classList.remove('success');
    try {
      // Call both functions in parallel
      const [imageResult, bioResult] = await Promise.all([
        base64Image ?
        sendUpdateProfileImage({
          img: base64Image
        }) :
        Promise.resolve({
          updateProfileImage: {
            status: "success",
            ResponseCode: "11004"
          }
        }),

        sendUpdateBio(base64Biography),
      ]);
      const imageSuccess =
        imageResult.updateProfileImage.status === "success" &&
        imageResult.updateProfileImage.ResponseCode === "11004";
      const bioSuccess =
        bioResult.updateBio.status === "success" &&
        bioResult.updateBio.ResponseCode === "11003";
      msgElem.classList.add(bioResult.updateBio.status);
      msgElem.innerHTML = userfriendlymsg(bioResult.updateBio.ResponseCode);
      if (imageSuccess && bioSuccess) {
       location.reload();
      } else {
        console.error("One or both updates failed.");
      }
    } catch (error) {
      console.error("Error during update profile request:", error);
    }
  });
  document.getElementById("changeusernameForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form reload
    // Retrieve input values for form
    const username = document.getElementById("newusername").value;
    const userPassword = document.getElementById("userPassword").value;
    // Disable form and show loading indicator (optional UI improvement)
    const submitButton = document.getElementById("changeUserBtn");
    submitButton.disabled = true;
    try {
      // Attempt to change the username after passing validations
      const result = await sendUpdateUsername(username, userPassword);
      if (result.updateUsername.status === "success" && result.updateUsername.ResponseCode === "11007") {
        //  Reset the input field
        document.getElementById("newusername").value = "";
        document.getElementById("userPassword").value = "";
        document.getElementById("response_msg_change_username").classList.add(result.updateUsername.status);
        document.getElementById("response_msg_change_username").innerHTML = userfriendlymsg(result.updateUsername.ResponseCode);
        setTimeout(() => {
          location.reload();
        }, 1000);

      } else {
        document.getElementById("response_msg_change_username").classList.add(result.updateUsername.status);
        document.getElementById("response_msg_change_username").innerHTML = userfriendlymsg(result.updateUsername.ResponseCode);
      }
    } catch (error) {
      console.error("Error during update username request:", error);
    } finally {
      // Re-enable the form and hide loading indicator
      submitButton.disabled = false;
    }
  });

  document.getElementById("changepasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const expassword = document.getElementById("old_password").value.trim();
    const newpassword = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm_password").value.trim();
    const msgElem = document.getElementById("confirmValidationMessage");
    const submitButton = document.getElementById("changePasswordBtn");

    // clear out any old message classes
    msgElem.classList.remove("error", "success");
    msgElem.innerHTML = "";

    // Password validation
    const passwordMinLength = 8; // Minimum password length
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

    // Password validation checks
    if (newpassword.length < passwordMinLength) {
      return displayValidationMessage(userfriendlymsg("Password too short (min. 8 chars)!!"), "confirmValidationMessage");
    }
    if (!/[A-Z]/.test(newpassword)) {
      return displayValidationMessage(userfriendlymsg("Add at least 1 uppercase letter!!"), "confirmValidationMessage");
    }
    if (!/\d/.test(newpassword)) {
      return displayValidationMessage(userfriendlymsg("Add at least 1 number!!"), "confirmValidationMessage");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newpassword)) {
      return displayValidationMessage(userfriendlymsg("Include a special character (!@#$...)!!"), "confirmValidationMessage");
    }
    if (!passwordRegex.test(newpassword)) {
      return displayValidationMessage(userfriendlymsg("Password does not meet requirements!!"), "confirmValidationMessage");
    }
    if (newpassword !== confirmPassword) {
      return displayValidationMessage(userfriendlymsg("Passwords do not match!!"), "confirmValidationMessage");
    }

    //  disable button while we wait
    submitButton.disabled = true;

    try {
      const result = await sendUpdatePassword(newpassword, expassword);
      const {
        status,
        ResponseCode
      } = result.updatePassword;

      if (status === "success" && ResponseCode === "11005") {
        // reset fields
        ["old_password", "password", "confirm_password"].forEach(id =>
          document.getElementById(id).value = ""
        );
        msgElem.classList.add("success");
        msgElem.classList.remove('notvalid')
        document.getElementById('passwordStrength') ?.classList.add('none');
      } else {
        msgElem.classList.add("error");
      }

      msgElem.innerHTML = userfriendlymsg(ResponseCode);
    } catch (err) {
      console.error("Error updating password:", err);
      msgElem.classList.add("error");
      msgElem.innerHTML = "An unexpected error occurred";
    } finally {
      submitButton.disabled = false;
    }
  });

  document.getElementById("changeemailForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form reload
    // Retrieve input values for form

    const email = document.getElementById("new_email").value;
    const emailPassword = document.getElementById("yourpassword").value;
    const msgElem = document.getElementById("response_msg_change_email");

    // Disable form and show loading indicator (optional UI improvement)
    const submitButton = document.getElementById("changeEmailBtn");
    // clear out any old message classes
    msgElem.classList.remove("error", "success");
    msgElem.innerHTML = "";

    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      msgElem.classList.add("error");
      msgElem.innerHTML = "Enter a valid email!";

      return;
    }

    submitButton.disabled = true;
    try {
      // Attempt to change the password after passing validations
      const result = await sendUpdateEmail(email, emailPassword);
      const {
        status,
        ResponseCode
      } = result.updateEmail;

      if (status === "success" && ResponseCode === "11006") {
        // reset fields
        ["new_email", "yourpassword"].forEach(id =>
          document.getElementById(id).value = ""
        );
        msgElem.classList.add("success");
      } else {
        msgElem.classList.add("error");
      }

      msgElem.innerHTML = userfriendlymsg(ResponseCode);
    } catch (error) {
      console.error("Error during update e-mail request:", error);
    } finally {
      // Re-enable the form and hide loading indicator
      submitButton.disabled = false;
    }
  });


});

async function sendUpdateProfileImage(variables) {
  const accessToken = getCookie("authToken");
  if (!accessToken) {
    throw new Error("Auth token is missing or invalid.");
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  let query =
    `mutation UpdateProfileImage ($img: String!){
      updateProfileImage(img: $img) {
          status
          ResponseCode
      }
    }`;

  try {
    const response = await fetch(GraphGL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    if (result.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
    }
    if (result.data.updateProfileImage.status == "error") {
      throw new Error(userfriendlymsg(result.data.updateProfileImage.ResponseCode));
    } else return result.data;
  } catch (error) {
    Merror("Update Profile Image failed", error);
    return false;
  }
}

async function sendUpdateUsername(username, password) {
  const accessToken = getCookie("authToken");
  if (!accessToken) {
    throw new Error("Auth token is missing or invalid.");
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  let query =
    `mutation UpdateUsername ($username: String!, $password: String!){
        updateUsername(username: $username, password: $password) {
            status
            ResponseCode
        }
      }`;

  try {
    const response = await fetch(GraphGL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query,
        variables: {
          username,
          password,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
    }
    return result.data;
  } catch (error) {
    Merror("Update username failed", error);
    return false;
  }
}

async function sendUpdatePassword(password, expassword) {
  const accessToken = getCookie("authToken");
  if (!accessToken) {
    throw new Error("Auth token is missing or invalid.");
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  let query =
    `mutation UpdatePassword ($password: String!, $expassword: String!){
        updatePassword(password: $password, expassword: $expassword) {
            status
            ResponseCode
        }
      }`;
  try {
    const response = await fetch(GraphGL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query,
        variables: {
          password,
          expassword,
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    if (result.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
    }
    return result.data;
  } catch (error) {
    Merror("Update password failed", error);
    return false;
  }
}

async function sendUpdateEmail(email, password) {
  const accessToken = getCookie("authToken");
  if (!accessToken) {
    throw new Error("Auth token is missing or invalid.");
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  let query =
    `mutation UpdateEmail ($email: String!, $password: String!){
        updateEmail(email: $email, password: $password) {
            status
            ResponseCode
        }
      }`;
  try {
    const response = await fetch(GraphGL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query,
        variables: {
          email,
          password,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    if (result.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
    }
    return result.data;
  } catch (error) {
    Merror("Update e-mail failed", error);
    // console.error("Error create Post:", error);
    return false;
  }
}

async function sendUpdateBio(biography) {
  const accessToken = getCookie("authToken");
  if (!accessToken) {
    throw new Error("Auth token is missing or invalid.");
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  let query =
    `mutation UpdateBio ($biography: String!){
        updateBio(biography: $biography) {
            status
            ResponseCode
        }
      }`;
  try {

    const response = await fetch(GraphGL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query,
        variables: {
          biography,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
    }
    return result.data;
  } catch (error) {
    Merror("Update Bio failed", error);
    // console.error("Error create Post:", error);
    return false;
  }
}

const logOutBtn = document.getElementById("logOut");
const modalOverlay = document.getElementById("modalOverlay");
const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
logOutBtn.addEventListener("click", function (event) {
  event.preventDefault();
  modalOverlay.classList.remove("none");
});
cancelLogoutBtn.addEventListener("click", function () {
  modalOverlay.classList.add("none");
});
confirmLogoutBtn.addEventListener("click", function () {
  clearCacheAndSession();
});

function clearCacheAndSession() {
  // Clear localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  // Delete all cookies
  document.cookie.split(";").forEach(function (cookie) {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  // Redirect to login
  window.location.href = "login.php";
}

function displayValidationMessage(message, elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.remove("error", "success", "notvalid");
    element.classList.add("notvalid");
    element.innerText = message;
  } else {
    console.error(`Element with ID "${elementId}" not found!`);
  }
}