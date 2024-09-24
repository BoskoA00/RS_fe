<script setup>
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import HomePageAd from '@/components/HomePageAd/HomePageAd.vue'
import { API_BASE_URL } from '@/Stores/config'
import { useRoute } from 'vue-router'
import SearchComponent from '@/components/HomePageAd/SearchComponent.vue'

const ads = ref([])
const route = useRoute()
async function fetchAds() {
  try {
    let response = await axios.get(API_BASE_URL + 'ads')
    ads.value = response.data || []
  } catch (error) {
    console.log('API Error:', error)
    ads.value = []
  }
}
async function searchAdsByParams(params) {
  try {
    ads.value = []

    const queryString = new URLSearchParams({
      city: params.city || '',
      country: params.country || '',
      maxPrice: params.maxPrice || '',
      minPrice: params.minPrice || '',
      maxSize: params.maxSize || '',
      minSize: params.minSize || '',
      type: params.type || ''
    }).toString()

    let response = await axios.get(`${API_BASE_URL}adsBySearch?${queryString}`)

    ads.value = response.data || []
    ads.value = ads.value.reverse()
  } catch (error) {
    console.log('API Error:', error)
    ads.value = []
  }
}

function handleAdDeleted(adId) {
  ads.value = ads.value.filter((ad) => ad._id !== adId)
}

onMounted(() => {
  fetchAds()
})
watch(
  () => route.query.refresh,
  () => {
    fetchAds()
  }
)
</script>

<template>
  <div class="homepage-main">
    <div class="search-component-div">
      <SearchComponent :searchAds="searchAdsByParams" :reset="fetchAds" />
    </div>
    <div class="ads-components-div">
      <div v-if="ads.length > 0" class="homepage-ads">
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
      </div>
      <div class="no-ads-div" v-else>
        <h1>Nema dostupnih oglasa</h1>
      </div>
    </div>
  </div>
</template>
<style scoped>
.homepage-main {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: start;
  min-height: 80vh;
  flex-wrap: nowrap;
}

.search-component-div {
  width: 30%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 50px;
}

.ads-components-div {
  width: 70%;
  min-height: 100vh;
  overflow-y: auto;
  border: 3px solid #0f2746;
  margin-top: 50px;
  margin-right: 20px;
  border-radius: 20px;
}

.homepage-ads {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
  gap: 20px;
}

.no-ads-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

@media (max-width: 1024px) {
  .search-component-div {
    width: 100%;
    padding: 20px;
  }

  .ads-components-div {
    width: 100%;
    margin-right: 0;
  }

  .homepage-ads {
    grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
  }
}

@media (max-width: 768px) {
  .homepage-main {
    flex-direction: column;
    align-items: center;
  }

  .search-component-div {
    width: 100%;
    margin-top: 20px;
    padding: 0;
  }

  .ads-components-div {
    width: 80%;
    margin-top: 0;
    margin-top: 20px;
  }

  .homepage-ads {
    grid-template-columns: repeat(auto-fill, minmax(50%, 1fr));
  }
}

@media (max-width: 480px) {
  .search-component-div {
    padding: 10px;
  }

  .ads-components-div {
    width: 80%;
    margin-top: 10px;
  }

  .homepage-ads {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
}
</style>
