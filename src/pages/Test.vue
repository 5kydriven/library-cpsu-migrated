<script setup>
import { ref } from 'vue';
import qrCode from "@/components/studentComp/qrCode.vue"
import { useToast } from "primevue/usetoast";
const toast = useToast();

const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });

};

const op = ref();

const OpToggle = (event) => {
    op.value.toggle(event);
}

</script>
<template>
      <section class="bg-gray-50 dark:bg-gray-900">
        <div class=" px-4 mx-auto max-w-2xl  bg-white">
            <div class="flex justify-between items-center p-5 ">
              <img src="/logo.png" width="50" alt="">
              <h1 class="font-bold text-2xl">CPSU Library</h1>
              <div class="flex items-center">
                    <div class="flex items-center ms-3">
                        <div>
                            <button type="button" @click="OpToggle"
                                class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                <span class="sr-only">Open user menu</span>
                                <img class="w-8 h-8 rounded-full"
                                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                    alt="user photo">
                            </button>
                        </div>
                        <OverlayPanel ref="op">
                            <div class="text-base list-none bg-white">
                                <div class="px-4 py-3" role="none">
                                    <p class="text-sm text-gray-900 dark:text-white" role="none">
                                        Neil Sims
                                    </p>
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                                        role="none">
                                        neil.sims@flowbite.com
                                    </p>
                                </div>
                                <hr>
                                <ul class="py-1" role="none">
                                    <li>
                                        <a href="#"
                                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                            role="menuitem">Settings</a>
                                    </li>
                                    <li>
                                        <a class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                            role="menuitem">Sign out</a>
                                    </li>
                                </ul>
                            </div>
                        </OverlayPanel>
                    </div>
              </div>
            </div>
            <div class=" flex flex-col items-center bg-[url('/background.jpg')]">
                <img src="/logo.png" class="mt-10 border-4 border-green-600 rounded-full" width="100px" height="100px" alt="">
                <span class="mb-4 text-xl font-bold text-gray-900 dark:text-white">John Doe</span>
                <span class="text-gray-400">BSIT</span>
            </div>
            <div>
                <div>
                    <span class="ont-bold text-gray-900">Email</span>
                    <div class="">
                        <span>sample@gmail.com</span>
                    </div>
                </div>
                <div class="w-full flex justify-center">
                  <qrCode/>
                </div>
            </div>
        </div>
      </section>
</template>