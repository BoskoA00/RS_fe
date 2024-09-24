import { reactive } from 'vue'

export const authState = reactive({
  isLoggedIn: false,
  loggedUser: null,
  authHeader: null
})

export function Login(userData, token) {
  localStorage.setItem('user', JSON.stringify(userData))
  localStorage.setItem('token', token)
  authState.authHeader = token
  authState.isLoggedIn = true
  authState.loggedUser = userData
}

export function LogOut() {
  authState.authHeader = null
  authState.isLoggedIn = false
  authState.loggedUser = null
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}
