<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL, USER_ROLES } from '@/Stores/config'
import { authState, LogOut } from '@/Stores/Auth'

const route = useRoute()
const userId = route.params.id
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const newPassword = ref('')
const selectedPicture = ref(null)
const pictureName = ref('')
const isLoading = ref(false)
const emailError = ref('')
const passwordError = ref('')
const firstNameError = ref('')
const lastNameError = ref('')
const pictureError = ref('')
const type = ref(0)
const router = useRouter()

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

function handleNewPasswordChange() {
  passwordError.value = ''
}

function handleFirstNameChange() {
  firstNameError.value = ''
}

function handleLastNameChange() {
  lastNameError.value = ''
}

async function updateUser() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (email.value !== '' && !emailPattern.test(email.value)) {
    emailError.value = 'Unesite validan email'
    return
  } else {
    emailError.value = null
  }

  if (newPassword.value.trim() !== '' && newPassword.value.length < 6) {
    passwordError.value = 'Nova lozinka mora imati bar 6 karaktera'
    return
  }
  isLoading.value = true
  try {
    let formData = new FormData()
    formData.append('email', email.value)
    formData.append('firstName', firstName.value)
    formData.append('lastName', lastName.value)
    formData.append('password', newPassword.value)
    formData.append('newPassword', newPassword.value)
    formData.append('image', selectedPicture.value)
    if (authState.loggedUser.role != 2) {
      formData.append('role', type.value)
    }
    let r = await axios.patch(API_BASE_URL + `user/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${authState.authHeader}`
      }
    })

    if (userId === authState.loggedUser.id) {
      authState.loggedUser.firstName = r.data.user.firstName
      authState.loggedUser.lastName = r.data.user.lastName
      authState.loggedUser.email = r.data.user.email
      authState.loggedUser.imagePath = r.data.user.imagePath
      if (authState.loggedUser.role != 2) {
        authState.loggedUser.role = r.data.user.role
      }
    }
    LogOut()
    router.push({ name: 'login' })
  } catch (e) {
    console.log(e)
    alert(e.message)
  } finally {
    isLoading.value = false
  }
}

async function fetchUser() {
  try {
    let r = await axios.get(API_BASE_URL + `user/${userId}`)
    firstName.value = r.data.user.firstName
    lastName.value = r.data.user.lastName
    email.value = r.data.user.email
    if (r.data.user.role < 2) {
      type.value = r.data.user.role
    } else {
      type.value = 1
    }
  } catch (error) {
    console.log(error)
  }
}

function submitForm() {
  updateUser()
}
onMounted(() => {
  fetchUser()
  if (!authState.isLoggedIn) {
    router.push({ name: 'home' })
  }
  if (authState.loggedUser.role != USER_ROLES.ADMINISTRATOR) {
    if (authState.loggedUser.id != userId) {
      router.push({ name: 'profile' })
    }
  }
})
</script>

<template>
  <template v-if="!isLoading">
    <div class="updateUser-main">
      <div class="card">
        <h2>Izmeni podatke</h2>
        <h3>Unesite nove podatke</h3>
        <form class="form" @submit.prevent="submitForm()">
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
          <input
            type="password"
            v-model="newPassword"
            placeholder="Nova lozinka"
            @input="handleNewPasswordChange"
          />
          <label class="errorLabel">{{ passwordError }}</label>
          <select v-model="type">
            <option value="0">Kupac</option>
            <option value="1">Prodavac</option>
          </select>
          <div class="file-input-wrapper">
            <label for="file-upload" class="file-label">
              <span>{{ selectedPicture ? pictureName : 'Izaberite sliku' }}</span>
            </label>
            <input type="file" id="file-upload" @change="handlePictureUpload" />
          </div>
          <label class="errorLabel">{{ pictureError }}</label>
          <button type="submit">Sačuvaj promene</button>
        </form>
      </div>
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
.updateUser-main {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  padding: 50px;
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

.form > :is(input, select) {
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

.form > select option {
  background-color: rgba(17, 49, 70, 0.9);
  color: white;
  padding: 10px;
}

.form > select option {
  cursor: pointer;
}

.errorLabel {
  padding-left: 10px;
}

@media (max-width: 768px) {
  .form > input,
  .form > select {
    width: 80%;
    margin: 0 auto;
  }

  .form > button {
    width: 100%;
  }

  .card {
    padding: 20px;
  }
  .file-input-wrapper {
    width: 80%;
    margin-left: 20px;
  }
}

.loader {
  display: flex;
  flex-wrap: wrap;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
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
