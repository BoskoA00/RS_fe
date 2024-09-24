<script setup>
import { onMounted, ref } from 'vue'
import { API_BASE_URL, USER_ROLES } from '@/Stores/config'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AdsViewProfile from './AdsViewProfile.vue'
import { authState } from '@/Stores/Auth'

const route = useRoute()
const router = useRouter()
const user = ref(null)
const id = route.params.id
const pictureUrl = ref('')
async function getUser() {
  try {
    let response = await axios.get(API_BASE_URL + 'user/' + id)
    user.value = response.data.user || null
    pictureUrl.value = user.value.imagePath
      ? 'http://localhost:3000/' + user.value.imagePath
      : '/NoPic.png'
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getUser()
})

async function deleteUser() {
  try {
    await axios.delete(API_BASE_URL + 'user/' + id, {
      headers: {
        Authorization: `Bearer ${authState.authHeader}`
      }
    })
    router.push({ name: 'home' })
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <template v-if="user">
    <div class="main-profile-card">
      <div class="card">
        <img :src="pictureUrl" alt="Profile Picture" />
        <div>
          <h2>{{ user.firstName }} {{ user.lastName }}</h2>
          <h3>{{ user.role == USER_ROLES.ADMINISTRATOR ? 'Administrator' : '' }}</h3>
          <h3>{{ user.role == USER_ROLES.SELLER ? 'Prodavac' : '' }}</h3>
          <h3>{{ user.role == USER_ROLES.BUYER ? 'Kupac' : '' }}</h3>
          <p>{{ user.email }}</p>
          <button
            v-if="
              (authState.loggedUser && authState.loggedUser.role === USER_ROLES.ADMINISTRATOR) ||
              (authState.loggedUser && authState.loggedUser.id == id)
            "
            class="button delete"
            @click="deleteUser"
          >
            Izbriši profil
          </button>
          <button
            class="button update"
            v-if="
              (authState.loggedUser && authState.loggedUser.role === USER_ROLES.ADMINISTRATOR) ||
              (authState.loggedUser && authState.loggedUser.id == id)
            "
          >
            <RouterLink :to="{ name: 'updateProfile', params: { id: id } }"
              >Izmeni profil</RouterLink
            >
          </button>
        </div>
      </div>
    </div>
    <AdsViewProfile :userId="id" />
  </template>
  <template v-else>
    <h2>Profile not found or loading...</h2>
  </template>
</template>
<style scoped>
* {
  box-sizing: border-box;
  user-select: none;
  margin-top: 20px;
}

.main-profile-card {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  background: #224c83;
  color: #fdfcfd;
  font-family: 'Euclid Circular A', 'Poppins';
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card {
  display: flex;
  align-items: center;
  width: 75vw;
  max-width: 650px;
  padding: 50px 30px 50px 20px;
  background: #0f2746;
  border-radius: 24px;
}

.card img {
  max-width: 280px;
  width: 35vw;
  height: 300px;
  object-fit: cover;
  margin-left: -60px;
  margin-right: 30px;
  border-radius: inherit;
  box-shadow: 0 60px 40px rgb(0 0 0 / 8%);
}

.card h2 {
  font-size: 26px;
  font-weight: 400;
  margin-top: 0;
  margin-right: 30px;
  margin-bottom: 10px;
}

.card h3 {
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  opacity: 0.75;
}

.card p {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 30px;
  opacity: 0.5;
}

.card button {
  border: 1px solid #f8f8f8;
  background: transparent;
  color: #f8f8f8;
  font-family: inherit;
  padding: 16px 26px;
  font-size: 16px;
  border-radius: 40px;
}
.button {
  margin-left: 20px;
}
.button a {
  text-decoration: none;
  color: #f8f8f8;
}
.button:hover {
  cursor: pointer;
}
.delete:hover {
  background-color: red;
  transition: 0.5s ease-in;
}
.update:hover {
  background-color: rgb(102, 0, 255);
  transition: 0.5s ease-in;
}

@media (width <= 600px) {
  .card {
    margin: 75px 40px;
    padding-left: 50px;
    padding-right: 50px;
    padding-bottom: 60px;
    width: 100%;
    text-align: center;
    flex-direction: column;
  }

  .card h2 {
    margin-right: 0;
    font-size: 26px;
  }

  .card img {
    margin: -100px 0 30px 0;
    width: 100%;
    max-width: 1000px;
    height: 250px;
  }

  .card p {
    max-width: 360px;
  }
}

@media (width <= 440px) {
  .card img {
    height: 45vw;
    width: 45vw;
    border-radius: 50%;
    margin: -140px 0 30px 0;
  }
}
</style>
