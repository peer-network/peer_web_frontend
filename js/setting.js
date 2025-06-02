
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
      form.querySelectorAll('input[required]').forEach(input =>
        input.addEventListener('input', () => updateSubmitButtonState(form, submitBtn))
      );
    });
  


  getUser().then(profile2 => {


  const pusername = document.getElementById("pusername"); 
  pusername.innerText = profile2.data.getProfile.affectedRows.username; 

  const img = document.getElementById("myprofilbild");
    img.onerror = function () {
      this.src = "svg/noname.svg";
    };

  img.src = profile2.data.getProfile.affectedRows.img ? tempMedia(profile2.data.getProfile.affectedRows.img.replace("media/", "")) : "svg/noname.svg";

  const bioPath = profile2.data.getProfile.affectedRows.biography;
  // Check if bioPath is valid
  if (bioPath) {
  const fullPath = tempMedia(profile2.data.getProfile.affectedRows.biography);


    fetch(fullPath , { cache: "no-store" })
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
  } else {
    //document.getElementById("biography").innerText = "No biography found";
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
    event.preventDefault(); // Prevent form reload
    // You can process or upload the final image here
    //alert("Image applied!");
    /*console.log(scale);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set the canvas size to the crop box size
    const cropBoxSize = 600; // Adjust to match your crop area
    canvas.width = cropBoxSize;
    canvas.height = cropBoxSize;

    // Calculate crop position
    const imgWidth = previewImage.naturalWidth;
    const imgHeight = previewImage.naturalHeight;

    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    const dx = (scaledWidth - cropBoxSize) / 2;
    const dy = (scaledHeight - cropBoxSize) / 2;

    ctx.drawImage(
      previewImage,
      -dx, -dy, // Move image to center
      scaledWidth, scaledHeight // Apply zoom
    );

    // Convert canvas to base64 and apply to profile image
    const croppedBase64 = canvas.toDataURL("image/png");
    
    
    document.getElementById("profilbild").src = croppedBase64;
    modal.style.display = "none";
    */

    const newImageSrc = previewImage.src;
    document.getElementById("myprofilbild").src = newImageSrc;
    modal.style.display = "none";
  });

  document.getElementById("saveprofileBtn").addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent form reload
    const biographyText = document.getElementById("biography").value.trim();
    const imageWrappers = document.querySelectorAll(".my-profile-picture");
    const base64Image = Array.from(imageWrappers)
    .map((img) => img.src)
    .find((src) => src.startsWith("data:image/"));
    //console.log(base64Image);
    
    // If no image and no biography, do nothing
    if (!base64Image && !biographyText) {
     // console.warn("No image or biography to update.");
      return;
    }
    
    // Encode biography to base64 and format as required
    const base64Biography = biographyText
    ? `data:text/plain;base64,${btoa(unescape(encodeURIComponent(biographyText)))}`
    : null;

 try {
      

      // Call both functions in parallel
      const [imageResult, bioResult] = await Promise.all([
        base64Image
          ? sendUpdateProfileImage({ img: base64Image })
          : Promise.resolve({ updateProfileImage: { status: "success", ResponseCode: "11004" } }),
        base64Biography
          ? sendUpdateBio(base64Biography)
          : Promise.resolve({ updateBio: { status: "success",ResponseCode: "11003" } }),
      ]);

      console.log(base64Biography);

      const imageSuccess =
        imageResult.updateProfileImage.status === "success" &&
        imageResult.updateProfileImage.ResponseCode === "11004";
      const bioSuccess = 
        bioResult.updateBio.status === "success" &&
        bioResult.updateBio.ResponseCode === "11003";

      if (imageSuccess && bioSuccess) {
        location.reload();
      } else {
        console.error("One or both updates failed.");
      }
  

      
    } catch (error) {
      console.error("Error during update profile request:", error);
      
    } finally {
      // Re-enable the form and hide loading indicator
      //submitButton.disabled = false;
    }


  });
  document.getElementById("changeusernameForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form reload
    // Retrieve input values for form
    const username = document.getElementById("newusername").value;
    const password = document.getElementById("password").value;
    // Disable form and show loading indicator (optional UI improvement)
    const submitButton = document.getElementById("changeUserBtn");
    submitButton.disabled = true;
    try {
      // Attempt to change the username after passing validations
      const result = await sendUpdateUsername(username, password);
      //console.log(result.updateUsername.ResponseCode);
      if (result.updateUsername.status === "success" && result.updateUsername.ResponseCode === "11007") {
        //  Reset the input field
        document.getElementById("newusername").value = "";
        document.getElementById("password").value = "";
        document.getElementById("response_msg_change_username").classList.add(result.updateUsername.status);
        document.getElementById("response_msg_change_username").innerHTML = userfriendlymsg(result.updateUsername.ResponseCode);
        setTimeout(() => {
          location.reload();
        }, 1000);

      }else{
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

    const expassword      = document.getElementById("old_password").value.trim();
    const newpassword     = document.getElementById("new_password").value.trim();
    const repeatpassword  = document.getElementById("repeat_password").value.trim();
    const msgElem         = document.getElementById("response_msg_change_password");
    const submitButton    = document.getElementById("changePasswordBtn");

    // clear out any old message classes
    msgElem.classList.remove("error", "success");
    msgElem.innerHTML = "";

    //  Check match:
    if (newpassword !== repeatpassword) {
      msgElem.classList.add("error");
      msgElem.innerHTML = "Passwords do not match";
      return; // stop here
    }

    // Password validation
      const passwordMinLength = 8; // Minimum password length
      const passwordRegex = /^(?=.*[A-Z]).+$/; // Must contain at least one capital letter

    // Check if the password meets the minimum length
    if (newpassword.length < passwordMinLength) {
      msgElem.classList.add("error");
      msgElem.innerHTML = "The password must be at least 8 characters long!";
      
      return;
    }

    // Check if the password contains a capital letter
    if (!passwordRegex.test(newpassword)) {
      msgElem.classList.add("error");
      msgElem.innerHTML = "The password must contain at least one capital letter!";
      
      return;
    }

    //  disable button while we wait
    submitButton.disabled = true;

    try {
      const result = await sendUpdatePassword(newpassword, expassword);
      const { status, ResponseCode } = result.updatePassword;

      if (status === "success" && ResponseCode === "11005") {
        // reset fields
        ["old_password","new_password","repeat_password"].forEach(id => 
          document.getElementById(id).value = ""
        );
        msgElem.classList.add("success");
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
    const password = document.getElementById("yourpassword").value;
    const msgElem   = document.getElementById("response_msg_change_email");
   
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
      const result = await sendUpdateEmail(email, password);
      const { status, ResponseCode } = result.updateEmail;

      if (status === "success" && ResponseCode === "11006") {
        // reset fields
        ["new_email","yourpassword"].forEach(id => 
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
      console.log("Mutation Result:", result.data);

      if (result.data.updateProfileImage.status == "error") {
        throw new Error(userfriendlymsg(result.data.updateProfileImage.ResponseCode));
      } else return result.data;
    } catch (error) {
      Merror("Update Profile Image failed", error);
      // console.error("Error create Post:", error);
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
      console.log("Mutation Result:", result.data);

      return result.data;

    } catch (error) {
      Merror("Update username failed", error);
      // console.error("Error create Post:", error);
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
      console.log("Mutation Result:", result.data);

      return result.data;

    } catch (error) {
      Merror("Update password failed", error);
      // console.error("Error create Post:", error);
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
      console.log("Mutation Result:", result.data);

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
      console.log("Mutation Result:", result.data);

      return result.data;

    } catch (error) {
      Merror("Update e-mail failed", error);
      // console.error("Error create Post:", error);
      return false;
    }
}


// logout functionality
document.addEventListener("DOMContentLoaded", function () {
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

  // Confirm button redirects to login
  confirmLogoutBtn.addEventListener("click", function () {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "login.php"; 
  });
});


