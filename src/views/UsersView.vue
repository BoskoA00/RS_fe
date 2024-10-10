<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { authState, LogOut } from '@/Stores/Auth'
import { API_BASE_URL, USER_ROLES } from '@/Stores/config'
import { useRouter } from 'vue-router'
import { modalData } from '@/Stores/Modal'

const router = useRouter()
const users = ref([])
const searchEmail = ref('')

async function fetchUsers() {
  try {
    const response = await axios.get(API_BASE_URL + 'user')
    users.value = response.data.users
  } catch (error) {
    console.error('Error fetching users:', error)
    const errorMessage = error.response?.data?.message || 'Došlo je do greške. Pokušajte ponovo.'
    modalData.isVisible = true
    modalData.isGood = false
    modalData.message = errorMessage
    users.value = []
  }
}

async function searchUsers() {
  if (!searchEmail.value) {
    return alert('Email is required for search.')
  }
  try {
    const response = await axios.get(`${API_BASE_URL}searchUsersByEmail`, {
      params: { wantedEmail: searchEmail.value },
      headers: {
        Authorization: `Bearer ${authState.authHeader}`
      }
    })
    users.value = response.data.users || []
  } catch (error) {
    console.error('Error searching users:', error)
    const errorMessage = error.response?.data?.message || 'Došlo je do greške. Pokušajte ponovo.'
    modalData.isVisible = true
    modalData.isGood = false
    modalData.message = errorMessage
  }
}
async function deleteUser(id) {
  try {
    await axios.delete(`${API_BASE_URL}user/${id}`, {
      headers: {
        Authorization: `Bearer ${authState.authHeader}`
      }
    })
    users.value = users.value.filter((user) => user._id !== id)
  } catch (error) {
    console.error('Error deleting user:', error)
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
async function promoteUser(id) {
  try {
    await axios.patch(API_BASE_URL + `promoteUser/${id}`, null, {
      headers: {
        Authorization: `Bearer ${authState.authHeader}`
      }
    })

    const index = users.value.findIndex((user) => user._id === id)
    if (index !== -1) {
      users.value[index].role = users.value[index].role + 1
    }
  } catch (error) {
    console.error('Error promoting user:', error)
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
async function demoteUser(id) {
  try {
    await axios.patch(API_BASE_URL + `demoteUser/${id}`, null, {
      headers: {
        Authorization: `Bearer ${authState.authHeader}`
      }
    })

    const index = users.value.findIndex((user) => user._id === id)
    if (index !== -1) {
      users.value[index].role = users.value[index].role - 1
    }
  } catch (error) {
    console.error('Error demoting user:', error)
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

onMounted(() => {
  if (!authState.isLoggedIn) {
    router.push({ name: 'home' })
  }
  if (authState.loggedUser.role !== USER_ROLES.ADMINISTRATOR) {
    router.push({ name: 'home' })
  }
  fetchUsers()
})
</script>
<template>
  <div class="users-main">
    <div class="search-container">
      <input
        type="text"
        v-model="searchEmail"
        placeholder="Pretraži korisnike po emailu"
        class="search-input"
      />
      <button @click="searchUsers" class="search-button">Pretraži</button>
    </div>
    <table class="users-table">
      <thead>
        <tr>
          <th>Ime i prezime</th>
          <th>Email</th>
          <th>Uloga</th>
          <th>Opcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id" class="user-row">
          <template v-if="authState.loggedUser && user._id != authState.loggedUser.id">
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>
              <RouterLink :to="{ name: 'profile', params: { id: user._id } }">
                {{ user.email }}
              </RouterLink>
            </td>
            <td v-if="user.role === USER_ROLES.BUYER">Kupac</td>
            <td v-else-if="user.role === USER_ROLES.SELLER">Prodavac</td>
            <td v-else-if="user.role === USER_ROLES.ADMINISTRATOR">Administrator</td>
            <td>
              <button
                v-if="user.role == USER_ROLES.BUYER"
                @click="deleteUser(user._id)"
                class="action-button delete"
              >
                Izbriši korisnika
              </button>
              <button
                v-if="user.role > USER_ROLES.BUYER"
                @click="demoteUser(user._id)"
                class="action-button delete"
              >
                Unazadi korisnika
              </button>
              <button
                v-if="user.role < USER_ROLES.ADMINISTRATOR"
                @click="promoteUser(user._id)"
                class="action-button update"
              >
                Unapredi korisnika
              </button>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.users-main {
  margin-top: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: c;
  background-color: #f3f4f6;
  padding: 20px;
  min-height: 80vh;
  overflow-y: auto;
  flex-direction: column;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}
.users-table a {
  text-decoration: none;
  color: black;
}

.users-table thead {
  background-color: #0f2746;
  color: white;
}

.users-table th,
.users-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.users-table th {
  font-size: 1.1em;
  letter-spacing: 0.05em;
}

.users-table tbody tr:hover {
  background-color: #f1f1f1;
}

.user-row td {
  font-size: 0.9em;
  color: #333;
}

.action-button {
  border: 1px solid #f8f8f8;
  background: #0f2746;
  color: #f8f8f8;
  font-family: inherit;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 40px;
  margin-left: 10px;
}

.delete {
  background-color: rgb(180, 3, 3);
}

.button:hover {
  cursor: pointer;
}

.delete:hover {
  background-color: rgb(143, 2, 2);
  transition: 0.5s ease-in;
  cursor: pointer;
}

.update:hover {
  background-color: rgb(102, 0, 255);
  transition: 0.5s ease-in;
}
.search-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.search-input {
  width: 30%;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 56px;
  border-radius: 6px;
  border: 0;
  background: rgba(17, 49, 70, 0.08);
  color: rgba(37, 37, 37, 0.38);
  padding: 0 16px;
  font-size: 16px;
}

.search-button {
  cursor: pointer;
  width: 20%;
  border-radius: 20px;
  height: 56px;
  padding: 0 16px;
  background: var(--color-primary);
  color: rgba(37, 37, 37, 0.38);
  border: 0;
  font-family: inherit;
  font-size: 18px;
  transition: all 0.375s;
}

.search-button:hover {
  background: rgb(102, 0, 255);
}

@media (max-width: 768px) {
  .users-table th,
  .users-table td {
    font-size: 0.85em;
    padding: 8px;
  }

  .action-button {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
