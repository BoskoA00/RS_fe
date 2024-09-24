<script setup>
import '@/assets/AdsViewProfile.css'
import { onMounted, ref } from 'vue'
import HomePageAd from '../HomePageAd/HomePageAd.vue'
import axios from 'axios'
const ads = ref([])
const isLoading = ref(false)
const props = defineProps({
  userId: String
})

async function fetchAds() {
  isLoading.value = true
  try {
    ads.value = []
    const response = await axios.get(`http://localhost:3000/adsByUser/${props.userId}`)
    ads.value = response.data
    ads.value = ads.value.reverse()
  } catch (error) {
    console.error('Error fetching ads:', error)
    ads.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAds()
})

function handleAdDeleted(adId) {
  const updatedAds = ads.value.filter((ad) => ad._id !== adId)
  ads.value = updatedAds
}
</script>

<template>
  <div class="adsviewprofile-main">
    <template v-if="!isLoading">
      <template v-if="ads.length > 0">
        <HomePageAd
          v-for="ad in ads"
          :key="ad._id"
          :adId="ad._id"
          :title="ad.title"
          :city="ad.city"
          :country="ad.country"
          :size="ad.size"
          :price="ad.price"
          :image="ad.picturePaths.length > 0 ? ad.picturePaths[0] : 'src/assets/NoImage.png'"
          :type="ad.type"
          :userFirstName="ad.userId.firstName"
          :userLastName="ad.userId.lastName"
          :userId="ad.userId._id"
          :onAdDelete="handleAdDeleted"
        />
      </template>
      <template v-else>
        <h1>Korisnik nema oglase.</h1>
      </template>
    </template>
    <template v-else> <h1>Ucitava oglase...</h1> </template>
  </div>
</template>
