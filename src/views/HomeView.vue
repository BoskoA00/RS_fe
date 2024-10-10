<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import axios from 'axios'
import HomePageAd from '@/components/HomePageAd/HomePageAd.vue'
import { API_BASE_URL } from '@/Stores/config'
import { useRoute } from 'vue-router'
import SearchComponent from '@/components/HomePageAd/SearchComponent.vue'

const ads = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const searchParams = ref({})
const route = useRoute()

async function fetchAds(page = 1) {
  try {
    let response = await axios.get(`${API_BASE_URL}ads?page=${page}`)
    ads.value = response.data.ads || []
    totalPages.value = response.data.totalPages
    currentPage.value = response.data.currentPage
  } catch (error) {
    console.log('API Error:', error)
    ads.value = []
  }
}

async function searchAdsByParams(params, page = 1) {
  try {
    searchParams.value = params

    const queryString = new URLSearchParams({
      city: params.city || '',
      country: params.country || '',
      maxPrice: params.maxPrice || '',
      minPrice: params.minPrice || '',
      maxSize: params.maxSize || '',
      minSize: params.minSize || '',
      type: params.type || '',
      page
    }).toString()

    let response = await axios.get(`${API_BASE_URL}adsBySearch?${queryString}`)

    ads.value = response.data.ads || []
    totalPages.value = response.data.totalPages
    currentPage.value = response.data.currentPage
  } catch (error) {
    console.log('API Error:', error)
    ads.value = []
  }
}

function handleAdDeleted(adId) {
  ads.value = ads.value.filter((ad) => ad._id !== adId)
}

onMounted(() => {
  fetchAds(1)
})

watch(
  () => route.query.refresh,
  () => {
    fetchAds()
  }
)

function changePage(page) {
  currentPage.value = page
  if (Object.keys(searchParams.value).length > 0) {
    searchAdsByParams(searchParams.value, page)
  } else {
    fetchAds(page)
  }
}

function resetAds() {
  currentPage.value = 1
  searchParams.value = {}
  fetchAds(1)
}

const paginationButtons = computed(() => {
  const buttons = []
  const total = totalPages.value

  if (total <= 1) return buttons

  if (currentPage.value > 1) {
    buttons.push(currentPage.value - 1)
  }

  buttons.push(currentPage.value)

  if (currentPage.value < total) {
    buttons.push(currentPage.value + 1)
  }

  return buttons
})
</script>

<template>
  <div class="homepage-main">
    <div class="search-component-div">
      <SearchComponent :searchAds="searchAdsByParams" :reset="resetAds" />
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

      <div class="pagination" v-if="paginationButtons.length > 0">
        <button
          v-for="page in paginationButtons"
          :key="page"
          @click="changePage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
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
  overflow-y: none;
  border: 3px solid #0f2746;
  margin-top: 50px;
  margin-right: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.homepage-ads {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  height: 90%;
  overflow-y: none;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  user-select: none;
  margin: 0 5px;
  padding: 10px 15px;
  border: 1px solid #0f2746;
  background-color: #ffffff;
  color: #0f2746;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
}

.pagination button.active {
  background-color: #0f2746;
  color: #ffffff;
}

.pagination button:hover {
  background-color: #0f2746;
  color: #ffffff;
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
    margin-right: 10px;
  }

  .homepage-ads {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    overflow-y: auto;
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
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    overflow-y: auto;
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
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    overflow-y: auto;
  }
}
</style>
