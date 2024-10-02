<script setup>
import AdsViewProfile from '@/components/ProfilePage/AdsViewProfile.vue'
import ProfileCard from '@/components/ProfilePage/ProfileCard.vue'
import { authState } from '@/Stores/Auth'
import { USER_ROLES } from '@/Stores/config'
</script>

<template>
  <ProfileCard />
  <AdsViewProfile
    v-if="authState.loggedUser.role != USER_ROLES.BUYER"
    :userId="authState.loggedUser.id"
  />
</template>
