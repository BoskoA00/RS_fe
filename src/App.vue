<script setup>
import { RouterLink, RouterView } from 'vue-router'
import './assets/navigation.css'
import { Login, LogOut, authState } from './Stores/Auth.js'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { USER_ROLES } from './Stores/config'
import ModalComponent from './components/Modal/ModalComponent.vue'

const router = useRouter()

function logOut() {
  LogOut()
  router.push({ name: 'login' })
}
onMounted(() => {
  const token = localStorage.getItem('token')
  const userData = localStorage.getItem('user')
  if (token && userData) {
    Login(JSON.parse(userData), token)
  }
})
</script>

<template>
  <div class="nav-main">
    <RouterLink to="/">
      <div class="logo-container">
        <div class="logo-image-div"><img src="/Logo.svg" /></div>
        <div class="app-name-div">
          <h1>RentASpot</h1>
        </div>
      </div>
    </RouterLink>
    <div class="links-div">
      <nav class="navigation-links">
        <div class="dropdown">
          <RouterLink to="/">Početna</RouterLink>
          <div
            v-if="
              authState.isLoggedIn &&
              (authState.loggedUser.role == USER_ROLES.ADMINISTRATOR ||
                authState.loggedUser.role == USER_ROLES.SELLER)
            "
            class="dropdown-menu"
          >
            <RouterLink to="/createAd">Kreiraj oglas</RouterLink>
            <RouterLink
              to="/users"
              v-if="authState.loggedUser && authState.loggedUser.role == USER_ROLES.ADMINISTRATOR"
              >Pregled korisnika</RouterLink
            >
          </div>
        </div>

        <div class="dropdown">
          <RouterLink to="/forum">Forum</RouterLink>
          <div v-if="authState.isLoggedIn" class="dropdown-menu">
            <RouterLink to="/createQuestion">Kreiraj pitanje</RouterLink>
          </div>
        </div>
        <RouterLink v-if="authState.isLoggedIn" to="/myProfile">Profil</RouterLink>
        <RouterLink v-if="!authState.isLoggedIn" to="/login">Uloguj se</RouterLink>
        <button v-if="authState.isLoggedIn" class="logout-button" @click="logOut">
          Izloguj se
        </button>
      </nav>
    </div>
    <ModalComponent />
  </div>

  <RouterView />
</template>

<style scoped></style>
