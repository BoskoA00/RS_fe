<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL } from '@/Stores/config'
import '@/assets/AdView.css'

const route = useRoute()
const id = route.params.id
const mainImg = ref('')
const ad = ref(null)

async function fetchAd() {
  try {
    const response = await axios.get(API_BASE_URL + 'ads/' + id)
    ad.value = response.data
    mainImg.value = response.data.picturePaths.length > 0 ? response.data.picturePaths[0] : ''
  } catch (error) {
    console.error(error)
  }
}
function changeImage(image) {
  mainImg.value = image
}
onMounted(() => {
  fetchAd()
})
</script>

<template>
  <div class="adview-main">
    <div class="adview-card" v-if="ad">
      <div class="adview-images-div">
        <div class="adview-main-image">
          <img
            :src="
              mainImg
                ? 'http://localhost:3000/ads-pictures/' + mainImg
                : 'path/to/default-image.png'
            "
            alt="Main Ad Image"
          />
        </div>
        <div class="adview-other-images">
          <div
            class="adview-other-image"
            v-for="(picturePath, index) in ad.picturePaths"
            :key="index"
          >
            <img
              @click="changeImage(picturePath)"
              :src="
                picturePath
                  ? 'http://localhost:3000/ads-pictures/' + picturePath
                  : 'path/to/default-image.png'
              "
              alt="Other Ad Image"
            />
          </div>
        </div>
      </div>
      <div class="adview-data-div">
        <div class="adview-data-title">
          <h1>
            {{ ad.title }}
          </h1>
        </div>
        <div class="adview-data-location">
          <h3>{{ ad.city }}, {{ ad.country }}</h3>
        </div>
        <div class="adview-data-price">
          <h3>{{ ad.price }} &#8364;</h3>
        </div>
        <div class="adview-data-size">
          <h3>{{ ad.size }} m²</h3>
        </div>
        <div class="adview-data-type">
          <h3>
            {{ ad.type === 0 ? 'Prodaja' : 'Iznajmljivanje' }}
          </h3>
        </div>
        <div class="adview-data-user">
          <RouterLink :to="{ name: 'profile', params: { id: ad.userId._id } }">
            <h3>{{ ad.userId.firstName }} {{ ad.userId.lastName }}</h3>
          </RouterLink>
        </div>
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>
