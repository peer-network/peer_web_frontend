const rememberMeCheckbox = document.getElementById("rememberMe");
const emailInput = document.getElementById("email");

// Restore cookies
async function main() {
  // Auto-login if tokens exist
  if (refreshToken) {
    //console.log("User already logged in with token:", accessToken);
    rememberMeCheckbox.checked = true;
    const accessToken = await refreshAccessToken(refreshToken);
    // scheduleSilentRefresh(accessToken, refreshToken);
    if (accessToken) {
      window.location.href = "dashboard.php";
    }
  }
}
main();
// Pre-fill email input if saved
if (storedEmail) {
  emailInput.value = storedEmail;
}

document.addEventListener("DOMContentLoaded", function () {
  const heading = document.querySelector(".heading");
  const rememberedEmail = getCookie("userEmail");

  if (rememberedEmail && heading) {
    const rawName = rememberedEmail.split("@")[0];
    const name = rawName.replace(/[0-9]/g, '');
    heading.innerHTML = `Hey ${name}, <span class="waving-hand">👋</span><br>Welcome back!`;
  }

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
        // Use cookie helpers consistently
        if (rememberMeChecked) {
          
          setCookie("authToken", result.accessToken,7); //7 days
          setCookie("refreshToken", result.refreshToken, 7);
          setCookie("userEmail", email, 7);
          
        } else {
          setCookie("authToken", result.accessToken);
          setCookie("refreshToken", result.refreshToken);
          setCookie("userEmail", email);
         
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
});

async function loginRequest(email, password) {
  const headers = new Headers({ "Content-Type": "application/json" });

  const graphql = JSON.stringify({
    query: `mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        status
        ResponseCode
        accessToken
        refreshToken
      }
    }`,
    variables: { email, password },
  });

  const requestOptions = {
    method: "POST",
    headers,
    body: graphql,
  };

  const response = await fetch(GraphGL, requestOptions);
  const result = await response.json();

  if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  if (result.errors) throw new Error(result.errors[0].message);

  const { status, ResponseCode, accessToken, refreshToken } = result.data.login;

  return { status, ResponseCode, accessToken, refreshToken };
}

// Cookie helpers

