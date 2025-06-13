
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("forgotpasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form reload

    // Retrieve input values for email and password
    const email = document.getElementById("email").value;
    const sentcode_msg = document.getElementById("sentcode_msg");
    const verifycodeFormID = document.getElementById("verifycodeForm");
    
      const loader = this.querySelector(".loader"); // Get the loader inside the form
      if (loader) {
        loader.classList.add("active"); // Show the loader
      }

      const validmsg = document.getElementById("validationMessage");
      validmsg.innerText = "";

    // Disable form and show loading indicator (optional UI improvement)
    const submitButton = document.getElementById("submit");
    submitButton.disabled = true;

    try {
      // Attempt to register the user after passing validations
      const result = await forgotpasswordRequest(email);

      // Handle successful registration (e.g., redirect or display success message)
      if (result.status === "success" && result.ResponseCode === "11901") {
       
        //console.log(userfriendlymsg(result.ResponseCode));
            // Delay execution
          setTimeout(() => {
            document.getElementById("forgotpasswordForm").classList.toggle('hide');
            // ✅ Remove loader after delay
            if (loader) loader.classList.remove("active");
            if (verifycodeFormID) {
              verifycodeFormID.classList.toggle('hide');
            }

            if (sentcode_msg) {
              const maskedEmail = maskEmail(email);
              sentcode_msg.innerHTML = `We sent a code to your email ${maskedEmail}. Please, enter the code to change your password.`;
            }

            // Start 3 minute countdown
            const timeDisplay = document.getElementById("timecounter");
            const resendButton = document.getElementById("send_again");
            startCountdown(180, timeDisplay, resendButton);

            

          }, 500); // 2000ms = 2 seconds
      
      } else {
        //console.log(userfriendlymsg(result.ResponseCode));
        displayValidationMessage(userfriendlymsg(result.ResponseCode) || "Fehler beim Login.");
        if (loader) {
          loader.classList.remove("active"); // Hide the loader
        }
      }
    } catch (error) {
      console.error("Error during forgotpassword request:", error);
      if (loader) {
        loader.classList.remove("active"); // Hide the loader
      }
      
    } finally {
      // Re-enable the form and hide loading indicator
      submitButton.disabled = false;
      
    }
  });

  document.getElementById("send_again").addEventListener("click", function (e) {
    e.preventDefault();

    // Check if button has "disable" class
    if (!this.classList.contains("disable")) {
      const msgElem_wrong_code        = document.getElementById("response_msg_wrong_code");
      msgElem_wrong_code.classList.remove("error", "success");
      msgElem_wrong_code.innerHTML = "";
      const verification_code        = document.getElementById("verification_code");
      verification_code.value="";
      document.getElementById("forgotpasswordForm").classList.toggle('hide');
       document.getElementById("verifycodeForm").classList.toggle('hide');
      // Trigger submit of #forgotpasswordForm
      //document.getElementById("forgotpasswordForm").requestSubmit();
    }
  });

  document.getElementById("verifycodeForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form reload

    const code = document.getElementById("verification_code").value.trim();
        const loader = this.querySelector(".loader"); // Get the loader inside the form
      if (loader) {
        loader.classList.add("active"); // Show the loader
      }

    // Optional: only proceed if code is at least 4 characters (or whatever length you want)
    if (code.length >= 10) {
        setTimeout(() => {
          // Store code in localStorage
          localStorage.setItem("verificationcode", code);

          // Hide the verify code form
          const verifycodeForm = document.getElementById("verifycodeForm");
          if (verifycodeForm) verifycodeForm.classList.add("hide");

          const msgElem_cp = document.getElementById("response_msg_change_password");
          msgElem_cp.classList.remove("error", "success");
          msgElem_cp.innerHTML = "";

          const msgElem_wrong_code        = document.getElementById("response_msg_wrong_code");
          msgElem_wrong_code.classList.remove("error", "success");
          msgElem_wrong_code.innerHTML = "";

          // reset fields
              ["new_password","repeat_password"].forEach(id => 
                document.getElementById(id).value = ""
              );
          if (loader) {
            loader.classList.remove("active"); // Show the loader
          }
          // Show the reset password form
          const resetpasswordForm = document.getElementById("resetpasswordForm");
          if (resetpasswordForm) resetpasswordForm.classList.remove("hide");


        }, 2000); // 2000ms = 2 seconds
    }
  });


  document.getElementById("resetpasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form reload

    // Retrieve input values for email and password
    const new_password = document.getElementById("new_password").value;
    const repeat_password = document.getElementById("repeat_password").value;
    const msgElem         = document.getElementById("response_msg_change_password");
    const msgElem_wrong_code        = document.getElementById("response_msg_wrong_code");

    const verifycodeForm = document.getElementById("verifycodeForm");
    const resetpasswordForm = document.getElementById("resetpasswordForm");
    const password_changed_success = document.getElementById("password_changed_success");

    const token = localStorage.getItem("verificationcode");
    
      // clear out any old message classes
      msgElem.classList.remove("error", "success");
      msgElem.innerHTML = "";

    //  Check match:
      if (new_password !== repeat_password) {
        msgElem.classList.add("error");
        msgElem.innerHTML = "Passwords do not match";
        return; // stop here
      }

      // Password validation
        const passwordMinLength = 8; // Minimum password length
        const passwordRegex = /^(?=.*[A-Z]).+$/; // Must contain at least one capital letter

      // Check if the password meets the minimum length
      if (new_password.length < passwordMinLength) {
        msgElem.classList.add("error");
        msgElem.innerHTML = "The password must be at least 8 characters long!";
        
        return;
      }

      // Check if the password contains a capital letter
      if (!passwordRegex.test(new_password)) {
        msgElem.classList.add("error");
        msgElem.innerHTML = "The password must contain at least one capital letter!";
        
        return;
      }
  

    // Disable form and show loading indicator (optional UI improvement)
    const submitButton = document.getElementById("resetpassword");
    submitButton.disabled = true;

    try {
      // Attempt to register the user after passing validations
      const result = await resetpasswordRequest(token,new_password);

      // Handle successful registration (e.g., redirect or display success message)
      if (result.status === "success" && result.ResponseCode === "11005") {
        
        
        // reset fields
          ["new_password","repeat_password"].forEach(id => 
            document.getElementById(id).value = ""
          );
          localStorage.removeItem("verificationcode");
          msgElem.classList.add("success");

          //Show Success Container
          
          if (password_changed_success) password_changed_success.classList.remove("hide");
          
          // Hide the resetpasswordForm 
          
          if (resetpasswordForm) resetpasswordForm.classList.add("hide");

      
      }else if(result.ResponseCode === "31904") { //wrong code or  code expire
          msgElem.classList.add("error");
          msgElem_wrong_code.classList.add("error");
          msgElem_wrong_code.innerHTML = userfriendlymsg(result.ResponseCode);
          
          // Show the verify code form
        
          if (verifycodeForm) verifycodeForm.classList.remove("hide");
          // Hide the resetpasswordForm 
          
          if (resetpasswordForm) resetpasswordForm.classList.add("hide");



      }else {
        msgElem.classList.add("error");
      }

      msgElem.innerHTML = userfriendlymsg(result.ResponseCode);

    } catch (error) {
      console.error("Error during resetpassword request:", error);
      
    } finally {
      // Re-enable the form and hide loading indicator
      submitButton.disabled = false;
    }
  });
});



