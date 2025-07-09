document.addEventListener("DOMContentLoaded", () => {

  // document.getElementById("goToRegister")?.addEventListener("click", function (e) {
  //   e.preventDefault();
  //   resetToReferralStep();
  // });


  const urlParams = new URLSearchParams(window.location.search);
  const referralCodeFromRef = urlParams.get("ref");
  const referralCodeFromUuid = urlParams.get("referralUuid");

  const referralInputs = document.querySelectorAll("#referral_code");
  const validationMsg = document.getElementById("refValidationMessage");
  const staticUUID = "8e2b5672-84bd-4a5c-a5d0-f4bfc212ec2a";
  let autoFillCode = null;

  const formSteps = document.querySelectorAll(".form-step");
  const multiStepForm = document.getElementById("multiStepForm");
  const registerForm = document.getElementById("registerForm");
  const backBtn = document.getElementById("back-btn");
  const noCodeLink = document.getElementById("noCodeLink");
  const step1Section = document.querySelector('.form-step[data-step="1"]');
  const step2Section = document.querySelector('.form-step[data-step="2"]');
  const referralCode = referralCodeFromRef || referralCodeFromUuid;

  if (referralCode) {
    if (referralCodeFromUuid) {
      localStorage.setItem("referralUuid", referralCodeFromUuid);
    }

    referralInputs.forEach(input => input.value = referralCode);
    validateReferralCode(referralCode);
  }

  showStep(1);

  noCodeLink?.addEventListener("click", (e) => {
    e.preventDefault();
    autoFillCode = staticUUID;
    showStep(2);
  });

  multiStepForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!step1Section.classList.contains("none")) {
      const referralValue = referralInputs[0]?.value.trim();
      const isValid = validateReferralCode(referralValue);
      if (!isValid) return;

      const inputField = multiStepForm.querySelector(".input-field");
      const loader = inputField.querySelector(".loader");

      if (loader.style.display === "block") return;
      loader.style.display = "block";

      setTimeout(() => {
        loader.style.display = "none";
        multiStepForm.classList.add("none");
        registerForm.classList.remove("none");
        multiStepForm.reset();

        localStorage.setItem("isOnRegister", "true");
      }, 3000);
    }
  });

  backBtn.addEventListener("click", (e) => {
    const currentRegisterVisible = !registerForm.classList.contains("none");
    const currentMultiStepVisible = !multiStepForm.classList.contains("none");
    const currentStep = multiStepForm.querySelector('.form-step:not(.none)');
    const stepNumber = currentStep?.dataset.step;

    if (currentRegisterVisible) {
      e.preventDefault();
      localStorage.removeItem("isOnRegister");

      registerForm.classList.add("none");
      multiStepForm.classList.remove("none");

      const inputField = multiStepForm.querySelector(".input-field");
      const loader = inputField.querySelector(".loader");
      loader.style.display = "none";

      showStep(1);
    } else if (currentMultiStepVisible && stepNumber !== "1") {
      e.preventDefault();
      showStep(1);
    }
  });

  function showStep(step) {
    formSteps.forEach(section => {
      section.classList.toggle("none", section.dataset.step !== String(step));
    });
  }

  document.getElementById("submitStep2").addEventListener("click", function (e) {
    e.preventDefault();

    const inputField = step2Section.querySelector(".input-field");
    const loader = inputField.querySelector(".loader");

    if (loader.style.display === "block") return;
    loader.style.display = "block";

    setTimeout(() => {
      loader.style.display = "none";
      showStep(1);

      if (autoFillCode) {
        referralInputs.forEach(input => input.value = autoFillCode);
        validateReferralCode(autoFillCode);
      }
    }, 3000);
  });

  function validateReferralCode(code) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!code || !uuidRegex.test(code)) {
      if (validationMsg) {
        validationMsg.innerText = "Invalid or missing referral code.";
        validationMsg.classList.add("notvalid");
      }
      return false;
    } else {
      if (validationMsg) {
        validationMsg.innerText = "";
        validationMsg.classList.remove("notvalid");
      }
      return true;
    }
  }

  // const isOnRegister = localStorage.getItem("isOnRegister") === "true";
  // if (isOnRegister) {
  //   multiStepForm.classList.add("none");
  //   registerForm.classList.remove("none");
  // } else {
  //   showStep(1);
  // }

  document.getElementById("copyIcon").addEventListener("click", function () {
    const input = document.getElementById("referral_code");
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value);
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
      referralUuid: referralcode,
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

// Event-Listener für das Registrierungsformular, der ausgelöst wird, wenn das Formular abgeschickt wird
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const ageConfirmation = document.getElementById("ageConfirmation");
  const formSteps = ageConfirmation.querySelectorAll(".ageConfirm");
  const confirmButton = document.getElementById("confirmAge");
  const cancelButton = document.getElementById("cancelAge");
  const loaders = document.querySelectorAll(".regLoader");

  const passwordMinLength = 8;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

  function showAgeStep(stepNumber) {
    formSteps.forEach(section => {
      section.style.display = section.dataset.step === String(stepNumber) ? "flex" : "none";
    });

    const backBtn = document.getElementById("back-btn");
    const footer = document.querySelector(".footer"); 

    if (["1", "2", "3"].includes(String(stepNumber))) {
      backBtn?.classList.add("none");
      footer?.classList.add("none");
    } else {
      backBtn?.classList.remove("none");
      footer?.classList.remove("none");
    }
  }

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    clearValidationMessage("regValidationMessage");

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    // const registerBtn = document.getElementById("registerBtn");

    // const isFilled = username !== "" && email !== "" && password !== "" && confirmPassword !== "";
    // const isPasswordValid = password.length >= passwordMinLength && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
    // const isMatching = password === confirmPassword ;

    // if (isFilled && isPasswordValid && isMatching) {
    //    registerBtn.classList.remove('disabled');
    // }
    // else {
    //   registerBtn.classList.add('disabled');
    // }


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

    loaders.forEach(loader => {
      loader.classList.add("active");
    });
    setTimeout(() => {
      loaders.forEach(loader => {
        loader.classList.remove("active");
      });
      registerForm.classList.add("none");
      ageConfirmation.classList.remove("none");
      showAgeStep(1);
    }, 3000);
  });

  confirmButton.addEventListener("click", async () => {
    const referralCode = document.getElementById("referral_code").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loaders.forEach(loader => {
      loader.classList.add("active");
    });
    try {
      const status = await registerUser(email, password, username, referralCode);
      if (status === true) {
        loaders.forEach(loader => {
          loader.classList.add("active");
        });
        setTimeout(() => { 
          loaders.forEach(loader => {
            loader.classList.remove("active");
          });
          showAgeStep(3);
        }, 3000);
      } else {
        loaders.forEach(loader => {
          loader.classList.add("active");
        });
        setTimeout(() => { 
          loaders.forEach(loader => {
            loader.classList.remove("active");
          });
          ageConfirmation.classList.add("none");
          registerForm.classList.remove("none");
        }, 3000);
        
      }
      
    } catch (error) {
      console.error("Registration error:", error);
    }
  });

  cancelButton.addEventListener("click", () => {
    showAgeStep(2); // No registration called
  });
});



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
      const validationMessage = document.getElementById("finalValidationMessage");
      // console.log("Status:", status);
      // console.log("Error Message:", ResponseCode);
      if (status === "success") {
        // Erfolgreiche Verifizierung
        validationMessage.innerText = "";
        validationMessage.classList.add("validText");
        displayValidationMessage(userfriendlymsg(ResponseCode), "finalValidationMessage");
        // Optional: Weiterleitung oder andere Aktionen nach erfolgreicher Verifizierung
        // window.location.href = "login.php"; // Beispiel: Weiterleitung zur Login-Seite
      } else {
        // Fehler bei der Verifizierung
        validationMessage.innerText = "";
        validationMessage.classList.remove("validText");
      }
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



