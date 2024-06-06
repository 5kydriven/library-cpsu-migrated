<script setup>
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
    id: String,
})
</script>
<template>
    <div>
        <qrcode-vue :value="props.id" :size="150" level="H" />
        {{ props.id }}
    </div>
  </template>
  