const rememberMeCheckbox = document.getElementById("rememberMe");
const refreshToken = getCookie("refreshToken");

async function autoLogin() {
  const remember = localStorage.getItem("rememberMe") === "true";
  // Auto-login if tokens exist
  if (remember && refreshToken) {
    rememberMeCheckbox.checked = true;
    const accessToken = await refreshAccessToken(refreshToken);

    if (accessToken) {
      window.location.href = "dashboard.php";
    }
  }
}

async function refreshAccessToken(refreshToken) {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const graphql = JSON.stringify({
    query: `mutation RefreshToken {
          refreshToken(refreshToken: "${refreshToken}") {
            status
            ResponseCode
            accessToken
            refreshToken
          }
        }`,
  });

  const requestOptions = {
    method: "POST",
    headers,
    body: graphql,
    redirect: "follow",
  };

  try {
    const response = await fetch(GraphGL, requestOptions);
    const result = await response.json();

    if (response.ok && result.data && result.data.refreshToken) {
      const {
        status,
        ResponseCode,
        accessToken,
        refreshToken: newRefreshToken,
      } = result.data.refreshToken;

      if (
        status !== "success" &&
        (ResponseCode == "10801" || ResponseCode == "10901")
      ) {
        throw new Error("Refresh failed with code: " + ResponseCode);
      }
      // Store updated tokens
      // Save updated tokens back into cookies
      updateCookieValue("authToken", accessToken); // keep same lifetime
      updateCookieValue("refreshToken", newRefreshToken);
      return accessToken;
    } else {
      throw new Error("Invalid response from refresh mutation");
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
}

// Enhanced Login Form Controller with Accessibility
class AccessibleLoginForm {
  constructor() {
    this.formData = {};
    this.validators = {};
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupValidators();
  }

  setupEventListeners() {
    // Login
    document
      .getElementById("loginForm")
      ?.addEventListener("submit", (e) => this.handleLogin(e));

    // Password toggle
    document
      .getElementById("togglePasswordBtn")
      ?.addEventListener("click", () => this.togglePasswordVisibility());

    // Real-time validation
    this.setupRealTimeValidation();
  }

  setupValidators() {
    this.validators = {
      email: {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Please enter a valid email address",
      },
      password: {
        regex: /^(?!\s*$).+/,
        message: "Please enter a valid password",
      },
    };
  }

  setupRealTimeValidation() {
    // Email validation
    const emailInput = document.getElementById("email");
    //emailInput?.addEventListener('input', () => this.validateField('email'));
    emailInput?.addEventListener("blur", () => this.validateField("email"));

    // Password validation
    const passwordInput = document.getElementById("password");
    //passwordInput?.addEventListener('input', () => this.validateField('password'));
    passwordInput?.addEventListener("blur", () =>
      this.validateField("password")
    );
  }

  validateField(fieldName) {
    const input = document.getElementById(fieldName);
    const field = document.getElementById(`${fieldName}Field`);
    const validationElement = document.getElementById(`${fieldName}Validation`);
    const validIcon = document.getElementById(`${fieldName}ValidIcon`);

    if (!input || !field || !validationElement) return false;

    const value = input.value.trim();
    let isValid = false;
    let message = "";

    switch (fieldName) {
      case "email":
      case "password":
        isValid = this.validators[fieldName].regex.test(value);
        message = isValid ? "" : this.validators[fieldName].message;
        break;
    }
    this.updateFieldValidation(
      field,
      validationElement,
      validIcon,
      isValid,
      message
    );
    return isValid;
  }

  updateFieldValidation(field, validationElement, validIcon, isValid, message) {
    field.classList.remove("valid", "invalid");
    validationElement.classList.remove("valid");

    if (isValid) {
      field.classList.add("valid");
      validationElement.classList.add("valid");
      validIcon?.classList.add("show");
      validationElement.textContent = "";
    } else {
      field.classList.add("invalid");
      validIcon?.classList.remove("show");
      validationElement.textContent = message;
    }
  }

  clearFieldValidation(field, validationElement, validIcon) {
    field.classList.remove("valid", "invalid");
    validationElement.classList.remove("valid");
    validIcon?.classList.remove("show");
    validationElement.textContent = "";
  }

  togglePasswordVisibility() {
    let passwordInput, toggleBtn;

    passwordInput = document.getElementById("password");
    toggleBtn = document.getElementById("togglePasswordBtn");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleBtn.innerHTML = '<i class="peer-icon peer-icon-eye-open"></i> ';
      toggleBtn.setAttribute("aria-label", "Hide password");
    } else {
      passwordInput.type = "password";
      toggleBtn.innerHTML = '<i class="peer-icon peer-icon-eye-close"></i> ';
      toggleBtn.setAttribute("aria-label", "Show password");
    }
  }

  async handleLogin(e) {
    e.preventDefault();

    const submitBtn = document.getElementById("loginBtn");

    // Validate all fields
    const emailValid = this.validateField("email");
    const passwordValid = this.validateField("password");

    if (!emailValid || !passwordValid) {
      this.focusFirstError("loginForm");
      this.showToast("Please correct the errors in the form", "error");
      return;
    }

    const formData = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
    };

    this.setButtonLoading(submitBtn, true);

    try {
      const success = await this.loginUser(formData);
      if (success) {
      }
    } catch (error) {
      this.showToast("Login failed: " + error.message, "error");
    } finally {
      this.setButtonLoading(submitBtn, false);
    }
  }

  setButtonLoading(button, loading) {
    if (loading) {
      button.disabled = true;
      button.classList.add("loading");
      button.setAttribute("aria-busy", "true");
    } else {
      button.disabled = false;
      button.classList.remove("loading");
      button.setAttribute("aria-busy", "false");
    }
  }

  focusFirstError(stepId) {
    const step = document.getElementById(stepId);
    const firstError = step?.querySelector(".input-field.invalid input");
    firstError?.focus();
  }

  showToast(message, type = "info") {
    // Remove existing toast
    const existingToast = document.querySelector(".toast");
    existingToast?.remove();

    // Create new toast
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add("show"), 100);

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  async loginUser(formData) {
    // GraphQL-Mutation für die Registrierung eines Benutzers
    const query = `
                mutation Login($email: String!, $password: String!) {
                  login(email: $email, password: $password) {
                    status
                    ResponseCode
                    accessToken
                    refreshToken
                  }
                }`;

    const variables = {
      email: formData.email,
      password: formData.password,
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

      // Erfolgreiche Login
      if (
        result.data.login.status === "success" &&
        result.data.login.ResponseCode === "10801"
      ) {
        // Use cookie helpers consistently
        const rememberMeChecked = rememberMeCheckbox.checked;
        if (rememberMeChecked) {
          setCookie("authToken", result.data.login.accessToken, 3650); // approx. 10 years
          setCookie("refreshToken", result.data.login.refreshToken, 3650); // approx. 10 years
          setCookie("userEmail", email, 3650);
          localStorage.setItem("rememberMe", "true"); // adding RememberMe-flag on checked
        } else {
          setCookie("authToken", result.data.login.accessToken);
          setCookie("refreshToken", result.data.login.refreshToken);
          setCookie("userEmail", email);
          localStorage.removeItem("rememberMe"); // removing RememberMe-flag on unchecked
        }
        this.showToast(
          "Login successfully. " +
            userfriendlymsg(result.data.login.ResponseCode),
          "success"
        );
        //scheduleSilentRefresh(result.data.login.accessToken, result.data.login.refreshToken);
        window.location.href = "dashboard.php";
        return true;
      } else {
        if (result.data.login.ResponseCode === "30801") {
          const field = document.getElementById("passwordField");
          const validationElement =
            document.getElementById("passwordValidation");
          const message = userfriendlymsg(result.data.login.ResponseCode);
          const validIcon = document.getElementById("passwordValidIcon");
          const isValid = false;
          this.updateFieldValidation(
            field,
            validationElement,
            validIcon,
            isValid,
            message
          );
        } else {
          this.showToast(
            "Login failed. " + userfriendlymsg(result.data.login.ResponseCode),
            "error"
          );
          console.error("Login failed:" + result.data.login.ResponseCode);
        }
        return false;
      }
    } catch (error) {
      // Fehlerbehandlung bei Netzwerkfehlern oder anderen Problemen
      console.error("An Error occured:", error);
    }
  }
}

