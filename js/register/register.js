
        const authToken = getCookie("authToken");

        async function autoLogin() {
            // Auto-login if tokens exist
            
            if (authToken) {
                window.location.href = "dashboard.php";
            }
           
        }
        // Enhanced Registration Form Controller with Accessibility
        class AccessibleRegistrationForm {
            constructor() {
                this.currentStep = 1;
                this.formData = {};
                this.validators = {};
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.setupValidators();
                
                
                // Check for URL parameters
                this.handleURLParams();
                
                // Announce current step to screen readers
                this.announceStep();
            }

            setupEventListeners() {
              
                // Referral code
                document.getElementById('referralForm')?.addEventListener('submit', (e) => this.handleReferralSubmit(e));
                document.getElementById('useDefaultCodeBtn')?.addEventListener('click', () => this.showDefaultReferral());
                document.getElementById('useThisCodeBtn')?.addEventListener('click', () => this.useDefaultReferral());

                // Registration
                document.getElementById('registrationForm')?.addEventListener('submit', (e) => this.handleRegistration(e));
                
                // Navigation
                document.getElementById('backBtn')?.addEventListener('click', (e) => this.goBack(e));

                // Password toggle
                document.getElementById('togglePasswordBtn')?.addEventListener('click', () => this.togglePasswordVisibility('password'));
                // Confirm Password toggle
                document.getElementById('toggleConfirmPasswordBtn')?.addEventListener('click', () => this.togglePasswordVisibility('confirmpassword'));


                // Real-time validation
                this.setupRealTimeValidation();
                // Real-time checkbox  validation
                this.setupCheckboxListeners();
            }


            setupValidators() {
                this.validators = {
                    email: {
                        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Please enter a valid email address'
                    },
                    username: {
                        regex: /^[a-zA-Z0-9_-]{3,23}$/,
                        message: 'Username must be 3-23 characters'
                    },
                    referralCode: {
                        regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
                        message: 'Hmm… that referral code doesn’t seem to work. Ask your friend to send you a new link, or use a Peer code.'
                    }
                };
            }

            setupRealTimeValidation() {
                // Email validation
                const emailInput = document.getElementById('email');
                emailInput?.addEventListener('input', () => this.validateField('email'));
                emailInput?.addEventListener('blur', () => this.validateField('email'));

                // Username validation
                const usernameInput = document.getElementById('username');
                usernameInput?.addEventListener('input', () => this.validateField('username'));
                usernameInput?.addEventListener('blur', () => this.validateField('username'));

                // Password validation
                const passwordInput = document.getElementById('password');
                passwordInput?.addEventListener('input', () => {
                    this.validatePassword();
                    this.validateField('confirmPassword'); // Re-validate confirm password
                });

                // Confirm password validation
                const confirmPasswordInput = document.getElementById('confirmPassword');
                confirmPasswordInput?.addEventListener('input', () => this.validateField('confirmPassword'));

                // Referral code validation
                const referralInput = document.getElementById('referralCode');
                referralInput?.addEventListener('input', () => this.validateField('referralCode'));
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
                    case 'username':
                    case 'referralCode':
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

            validateCheckbox() {
                const readPrivacyCheckbox = document.getElementById('readPrivacy');
                const agreementEULACheckbox = document.getElementById('agreementEULA');
                
                // Check if elements exist
                if (!readPrivacyCheckbox || !agreementEULACheckbox) {
                    console.error('Checkbox elements not found');
                    return false;
                }
                
                const isPrivacyChecked = readPrivacyCheckbox.checked;
                const isEULAChecked = agreementEULACheckbox.checked;
                
                // Clear previous error states
                this.clearCheckboxError(readPrivacyCheckbox,agreementEULACheckbox);
                
                // Both checkboxes must be checked
                if (!isPrivacyChecked && !isEULAChecked) {
                    this.showCheckboxError('Please accept both the Privacy Policy and EULA to continue');
                    this.highlightCheckbox(readPrivacyCheckbox, true);
                    this.highlightCheckbox(agreementEULACheckbox, true);
                    return false;
                } 
                else if (!isPrivacyChecked) {
                    this.showCheckboxError('Please accept the Privacy Policy to continue');
                    this.highlightCheckbox(readPrivacyCheckbox, true);
                    return false;
                } 
                else if (!isEULAChecked) {
                    this.showCheckboxError('Please accept the  End User License Agreement (EULA) to continue');
                    this.highlightCheckbox(agreementEULACheckbox, true);
                    return false;
                }
                
                // Both are checked - success
                return true;
            }
            /**
             * Display checkbox validation error message
             * param {string} message - Error message to display
             */
            showCheckboxError(message) {
                const errorElement = document.getElementById('checkboxValidation');
                if (errorElement) {
                    errorElement.textContent = message;
                    errorElement.classList.add('notvalid');
                }
            }
            /**
             * Clear checkbox validation error
             */
            clearCheckboxError(readPrivacyCheckbox,agreementEULACheckbox) {
                const errorElement = document.getElementById('checkboxValidation');
                if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.classList.remove('notvalid');
                }
                
                // Clear visual highlights                
                if (readPrivacyCheckbox) this.highlightCheckbox(readPrivacyCheckbox, false);
                if (agreementEULACheckbox) this.highlightCheckbox(agreementEULACheckbox, false);
            }

            /**
             * Highlight or unhighlight a checkbox with error state
             * param {HTMLElement} checkbox - Checkbox element
             * param {boolean} highlight - True to highlight, false to remove highlight
             */
            highlightCheckbox(checkbox, highlight) {
                const checkboxContainer = checkbox.closest('.checkbox-field');
                
                if (highlight) {
                    checkboxContainer?.classList.add('checkbox-error');
                    checkbox.setAttribute('aria-invalid', 'true');
                } else {
                    checkboxContainer?.classList.remove('checkbox-error');
                    checkbox.removeAttribute('aria-invalid');
                }
            }

            /**
             * Setup real-time validation for checkboxes
             */
            setupCheckboxListeners() {
                const readPrivacyCheckbox = document.getElementById('readPrivacy');
                const agreementEULACheckbox = document.getElementById('agreementEULA');
                
                // Clear error when either checkbox is checked
                [readPrivacyCheckbox, agreementEULACheckbox].forEach(checkbox => {
                    checkbox?.addEventListener('change', () => {
                        // Only validate if there was already an error showing
                        const errorElement = document.getElementById('checkboxValidation');
                        if (errorElement && errorElement.textContent) {
                            this.validateCheckbox();
                        }
                    });
                });
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

            handleURLParams() {
                const urlParams = new URLSearchParams(window.location.search);
                const referralCode = urlParams.get('ref') || urlParams.get('referralUuid');
               
                if (referralCode) {
                    this.formData.referralCode = referralCode;
                    // Auto-fill when we get to the referral step

                setTimeout(() => {
                    document.getElementById('referralCode').value = referralCode;
                    this.validateField('referralCode');
                }, 100);
                
                }
            }

            showDefaultReferral() {
                this.showStep('defaultReferralStep');
                this.updateBackButton(true);
            }

            useDefaultReferral() {
                const defaultCode = document.getElementById('defaultReferralCode').textContent.trim();
                this.formData.referralCode = defaultCode;
                
                // Go back to referral step and auto-fill
                this.showStep('referralStep');
                document.getElementById('referralCode').value = defaultCode;
                this.validateField('referralCode');
            }

            async handleReferralSubmit(e) {
                e.preventDefault();
                const submitBtn = document.getElementById('verifyReferralBtn');
                const referralCode = document.getElementById('referralCode').value.trim();
            
                 

                if (!this.validateField('referralCode')) {
                    this.focusFirstError('referralStep');
                    return;
                }

                this.setButtonLoading(submitBtn, true);

                try {
                    const isValid = await this.verifyReferralCode(referralCode);
                    if (isValid) {
                        this.formData.referralCode = referralCode;
                        this.goToStep(2);
                        this.announceStep('Referral code verified, proceeding to registration');
                    }
                } catch (error) {
                    this.showToast('Error verifying referral code.', 'error');
                } finally {
                    this.setButtonLoading(submitBtn, false);
                }
            }

            async handleRegistration(e) {
                e.preventDefault();
                
                const submitBtn = document.getElementById('registerBtn');
                
                // Validate all fields
                const emailValid = this.validateField('email');
                const usernameValid = this.validateField('username');
                const passwordValid = this.validatePassword();
                const confirmPasswordValid = this.validateField('confirmPassword');

                if (!emailValid || !usernameValid || !passwordValid || !confirmPasswordValid) {
                    this.focusFirstError('registrationStep');
                    this.showToast('Please correct the errors in the form','error');
                    this.announceStep('Please correct the errors in the form');
                    return;
                }
                // Validate checkboxes
                if (!this.validateCheckbox()) {
                    // Focus first unchecked checkbox
                    const readPrivacy = document.getElementById('readPrivacy');
                    const agreementEULA = document.getElementById('agreementEULA');
                    
                    if (!readPrivacy.checked) {
                        readPrivacy.focus();
                    } else if (!agreementEULA.checked) {
                        agreementEULA.focus();
                    }
                    return;
                }

                const formData = {
                    email: document.getElementById('email').value.trim(),
                    username: document.getElementById('username').value.trim(),
                    password: document.getElementById('password').value,
                    referralCode: this.formData.referralCode
                };

                this.setButtonLoading(submitBtn, true);

                try {
                    const success = await this.registerUser(formData);
                    if (success) {
                        this.goToStep(3);
                        this.announceStep('Registration successful! Welcome to peer!');
                    }
                } catch (error) {
                    this.showToast('Registration failed: ' + error.message, 'error');
                } finally {
                    this.setButtonLoading(submitBtn, false);
                }
            }    

            goToStep(stepNumber) {
                this.currentStep = stepNumber;
                this.showStep(this.getStepId(stepNumber));
               
                this.updateBackButton(stepNumber > 1);
                if(stepNumber > 2)
                this.updateBackButton(false);
                
               
            }

            getStepId(stepNumber) {
                const stepMap = {
                    
                    1: 'referralStep',
                    2: 'registrationStep',
                    3: 'successStep'
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
                    1: 'Referral Code Entry',
                    2: 'Registration Form',
                    3: 'Registration Complete'
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

                // Hide toast after 3 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }
            async  verifyReferralCode(referralString) {
              const accessToken = getCookie("authToken");

              /*const isValid = this.validators.referralCode.regex.test(referralString);
             
              if (!isValid) {
                 this.showToast('Invalid or missing referral code format.', 'error');
                return false;
              }*/
              
              const headers = new Headers({
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              });

              const graphql = JSON.stringify({
                query: `mutation VerifyReferralString ($referralString: String!) {
                    verifyReferralString(referralString: $referralString) {
                      ResponseCode
                      affectedRows {
                        uid
                        username
                        slug
                        img
                      }
                      status
                    }
                  }`,
                variables: {
                referralString,
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
                
                const data = result?.data?.verifyReferralString;
               

                if (data && data.status === "success") {
                  this.showToast(userfriendlymsg(data.ResponseCode), 'success');
                  return true;
                } else {
                  this.showToast(userfriendlymsg(data.ResponseCode), 'error');
                  return false;
                }

              } catch (error) {
                console.error("Error verifying referral code:", error);
                this.showToast('Error verifying referral code'+ error, 'error');
                return false;
              }
            }
            async registerUser(formData) {
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
  
                const variables = {
                    input: {
                    email: formData.email,
                    password: formData.password,
                    username: formData.username,
                    pkey: null,
                    referralUuid:formData.referralCode,
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
                        this.verifyUser2(result.data.register.userid);
                        this.showToast("Registration successfully. " + userfriendlymsg(result.data.register.ResponseCode), 'success');
                        return true;
                    }else {
                       if (result.data.register.ResponseCode === "30601") { //Email already registered.
                            const field = document.getElementById('emailField');
                            const validationElement = document.getElementById('emailValidation');
                            const message = userfriendlymsg(result.data.register.ResponseCode);
                            const validIcon = document.getElementById('emailValidIcon');
                            const isValid = false;
                            this.updateFieldValidation(field, validationElement, validIcon, isValid, message);
                       }else{
                        this.showToast("Registration failed. " + userfriendlymsg(result.data.register.ResponseCode), 'error');
                        console.error("Registration failed:" + result.data.register.ResponseCode);
                       }
                        return false;
                    }
                } catch (error) {
                    // Fehlerbehandlung bei Netzwerkfehlern oder anderen Problemen
                    console.error("An Error occured:", error);
                }


              
            }
            async verifyUser2(userid) {
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
                   
                    })
                    .catch((error) => {
                    
                    console.error("Error:", error);
                    });
            }
        }

        

        // Initialize the form when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            autoLogin();
            new AccessibleRegistrationForm();
        });

        // Additional utility for cookie handling (keeping your original function)
        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let c of ca) {
            c = c.trim();
            if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length));
            }
            return null;
        }
