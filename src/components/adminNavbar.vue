<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/UserAuthStore';
import { auth } from '@/stores/firebase';

const store = useAuthStore();

const op = ref();

const OpToggle = (event) => {
    op.value.toggle(event);
}
</script>

<template>
    <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center justify-start rtl:justify-end">
                    <a class="flex ms-2 md:me-24">
                        <img src="/logo.png" class="h-8 me-3" alt="FlowBite Logo" />
                        <span
                            class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Library
                            System</span>
                    </a>
                </div>
                <div class="flex items-center">
                    <div class="flex items-center ms-3">
                        <div>
                            <Button type="button" @click="store.logoutUser" label="Logout" severity="danger" size="small" icon="pi pi-sign-out"/>
                            
                        </div>
                        <!-- <OverlayPanel ref="op">
                            <div class="text-base list-none bg-white">
                                <div class="px-4 py-3" role="none">
                                    <p class="text-sm text-gray-900 dark:text-white" role="none">
                                        Neil Sims
                                    </p>
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                                        role="none">
                                        {{auth.currentUser.email}}
                                    </p>
                                </div>
                                <hr>
                                <ul class="py-1" role="none">
                                    <li>
                                        <a @click="store.logoutUser"
                                            class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">Sign
                                            out</a>
                                    </li>
                                </ul>
                            </div>
                        </OverlayPanel> -->
                    </div>
                </div>
            </div>
        </div>
    </nav>

</template>