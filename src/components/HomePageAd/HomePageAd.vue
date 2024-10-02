<script setup>
import { ref } from 'vue'
import '../../assets/HomePageAd.css'
import axios from 'axios'
import { authState, LogOut } from '@/Stores/Auth'
import { API_BASE_URL, USER_ROLES } from '@/Stores/config'
import { modalData } from '@/Stores/Modal'
import { useRouter } from 'vue-router'
const props = defineProps({
  adId: String,
  title: String,
  city: String,
  country: String,
  size: Number,
  price: Number,
  image: String,
  type: Number,
  userFirstName: String,
  userLastName: String,
  userId: String,
  onAdDelete: Function
})
const router = useRouter()
const dropdownVisible = ref(false)

function toggleDropdown() {
  dropdownVisible.value = !dropdownVisible.value
}

async function deleteAd() {
  try {
    await axios.delete(API_BASE_URL + 'ads/' + props.adId, {
      headers: {
        Authorization: `Bearer ${authState.authHeader}`
      }
    })
    modalData.isVisible = true
    modalData.isGood = true
    modalData.message = 'Oglas uspesno izbrisan!'
    props.onAdDelete(props.adId)
  } catch (error) {
    console.error(error)
    if (error.response.data.message === 'Invalid token.') {
      LogOut()
      router.push('login')
    }
    const errorMessage = error.response?.data?.message || 'Došlo je do greške. Pokušajte ponovo.'
    modalData.isVisible = true
    modalData.isGood = false
    modalData.message = errorMessage
  }
}
</script>

<template>
  <div class="homepagead-card">
    <img
      class="main-picture"
      :src="`http://localhost:3000/ads-pictures/${props.image}`"
      alt="Ad Image"
    />

    <div class="homepagead-content">
      <div
        class="homepagead-options"
        v-if="
          (authState.loggedUser && authState.loggedUser.role === USER_ROLES.ADMINISTRATOR) ||
          (authState.loggedUser && authState.loggedUser.id === props.userId)
        "
      >
        <img src="/options.svg" @click.stop="toggleDropdown" />
        <div v-if="dropdownVisible" class="homepagead-dropdown">
          <button @click="deleteAd">
            <div>Izbriši</div>
            <div><img src="/DeleteAd.svg" /></div>
          </button>
          <RouterLink :to="{ name: 'updateAd', params: { id: props.adId } }">
            <button>
              <div>Izmeni</div>
              <div><img src="/EditAd.svg" /></div>
            </button>
          </RouterLink>
        </div>
      </div>
      <RouterLink :to="{ name: 'ad', params: { id: props.adId || 'default-id' } }">
        <p class="homepagead-title">{{ props.title }}</p>
        <p class="homepagead-description">{{ props.city + ',' + props.country }}</p>
        <p class="homepagead-description">Veličina: {{ props.size + 'm^2' }}</p>
        <p class="homepagead-description">Cena: {{ props.price + ' &#8364;' }}</p>
        <p class="homepagead-description">{{ props.userFirstName + ' ' + props.userLastName }}</p>
      </RouterLink>
    </div>
  </div>
</template>
