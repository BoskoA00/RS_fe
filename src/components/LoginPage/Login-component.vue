<script setup>
import { ref } from 'vue'
import { Login } from '@/Stores/Auth'
import { API_BASE_URL } from '@/Stores/config'
import axios from 'axios'
import { useRouter } from 'vue-router'
const loginForm = ref(true)
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const type = ref(0)
const selectedPicture = ref(null)
const pictureName = ref('')
const isLoading = ref(false)
const emailError = ref('')
const passwordError = ref('')
const confirmationPasswordError = ref('')
const firstNameError = ref('')
const lastNameError = ref('')
const pictureError = ref('')

const router = useRouter()

function formChangeHandler() {
  firstName.value = ''
  lastName.value = ''
  password.value = ''
  confirmPassword.value = ''
  selectedPicture.value = null
  pictureName.value = ''
  email.value = ''
  type.value = 0
  confirmPassword.value = ''
  firstNameError.value = ''
  lastNameError.value = ''
  passwordError.value = ''
  confirmationPasswordError.value = ''
  pictureError.value = ''
  emailError.value = ''
  loginForm.value = !loginForm.value
}

function handlePictureUpload(e) {
  pictureError.value = ''
  selectedPicture.value = e.target.files[0]
  if (selectedPicture.value) {
    pictureName.value = selectedPicture.value.name
  }
}
function handleEmailChange() {
  emailError.value = ''
}
function handlePasswordChange() {
  passwordError.value = ''
}
function handleConfirmPasswordChange() {
  confirmationPasswordError.value = ''
}

function handleFirstNameChange() {
  firstNameError.value = ''
}

function handleLastNameChange() {
  lastNameError.value = ''
}

async function loginUser() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email.value)) {
    emailError.value = 'Unesite validan email'
    return
  } else {
    emailError.value = null
  }
  if (password.value.length < 6) {
    passwordError.value = 'Lozinka mora imati bar 6 karaktera'
    return
  } else {
    passwordError.value = null
    isLoading.value = true
  }

  try {
    let response = await axios.post(API_BASE_URL + 'user/login', {
      email: email.value,
      password: password.value
    })
    let { token, user } = response.data
    Login(user, token)
    isLoading.value = false
    email.value = ''
    password.value = ''
    router.push({ name: 'myProfile' })
  } catch (e) {
    console.log(e)
    email.value = ''
    password.value = ''
    isLoading.value = false
  } finally {
    email.value = ''
    password.value = ''
    isLoading.value = false
  }
}

function registerUser() {
  if (firstName.value.trim() == '') {
    firstNameError.value = 'Morate uneti ime'
    return
  }
  if (lastName.value.trim() == '') {
    lastNameError.value = 'Morate uneti prezime'
    return
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email.value)) {
    emailError.value = 'Unesite validan email'
    return
  } else {
    emailError.value = null
  }
  if (password.value.trim() == '' || password.value.length < 6) {
    passwordError.value = 'Lozinka mora imati bar 6 karaktera'
    return
  }
  if (confirmPassword.value != password.value.trim()) {
    confirmationPasswordError.value = 'Lozinke se ne podudaraju'
    return
  }
  if (selectedPicture.value == null) {
    pictureError.value = 'Morate odabrati sliku'
    return
  }
  isLoading.value = true
  try {
    let formData = new FormData()
    formData.append('email', email.value)
    formData.append('firstName', firstName.value)
    formData.append('lastName', lastName.value)
    formData.append('role', type.value)
    formData.append('image', selectedPicture.value)
    formData.append('password', password.value)
    axios.post(API_BASE_URL + 'user/register', formData)
    isLoading.value = false
    formChangeHandler()
  } catch (e) {
    isLoading.value = false
    alert(e.message)
  } finally {
    isLoading.value = false
  }
}

function submitForm() {
  if (loginForm.value) {
    loginUser()
  } else {
    registerUser()
  }
}
</script>

