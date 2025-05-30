// Utility functions for UI feedback
function displayValidationMessage(message) {
  let element;
  // Display error message in the UI (instead of using alert)
  element = document.getElementById("validationMessage");
  element.classList.add("notvalid");
  element.innerText = message;
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
const emailField = document.getElementById("email");

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

// Optional: Entfernen der Klassen bei Fokus (zurücksetzen des Felds)
emailField.addEventListener("focus", function () {
  emailField.parentElement.classList.remove("valid", "invalid");
});

const passwordField = document.getElementById("password");
const passwordConfirm = document.getElementById("confirm_password");

// Regulärer Ausdruck für Passwort-Validierung: Mindestens 8 Zeichen, 1 Großbuchstabe, 1 Zahl
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
if (passwordConfirm) {
  passwordConfirm.addEventListener("input", function () {
    document.getElementById("validationMessage").innerText = "";
    document.getElementById("validationMessage").classList.remove("notvalid");
    // Überprüfen, ob das Passwort gültig ist
    if (passwordRegex.test(passwordConfirm.value) && passwordConfirm.value === passwordField.value) {
      // Gültiges Passwort: Klasse 'valid-password' hinzufügen und 'invalid-password' entfernen
      passwordConfirm.parentElement.classList.add("valid");
      passwordConfirm.parentElement.classList.remove("invalid");
    } else {
      // Ungültiges Passwort: Klasse 'invalid-password' hinzufügen und 'valid-password' entfernen
      passwordConfirm.parentElement.classList.add("invalid");
      passwordConfirm.parentElement.classList.remove("valid");
    }
  });
}
// Event-Listener für das Verlassen des Eingabefelds (blur)
passwordField.addEventListener("input", function () {
  document.getElementById("validationMessage").innerText = "";
  document.getElementById("validationMessage").classList.remove("notvalid");
  // Überprüfen, ob das Passwort gültig ist
  if (passwordRegex.test(passwordField.value)) {
    // Gültiges Passwort: Klasse 'valid-password' hinzufügen und 'invalid-password' entfernen
    passwordField.parentElement.classList.add("valid");
    passwordField.parentElement.classList.remove("invalid");
    if (passwordConfirm.value === passwordField.value) {
      passwordConfirm.parentElement.classList.add("valid");
      passwordConfirm.parentElement.classList.remove("invalid");
    } else {
      passwordConfirm.parentElement.classList.add("invalid");
      passwordConfirm.parentElement.classList.remove("valid");
    }
  } else {
    // Ungültiges Passwort: Klasse 'invalid-password' hinzufügen und 'valid-password' entfernen
    passwordField.parentElement.classList.add("invalid");
    passwordField.parentElement.classList.remove("valid");
  }
});

// Optional: Entfernen der Klassen bei Fokus (zurücksetzen des Felds)
passwordField.addEventListener("focus", function () {
  passwordField.parentElement.classList.remove("valid", "invalid");
});
