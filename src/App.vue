<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/UserAuthStore';
import { onBeforeMount } from 'vue';

const store = useAuthStore()

onBeforeMount(() => {
  store.init()
})
</script>

<template>
  <RouterView />
</template>