<template>
  <template v-if="!isLoading">
    <div class="card">
      <h2>{{ loginForm ? 'Login' : 'Registruj se' }}</h2>
      <h3>Unesite vaše podatke</h3>
      <form class="form" @submit.prevent="submitForm()">
        <template v-if="loginForm">
          <input type="text" v-model="email" placeholder="Email" @input="handleEmailChange" />
          <label class="errorLabel">{{ emailError }}</label>
          <input
            type="password"
            v-model="password"
            placeholder="Password"
            @input="handlePasswordChange"
          />
          <label class="errorLabel">{{ passwordError }}</label>
        </template>

        <template v-else>
          <input type="text" v-model="firstName" placeholder="Ime" @input="handleFirstNameChange" />
          <label class="errorLabel">{{ firstNameError }}</label>
          <input
            type="text"
            v-model="lastName"
            placeholder="Prezime"
            @input="handleLastNameChange"
          />
          <label class="errorLabel">{{ lastNameError }}</label>
          <input type="email" v-model="email" placeholder="Email" @input="handleEmailChange" />
          <label class="errorLabel">{{ emailError }}</label>
          <input
            type="password"
            v-model="password"
            placeholder="Lozinka"
            @input="handlePasswordChange"
          />
          <label class="errorLabel">{{ passwordError }}</label>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="Potvrda lozinke"
            @input="handleConfirmPasswordChange"
          />
          <label class="errorLabel">{{ confirmationPasswordError }}</label>
          <select v-model="type">
            <option value="0">Kupac</option>
            <option value="1">Prodavac</option>
          </select>
          <div class="file-input-wrapper">
            <label for="file-upload" class="file-label">
              <span>{{ selectedPicture ? pictureName : 'Slika' }}</span>
            </label>
            <input type="file" id="file-upload" @change="handlePictureUpload" />
          </div>
          <label class="errorLabel">{{ pictureError }}</label>
        </template>
        <label>
          <input type="checkbox" :checked="!loginForm" @change="formChangeHandler" />
          <span class="checkbox-wrapper">
            <span class="checkbox"></span>
          </span>
          <span class="checkbox-text">
            {{ loginForm ? 'Niste registrovani? Napravite nalog.' : 'Registraciona forma' }}
          </span>
        </label>
        <button type="submit">
          {{ loginForm ? 'Login' : 'Register' }}
        </button>
      </form>
    </div>
  </template>
  <template v-else>
    <div class="loader">
      <div class="square" id="sq1"></div>
      <div class="square" id="sq2"></div>
      <div class="square" id="sq3"></div>
      <div class="square" id="sq4"></div>
      <div class="square" id="sq5"></div>
      <div class="square" id="sq6"></div>
      <div class="square" id="sq7"></div>
      <div class="square" id="sq8"></div>
      <div class="square" id="sq9"></div>
    </div>
  </template>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

@keyframes rotate {
  100% {
    background-position: 25% 50%;
  }
}

:root {
  --color-primary: #3192e5;
}

body {
  display: grid;
  place-items: center;
  margin: 0;
  height: 100vh;
  padding: 0 24px;
  background-color: var(--color-primary);
  background-image: url('bg.svg');
  background-repeat: no-repeat;
  background-size: cover;
  font-family: 'Euclid Circular A';
  color: rgba(37, 37, 37, 0.38);
  animation: rotate 6s infinite alternate linear;
}
.errorLabel {
  padding-left: 10px;
}
.card {
  width: 100%;
  margin: 0 20px;
  padding: 70px 30px 44px;
  border-radius: 20px;
  background: rgba(17 49 70 / 17%);
  backdrop-filter: blur(10px);
  text-align: center;
}

@media (width >= 448px) {
  .card {
    margin: 0;
    width: 70%;
    min-width: 400px;
  }
}

@media (width >= 500px) {
  body {
    padding: 0;
  }
}

@media (width >= 628px) {
  .card {
    padding: 0 44px;
    width: 100%;
    max-width: 800px;
    min-width: auto;
    display: flex;
    border-radius: 20px;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 20px;
  }
}

.card > h2 {
  font-size: 36px;
  font-weight: 400;
  margin: 0 0 12px;
}

.card > h3 {
  color: rgba(37, 37, 37, 0.38);
  margin: 0 0 48px;
  font-weight: 400;
  font-size: 16px;
}

