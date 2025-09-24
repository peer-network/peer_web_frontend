
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
                this.updateProgress();
                
                // Check for URL parameters
                this.handleURLParams();
                
                // Announce current step to screen readers
                this.announceStep();
            }

            setupEventListeners() {
                // Age verification
                document.getElementById('confirmAgeBtn')?.addEventListener('click', () => this.handleAgeConfirm());
                document.getElementById('underAgeBtn')?.addEventListener('click', () => this.handleAgeReject());

                // Referral code
                document.getElementById('referralForm')?.addEventListener('submit', (e) => this.handleReferralSubmit(e));
                document.getElementById('useDefaultCodeBtn')?.addEventListener('click', () => this.showDefaultReferral());
                document.getElementById('useThisCodeBtn')?.addEventListener('click', () => this.useDefaultReferral());

                // Registration
                document.getElementById('registrationForm')?.addEventListener('submit', (e) => this.handleRegistration(e));

                // Navigation
                document.getElementById('backBtn')?.addEventListener('click', () => this.goBack());

                // Copy buttons
                this.setupCopyButtons();

                // Password toggle
                document.getElementById('togglePasswordBtn')?.addEventListener('click', () => this.togglePasswordVisibility());

                // Real-time validation
                this.setupRealTimeValidation();
            }

            setupValidators() {
                this.validators = {
                    email: {
                        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Please enter a valid email address'
                    },
                    username: {
                        regex: /^[a-zA-Z][a-zA-Z0-9_]{4,19}$/,
                        message: 'Username must be 5-20 characters, starting with a letter'
                    },
                    referralCode: {
                        regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
                        message: 'Invalid referral code format'
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

                if (value === '') {
                    // Field is empty
                    this.clearFieldValidation(field, validationElement, validIcon);
                    return false;
                }

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

            validatePassword() {
                const passwordInput = document.getElementById('password');
                const password = passwordInput.value;
                
                const requirements = {
                    length: password.length >= 8,
                    upper: /[A-Z]/.test(password),
                    number: /\d/.test(password),
                    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
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
                let width = '25%';

                if (metCount >= 3) {
                    strength = 'medium';
                    width = '60%';
                }
                if (metCount === 4) {
                    strength = 'strong';
                    width = '100%';
                }

                if (strengthFill) {
                    strengthFill.className = `strength-fill ${strength}`;
                    strengthFill.style.width = width;
                }

                return Object.values(requirements).every(Boolean);
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

            setupCopyButtons() {
                document.querySelectorAll('.copy-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        
                        let textToCopy = '';
                        if (btn.id === 'copyReferralBtn') {
                            textToCopy = document.getElementById('referralCode').value;
                        } else if (btn.id === 'copyDefaultBtn') {
                            textToCopy = document.getElementById('defaultReferralCode').textContent.trim();
                        }

                        try {
                            await navigator.clipboard.writeText(textToCopy);
                            this.showToast('Referral code copied!', 'success');
                            
                            // Update button text temporarily
                            const originalText = btn.innerHTML;
                            btn.innerHTML = '✓';
                            setTimeout(() => btn.innerHTML = originalText, 1500);
                        } catch (err) {
                            this.showToast('Failed to copy code', 'error');
                        }
                    });
                });
            }

            togglePasswordVisibility() {
                const passwordInput = document.getElementById('password');
                const toggleBtn = document.getElementById('togglePasswordBtn');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleBtn.innerHTML = '🙈';
                    toggleBtn.setAttribute('aria-label', 'Hide password');
                } else {
                    passwordInput.type = 'password';
                    toggleBtn.innerHTML = '👁️';
                    toggleBtn.setAttribute('aria-label', 'Show password');
                }
            }

            handleURLParams() {
                const urlParams = new URLSearchParams(window.location.search);
                const referralCode = urlParams.get('ref') || urlParams.get('referralUuid');
                
                if (referralCode) {
                    this.formData.referralCode = referralCode;
                    // Auto-fill when we get to the referral step
                }
            }

            handleAgeConfirm() {
                this.goToStep(2);
                this.announceStep('Proceeding to referral code entry');
            }

            handleAgeReject() {
                this.showStep('ageRejection');
                this.announceStep('Age verification failed');
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
                    //return;
                }

                this.setButtonLoading(submitBtn, true);

                try {
                    const isValid = await this.verifyReferralCode(referralCode);
                    if (isValid) {
                        this.formData.referralCode = referralCode;
                        this.goToStep(3);
                        this.announceStep('Referral code verified, proceeding to registration');
                    }
                } catch (error) {
                    this.showToast('Error verifying referral code', 'error');
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
                    this.announceStep('Please correct the errors in the form');
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
                        this.goToStep(4);
                        this.announceStep('Registration successful! Welcome to peer!');
                    }
                } catch (error) {
                    this.showToast('Registration failed: ' + error.message, 'error');
                } finally {
                    this.setButtonLoading(submitBtn, false);
                }
            }

           

            async  verifyReferralCode(referralString) {
              const accessToken = getCookie("authToken");

              const isValid = this.validators.referralCode.regex.test(referralString);
             
              if (!isValid) {
                 this.showToast('Invalid or missing referral code format.', 'error');
                return false;
              }
              
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
                this.showToast('Error verifying referral code', 'error');
                return false;
              }
            }



            async registerUser(formData) {
                // Simulate API call - replace with actual implementation
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        // Mock success - in real app, make GraphQL call
                        if (Math.random() > 0.1) { // 90% success rate for demo
                            resolve(true);
                        } else {
                            reject(new Error('Email already exists'));
                        }
                    }, 2000);
                });
            }

            goToStep(stepNumber) {
                this.currentStep = stepNumber;
                this.showStep(this.getStepId(stepNumber));
                this.updateProgress();
                this.updateBackButton(stepNumber > 1);
                
                // Auto-fill referral code if we have it
                if (stepNumber === 2 && this.formData.referralCode) {
                    setTimeout(() => {
                        document.getElementById('referralCode').value = this.formData.referralCode;
                        this.validateField('referralCode');
                    }, 100);
                }
            }

            getStepId(stepNumber) {
                const stepMap = {
                    1: 'ageVerification',
                    2: 'referralStep',
                    3: 'registrationStep',
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

            updateProgress() {
                const progressFill = document.querySelector('.progress-fill');
                const progressPercentages = {
                    1: '25%',
                    2: '50%',
                    3: '75%',
                    4: '100%'
                };
                
                if (progressFill) {
                    progressFill.style.width = progressPercentages[this.currentStep];
                }

                // Update progress bar aria-label
                const progressBar = document.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.setAttribute('aria-valuenow', this.currentStep);
                    progressBar.setAttribute('aria-valuemax', '4');
                    progressBar.setAttribute('aria-valuetext', `Step ${this.currentStep} of 4`);
                }
            }

            updateBackButton(show) {
                const backBtn = document.getElementById('backBtn');
                if (backBtn) {
                    backBtn.style.display = show ? 'flex' : 'none';
                }
            }

            goBack() {
                if (this.currentStep > 1) {
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
                    1: 'Age Verification',
                    2: 'Referral Code Entry',
                    3: 'Registration Form',
                    4: 'Registration Complete'
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
        }

        

        // Initialize the form when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new AccessibleRegistrationForm();
        });

        // Additional utility for cookie handling (keeping your original function)
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }
