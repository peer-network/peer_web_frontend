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
    if (ResponseCode !== "10801") {
       displayValidationMessage(userfriendlymsg(ResponseCode), "validationMessage");
    }

    // Securely store tokens if login was successful
    if (status === "success") {
      document.cookie = `authToken=${accessToken}; path=/; secure; SameSite=Strict`;
      document.cookie = `refreshToken=${refreshToken}; path=/; secure; SameSite=Strict`;
    }

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

const rememberMeCheckbox = document.getElementById("rememberMe");
const emailInput = document.getElementById("email");

const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
const storedEmail = localStorage.getItem('userEmail');

if (accessToken && refreshToken) {
  rememberMeCheckbox.checked = true;
}
if (storedEmail) {
  emailInput.value = storedEmail;
}

document.addEventListener("DOMContentLoaded", function () {
  const heading = document.querySelector(".heading");
  const rememberedEmail = localStorage.getItem("rememberedEmail");

  if (rememberedEmail && heading) {
    // Extract only letters before the '@'
    const rawName = rememberedEmail.split("@")[0];
    const name = rawName.replace(/[0-9]/g, ''); // Remove digits

    heading.innerHTML = `Hey ${name}, <span class="waving-hand">👋</span><br>Welcome back!`;
  }
});

document.getElementById("registerForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = emailInput.value;
  const password = document.getElementById("password").value;
  const rememberMeChecked = rememberMeCheckbox.checked;
  const submitButton = document.getElementById("submit");
  submitButton.disabled = true;

  try {
    const result = await loginRequest(email, password);

    if (result.status === "success" && result.ResponseCode === "10801") {
      if (rememberMeChecked) {
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('userEmail', email);
      } else {
        sessionStorage.setItem('accessToken', result.accessToken);
        sessionStorage.setItem('refreshToken', result.refreshToken);
        localStorage.removeItem('userEmail');
      }
      scheduleSilentRefresh(result.accessToken, result.refreshToken);
      window.location.href = "dashboard.php";
    } else {
      displayValidationMessage(userfriendlymsg(result.ResponseCode) || "Fehler beim Login.");
    }
  } catch (error) {
    console.error("Error during login request:", error);
    displayValidationMessage("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
  } finally {
    submitButton.disabled = false;
  }
});
