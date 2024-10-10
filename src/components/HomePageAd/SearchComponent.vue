<script setup>
import { API_BASE_URL } from '@/Stores/config'
import { modalData } from '@/Stores/Modal'
import axios from 'axios'
import { onMounted, ref } from 'vue'

const props = defineProps({
  searchAds: Function,
  reset: Function
})

const city = ref('')
const country = ref('')
const maxPrice = ref('')
const minPrice = ref('')
const minSize = ref('')
const maxSize = ref('')
const type = ref('')

const minPriceLimit = ref('')
const maxPriceLimit = ref('')
const minSizeLimit = ref('')
const maxSizeLimit = ref('')

const maxPriceError = ref('')
const minPriceError = ref('')
const maxSizeError = ref('')
const minSizeError = ref('')

function handleSearch() {
  let hasError = false

  maxPriceError.value = ''
  minPriceError.value = ''
  maxSizeError.value = ''
  minSizeError.value = ''

  const fieldsToCheck = [
    { value: maxPrice.value, name: 'maxPrice', errorLabel: maxPriceError },
    { value: minPrice.value, name: 'minPrice', errorLabel: minPriceError },
    { value: maxSize.value, name: 'maxSize', errorLabel: maxSizeError },
    { value: minSize.value, name: 'minSize', errorLabel: minSizeError }
  ]

  fieldsToCheck.forEach((field) => {
    if (field.value.trim() && isNaN(field.value.trim())) {
      field.errorLabel.value = `${
        field.name === 'maxPrice'
          ? 'Maksimalna cena'
          : field.name === 'minPrice'
            ? 'Minimalna cena'
            : field.name === 'maxSize'
              ? 'Maksimalna veličina'
              : 'Minimalna veličina'
      } mora biti broj.`
      hasError = true
    }
  })

  if (minPrice.value.trim() && !isNaN(minPrice.value.trim())) {
    const minPriceValue = Number(minPrice.value.trim())
    if (minPriceValue < minPriceLimit.value) {
      minPriceError.value = `Minimalna moguća cena je ${minPriceLimit.value} €`
      hasError = true
    } else if (maxPrice.value.trim() && !isNaN(maxPrice.value.trim())) {
      const maxPriceValue = Number(maxPrice.value.trim())
      if (minPriceValue >= maxPriceValue) {
        minPriceError.value = 'Minimalna cena ne može biti veća ili jednaka maksimalnoj ceni.'
        hasError = true
      }
    }
  }

  if (maxPrice.value.trim() && !isNaN(maxPrice.value.trim())) {
    const maxPriceValue = Number(maxPrice.value.trim())
    if (maxPriceValue > maxPriceLimit.value) {
      maxPriceError.value = `Maksimalna moguća cena je ${maxPriceLimit.value} €`
      hasError = true
    } else if (minPrice.value.trim() && !isNaN(minPrice.value.trim())) {
      const minPriceValue = Number(minPrice.value.trim())
      if (maxPriceValue <= minPriceValue) {
        maxPriceError.value = 'Maksimalna cena ne može biti manja ili jednaka minimalnoj ceni.'
        hasError = true
      }
    }
  }

  if (minSize.value.trim() && !isNaN(minSize.value.trim())) {
    const minSizeValue = Number(minSize.value.trim())
    if (minSizeValue < minSizeLimit.value) {
      minSizeError.value = `Minimalna moguća veličina je ${minSizeLimit.value} m²`
      hasError = true
    } else if (maxSize.value.trim() && !isNaN(maxSize.value.trim())) {
      const maxSizeValue = Number(maxSize.value.trim())
      if (minSizeValue >= maxSizeValue) {
        minSizeError.value =
          'Minimalna veličina ne može biti veća ili jednaka maksimalnoj veličini.'
        hasError = true
      }
    }
  }

  if (maxSize.value.trim() && !isNaN(maxSize.value.trim())) {
    const maxSizeValue = Number(maxSize.value.trim())
    if (maxSizeValue > maxSizeLimit.value) {
      maxSizeError.value = `Maksimalna moguća veličina je ${maxSizeLimit.value} m²`
      hasError = true
    } else if (minSize.value.trim() && !isNaN(minSize.value.trim())) {
      const minSizeValue = Number(minSize.value.trim())
      if (maxSizeValue <= minSizeValue) {
        maxSizeError.value =
          'Maksimalna veličina ne može biti manja ili jednaka minimalnoj veličini.'
        hasError = true
      }
    }
  }

  if (hasError) return

  const searchParams = {
    city: city.value || '',
    country: country.value || '',
    maxPrice: maxPrice.value.trim() !== '' ? Number(maxPrice.value.trim()) : 0,
    minPrice: minPrice.value.trim() !== '' ? Number(minPrice.value.trim()) : 0,
    maxSize: maxSize.value.trim() !== '' ? Number(maxSize.value.trim()) : 0,
    minSize: minSize.value.trim() !== '' ? Number(minSize.value.trim()) : 0,
    type: type.value
  }

  props.searchAds(searchParams)
}

