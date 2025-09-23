document.addEventListener("DOMContentLoaded", () => {

  // document.getElementById("goToRegister")?.addEventListener("click", function (e) {
  //   e.preventDefault();
  //   resetToReferralStep();
  // });


  // referral.js
  const urlParams = new URLSearchParams(window.location.search);
  const referralCodeFromRef = urlParams.get("ref");
  const referralCodeFromUuid = urlParams.get("referralUuid");

  const referralInputs = document.getElementById("referral_code");
  const validationMsg = document.getElementById("refValidationMessage");
  const staticUUID = "85d5f836-b1f5-4c4e-9381-1b058e13df93";
  let autoFillCode = null;

  const formSteps = document.querySelectorAll(".referral_formStep");
  const multiStepForm = document.getElementById("multiStepForm");
  const registerForm = document.getElementById("registerForm");
  const backBtn = document.getElementById("back-btn");
  const noCodeLink = document.getElementById("noCodeLink");
  const step1Section = document.querySelector('.form-step[data-step="1"]');
  const step2Section = document.querySelector('.form-step[data-step="2"]');
  const referralCode = referralCodeFromRef || referralCodeFromUuid;

  // Autofill referral if code is in URL
  if (referralCode) {
    (async () => {
      referralInputs.value = referralCode;
      await validateReferralCode(referralCode);
    })();
  }

  // "No code" → use static UUID
  noCodeLink?.addEventListener("click", (e) => {
    e.preventDefault();
    autoFillCode = staticUUID;
    showReferralStep(2);
  });

  // Submit referral form (Step 1)
  document.getElementById("submitStep1").addEventListener("click", async (e) => {
    e.preventDefault();

      const referralValue = referralInputs.value.trim();
      const isValid = await validateReferralCode(referralValue);
      console.log("Referral code valid:", isValid);
      if (!isValid) return;
      multiStepForm.classList.add("none");
      registerForm.classList.remove("none");
      showRegister(true);
    
  });

  const ageConfirmation = document.getElementById("ageConfirmation");
  const confirmAgeBtn = document.getElementById("confirmAge");
  const cancelAgeBtn = document.getElementById("cancelAge");
  const ageSteps = ageConfirmation.querySelectorAll(".ageConfirm");
  const passwordMinLength = 8;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

  showAgeStep(1);
  
  // Handle "I am 18+"
  confirmAgeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    ageConfirmation.classList.add("none");
    multiStepForm.classList.remove("none");
    showReferralStep(1);
  });


  // Handle "No, I'm under 18"
  cancelAgeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showAgeStep(2);
  });

  // Register Form Submit
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    const referralCode = document.getElementById("referral_code").value.trim();
  

    // Validation
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
      return displayValidationMessage(userfriendlymsg("All fields must be filled out!!"), "regValidationMessage");
    }
    if (password.length < passwordMinLength) {
      return displayValidationMessage(userfriendlymsg("Password too short (min. 8 chars)!!"), "regValidationMessage");
    }
    if (!/[A-Z]/.test(password)) {
      return displayValidationMessage(userfriendlymsg("Add at least 1 uppercase letter!!"), "regValidationMessage");
    }
    if (!/\d/.test(password)) {
      return displayValidationMessage(userfriendlymsg("Add at least 1 number!!"), "regValidationMessage");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return displayValidationMessage(userfriendlymsg("Include a special character (!@#$...)!!"), "regValidationMessage");
    }
    if (!passwordRegex.test(password)) {
      return displayValidationMessage(userfriendlymsg("Password does not meet requirements!!"), "regValidationMessage");
    }
    if (password !== confirmPassword) {
      return displayValidationMessage(userfriendlymsg("Passwords do not match!!"), "confirmValidationMessage");
    }

    try {
      const status = await registerUser(email, password, username, referralCode);
      if (status === true) {
        registerForm.classList.add("none");
        ageConfirmation.classList.remove("none");
        showAgeStep(3);

        return;
      }
      
    } catch (error) {
      console.error("Registration error:", error);
    }
  });

  function showAgeStep(step) {
    ageSteps.forEach(section => {
      section.classList.toggle("none", section.dataset.step !== String(step));
    });
    updateFooterAndBack("age", step)
  }

  function showRegister(show) {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    if (show) {
      registerForm.classList.remove("none");
    } else {
      registerForm.classList.add("none");
    }
    updateFooterAndBack("register", null);
  }


  function updateFooterAndBack(currentContext, step) {
    const footer = document.querySelector(".footer");
    const backBtn = document.getElementById("back-btn");

    if (currentContext === "age") {
      if (step === 1) {
        footer?.classList.add("none");
        backBtn?.classList.remove("none");
      } else {
        footer?.classList.add("none");
        backBtn?.classList.add("none");
      }
    }

    if (currentContext === "referral") {
      if (!multiStepForm.classList.contains("none")) {
        footer?.classList.remove("none");
        backBtn?.classList.remove("none");
      } else {
        footer?.classList.add("none");
        backBtn?.classList.remove("none");
      }
    }

    if (currentContext === "register") {
      footer?.classList.add("none");
      backBtn?.classList.remove("none");
    }
  }


  backBtn.addEventListener("click", (e) => {
    const currentRegisterVisible = !registerForm.classList.contains("none");
    const currentMultiStepVisible = !multiStepForm.classList.contains("none");
    const currentStep = multiStepForm.querySelector('.form-step:not(.none)');
    const stepNumber = currentStep?.dataset.step;

    if (currentRegisterVisible) {
      e.preventDefault();
      registerForm.classList.add("none");
      multiStepForm.classList.remove("none");
      showReferralStep(1);
    } else if (currentMultiStepVisible && stepNumber !== "1") {
      e.preventDefault();
      showReferralStep(1);
    }
  });

  function showReferralStep(step) {
    formSteps.forEach(section => {
      section.classList.toggle("none", section.dataset.step !== String(step));
    });
    updateFooterAndBack("referral", step)
  } 

  document.getElementById("submitStep2").addEventListener("click", async function (e) {
    e.preventDefault();
    showReferralStep(1);
    if (autoFillCode) {
      referralInputs.value = autoFillCode;
      await validateReferralCode(autoFillCode);
    }
  });


  async function validateReferralCode(referralString) {
    const accessToken = getCookie("authToken");
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!referralString || !uuidRegex.test(referralString)) {
      if (validationMsg) {
        validationMsg.innerText = "Invalid or missing referral code format.";
        validationMsg.classList.add("notvalid");
      }
      return false;
    }
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    const graphql = JSON.stringify({
      query: `mutation VerifyReferralString ($referralString: String!) {
          verifyReferralString(referralString: $referralString) {
            ResponseCode
            affectedRows {
              uid
              username
              slug
              img
            }
            status
          }
        }`,
      variables: {
      referralString,
      },
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: graphql,
      redirect: "follow",
    };

    

    try {
      const response = await fetch(GraphGL, requestOptions);
      const result = await response.json();
      const data = result?.data?.verifyReferralString;

      if (data && data.status === "success") {
        if (validationMsg) {
          validationMsg.innerText = ""; 
          validationMsg.classList.remove("notvalid");
        }
        return true;
      } else {
        if (validationMsg) {
          validationMsg.innerText = userfriendlymsg(data.ResponseCode);
          validationMsg.classList.add("notvalid");
        }
        return false;
      }

    } catch (error) {
      console.error("Error verifying referral code:", error);
      if (validationMsg) {
        validationMsg.innerText = "Error verifying referral code.";
        validationMsg.classList.add("notvalid");
      }
      return false;
    }
  }


  // const isOnRegister = localStorage.getItem("isOnRegister") === "true";
  // if (isOnRegister) {
  //   multiStepForm.classList.add("none");
  //   registerForm.classList.remove("none");
  // } else {
  //   showStep(1);
  // }

  document.querySelectorAll(".copy").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.closest("div").querySelector(".referral_code");
      if (!input) return;

      let textToCopy = "";

      if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
        input.focus();
        input.select();
        input.setSelectionRange(0, 99999);
        textToCopy = input.value;
      } else {
        textToCopy = input.textContent;
      }

      navigator.clipboard.writeText(textToCopy)
        .then(() => console.log("Referral code copied!"))
        .catch(err => console.error("Failed to copy:", err));
    });
  });


});



