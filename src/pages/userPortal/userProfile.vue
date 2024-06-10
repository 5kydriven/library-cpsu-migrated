<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/stores/firebase';
import { useAuthStore } from '@/stores/UserAuthStore';
import qrCode from "@/components/studentComp/qrCode.vue"
import { useToast } from "primevue/usetoast";
import loader from '@/components/loader.vue';

const isLoading = ref(false)
const store = useAuthStore()
const toast = useToast();

const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });

};

const op = ref();

const OpToggle = (event) => {
    op.value.toggle(event);
}

const uid = ref()
onMounted(() => {
    isLoading.value = true
    onAuthStateChanged(auth, (userDetails) => {
        console.log(userDetails);
        if (userDetails) {
          uid.value = userDetails.uid;
          getStudent()
        //   router.push( "/dashboard" );
        } else {
          // isLoading.value = false;
          console.log("not signed in");
        //   router.replace({ name: "signin" });         
        }
        // isLoading.value = true;
      });

})

const student = ref({})

const getStudent = async ()=>{
    const queryStudent = query(collection(db, 'students'), where('uid', '==', uid.value));

    try {
        const querySnapshot = await getDocs(queryStudent);
            querySnapshot.forEach((doc) => {
              student.value = {...student.value, ...doc.data()}
              console.log(doc.data());
        });
        isLoading.value = false
    } catch (error) {
        console.error('Error getting documents: ', error);
    }
}

</script>
<template>
    <loader v-if="isLoading"/>
      <section class="bg-gray-50 dark:bg-gray-900" v-else>
        <div class="mx-auto max-w-2xl bg-white">
            <div class="flex justify-between items-center p-5">
              <img src="/logo.png" width="50" alt="">
              <h1 class="font-bold text-2xl">CPSU Library</h1>
              <div class="flex items-center">
                    <div class="flex items-center ms-3">
                        <div>
                            <button type="button" @click="OpToggle"
                                class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-green-500 dark:focus:ring-green-600"
                                aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                <span class="sr-only">Open user menu</span>
                                <img class="w-8 h-8 rounded-full"
                                    :src="student.image"
                                    alt="user photo" v-if="student.image">
                                <img class="w-8 h-8 rounded-full"
                                    src="/default.jpg"
                                    alt="user photo" v-else>
                            </button>
                        </div>
                        <OverlayPanel ref="op">
                            <div class="text-base list-none bg-white">
                                <div class="px-4 py-3" role="none">
                                    <p class="text-sm text-gray-900 dark:text-white" role="none">
                                        {{ student.name }}
                                    </p>
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                                        role="none">
                                       {{ student.email }}
                                    </p>
                                </div>
                                <hr>
                                <ul class="py-1" role="none">
                                    <li>
                                        <router-link  to="user-account" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Edit profile</router-link>
                                    </li>
                                    <li>
                                        <a @click.prevent="store.logoutUser" class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                            role="menuitem">Sign out</a>
                                    </li>
                                </ul>
                            </div>
                        </OverlayPanel>
                    </div>
              </div>
            </div>
            <div class=" flex flex-col items-center">
                <img :src="student.image" class="mt-10 border-4 border-green-600 rounded-full" width="100px" height="100px" alt="" v-if="student.image">
                <img src="/default.jpg" class="mt-10 border-4 border-green-600 rounded-full" width="100px" height="100px" alt="" v-else>
                <span class="mb-4 text-xl font-bold text-gray-900 dark:text-white">{{ student.name }}</span>
                <span class="text-xl font-bold">{{ student.course }}</span><br>
            </div>
            <div class="flex flex-col items-center gap-10 bg-gradient-to-l from-green-600 to-green-500 rounded-t-lg rounded-tr-full rounded-tl-full h-96">
                <div class="p-5 bg-white border-4 border-gray-950">
                  <qrCode :id="student.id"/>
                </div>
                <div class="flex justify-center items-center gap-3 ">
                    <img src="/logo.png" width="50" alt="">
                    <h1 class="text-3xl font-bold" style="color:yellow; text-shadow: 0 0 5px black">CPSU LIBRARY</h1>
                </div> 
            </div>
        </div>
      </section>
</template>