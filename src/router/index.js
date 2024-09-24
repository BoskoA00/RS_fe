import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ForumView from '../views/ForumView.vue'
import ProfileView from '@/views/ProfileView.vue'
import AuthView from '@/views/AuthView.vue'
import CreateAd from '@/views/CreateAd.vue'
import CreateQuestion from '@/views/CreateQuestion.vue'
import UpdateProfile from '@/views/UpdateProfile.vue'
import Ad from '@/views/AdView.vue'
import UserProfile from '@/components/ProfilePage/UserProfile.vue'
import UpdateAd from '@/views/UpdateAd.vue'
import UpdateQuestion from '@/views/UpdateQuestion.vue'
import CreateAnswer from '@/views/CreateAnswer.vue'
import UpdateAnswer from '@/views/UpdateAnswer.vue'
import UsersView from '@/views/UsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/forum', name: 'forum', component: ForumView },
    { path: '/myProfile', name: 'myProfile', component: ProfileView },
    { path: '/login', name: 'login', component: AuthView },
    { path: '/createAd', name: 'createAd', component: CreateAd },
    { path: '/createQuestion', name: 'createQuestion', component: CreateQuestion },
    { path: '/updateProfile/:id', name: 'updateProfile', component: UpdateProfile },
    { path: '/ad/:id', name: 'ad', component: Ad },
    { path: '/profile/:id', name: 'profile', component: UserProfile },
    { path: '/updateAd/:id', name: 'updateAd', component: UpdateAd },
    { path: '/updateQuestion/:id', name: 'updateQuestion', component: UpdateQuestion },
    { path: '/createAnswer/:id', name: 'createAnswer', component: CreateAnswer },
    { path: '/updateAnswer/:id', name: 'updateAnswer', component: UpdateAnswer },
    { path: '/users', name: 'users', component: UsersView }
  ]
})

export default router
