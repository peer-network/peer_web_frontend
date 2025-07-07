// components/password.js
document.addEventListener("DOMContentLoaded", async () => {
  const mounts = document.querySelector(".password-component");
  if (!mounts) return;

  const nameAttr = mounts.dataset.name || 'password';
  const showStrength = mounts.dataset.showStrength === "true";
  const showMessage = mounts.dataset.showMessage === "true";

  fetch("template-parts/passwords/password.php")
    .then(res => res.text())
    .then(html => {
      mounts.innerHTML = html;

      const passwordField = document.getElementById("password");
      const toggleIcon = document.getElementById("togglePassword");
      const strengthBar = document.getElementById("passwordStrength");
      const bars = strengthBar?.querySelectorAll(".bar-segment") || [];
      const validationMessage = document.getElementById("validationMessage");

      if (!showStrength && strengthBar) strengthBar.classList.add("none");
      if (!showMessage && validationMessage) validationMessage.classList.add("none");

      function updateStrength(value) {
        let strength = 0;
        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/\d/.test(value)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) strength++;

        bars.forEach((bar, i) => {
          bar.className = "bar-segment";
          if (i < strength) {
            if (strength <= 2) bar.classList.add("weak");
            else if (strength === 3) bar.classList.add("medium");
            else bar.classList.add("strong");
          }
        });
      }

      passwordField.addEventListener("input", () => {
        const val = passwordField.value.trim();

        if (showStrength) {
          if (val.length > 0) {
            strengthBar.classList.remove("none");
            updateStrength(val);
          } else {
            strengthBar.classList.add("none");
            bars.forEach(bar => bar.className = "bar-segment");
          }
        }

        if (showMessage && validationMessage) {
          // Clear previous message and styling
          validationMessage.innerText = "";
          validationMessage.classList.remove("notvalid");
          passwordField.parentElement.classList.remove("valid", "invalid");

          // Validation rule
          const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
          const isValid = passwordRegex.test(val);

          if (val.length === 0) {
            // Do nothing if empty — don't show validation
            return;
          }

          if (isValid) {
            passwordField.parentElement.classList.add("valid");
          } else {
            validationMessage.innerText = "";
            validationMessage.classList.add("notvalid");
            passwordField.parentElement.classList.add("invalid");
          }
        }
      });

      toggleIcon.addEventListener("click", () => {
        const isVisible = passwordField.type === "text";
        passwordField.type = isVisible ? "password" : "text";
        toggleIcon.src = isVisible ? "svg/seePass.png" : "svg/hidePass.png";
      });
    });
});

