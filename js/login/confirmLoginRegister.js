// Utility functions for UI feedback
function displayValidationMessage(message) {
    let element;
    // Display error message in the UI (instead of using alert)
    element = document.getElementById("validationMessage");
    element.classList.add("notvalid");
    element.innerText = message;
  }

  function clearValidationMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerText = "";
      element.classList.remove("notvalid");
    }
  }
  
  // Das Eingabefeld auswählen
  // const inputField = document.querySelector(".input-field");
  const emailField = document.getElementById("email");
  const statusIcon = document.querySelector(".tick");
  if (emailField) {
    // Regulärer Ausdruck für E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Event-Listener für das Verlassen des Eingabefelds (blur)
    emailField.addEventListener("input", function () {
      // Überprüfen, ob die E-Mail gültig ist
      if (emailRegex.test(emailField.value)) {
        // Gültige E-Mail: Klasse 'valid-email' hinzufügen und 'invalid-email' entfernen
        emailField.parentElement.classList.add("valid");
        emailField.parentElement.classList.remove("invalid");
        return displayValidationMessage(userfriendlymsg("Please enter a valid email."), "emailValidationMessage");
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
  }