function resetAds() {
  city.value = ''
  country.value = ''
  maxPrice.value = ''
  minPrice.value = ''
  maxSize.value = ''
  minSize.value = ''
  type.value = ''
  props.reset()
}

async function getLimitations() {
  try {
    let r = await axios.get(API_BASE_URL + 'adsSearchParams')
    minPriceLimit.value = r.data.minPrice
    maxPriceLimit.value = r.data.maxPrice
    minSizeLimit.value = r.data.minSize
    maxSizeLimit.value = r.data.maxSize
  } catch (error) {
    console.log(error)
    const errorMessage = error.response?.data?.message || 'Došlo je do greške. Pokušajte ponovo.'
    modalData.isVisible = true
    modalData.isGood = false
    modalData.message = errorMessage
  }
}
onMounted(() => {
  getLimitations()
})
</script>

<template>
  <div class="card">
    <h2>Pretraga</h2>
    <form class="form" @submit.prevent="handleSearch">
      <input type="text" v-model="city" placeholder="Grad" />
      <input type="text" v-model="country" placeholder="Država" />
      <input type="text" v-model="maxPrice" placeholder="Maksimalna cena (&#8364;)" />
      <label>{{ maxPriceError }}</label>
      <input type="text" v-model="minPrice" placeholder="Minimalna cena (&#8364;)" />
      <label>{{ minPriceError }}</label>

      <input type="text" v-model="maxSize" placeholder="Maksimalna veličina (m^2)" />
      <label>{{ maxSizeError }}</label>

      <input type="text" v-model="minSize" placeholder="Minimalna veličina (m^2)" />
      <label>{{ minSizeError }}</label>

      <select v-model="type">
        <option value="">Sve</option>
        <option value="0">Prodaja</option>
        <option value="1">Iznajmljivanje</option>
      </select>
      <button type="button" @click="handleSearch">Pretraga</button>
      <button type="button" @click="resetAds">Reset</button>
    </form>
  </div>
</template>

<style scoped>
.card {
  user-select: none;
  width: 100%;
  margin: 0 20px;
  padding: 70px 30px 44px;
  border-radius: 20px;
  background: rgba(17, 49, 70, 0.17);
  backdrop-filter: blur(10px);
  text-align: center;
}

@media (min-width: 448px) {
  .card {
    margin: 0;
    width: 70%;
    min-width: 400px;
  }
}

@media (min-width: 628px) {
  .card {
    padding: 0 60px;
    width: 100%;
    max-width: 800px;
    min-width: auto;
    display: flex;
    border-radius: 20px;
    flex-direction: column;
    padding-bottom: 20px;
    justify-content: center;
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

.form > :is(input, button, select) {
  width: 100%;
  height: 56px;
  border-radius: 6px;
  border: 0;
}

.form > input,
.form > select {
  color: rgba(37, 37, 37, 0.38);
  background: rgba(17, 49, 70, 0.08);
  font-family: inherit;
  font-size: 16px;
  padding: 0 16px;
}

.form > input:focus,
.form > select:focus {
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
  color: white;
  border: 0;
  font-family: inherit;
  font-size: 18px;
  font-weight: 400;
  text-align: center;
  transition: all 0.375s;
}

.form > button:hover {
  background-color: darken(var(--color-primary), 10%);
}

@media (max-width: 768px) {
  .card {
    padding: 30px 20px;
    margin: 0 10px;
    border-radius: 10px;
  }

  .form {
    gap: 12px;
  }

  .form > input,
  .form > select,
  .form > button {
    height: 48px;
    width: 90%;
  }
  .form > button {
    width: 100%;
  }
  .card > h2 {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 20px;
    margin: 0 5px;
    border-radius: 10px;
  }

  .form > input,
  .form > select,
  .form > button {
    height: 44px;
    font-size: 14px;
    width: 90%;
  }

  .card > h2 {
    font-size: 24px;
  }
}
</style>
