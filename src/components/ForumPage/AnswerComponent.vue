<script setup>
import { authState, LogOut } from '@/Stores/Auth'
import { API_BASE_URL, USER_ROLES } from '@/Stores/config'
import { modalData } from '@/Stores/Modal'
import axios from 'axios'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  content: String,
  userFirstName: String,
  userLastName: String,
  userId: String,
  answerId: String,
  onAnswerDelete: Function
})

const showOptions = ref(false)

const toggleOptions = () => {
  showOptions.value = !showOptions.value
}

const handleUpdate = () => {
  router.push({ name: 'updateAnswer', params: { id: props.answerId } })
}

async function handleDelete() {
  try {
    await axios.delete(API_BASE_URL + `answers/${props.answerId}`, {
      headers: {
        Authorization: `Bearer ${authState.authHeader}`
      }
    })
    props.onAnswerDelete(props.answerId)
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
</script>

<template>
  <div class="answer-container">
    <div class="answer-content">
      <h3>{{ props.content }}</h3>
    </div>
    <div class="answer-user">
      <RouterLink :to="{ name: 'profile', params: { id: props.userId } }">
        <div>
          <p>
            {{ props.userFirstName }}
          </p>
        </div>
        <div>
          <p>
            {{ props.userLastName }}
          </p>
        </div>
      </RouterLink>
    </div>
    <div
      class="options"
      v-if="
        (authState.loggedUser && authState.loggedUser.role === USER_ROLES.ADMINISTRATOR) ||
        (authState.loggedUser && authState.loggedUser.id === userId)
      "
    >
      <button @click="toggleOptions" class="options-button">
        <img src="/options.svg" alt="Options" />
      </button>
      <div v-if="showOptions" class="options-menu">
        <button @click="handleUpdate" class="menu-option">Izmeni odgovor</button>
        <button @click="handleDelete" class="menu-option">Izbriši odgovor</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.answer-container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  padding: 10px;
  border: 1px solid #224c83;
  margin: 10px 10px;
  border-radius: 20px;
  overflow-x: auto;
  min-height: 13vh;
}

.answer-content {
  flex: 1;
  padding: 10px;
  width: 80%;
  color: #224c83;
  text-align: start;
  overflow-wrap: break-word;
}

.answer-user {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  height: 100%;
}

.answer-user a {
  text-decoration: none;
  color: #224c83;
}

.options {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  height: 100%;
}

.options-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.options img {
  width: 25px;
  height: 25px;
}

.options-menu {
  position: absolute;
  top: 0%;
  right: 100%;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.menu-option {
  background: none;
  border: none;
  padding: 10px;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.menu-option:hover {
  background: #f0f0f0;
}

@media (max-width: 768px) {
  .answer-container {
    flex-direction: row;
    align-items: flex-start;
    padding: 10px;
  }

  .answer-content {
    width: 100%;
    padding: 5px;
    font-size: 14px;
  }

  .answer-user {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    height: 100%;
  }

  .options-menu {
    top: auto;
    right: 0;
    min-width: 100px;
  }

  .menu-option {
    font-size: 14px;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .answer-container {
    flex-direction: row;
    padding: 5px;
  }

  .answer-content {
    font-size: 12px;
    padding: 5px;
  }

  .answer-user {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    height: 100%;
  }

  .options img {
    width: 20px;
    height: 20px;
  }

  .options-menu {
    top: auto;
    right: 0;
    min-width: 90px;
  }

  .menu-option {
    font-size: 12px;
    padding: 6px;
  }
}
</style>
