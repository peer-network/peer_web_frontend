
        /* Requirment: Code Resend Timing  { storing: reset_code_sent_counter in local strorage}
            1st request: code sent immediately
            2nd request: available after 1 minute
            3rd request: available after 10 minutes
            After 3 failed attempts:
            Display message: "Email delivery failed - Please contact our support team at help.peernetwork@gmail.com"
        */
     
        

        let code_sent_counter = getCookie("reset_code_sent_counter") || 0;
      
        const authToken = getCookie("authToken");
      
        //on page load;
        deleteCookie("timerstart");

        async function autoLogin() {
            // Auto-login if tokens exist
            
            if (authToken) {
                        
                window.location.href = "dashboard.php";
            }
           
        }
        // Enhanced Resetpassword Form Controller with Accessibility
        class AccessibleResetpasswordForm {
            constructor() {
                this.currentStep = 1;
                this.formData = {};
                this.validators = {};
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.setupValidators();
             
                // Announce current step to screen readers
                this.announceStep();
            }

            setupEventListeners() {
              
                // Submit email to get the  code
                document.getElementById('emailForm')?.addEventListener('submit', (e) => this.handleEmailSubmit(e));
                document.getElementById("send_again").addEventListener("click",  (e) => {e.preventDefault(); this.handleEmailSubmit(e)});
                
                // Verify Code
                document.getElementById('verifycodeForm')?.addEventListener('submit', (e) => this.handleVerifyCodeSubmit(e));
                
                 // Registration
                document.getElementById('newpasswordForm')?.addEventListener('submit', (e) => this.handleResetPasswordSubmit(e));
                
                // Navigation
                document.getElementById('backBtn')?.addEventListener('click', (e) => this.goBack(e));

                // Password toggle
                document.getElementById('togglePasswordBtn')?.addEventListener('click', () => this.togglePasswordVisibility('password'));
                // Confirm Password toggle
                document.getElementById('toggleConfirmPasswordBtn')?.addEventListener('click', () => this.togglePasswordVisibility('confirmpassword'));


                // Real-time validation
                this.setupRealTimeValidation();
               
            }


            setupValidators() {
                this.validators = {
                    email: {
                        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Please enter a valid email address'
                    },
                    verifycode: {
                        regex: /^(?!\s*$).+/,
                        message: 'Enter a valid code.'
                    }
                };
            }

            setupRealTimeValidation() {
                // Email validation
                const emailInput = document.getElementById('email');
                //emailInput?.addEventListener('input', () => this.validateField('email'));
                emailInput?.addEventListener('blur', () => this.validateField('email'));

                // Code validation
                const verifycodeInput = document.getElementById('verifycode');
                verifycodeInput?.addEventListener('input', () => this.validateField('verifycode'));
                verifycodeInput?.addEventListener('blur', () => this.validateField('verifycode'));

                // Password validation
                const passwordInput = document.getElementById('password');
                passwordInput?.addEventListener('input', () => {
                    this.validatePassword();
                    this.validateField('confirmPassword'); // Re-validate confirm password
                });

                // Confirm password validation
                const confirmPasswordInput = document.getElementById('confirmPassword');
                confirmPasswordInput?.addEventListener('input', () => this.validateField('confirmPassword'));

                
            }

            validateField(fieldName) {
                  
                const input = document.getElementById(fieldName);
                const field = document.getElementById(`${fieldName}Field`);
                const validationElement = document.getElementById(`${fieldName}Validation`);
                const validIcon = document.getElementById(`${fieldName}ValidIcon`);
                  
                if (!input || !field || !validationElement) return false;

                const value = input.value.trim();
                let isValid = false;
                let message = '';

               /*if (value === '') {
                    // Field is empty
                    //alert(fieldName+"empty");
                    this.clearFieldValidation(field, validationElement, validIcon);
                    return false;
                }*/
                   
                switch (fieldName) {
                    case 'email':
                    case 'verifycode':
                        isValid = this.validators[fieldName].regex.test(value);
                        message = isValid ? '' : this.validators[fieldName].message;
                        break;

                    case 'confirmPassword':
                        const password = document.getElementById('password').value;
                        isValid = value === password && value.length > 0;
                        message = isValid ? '' : 'Passwords do not match';
                        break;
                }

                this.updateFieldValidation(field, validationElement, validIcon, isValid, message);
                return isValid;
            }

            validatePassword() {
                const passwordInput = document.getElementById('password');
                const password = passwordInput.value;
                
                const requirements = {
                    length: password.length >= 8,
                    lower: /[a-z]/.test(password),
                    upper: /[A-Z]/.test(password),
                    number: /\d/.test(password),
                    special: /[!@#$%^&*(),.?":{}|<>]/.test(password) || password.length >= 12
                };

                // Update requirement indicators
                Object.keys(requirements).forEach(req => {
                    const element = document.getElementById(`${req}Req`);
                    if (element) {
                        element.classList.toggle('met', requirements[req]);
                    }
                });

                // Update strength meter
                const strengthFill = document.getElementById('strengthFill');
                const metCount = Object.values(requirements).filter(Boolean).length;
                let strength = 'weak';
                

                if (metCount >= 2) {
                    strength = 'weak2';
                
                }

                if (metCount >= 3) {
                    strength = 'medium';
                
                }

                // Strong only when ALL required checks pass
                const requiredChecks = ['length', 'lower', 'upper', 'number'];
                const allRequiredMet = requiredChecks.every(req => requirements[req]);
                if (allRequiredMet) {
                    strength = 'strong';
                    // Excellent if strong + special
                    if (requirements.special) {
                        strength = 'excellent';
                    }
                }

                if (strengthFill) {
                    strengthFill.className = `strength-fill ${strength}`;
                
                    if(password==''){
                        strengthFill.classList.remove(strength);
                    }
                }
               
                // Return only required checks result
                return allRequiredMet;
                //return Object.values(requirements).every(Boolean);
            }

            updateFieldValidation(field, validationElement, validIcon, isValid, message) {
                field.classList.remove('valid', 'invalid');
                validationElement.classList.remove('valid');
                
                if (isValid) {
                    field.classList.add('valid');
                    validationElement.classList.add('valid');
                    validIcon?.classList.add('show');
                    validationElement.textContent = '';
                } else {
                    field.classList.add('invalid');
                    validIcon?.classList.remove('show');
                    validationElement.textContent = message;
                }
            }

            clearFieldValidation(field, validationElement, validIcon) {
                field.classList.remove('valid', 'invalid');
                validationElement.classList.remove('valid');
                validIcon?.classList.remove('show');
                validationElement.textContent = '';
            }

            togglePasswordVisibility(field) {

                let passwordInput, toggleBtn;

                if (field === 'password') {
                passwordInput = document.getElementById('password');
                toggleBtn = document.getElementById('togglePasswordBtn');
                } else {
                passwordInput = document.getElementById('confirmPassword');
                toggleBtn = document.getElementById('toggleConfirmPasswordBtn');
                }
                
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleBtn.innerHTML = '<i class="peer-icon peer-icon-eye-open"></i> ';
                    toggleBtn.setAttribute('aria-label', 'Hide password');
                } else {
                    passwordInput.type = 'password';
                    toggleBtn.innerHTML = '<i class="peer-icon peer-icon-eye-close"></i> ';
                    toggleBtn.setAttribute('aria-label', 'Show password');
                }
            }

            async handleEmailSubmit(e) {
                e.preventDefault();
                const submitBtn = document.getElementById('verifyEmailBtn');
                const email = document.getElementById('email').value.trim();
                const sentcode_msg = document.getElementById("sentcode_msg");

                const timerstart= getCookie("timerstart");
                 

                if (!this.validateField('email')) {
                    this.focusFirstError('emailStep');
                    return;
                }

                this.setButtonLoading(submitBtn, true);

                try {
                    let isValid;
                    if(timerstart==1 || code_sent_counter >= 3){
                        isValid =true;
                        
                    }else{
                        isValid = await this.forgotpasswordRequest(email);
                        
                    }
                    
                    if (isValid) {
                        if(!timerstart && code_sent_counter <= 3){
                            
                            const maskedEmail = this.maskEmail(email);
                            if (sentcode_msg) {
                            sentcode_msg.innerHTML = `We sent a code to your email ${maskedEmail}. Please, enter the code to change your password.`;
                            }
                        
                            code_sent_counter++;
                            updateCookieValue("reset_code_sent_counter", code_sent_counter,120); // for two hours passing 120mintues
                            //localStorage.setItem("reset_code_sent_counter", code_sent_counter);
                            let countermin;
                            if(code_sent_counter > 1){
                                countermin=600; //10 mintues
                            }else{
                                countermin=60; //1 mintue
                            }
                            // Start 1 minute countdown
                            const timeDisplay = document.getElementById("timecounter");
                            const resendButton = document.getElementById("send_again");
                            this.startCountdown(countermin, timeDisplay, resendButton);    
                        }
                         if(code_sent_counter > 3){ //After 3 failed attempts:
 
                            deleteCookie("timerstart");
                            const field = document.getElementById('emailField');
                            const validationElement = document.getElementById('emailValidation');
                            const message = userfriendlymsg(31903);
                            const validIcon = document.getElementById('emailValidIcon');
                            const isValid = false;
                            this.updateFieldValidation(field, validationElement, validIcon, isValid, message);
                            this.goToStep(1);   
                         }else{
                             
                            this.goToStep(2);          
                            this.announceStep('We sent a code to your email');
                         }
                        
                    }
                } catch (error) {
                    this.showToast('Error during forgotpassword request:'+ error, 'error');
                } finally {
                    this.setButtonLoading(submitBtn, false);
                }
            }
            maskEmail(email) {
              const [user, domain] = email.split("@");
              const maskedUser = user.length <= 2
                ? "*".repeat(user.length)
                : user.slice(0, 2) + "*".repeat(user.length - 2);
              return `${maskedUser}@${domain}`;
            }
            startCountdown(duration, display, button) {
            let timer = duration, minutes, seconds;

            button.classList.add("disable"); // Disable send_again button
            display.classList.remove("disable"); // Disable timecounter button
            let resend=document.querySelector(".resend-txt");
            if(resend){
                resend.classList.remove("disable"); // Disable timecounter button
            }
            //localStorage.setItem("timerstart", 1);
            updateCookieValue("timerstart",1,Math.floor(timer / 60)); // minutes 
            

            const countdownInterval = setInterval(() => {
                minutes = String(Math.floor(timer / 60)).padStart(2, "0");
                seconds = String(timer % 60).padStart(2, "0");

                display.textContent = `${minutes}:${seconds}`;

                if (--timer < 0) {
                    clearInterval(countdownInterval);
                    //button.disabled = false;
                    button.classList.remove("disable");
                    display.classList.add("disable"); // enable timecounter button
                    display.textContent = "";
                    if(resend){
                        resend.classList.add("disable"); // enable timecounter txt button
                    }
                    //localStorage.removeItem("timerstart");
                }
            }, 1000);
            }

            async handleVerifyCodeSubmit(e) {
                e.preventDefault();
                const submitBtn = document.getElementById('verifycodeBtn');
                const verifycode = document.getElementById('verifycode').value.trim();
                
                if (!this.validateField('verifycode')) {
                    this.focusFirstError('verifycodeStep');
                    return;
                }

                this.setButtonLoading(submitBtn, true);

                try {
                    const isValid = await this.verifycodeRequest(verifycode);
                   
                    if (isValid) {
                        this.formData.token = verifycode;
                        this.goToStep(3);          
                        this.announceStep('Code verfied enter new password');
                    }
                } catch (error) {
                    this.showToast('Error during code verification request:'+ error, 'error');
                } finally {
                    this.setButtonLoading(submitBtn, false);
                }
            }

            async handleResetPasswordSubmit(e) {
                e.preventDefault();
                
                const submitBtn = document.getElementById('updatePasswordBtn');
                
                // Validate all fields
                const passwordValid = this.validatePassword();
                const confirmPasswordValid = this.validateField('confirmPassword');

                if (!passwordValid || !confirmPasswordValid) {
                    this.focusFirstError('newpasswordStep');
                    this.showToast('Please correct the errors in the form','error');
                    this.announceStep('Please correct the errors in the form');
                    return;
                }
               

                const formData = {
                    
                    password: document.getElementById('password').value,
                    token: this.formData.token
                };

                this.setButtonLoading(submitBtn, true);

                try {
                    const success = await this.resetpasswordRequest(formData);
                    if (!success) {
                        this.goToStep(4);
                        this.announceStep('Password changed successfully!');
                    }
                } catch (error) {
                    this.showToast('Password reset failed: ' + error.message, 'error');
                } finally {
                    this.setButtonLoading(submitBtn, false);
                }
            } 

            goToStep(stepNumber) {
                this.currentStep = stepNumber;
                this.showStep(this.getStepId(stepNumber));
               
                this.updateBackButton(stepNumber >= 1);
                if(stepNumber > 3)
                this.updateBackButton(false);
                
               
            }

            getStepId(stepNumber) {
                const stepMap = {
                    
                    1: 'emailStep',
                    2: 'verifycodeStep',
                    3: 'newpasswordStep',
                    4: 'successStep'
                };
                return stepMap[stepNumber];
            }

            showStep(stepId) {
                document.querySelectorAll('.form-step').forEach(step => {
                    step.classList.remove('active');
                });
                
                const targetStep = document.getElementById(stepId);
                if (targetStep) {
                    targetStep.classList.add('active');
                    
                    // Focus first interactive element
                    setTimeout(() => {
                        const focusable = targetStep.querySelector('input, button, select, textarea');
                        focusable?.focus();
                    }, 100);
                }
            }

            updateBackButton(show) {
                
                const backBtn = document.getElementById('backBtn');
                if (backBtn) {
                    backBtn.style.display = show ? 'flex' : 'none';
                }
            }

            goBack(e) {
                                
                if (this.currentStep > 1) {
                    e.preventDefault();
                    this.goToStep(this.currentStep - 1);
                    this.announceStep('Navigated back to previous step');
                }
            }

            setButtonLoading(button, loading) {
                if (loading) {
                    button.disabled = true;
                    button.classList.add('loading');
                    button.setAttribute('aria-busy', 'true');
                } else {
                    button.disabled = false;
                    button.classList.remove('loading');
                    button.setAttribute('aria-busy', 'false');
                }
            }

            focusFirstError(stepId) {
                const step = document.getElementById(stepId);
                const firstError = step?.querySelector('.input-field.invalid input');
                firstError?.focus();
            }

            announceStep(customMessage) {
                const announcer = this.getOrCreateAnnouncer();
                const stepTitles = {
                    1: 'Email Submission Entry',
                    2: 'Verify Code Form',
                    3: 'New password Form',
                    4: 'Update Password Complete'
                };

                const message = customMessage || `Now on step ${this.currentStep}: ${stepTitles[this.currentStep]}`;
                announcer.textContent = message;
            }

            getOrCreateAnnouncer() {
                let announcer = document.getElementById('step-announcer');
                if (!announcer) {
                    announcer = document.createElement('div');
                    announcer.id = 'step-announcer';
                    announcer.className = 'sr-only';
                    announcer.setAttribute('aria-live', 'polite');
                    announcer.setAttribute('aria-atomic', 'true');
                    document.body.appendChild(announcer);
                }
                return announcer;
            }

            showToast(message, type = 'info') {
                // Remove existing toast
                const existingToast = document.querySelector('.toast');
                existingToast?.remove();

                // Create new toast
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.textContent = message;
                toast.setAttribute('role', 'alert');
                toast.setAttribute('aria-live', 'assertive');

                document.body.appendChild(toast);

                // Show toast
                setTimeout(() => toast.classList.add('show'), 100);

                // Hide toast after 6 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 600);
                }, 3000);
            }
            
            async  forgotpasswordRequest(email) {
             
              const headers = new Headers({
                "Content-Type": "application/json"
              });

              const graphql = JSON.stringify({
                query: `mutation RequestPasswordReset($email: String!) {
                  requestPasswordReset(email: $email) {
                    status
                    ResponseCode
                  }
                }`,
                variables: {
                email,
                },
              });

              const requestOptions = {
                method: "POST",
                headers: headers,
                body: graphql,
                redirect: "follow",
              };
              try {
                const response = await fetch(GraphGL, requestOptions);
                const result = await response.json();
                const data = result?.data?.requestPasswordReset;
                const response_msg =document.querySelector('.response-message');
              

                if (data && data.status === "success") {
                  this.showToast(userfriendlymsg(data.ResponseCode), 'success');
                  if(response_msg){
                        response_msg.textContent="";
                    }
                  return true;
                } else {

                  if (data.ResponseCode === "31903" || data.ResponseCode === "31901") { 
                      const field = document.getElementById('emailField');
                      const validationElement = document.getElementById('emailValidation');
                      const message = userfriendlymsg(data.ResponseCode);
                      const validIcon = document.getElementById('emailValidIcon');
                      const isValid = false;
                      this.updateFieldValidation(field, validationElement, validIcon, isValid, message);
                        if(response_msg){
                            response_msg.textContent=message;
                        }
                               
                    }else{
                    this.showToast(userfriendlymsg(data.ResponseCode), 'error');
                  }

                 
                  return false;
                }

              } catch (error) {
                console.error("Error during forgotpassword request:", error);
                this.showToast('Error during forgotpassword request:'+ error, 'error');
                return false;
              }
            }

            async  verifycodeRequest(token) {
            

              const headers = new Headers({
                "Content-Type": "application/json",
              
              });

              const graphql = JSON.stringify({

                query: `mutation ResetPasswordTokenVerify($token: String!) {
                    resetPasswordTokenVerify(token: $token) {
                        status
                        ResponseCode
                    }
                }`,
                variables: {
                token,
                },
              });

              const requestOptions = {
                method: "POST",
                headers: headers,
                body: graphql,
                redirect: "follow",
              };
              try {
                const response = await fetch(GraphGL, requestOptions);
                const result = await response.json();
                
                const data = result?.data?.resetPasswordTokenVerify;
               

                if (data && data.status === "success") {
                  this.showToast(userfriendlymsg(data.ResponseCode), 'success');
                  return true;
                } else {
                    if (data.ResponseCode === "31904") { 
                            const field = document.getElementById('verifycodeField');
                            const validationElement = document.getElementById('verifycodeValidation');
                            const message = userfriendlymsg(data.ResponseCode);
                            const validIcon = document.getElementById('verifycodeValidIcon');
                            const isValid = false;
                            this.updateFieldValidation(field, validationElement, validIcon, isValid, message);
                       }else{
                        this.showToast("code verification failed. " + userfriendlymsg(data.ResponseCode), 'error');
                        
                       }
                  return false;
                }

              } catch (error) {
                console.error("Error verifying code:", error);
                this.showToast('Error verifying code'+ error, 'error');
                return false;
              }
            }
            async resetpasswordRequest(formData) {
                
                const query = `
                    mutation ResetPassword($token: String!,$password: String!) {
                        resetPassword(token: $token,password: $password) {
                            status
                            ResponseCode
                        }
                    }
                    `;
  
                const variables = {
                   token: formData.token,
                    password: formData.password,
                    
                    
                };
  
                try {
                    // API-Anfrage an den GraphQL-Server
                    const response = await fetch(GraphGL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                  
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
                    if (result.data.resetPassword.status === "success") {
                        this.showToast("Password updated successfully. " + userfriendlymsg(result.data.resetPassword.ResponseCode), 'success');
                        return true;
                    }else {
                        const response_msg =document.getElementById('reset_step_message');
                       if (response_msg) { 
                            
                            const message = userfriendlymsg(result.data.resetPassword.ResponseCode);
                            response_msg.innerHTML=message;
                       }else{
                        this.showToast("Password Update failed. " + userfriendlymsg(result.data.resetPassword.ResponseCode), 'error');
                        console.error("Password Update failed:" + result.data.resetPassword.ResponseCode);
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
        document.addEventListener('DOMContentLoaded', () => {
            autoLogin();
            fetchEndpoints();
            new AccessibleResetpasswordForm();
        });

        // Additional utility for cookie handling (keeping your original function)

  function setCookie(name, value, minutes) {
    
    let expires = "";
    if (minutes) {
      const date = new Date();
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      expires = date.toUTCString(); // just store date
    }
    document.cookie = `${name}=${encodeURIComponent(value || "")}; expires=${expires}; path=/; Secure; SameSite=Strict`;

    // Save expiry separately for later reuse
    if (minutes) {
      localStorage.setItem(name + "_expiry", expires);
    }
  }



  // Update value but keep expiry if still valid
function updateCookieValue(name, value, minutes) {
  const expiry = localStorage.getItem(name + "_expiry");

  if (expiry) {
    const expiryDate = new Date(expiry);
    const now = new Date();

    if (now > expiryDate) {
      // Expired → remove stored expiry
     // console.log(`Cookie "${name}" already expired at`, expiryDate);
        deleteCookie(name);
         setCookie(name, value, minutes);
      
    }else{
    
        // Still valid → update value with same expiry
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expiry}; path=/; Secure; SameSite=Strict`;
        //console.log(`Cookie "${name}" updated. Still valid until`, expiryDate);

    }

  } else {
    // No expiry stored → set new cookie
    setCookie(name, value, minutes);
  }
}

  
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let c of ca) {
      c = c.trim();
      if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
  }

  // Delete a cookie by name
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure; SameSite=Strict";
  
  // Optional: remove any stored expiry in localStorage if you used it
  localStorage.removeItem(name + "_expiry");
}