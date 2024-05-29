<script setup>
import Navbar from '@/components/adminNavbar.vue';
import Sidebar from '@/components/adminSidebar.vue';

</script>
<template>
    <Navbar />
    <Sidebar />
    <div class="p-2 sm:ml-64">
        <div class="p-2 mt-14">
            <slot></slot>
        </div>
    </div>
</template>