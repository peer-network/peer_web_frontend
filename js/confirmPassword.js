document.addEventListener("DOMContentLoaded", () => {
  const mountPoint = document.querySelector('.confirm-password-component');
  const nameAttr = mountPoint?.dataset?.name || 'confirm_password';

  fetch('template-parts/passwords/confirmPassword.php')
    .then(res => res.text())
    .then(html => {
      mountPoint.innerHTML = html;

      // Add validation logic
      const confirmPassword = document.getElementById("confirm_password");
      const toggleConfirm = document.getElementById("toggleConfirmPassword");
      const validationMessage = document.getElementById("confirmValidationMessage");
      // const passwordField = document.getElementById("password"); 
      // const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

      confirmPassword.addEventListener("input", () => {
        validationMessage.innerText = "";
        const val = confirmPassword.value.trim();
        
        if (val.length > 0) {
          toggleConfirm.classList.remove("none");
        } else {
          toggleConfirm.classList.add("none");
        }

        // if ( // I:(Luqman) have commented out the 'if check' becuase the body was already commented out
        //   passwordRegex.test(confirmPassword.value) &&
        //   confirmPassword.value === passwordField?.value
        // ) {
          // confirmPassword.parentElement.classList.add("valid");
          // confirmPassword.parentElement.classList.remove("invalid");
        // } else {
          // confirmPassword.parentElement.classList.add("invalid");
          // confirmPassword.parentElement.classList.remove("valid");
        // }
      });

      toggleConfirm.addEventListener("click", () => {
        const isVisible = confirmPassword.type === "text";
        confirmPassword.type = isVisible ? "password" : "text";
        toggleConfirm.src = isVisible ? "svg/seePass.png" : "svg/hidePass.png";
      });
    });
});
