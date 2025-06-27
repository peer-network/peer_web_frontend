// Utility functions for UI feedback
function displayValidationMessage(message) {
    let element;
    // Display error message in the UI (instead of using alert)
    element = document.getElementById("validationMessage");
    element.classList.add("notvalid");
    element.innerText = message;
  }
  // Das Eingabefeld auswählen
  const inputField = document.querySelector(".input-field");
  const emailField = document.getElementById("email");
  const statusIcon = document.querySelector(".tick");
  if (emailField && inputField ) {
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

    emailField.addEventListener("focus", function () {
      inputField.classList.add("focused");
    });

    emailField.addEventListener("blur", function () {
      inputField.classList.remove("focused");
    });
    
    // Optional: Entfernen der Klassen bei Fokus (zurücksetzen des Felds)
    emailField.addEventListener("focus", function () {
      emailField.parentElement.classList.remove("valid", "invalid");
    }); 
  }

  const passField = document.querySelector(".password-field");
  const passwordField = document.getElementById("password");
  if (passwordField && passField) {
    // Regulärer Ausdruck für Passwort-Validierung: Mindestens 8 Zeichen, 1 Großbuchstabe, 1 Zahl
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    // Event-Listener für das Verlassen des Eingabefelds (blur)
    passwordField.addEventListener("input", function () {
      document.getElementById("validationMessage").innerText="";
      document.getElementById("validationMessage").classList.remove("notvalid");
      // Überprüfen, ob das Passwort gültig ist
      if (passwordRegex.test(passwordField.value)) {
        // Gültiges Passwort: Klasse 'valid-password' hinzufügen und 'invalid-password' entfernen
        passwordField.parentElement.classList.add("valid");
        passwordField.parentElement.classList.remove("invalid");
      } else {
        // Ungültiges Passwort: Klasse 'invalid-password' hinzufügen und 'valid-password' entfernen
        passwordField.parentElement.classList.add("invalid");
        passwordField.parentElement.classList.remove("valid");
      }
    });

    passwordField.addEventListener("focus", function () {
      passField.classList.add("focused");
    });

    passwordField.addEventListener("blur", function () {
      passField.classList.remove("focused");
    });
    
    // Optional: Entfernen der Klassen bei Fokus (zurücksetzen des Felds)
    passwordField.addEventListener("focus", function () {
      passwordField.parentElement.classList.remove("valid", "invalid");
    });
  }

  const togglePasswordIcon = document.getElementById("togglePassword");
  togglePasswordIcon.addEventListener("click", function () {
    const isPasswordVisible = passwordField.type === "text";

    passwordField.type = isPasswordVisible ? "password" : "text";

    // Swap icon image
    togglePasswordIcon.src = isPasswordVisible
      ? "svg/seePass.png"          // Hidden → show "eye"
      : "svg/hidePass.png";   // Visible → show "eye with slash"
  });