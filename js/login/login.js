//  import { responseMessages } from "../lib/responseCodes.js";
// console.log(responseMessages);
async function loginRequest(email, password) {
  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  // Define the GraphQL mutation with variables
  const graphql = JSON.stringify({
    query: `mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        status
        ResponseCode
        accessToken
        refreshToken
      }
    }`,
    variables: {
      email,
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
      ResponseCode,
      accessToken,
      refreshToken
    } = result.data.login;

    // Log status and error message for debugging; avoid logging sensitive tokens
    // console.log("Status:", status);
    if (ResponseCode !== "10801") console.warn("Error Message:", ResponseCode);

    // Securely store tokens if login was successful
    if (status === "success") {
      document.cookie = `authToken=${accessToken}; path=/; secure; SameSite=Strict`;
      document.cookie = `refreshToken=${refreshToken}; path=/; secure; SameSite=Strict`;
    }

    // console.log("ResponseCode:", ResponseCode);
    // console.log("Access Token:", accessToken);
    // console.log("Refresh Token:", refreshToken);
    return {
      status,
      ResponseCode,
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

document.getElementById("registerForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form reload

  // Retrieve input values for email and password
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Disable form and show loading indicator (optional UI improvement)
  const submitButton = document.getElementById("submit");
  submitButton.disabled = true;

  try {
    // Attempt to register the user after passing validations
    const result = await loginRequest(email, password);

    // Handle successful registration (e.g., redirect or display success message)
    if (result.status === "success" && result.ResponseCode === "10801") {
      window.location.href = "dashboard.php";
    } else {
      displayValidationMessage(userfriendlymsg(result.ResponseCode) || "Fehler beim Login.");
    }
  } catch (error) {
    console.error("Error during login request:", error);
    displayValidationMessage("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
  } finally {
    // Re-enable the form and hide loading indicator
    submitButton.disabled = false;
  }
});
