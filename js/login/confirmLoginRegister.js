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
    button.disabled = true;
    button.classList.add('disabled'); 
  }

  function enableButton(button) {
    button.disabled = false;
    button.classList.remove('disabled');
  }

  
  // Das Eingabefeld auswählen
  // const inputField = document.querySelector(".input-field");
  const emailField = document.getElementById("email");
  const statusIcon = document.querySelector(".tick");
  const emailValidationIcon = document.getElementById("emailValidationIcon");
  const emailValidationMessage = document.getElementById("emailValidationMessage");


  if (emailField) {
    // Regulärer Ausdruck für E-Mail-Validierung
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Event-Listener für das Verlassen des Eingabefelds (blur)
    emailField.addEventListener("input", function () {
       const value = emailField.value.trim();
      // Überprüfen, ob die E-Mail gültig ist

      if (value === "") {
        emailValidationIcon.classList.add("none");
        emailValidationMessage.innerText = "";
        return;
      }

      if (emailRegex.test(emailField.value)) {
        emailValidationIcon.classList.remove("none");
        emailValidationMessage.innerText = "";
        // Gültige E-Mail: Klasse 'valid-email' hinzufügen und 'invalid-email' entfernen
        // emailField.parentElement.classList.add("valid");
        // emailField.parentElement.classList.remove("invalid");
      } else {
        // Ungültige E-Mail: Klasse 'invalid-email' hinzufügen und 'valid-email' entfernen
        // emailField.parentElement.classList.add("invalid");
        // emailField.parentElement.classList.remove("valid");
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
  }