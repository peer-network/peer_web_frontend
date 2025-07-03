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
// Eingabefeld abrufen
const usernameInput = document.getElementById("username");

// Event-Listener für die Überprüfung hinzufügen
usernameInput.addEventListener("input", function () {
  const value = usernameInput.value;

  // Regex für Buchstaben und Zahlen
  const regex = /^[a-zA-Z0-9]+$/;

  if (regex.test(value)) {
    usernameInput.parentElement.classList.add("valid");
    usernameInput.parentElement.classList.remove("invalid");
  } else {
    usernameInput.parentElement.classList.add("invalid");
    usernameInput.parentElement.classList.remove("valid");
  }
});

// Das Eingabefeld auswählen
// const inputField = document.querySelector(".input-field");
const emailField = document.getElementById("email");
const statusIcon = document.querySelector(".tick");

// Regulärer Ausdruck für E-Mail-Validierung
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Event-Listener für das Verlassen des Eingabefelds (blur)
emailField.addEventListener("input", function () {
  // Überprüfen, ob die E-Mail gültig ist
  if (emailRegex.test(emailField.value)) {
    // Gültige E-Mail: Klasse 'valid-email' hinzufügen und 'invalid-email' entfernen
    emailField.parentElement.classList.add("valid");
    emailField.parentElement.classList.remove("invalid");
  } else {
    // Ungültige E-Mail: Klasse 'invalid-email' hinzufügen und 'valid-email' entfernen
    emailField.parentElement.classList.add("invalid");
    emailField.parentElement.classList.remove("valid");
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

//     modal.classList.add("none"); // Hide modal
//     onConfirmCallback(); // Proceed with registration
//   });
// }