// Asynchrone Funktion, um einen Benutzer zu registrieren
async function registerUser(email, password, username, referralcode) {
   
  // GraphQL-Mutation für die Registrierung eines Benutzers
  const query = `
        mutation Register($input: RegistrationInput!) {
            register(input: $input) {
                status
                ResponseCode
                userid
            }
        }
    `;
  // mutation Register {
  //     register(input: { email: "hu@bu.de", password: "1234567oO#", username: "olli" }) {
  //         status
  //         ResponseCode
  //         userid
  //     }
  // }
  // Variablen, die an die Mutation übergeben werden (E-Mail, Passwort, Benutzername)
  const variables = {
    input: {
      email: email,
      password: password,
      username: username,
      pkey: null,
      referralUuid:referralcode,
    },
  };

  try {
    // API-Anfrage an den GraphQL-Server
    const response = await fetch(GraphGL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Konvertierung der Mutation und Variablen in JSON-Format
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });

    // Überprüfen, ob die HTTP-Antwort erfolgreich war
    if (!response.ok) {
      throw new Error(`HTTP Fehler! Status: ${response.status}`);
    }

    // Das Ergebnis als JSON parsen
    const result = await response.json();

    // Erfolgreiche Registrierung
    if (result.data.register.status === "success") {
      // console.log("Registrierung erfolgreich! Benutzer-ID:", result.data.register.userid);
      // validationMessage.innerText = "";
      // validationMessage.classList.add("validText");
      // displayValidationMessage(userfriendlymsg("User registered successfully"), "ageValidationMessage");
      // displayValidationMessage(userfriendlymsg(result.data.register.ResponseCode), "ageValidationMessage");
      // Benutzer nach erfolgreicher Registrierung verifizieren
      verifyUser2(result.data.register.userid);
      return true;
    }
    // Fehler: Benutzername bereits vergeben
    else {
      // Merror("Register failed", result.data.register.ResponseCode);
      validationMessage.classList.remove("validText");
      displayValidationMessage("Registration failed. " + userfriendlymsg(result.data.register.ResponseCode), "regValidationMessage");
      console.error("Register failed:" + result.data.register.ResponseCode);
      return false;
    }
  } catch (error) {
    // Fehlerbehandlung bei Netzwerkfehlern oder anderen Problemen
    console.error("An Error occured:", error);
  }
}