async function forgotpasswordRequest(email) {
  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `mutation RequestPasswordReset($email: String!) {
      requestPasswordReset(email: $email) {
        status
        ResponseCode
      }
    }`,
    variables: {
      email,
    },
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

    const {
      status,
      ResponseCode      
    } = result.data.requestPasswordReset;

   

    

    // console.log("ResponseCode:", ResponseCode);
   
    return {
      status,
      ResponseCode      
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

async function resetpasswordRequest(token,password) {
  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `mutation ResetPassword($token: String!,$password: String!) {
      resetPassword(token: $token,password: $password) {
        status
        ResponseCode
      }
    }`,
    variables: {
      token,
      password,
    },
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

    const {
      status,
      ResponseCode      
    } = result.data.resetPassword;

   

    

    // console.log("ResponseCode:", ResponseCode);
   
    return {
      status,
      ResponseCode      
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
function maskEmail(email) {
  const [user, domain] = email.split("@");
  const maskedUser = user.length <= 2
    ? "*".repeat(user.length)
    : user.slice(0, 2) + "*".repeat(user.length - 2);
  return `${maskedUser}@${domain}`;
}
function startCountdown(duration, display, button) {
  let timer = duration, minutes, seconds;

  button.classList.add("disable"); // Disable send_again button

  const countdownInterval = setInterval(() => {
    minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    seconds = String(timer % 60).padStart(2, "0");

    display.textContent = `in ${minutes}:${seconds}`;

    if (--timer < 0) {
      clearInterval(countdownInterval);
      //button.disabled = false;
      button.classList.remove("disable");
      display.textContent = "";
    }
  }, 1000);
}

