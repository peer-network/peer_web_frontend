// Utility functions for UI feedback
function displayValidationMessage(message, elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add("notvalid");
    element.innerText = message;
  } else {
    console.warn(`Element with ID "${elementId}" not found.`);
  }
}

function clearValidationMessage(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerText = "";
    element.classList.remove("notvalid");
  }
}

function disableButton(button) {
  if (button && (button.type === "submit")) {
    button.disabled = true;
    button.classList.add("disabled");
  }
}

function enableButton(button) {
  if (button && (button.type === "submit")) {
    button.disabled = false;
    button.classList.remove("disabled");
  }
}


// Eingabefeld abrufen
const usernameInput = document.getElementById("username");
const userValidationIcon = document.getElementById("userValidationIcon");
const userlValidationMessage = document.getElementById("userValidationMessage");

// Event-Listener für die Überprüfung hinzufügen
usernameInput.addEventListener("input", function () {
  const value = usernameInput.value;

  // Regex für Buchstaben und Zahlen
  const regex = /^[a-zA-Z][a-zA-Z0-9_]{5,20}$/;

  if (value === "") {
    userValidationIcon.classList.add("none");
    userlValidationMessage.innerText = "";
    return;
  }
  
  if (regex.test(value)) {
    userlValidationMessage.innerText = "";
    userValidationIcon.classList.remove("none");
    // usernameInput.parentElement.classList.add("valid");
    // usernameInput.parentElement.classList.remove("invalid");
  } else {
    userValidationIcon.classList.add("none");
    return displayValidationMessage(userfriendlymsg("Username too short (min. 5 chars)"), "userValidationMessage");
    // usernameInput.parentElement.classList.add("invalid");
    // usernameInput.parentElement.classList.remove("valid");
  }
});

// Das Eingabefeld auswählen
// const inputField = document.querySelector(".input-field");
const emailField = document.getElementById("email");
const statusIcon = document.querySelector(".tick");
const emailValidationIcon = document.getElementById("emailValidationIcon");
const emailValidationMessage = document.getElementById("emailValidationMessage");

// Regulärer Ausdruck für E-Mail-Validierung
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Event-Listener für das Verlassen des Eingabefelds (blur)
emailField.addEventListener("input", function () {
  const value = emailField.value.trim();

  if (value === "") {
    emailValidationIcon.classList.add("none");
    emailValidationMessage.innerText = "";
    return;
  }

  if (emailRegex.test(value)) {
    emailValidationIcon.classList.remove("none");
    emailValidationMessage.innerText = "";
  } else {
    emailValidationIcon.classList.add("none");
    return displayValidationMessage(userfriendlymsg("Please enter a valid email."), "emailValidationMessage");
  }
});


// emailField.addEventListener("focus", function () {
//   inputField.classList.add("focused");
// });

// emailField.addEventListener("blur", function () {
//   inputField.classList.remove("focused");
// });

// Optional: Entfernen der Klassen bei Fokus (zurücksetzen des Felds)
emailField.addEventListener("focus", function () {
  emailField.parentElement.classList.remove("valid", "invalid");
});


// function showRegisterConfirmationModal(onConfirmCallback) {
//   const modal = document.getElementById("modalOverlay");
//   const confirmBtn = document.getElementById("confirmSubmit");
//   const botCheckbox = document.getElementById("notBot");
//   const ageCheckbox = document.getElementById("ageCheck");

//   // Show modal
//   modal.classList.remove("none");

//   modal.addEventListener("click", function (event) {
//     if (event.target === modal) {
//       modal.classList.add("none");
//     }
//   });

//   // Remove previous event listener (if any)
//   const newConfirmBtn = confirmBtn.cloneNode(true);
//   confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

//   newConfirmBtn.addEventListener("click", function () {
//     if (!botCheckbox.checked || !ageCheckbox.checked) {
//       Merror("Please confirm that you are not a bot and that you are at least 18+ years old.");
//       return;
//     }


//    modal.classList.add("none"); // Hide modal
//     onConfirmCallback(); // Proceed with registration
//   });
// }

