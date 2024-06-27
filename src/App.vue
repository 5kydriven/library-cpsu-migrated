<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/UserAuthStore';
import { onBeforeMount } from 'vue';

const authStore = useAuthStore()

onBeforeMount(() => {
  authStore.handleAuthState()
})
</script>

<template>
  <RouterView />
</template>
