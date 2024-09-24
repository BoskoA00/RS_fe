<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/Stores/config'
import QuestionComponent from '@/components/ForumPage/QuestionComponent.vue'

const questionsError = ref('')
const questions = ref([])

async function fetchQuestions() {
  try {
    questionsError.value = ''
    let response = await axios.get(API_BASE_URL + 'questions')
    questions.value = response.data
    questions.value = questions.value.reverse()
  } catch (error) {
    console.error(error)
    questionsError.value = error.message
  }
}
function handleQuestionDelete(qeustionId) {
  questions.value = questions.value.filter((question) => question._id !== qeustionId)
}

onMounted(() => {
  fetchQuestions()
})
</script>

<template>
  <div class="forum-div-main">
    <template v-if="questions.length > 0">
      <QuestionComponent
        v-for="question in questions"
        :key="question._id"
        :questionId="question._id"
        :title="question.title"
        :content="question.content"
        :userFirstName="question.userId.firstName"
        :userLastName="question.userId.lastName"
        :userPicture="question.userId.imagePath"
        :userId="question.userId._id"
        :onQuestionDelete="handleQuestionDelete"
      />
    </template>
    <template v-else>
      <h1>{{ questionsError || 'Trenutno nema pitanja.' }}</h1>
    </template>
  </div>
</template>

<style scoped>
.forum-div-main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 50px;
  overflow-y: auto;
}
</style>
