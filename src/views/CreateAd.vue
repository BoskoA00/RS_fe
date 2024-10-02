<script setup>
import { onMounted, ref } from 'vue'
import '../assets/CreateAd.css'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { authState, LogOut } from '@/Stores/Auth'
import { API_BASE_URL, USER_ROLES } from '@/Stores/config'
import { modalData } from '@/Stores/Modal'
const router = useRouter()
const isLoading = ref(false)
const title = ref('')
const city = ref('')
const country = ref('')
const size = ref('')
const price = ref('')
const pictures = ref([])
const type = ref(0)
const titleError = ref('')
const cityError = ref('')
const countryError = ref('')
const sizeError = ref('')
const priceError = ref('')
const pictureError = ref('')
function handleTitleChange() {
  titleError.value = ''
}
function handleCityChange() {
  cityError.value = ''
}
function handleCountryChange() {
  countryError.value = ''
}
function handleSizeChange() {
  sizeError.value = ''
}
function handlePriceChange() {
  priceError.value = ''
}
function handleFilesChange(e) {
  pictureError.value = ''
  const newFiles = e.target.files
  if (newFiles.length > 0) {
    const newFilesArray = Array.from(newFiles)
    pictures.value = [...pictures.value, ...newFilesArray]
  }
}
function removePicture(index) {
  pictures.value.splice(index, 1)
}

async function submitAd() {
  if (title.value.trim() == '') {
    titleError.value = 'Naslov oglasa je obavezan.'
    return
  }
  if (city.value.trim() == '') {
    cityError.value = 'Grad je obavezan.'
    return
  }
  if (country.value.trim() == '') {
    countryError.value = 'Država je obavezna.'
    return
  }
  if (size.value <= 0 || isNaN(size.value)) {
    size.value = ''
    sizeError.value = 'Veličina je neispravna.'
    return
  }
  if (price.value <= 0 || isNaN(price.value)) {
    price.value = ''
    priceError.value = 'Cena je neispravna.'
    return
  }
  if (pictures.value.length === 0) {
    pictureError.value = 'Dodajte barem jednu sliku.'
    return
  }
  try {
    isLoading.value = true
    let formData = new FormData()
    formData.append('title', title.value)
    formData.append('city', city.value)
    formData.append('country', country.value)
    formData.append('price', price.value)
    formData.append('size', size.value)
    formData.append('type', type.value)
    for (let i = 0; i < pictures.value.length; i++) {
      formData.append('pictures', pictures.value[i])
    }

    let response = await axios.post(API_BASE_URL + 'ads', formData, {
      headers: {
        Authorization: `Bearer ${authState.authHeader}`
      }
    })
    console.log(response)
    modalData.isVisible = true
    modalData.isGood = true
    modalData.message = response.data.message
    title.value = ''
    titleError.value = ''
    city.value = ''
    cityError.value = ''
    country.value = ''
    countryError.value = ''
    price.value = ''
    size.value = ''
    sizeError.value = ''
    pictures.value = []
    pictureError.value = ''
    type.value = 0
    priceError.value = ''
    isLoading.value = false
    router.push({ name: 'home', query: { refresh: Date.now() } })
  } catch (error) {
    console.log(error)
    isLoading.value = false
    if (error.response.data.message === 'Invalid token.') {
      modalData.isGood = false
      modalData.message = 'Istekao token. Ulogujte se ponovo.'
      modalData.isVisible = true
      LogOut()
      router.push('login')
    }
    const errorMessage = error.response?.data?.message || 'Došlo je do greške. Pokušajte ponovo.'
    console.log('Error:', errorMessage)
    modalData.isVisible = true
    modalData.isGood = false
    modalData.message = errorMessage
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  if (!authState.isLoggedIn) {
    router.push({ name: 'home' })
  }
  if (
    authState.loggedUser.role != USER_ROLES.SELLER &&
    authState.loggedUser.role != USER_ROLES.ADMINISTRATOR
  ) {
    router.push({ name: 'home' })
  }
})
</script>

<template>
  <div class="createAd-main">
    <template v-if="!isLoading">
      <div class="createAd-card">
        <h2>Kreiraj novi oglas</h2>
        <form class="createAd-form" @submit.prevent="submitAd()">
          <input type="text" v-model="title" placeholder="Naslov" @input="handleTitleChange" />
          <label class="errorLabel">{{ titleError }}</label>
          <input type="text" v-model="city" placeholder="Grad" @input="handleCityChange" />
          <label class="errorLabel">{{ cityError }}</label>
          <input type="text" v-model="country" placeholder="Država" @input="handleCountryChange" />
          <label class="errorLabel">{{ countryError }}</label>
          <input type="text" v-model="size" placeholder="Veličina(m^2)" @input="handleSizeChange" />
          <label class="errorLabel">{{ sizeError }}</label>
          <input
            type="text"
            v-model="price"
            placeholder="Cena(&#8364;)"
            @input="handlePriceChange"
          />
          <label class="errorLabel">{{ priceError }}</label>
          <select v-model="type">
            <option value="0">Prodaja</option>
            <option value="1">Iznajmljivanje</option>
          </select>
          <div class="createAd-fileInput-wrapper">
            <label for="file-upload" class="file-label">
              <span>Dodaj slike</span>
            </label>
            <input
              type="file"
              id="file-upload"
              @change="handleFilesChange"
              multiple
              accept="image/jpeg, image/png, image/gif"
            />
          </div>
          <label class="errorLabel">{{ pictureError }}</label>
          <ul v-if="pictures.length > 0" class="filesList">
            <li v-for="(file, index) in pictures" :key="index" class="fileLi">
              <div>
                {{ file.name }}
              </div>
              <div>
                <button type="button" @click="removePicture(index)">
                  <img src="/deleteAdImage.svg" />
                </button>
              </div>
            </li>
          </ul>
          <button type="submit">Kreiraj oglas</button>
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
  </div>
</template>
