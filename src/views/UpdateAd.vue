<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '@/assets/UpdateAd.css'
import { API_BASE_URL } from '@/Stores/config'
import { authState, LogOut } from '@/Stores/Auth'
import { modalData } from '@/Stores/Modal'
const route = useRoute()
const adId = route.params.id
const title = ref('')
const city = ref('')
const country = ref('')
const type = ref(0)
const size = ref('')
const price = ref('')
const titleError = ref('')
const priceError = ref('')
const cityError = ref('')
const countryError = ref('')
const sizeError = ref('')
const ad = ref(null)
const router = useRouter()
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

function submitAd() {
  if (title.value.trim() === '') {
    titleError.value = 'Naslov mora biti unet'
    return
  }
  if (price.value <= 0 || isNaN(price.value)) {
    priceError.value = 'Cena mora biti uneta'
    return
  }
  if (city.value.trim() === '') {
    cityError.value = 'Grad mora biti unet'
    return
  }
  if (country.value.trim() === '') {
    countryError.value = 'Država mora biti uneta'
    return
  }
  if (size.value <= 0 || isNaN(size.value)) {
    sizeError.value = 'Veličina mora biti uneta'
    return
  }
  updateAd()
}

async function updateAd() {
  try {
    await axios.patch(
      API_BASE_URL + `ads/${adId}`,
      {
        title: title.value,
        city: city.value,
        country: country.value,
        type: type.value,
        size: size.value,
        price: price.value
      },
      {
        headers: {
          Authorization: `Bearer ${authState.authHeader}`
        }
      }
    )
    modalData.isGood = true
    modalData.isVisible = true
    modalData.message = 'Oglas je uspešno izmenjen'
    router.push({ name: 'ad', params: { id: adId } })
  } catch (error) {
    console.log(error)
    if (error.response.data.message === 'Invalid token.') {
      modalData.isGood = false
      modalData.message = 'Istekao token. Ulogujte se ponovo.'
      modalData.isVisible = true
      LogOut()
      router.push('login')
    }
    const errorMessage = error.response?.data?.message || 'Došlo je do greške. Pokušajte ponovo.'
    modalData.isVisible = true
    modalData.isGood = false
    modalData.message = errorMessage
  }
}

async function fetchAd() {
  try {
    const response = await axios.get(`http://localhost:3000/ads/${adId}`)
    ad.value = response.data
    title.value = ad.value.title
    city.value = ad.value.city
    country.value = ad.value.country
    type.value = ad.value.type
    size.value = ad.value.size
    price.value = ad.value.price
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchAd()
  if (!authState.isLoggedIn) {
    router.push({ name: 'home' })
  }
})
</script>

<template>
  <div class="updateAd-main">
    <template v-if="ad">
      <div class="updateAd-card">
        <h2>Izmeni oglas</h2>
        <form class="updateAd-form" @submit.prevent="submitAd()">
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

          <button type="submit">Izmeni oglas</button>
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
