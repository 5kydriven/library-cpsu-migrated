<script setup>
import Navbar from '@/components/adminNavbar.vue';
import Sidebar from '@/components/adminSidebar.vue';

</script>
<template>
    <Navbar />
    <Sidebar />
    <slot></slot>
</template>