// Initialize the form when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const savedEmail = sessionStorage.getItem("newUserEmail");

  if (savedEmail && emailInput) {
    emailInput.value = savedEmail;

    sessionStorage.removeItem("newUserEmail");

    if (passwordInput) {
      passwordInput.focus();
    }
  }
  autoLogin();
  fetchEndpoints();
  new AccessibleLoginForm();
});
// Additional utility for cookie handling (keeping your original function)

//
// function setCookie(name, value, days) {
//   let expires = "";
//   if (days) {
//     const date = new Date();
//     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//     expires = date.toUTCString(); // just store date
//     localStorage.setItem(name + "_expiry", expires);
//   }
//   document.cookie = `${name}=${encodeURIComponent(value || "")}; expires=${expires}; path=/; Secure; SameSite=Strict`;
// }

// updated setCookie function
function setCookie(name, value, days) {
  let cookie = `${name}=${encodeURIComponent(value || "")}; path=/; Secure; SameSite=Strict`;
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookie += `; expires=${date.toUTCString()}`;
    localStorage.setItem(name + "_expiry", date.toUTCString());
  }
  document.cookie = cookie;
}

// Update value but keep expiry
function updateCookieValue(name, value) {
  const expiry = localStorage.getItem(name + "_expiry");
  if (expiry) {
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expiry}; path=/; Secure; SameSite=Strict`;
  } else {
    setCookie(name, value);
  }
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(nameEQ) == 0)
      return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}
