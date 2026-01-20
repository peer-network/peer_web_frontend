<script setup lang="ts">
/**
 * LoginForm.vue - Vue 3 Login Component
 * Matches exact HTML structure from login.php for CSS compatibility
 */
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

// Form state
const email = ref('')
const password = ref('')
const rememberMe = ref(true)
const showPassword = ref(false)

// Validation state
const emailTouched = ref(false)
const passwordTouched = ref(false)
const emailError = ref('')
const passwordError = ref('')

// Check for saved email from registration
onMounted(() => {
  const savedEmail = sessionStorage.getItem('newUserEmail')
  if (savedEmail) {
    email.value = savedEmail
    sessionStorage.removeItem('newUserEmail')
  }
  authStore.initializeFromCookies()
})

// Computed
const isFormValid = computed(() => {
  return email.value.length > 0 && password.value.length > 0 && !emailError.value && !passwordError.value
})

const emailFieldClass = computed(() => ({
  'valid': emailTouched.value && !emailError.value && email.value,
  'invalid': emailTouched.value && emailError.value
}))

const passwordFieldClass = computed(() => ({
  'valid': passwordTouched.value && !passwordError.value && password.value,
  'invalid': passwordTouched.value && passwordError.value
}))

// Validators (matching existing login.js logic)
function validateEmail(): boolean {
  emailTouched.value = true
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!regex.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
    return false
  }
  emailError.value = ''
  return true
}

function validatePassword(): boolean {
  passwordTouched.value = true
  if (!password.value.trim()) {
    passwordError.value = 'Please enter a valid password'
    return false
  }
  passwordError.value = ''
  return true
}

// Submit handler
async function handleSubmit() {
  const emailValid = validateEmail()
  const passwordValid = validatePassword()

  if (!emailValid || !passwordValid) {
    // Focus first error field
    if (!emailValid) {
      document.querySelector<HTMLInputElement>('#vue-email')?.focus()
    } else if (!passwordValid) {
      document.querySelector<HTMLInputElement>('#vue-password')?.focus()
    }
    return
  }

  const success = await authStore.login(email.value, password.value, rememberMe.value)
  
  if (success) {
    window.location.href = 'dashboard.php'
  }
}

// Toggle password visibility
function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="form-step active" id="vueLoginStep">
    <div class="step-header">
      <div class="peerLogo">
        <img src="/svg/PeerLogoWhite.svg" alt="Peer logo">
      </div>
      <h2 class="x_large_font">
        Hey there,<br />
        Welcome back
      </h2>
      <p class="large_font">It's good to see you again! Log in to continue your journey with us!</p>
    </div>

    <form @submit.prevent="handleSubmit" id="vueLoginForm" novalidate>
      <!-- Email Field -->
      <div class="input-group">
        <div class="input-field" id="vueEmailField" :class="emailFieldClass">
          <span class="input-icon" aria-hidden="true">
            <i class="peer-icon peer-icon-envelope"></i>
          </span>
          <input 
            v-model="email"
            type="email" 
            id="vue-email"
            name="email"
            placeholder="E-mail"
            required
            aria-describedby="vueEmailValidation"
            autocomplete="email"
            @blur="validateEmail"
          />
          <span v-if="emailTouched && !emailError && email" class="validation-icon show" aria-hidden="true">
            <i class="peer-icon peer-icon-tick-circle"></i>
          </span>
        </div>
        <div class="validation-message medium_font" id="vueEmailValidation" role="alert" aria-live="polite">
          {{ emailError }}
        </div>
      </div>

      <!-- Password Field -->
      <div class="input-group">
        <div class="input-field" id="vuePasswordField" :class="passwordFieldClass">
          <span class="input-icon" aria-hidden="true">
            <i class="peer-icon peer-icon-lock"></i>
          </span>
          <input 
            v-model="password"
            :type="showPassword ? 'text' : 'password'" 
            id="vue-password"
            name="password"
            placeholder="Password"
            required
            aria-describedby="vuePasswordValidation"
            autocomplete="current-password"
            @blur="validatePassword"
          />
          <span 
            class="toggle-passwordBtn-icon" 
            @click="togglePassword"
            title="Toggle password visibility" 
            aria-label="Show/hide password"
          >
            <i :class="showPassword ? 'peer-icon peer-icon-eye-open' : 'peer-icon peer-icon-eye-close'"></i>
          </span>
        </div>
        <div class="validation-message medium_font" id="vuePasswordValidation" role="alert" aria-live="polite">
          {{ passwordError }}
        </div>
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="input-group remember_forgetlink">
        <div class="checkbox-field" id="vueRememberMeField">
          <label class="checkbox-wrapper" for="vueRememberMe">
            <input 
              v-model="rememberMe"
              type="checkbox" 
              id="vueRememberMe"
              name="rememberMe"
            />
            <span class="checkbox-label medium_font">
              Remember me
            </span>
          </label>
        </div>
        <div class="forgetpassword-link medium_font">
          <a href="forgotpassword.php">Forgot password?</a>
        </div>
      </div>

      <!-- Error Message from API -->
      <div v-if="authStore.error" class="error-warning medium_font">
        <span aria-hidden="true">
          <i class="peer-icon peer-icon-warning"></i>
        </span>
        Login failed. Please check your credentials.
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        class="btn btn-primary" 
        id="vueLoginBtn"
        :disabled="authStore.isLoading"
        :class="{ loading: authStore.isLoading }"
      >
        {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <div class="line-with-text"><span class="medium_font">OR</span></div>
    
    <a href="register.php" class="btn btn-white">
      Register now 
      <span aria-hidden="true"><i class="peer-icon medium_font peer-icon-arrow-right-bold"></i></span>
    </a>
  </div>
</template>

<style scoped>
/* 
 * No custom styles needed - component uses existing CSS classes
 * from css/login-register.css which is already loaded by login.php
 */
.validation-icon.show {
  display: inline-block;
}
</style>
