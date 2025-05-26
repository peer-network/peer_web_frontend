// Asynchrone Funktion, um einen Benutzer zu registrieren
async function registerUser(email, password, username) {
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
      console.log("Registrierung erfolgreich! Benutzer-ID:", result.data.register.userid);
      // Benutzer nach erfolgreicher Registrierung verifizieren
      verifyUser2(result.data.register.userid);
    }
    // Fehler: Benutzername bereits vergeben
    else {
      // Merror("Register failed", result.data.register.ResponseCode);
      Merror("Register failed", userfriendlymsg(result.data.register.ResponseCode));
      console.error("Register failed:" + result.data.register.ResponseCode);
    }
  } catch (error) {
    // Fehlerbehandlung bei Netzwerkfehlern oder anderen Problemen
    console.error("Ein Fehler ist aufgetreten:", error);
  }
}

// Event-Listener für das Registrierungsformular, der ausgelöst wird, wenn das Formular abgeschickt wird
document.getElementById("registerForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form reload

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  // Validation
  const passwordMinLength = 8;
  const passwordRegex = /^(?=.*[A-Z]).+$/;

  if (password.length < passwordMinLength) {
    info("The password must be atleast 8 characters long!");
    return;
  }

  if (!passwordRegex.test(password)) {
    info("The password must contain atleast one Uppercase letter!");
    return;
  }

  if (password !== confirmPassword) {
    info("Passwords do not macth!");
    return;
  }

  // Show modal confirmation
  showRegisterConfirmationModal(() => {
    // Called only if user confirmed both checks
    registerUser(email, password, username);
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
      console.log("Status:", status);
      console.log("Error Message:", ResponseCode);
      if (status === "success") {
        info(ResponseCode);
        window.location.href = "login.php";
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