.form {
  width: 100%;
  margin: 0;
  display: grid;
  gap: 16px;
}
.file-input-wrapper {
  position: relative;
  width: 100%;
  height: 56px;
  background: rgba(17, 49, 70, 0.08);
  color: rgba(37, 37, 37, 0.38);
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
}

.file-label {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.file-input-wrapper input[type='file'] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-label span {
  color: rgba(37, 37, 37, 0.38);
}

.file-label span::before {
  content: 'Upload: ';
  font-weight: bold;
}
.form > :is(input, button) {
  width: 100%;
  height: 56px;
  border-radius: 6px;
  border: 0;
}

.form > input {
  color: rgba(37, 37, 37, 0.38);
  background: rgba(17, 49, 70, 0.08);
  font-family: inherit;
  font-size: 16px;
  padding: 0 16px;
}

.form > input:focus {
  outline: var(--color-primary);
}

.form > input::placeholder {
  color: rgba(37, 37, 37, 0.38);
}

.form > button {
  cursor: pointer;
  width: 100%;
  height: 56px;
  padding: 0 16px;
  background: var(--color-primary);
  color: rgba(37, 37, 37, 0.38);
  border: 0;
  font-family: inherit;
  font-size: 18px;
  font-weight: 400;
  text-align: center;
  transition: all 0.375s;
}

.form > a {
  color: var(--color-primary);
  font-size: 16px;
  text-align: left;
  text-decoration: none;
  margin-bottom: 30px;
}

.form label {
  display: block;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px 0 8px;
  color: rgba(37, 37, 37, 0.38);
}

.form label input {
  visibility: hidden;
  display: none;
}
.form > select {
  width: 100%;
  height: 56px;
  border-radius: 6px;
  border: 0;
  color: rgba(37, 37, 37, 0.38);
  background: rgba(17, 49, 70, 0.08);
  font-family: inherit;
  font-size: 16px;
  padding: 0 16px;
  appearance: none;
}

.form > select {
  width: 100%;
  height: 56px;
  border-radius: 6px;
  border: 0;
  color: rgba(37, 37, 37, 0.38);
  background: rgba(17, 49, 70, 0.08);
  font-family: inherit;
  font-size: 16px;
  padding: 0 16px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.form > select option {
  background-color: rgba(17, 49, 70, 0.9);
  color: white;
  padding: 10px;
}
.form > select option:hover {
  cursor: pointer;
}

.form input:checked ~ .checkbox-wrapper .checkbox {
  transform: rotate(45deg);
  width: 14px;
  margin-left: 12px;
  margin-top: -2px;
  border-color: var(--color-primary);
  border-top-color: transparent;
  border-left-color: transparent;
  border-radius: 0;
}

.checkbox-wrapper {
  width: 32px;
  height: 32px;
}

.checkbox {
  display: block;
  width: inherit;
  height: inherit;
  border: 3px solid rgb(17 49 70 / 22%);
  border-radius: 6px;
  transition: all 0.375s;
}
@keyframes loader_5191 {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.square {
  background: #ddd;
  width: 10px;
  height: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -5px;
  margin-left: -5px;
}

#sq1 {
  margin-top: -25px;
  margin-left: -25px;
  animation: loader_5191 675ms ease-in-out 0s infinite alternate;
}

#sq2 {
  margin-top: -25px;
  animation: loader_5191 675ms ease-in-out 75ms infinite alternate;
}

#sq3 {
  margin-top: -25px;
  margin-left: 15px;
  animation: loader_5191 675ms ease-in-out 150ms infinite;
}

#sq4 {
  margin-left: -25px;
  animation: loader_5191 675ms ease-in-out 225ms infinite;
}

#sq5 {
  animation: loader_5191 675ms ease-in-out 300ms infinite;
}

#sq6 {
  margin-left: 15px;
  animation: loader_5191 675ms ease-in-out 375ms infinite;
}

#sq7 {
  margin-top: 15px;
  margin-left: -25px;
  animation: loader_5191 675ms ease-in-out 450ms infinite;
}

#sq8 {
  margin-top: 15px;
  animation: loader_5191 675ms ease-in-out 525ms infinite;
}

#sq9 {
  margin-top: 15px;
  margin-left: 15px;
  animation: loader_5191 675ms ease-in-out 600ms infinite;
}
</style>