// Asynchrone Funktion, um einen Benutzer nach der Registrierung zu verifizieren
async function verifyUser2(userid) {
  // Definiere den GraphQL-Mutation-Query mit einer Variablen
  const query = `
    mutation VerifiedAccount($userId: ID!) {
      verifyAccount(userid: $userId) {
        status
        ResponseCode
      }
    }
  `;

  // Setze die Variable für den Request
  const variables = { userId: userid };

  // Ersetze die URL mit der deines GraphQL-Endpunkts
  fetch(GraphGL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Mutation result:", data);
      // Ergebnis der Mutation verarbeiten
      const { status, ResponseCode } = data.data.verifyAccount;
      // const validationMessage = document.getElementById("finalValidationMessage");
      // console.log("Status:", status);
      // console.log("Error Message:", ResponseCode);
      // if (status === "success") {
      //   // Erfolgreiche Verifizierung
      //   validationMessage.innerText = "";
      //   validationMessage.classList.add("validText");
      //   displayValidationMessage(userfriendlymsg(ResponseCode), "finalValidationMessage");
      //   // Optional: Weiterleitung oder andere Aktionen nach erfolgreicher Verifizierung
      //   // window.location.href = "login.php"; // Beispiel: Weiterleitung zur Login-Seite
      // } else {
      //   // Fehler bei der Verifizierung
      //   validationMessage.innerText = "";
      //   validationMessage.classList.remove("validText");
      // }
    })
    .catch((error) => {
      // Fehlerbehandlung
      console.error("Error:", error);
    });
}

// Funktion, um einen Cookie-Wert anhand des Cookie-Namens zu erhalten
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}



