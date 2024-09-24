<script setup>
import AdsViewProfile from '@/components/ProfilePage/AdsViewProfile.vue'
import ProfileCard from '@/components/ProfilePage/ProfileCard.vue'
import { authState } from '@/Stores/Auth'
</script>

<template>
  <ProfileCard />
  <AdsViewProfile :userId="authState.loggedUser.id" />
</template>
