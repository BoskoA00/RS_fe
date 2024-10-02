<script setup>
import { authState, LogOut } from '@/Stores/Auth'
import { API_BASE_URL } from '@/Stores/config'
import { modalData } from '@/Stores/Modal'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const questionId = route.params.id
const router = useRouter()
const content = ref('')
const contentError = ref('')
const isLoading = ref(false)

function handleContentChange() {
  if (content.value.trim() === '') {
    contentError.value = 'Sadržaj odgovora mora postojati.'
  } else {
    contentError.value = ''
  }
}
async function submitAnswer() {
  if (content.value.trim() === '') {
    contentError.value = 'Sadržaj odgovora mora postojati.'
    return
  }

  try {
    isLoading.value = true
    await axios.post(
      API_BASE_URL + 'answers',
      {
        questionId: questionId,
        content: content.value
      },
      {
        headers: {
          Authorization: `Bearer ${authState.authHeader}`
        }
      }
    )
    isLoading.value = false
    router.push({ name: 'forum' })
  } catch (error) {
    console.error(error)
    if (error.response.data.message === 'Invalid token.') {
      modalData.isGood = false
      modalData.message = 'Istekao token. Ulogujte se ponovo.'
      modalData.isVisible = true
      LogOut()
      router.push('login')
    }
    contentError.value = error.message
    isLoading.value = false
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  if (!authState.isLoggedIn) {
    router.push({ name: 'home' })
  }
})
</script>

<template>
  <template v-if="!isLoading">
    <div class="createAnswer-main">
      <div class="createAnswer-card">
        <h2>Kreiraj nov odgovor</h2>
        <form class="createAnswer-form" @submit.prevent="submitAnswer()">
          <textarea
            type="text"
            v-model="content"
            placeholder="Sadrzaj odgovora..."
            @input="handleContentChange"
          ></textarea>
          <label class="errorLabel">{{ contentError }}</label>

          <button type="submit">Kreiraj odgovor</button>
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
@keyframes rotate {
  100% {
    background-position: 25% 50%;
  }
}

:root {
  --color-primary: #3192e5;
}

.createAnswer-main {
  padding-top: 30px;
  padding-bottom: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.errorLabel {
  padding-left: 10px;
}
.createAnswer-card {
  width: 100%;
  margin: 0 20px;
  padding: 70px 30px 44px;
  border-radius: 20px;
  background: rgba(17 49 70 / 17%);
  backdrop-filter: blur(10px);
  text-align: center;
}

@media (width >= 448px) {
  .createAnswer-card {
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
  .createAnswer-card {
    padding: 0 44px;
    width: 100%;
    max-width: 800px;
    min-width: auto;
    display: flex;
    border-radius: 20px;
    flex-direction: column;
    justify-content: center;
  }
}

.createAnswer-card > h2 {
  font-size: 36px;
  font-weight: 400;
  margin: 0 0 12px;
}

.createAnswer-card > h3 {
  color: rgba(37, 37, 37, 0.38);
  margin: 0 0 48px;
  font-weight: 400;
  font-size: 16px;
}

.createAnswer-form {
  width: 100%;
  margin: 0;
  display: grid;
  gap: 16px;
  padding-bottom: 20px;
}
.createAnswer-fileInput-wrapper {
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

.createAnswer-form > :is(input, button) {
  width: 100%;
  height: 56px;
  border-radius: 6px;
  border: 0;
}

.createAnswer-form > input {
  color: rgba(37, 37, 37, 0.38);
  background: rgba(17, 49, 70, 0.08);
  font-family: inherit;
  font-size: 16px;
  padding: 0 16px;
}
.createAnswer-form > textarea {
  color: rgba(37, 37, 37, 0.38);
  background: rgba(17, 49, 70, 0.08);
  font-family: inherit;
  font-size: 16px;
  padding: 0 16px;
  height: 250px;
  resize: none;
  border-radius: 20px;
  padding: 15px;
  overflow-y: auto;
}

.createAnswer-form > input:focus {
  outline: var(--color-primary);
}

.createAnswer-form > input::placeholder {
  color: rgba(37, 37, 37, 0.38);
}
.createAnswer-form > textarea:focus {
  outline: var(--color-primary);
}

.createAnswer-form > textarea::placeholder {
  color: rgba(37, 37, 37, 0.38);
}

.createAnswer-form > button {
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

.createAnswer-form > a {
  color: var(--color-primary);
  font-size: 16px;
  text-align: left;
  text-decoration: none;
  margin-bottom: 30px;
}

.createAnswer-form label {
  display: block;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px 0 8px;
  color: rgba(37, 37, 37, 0.38);
}

.createAnswer-form label input {
  visibility: hidden;
  display: none;
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
