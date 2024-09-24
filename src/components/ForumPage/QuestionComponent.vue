<script setup>
import { authState, LogOut } from '@/Stores/Auth'
import { API_BASE_URL, USER_ROLES } from '@/Stores/config'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AnswerComponent from './AnswerComponent.vue'

const router = useRouter()
const answers = ref([])
const props = defineProps({
  questionId: String,
  title: String,
  content: String,
  userId: String,
  userFirstName: String,
  userLastName: String,
  userPicture: String,
  onQuestionDelete: Function
})

const showOptions = ref(false)

async function fetchAnswers() {
  try {
    answers.value = []
    const response = await axios.get(API_BASE_URL + `answersByQuestion/${props.questionId}`)
    answers.value = response.data || []
    answers.value = answers.value.reverse()
  } catch (error) {
    answers.value = []
    console.error(error)
  }
}
function handleAnswerDelete(answerId) {
  answers.value = answers.value.filter((answer) => answer._id !== answerId)
}

function toggleOptions() {
  showOptions.value = !showOptions.value
}

function handleUpdate() {
  router.push({ name: 'updateQuestion', params: { id: props.questionId } })
}

async function handleDelete() {
  try {
    await axios.delete(API_BASE_URL + 'questions/' + props.questionId, {
      headers: {
        Authorization: `Bearer ${authState.authHeader}`
      }
    })
    props.onQuestionDelete(props.questionId)
  } catch (error) {
    if (error.response.data.message === 'Invalid token.') {
      LogOut()
      router.push('login')
    }
  }
}
function handleAnswer() {
  router.push({ name: 'createAnswer', params: { id: props.questionId } })
}
onMounted(() => {
  fetchAnswers()
})
</script>

<template>
  <div class="question-container">
    <div class="question-header">
      <div class="question-title">
        {{ props.title }}
      </div>
      <div class="question-user-options">
        <div class="question-userImg">
          <img :src="'http://localhost:3000/' + props.userPicture || 'assets/NoPic.png'" />
        </div>
        <div class="question-user">
          <RouterLink
            :to="{ name: 'profile', params: { id: props.userId } }"
            class="question-userName"
          >
            {{ props.userFirstName }} {{ props.userLastName }}
          </RouterLink>
        </div>
        <div class="question-options" v-if="authState.isLoggedIn">
          <button @click="toggleOptions" class="options-button">
            <img class="options-img" src="/options.svg" alt="Options" />
          </button>
          <div v-if="showOptions" class="options-menu">
            <button @click="handleAnswer" class="menu-option">
              Odgovori na pitanje
              <img src="/answer.svg" alt="Delete" class="menu-icon" />
            </button>
            <button
              @click="handleUpdate"
              class="menu-option"
              v-if="
                authState.loggedUser.role === USER_ROLES.ADMINISTRATOR ||
                authState.loggedUser.id === userId
              "
            >
              Izmeni pitanje
              <img src="/EditAd.svg" alt="Edit" class="menu-icon" />
            </button>
            <button
              @click="handleDelete"
              class="menu-option"
              v-if="
                authState.loggedUser.role === USER_ROLES.ADMINISTRATOR ||
                authState.loggedUser.id === userId
              "
            >
              Izbrisi pitanje
              <img src="/DeleteAd.svg" alt="Delete" class="menu-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="question-content">
      <h2>
        {{ props.content }}
      </h2>
    </div>
    <div class="question-answers">
      <template v-if="answers.length > 0">
        <AnswerComponent
          v-for="answer in answers"
          :key="answer._id"
          :answerId="answer._id"
          :userFirstName="answer.userId.firstName"
          :userLastName="answer.userId.lastName"
          :userId="answer.userId._id"
          :content="answer.content"
          :onAnswerDelete="handleAnswerDelete"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.question-container {
  border: 5px solid #224c83;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 90%;
  margin: 10px;
  min-height: 12vh;
  padding: 15px 20px;
  border-radius: 20px;
  height: 40vh;
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.question-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 0px 10px;
  border-bottom: 5px solid #224c83;
  align-items: flex-end;
}

.question-title {
  font-size: 28px;
  color: #224c83;
  width: 70%;
  margin-bottom: 10px;
}

.question-user-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 30%;
}

.question-user {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex: 1;
}

.question-userName {
  color: #224c83;
  text-decoration: none;
  margin-right: 10px;
  font-size: 18px;
}

.question-userImg {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border: 1px solid black;
}

.question-userImg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.question-options {
  position: relative;
}

.options-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.options-img {
  width: 30px;
  height: 30px;
}

.options-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  min-width: 250px;
}

.menu-option {
  background: none;
  border: none;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.menu-option:hover {
  background: #f0f0f0;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}

.question-content {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 95%;
  padding: 10px 10px;
  color: #224c83;
  border-bottom: 3px solid #224c83;
  align-items: flex-end;
  font-size: 14px;
}

.question-answers {
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .question-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }

  .question-title {
    font-size: 22px;
    width: 100%;
  }

  .question-user-options {
    width: 100%;
    justify-content: flex-start;
  }

  .question-userImg {
    width: 50px;
    height: 50px;
  }

  .question-userName {
    font-size: 16px;
  }

  .options-img {
    width: 25px;
    height: 25px;
  }

  .options-menu {
    min-width: 200px;
  }

  .menu-option {
    font-size: 14px;
  }

  .menu-icon {
    width: 16px;
    height: 16px;
  }

  .question-content {
    font-size: 12px;
    padding: 5px;
  }
}

@media (max-width: 480px) {
  .question-container {
    padding: 10px;
    height: auto;
    max-height: none;
  }

  .question-header {
    padding: 5px;
  }

  .question-title {
    font-size: 18px;
    width: 100%;
  }

  .question-user-options {
    width: 100%;
    justify-content: flex-start;
  }

  .question-userImg {
    width: 40px;
    height: 40px;
  }

  .question-userName {
    font-size: 14px;
  }

  .options-img {
    width: 20px;
    height: 20px;
  }

  .options-menu {
    min-width: 150px;
  }

  .menu-option {
    font-size: 12px;
    padding: 8px;
  }

  .menu-icon {
    width: 14px;
    height: 14px;
  }

  .question-content {
    font-size: 10px;
    padding: 5px;
  }
}
</style>
