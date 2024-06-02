<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import {useStorage} from "@/stores/imageUpload";
import { collection, onSnapshot, setDoc, doc, getDocs } from "firebase/firestore"; 
import { db, auth } from "@/stores/firebase.js";
import loader from "@/components/loader.vue";

const isLoading = ref(false);
const imageStore = useStorage()

const buttondisplay = ref();
const icondisplay = ref();

const idNumberGenerated = ref(1)
const id = ref()

const studentData = ref({
    image: '',
    name: "",
    dob: '',
    gender: "",
    course: "",
    year: "",
    address: "",
})

const uid = ref()
const email = ref()
onMounted(() => {
    onAuthStateChanged(auth, (userDetails) => {
        console.log(userDetails);
        if (userDetails) {
          uid.value = userDetails.uid;
          email.value = userDetails.email
          getStudents()
        //   router.push( "/dashboard" );
        } else {
          // isLoading.value = false;
          console.log("not signed in");
        //   router.replace({ name: "signin" });         
        }
        // isLoading.value = true;
      });

})

async function getStudents() {
    try{
        const querySnapshot = await getDocs(collection(db, "students"));
        querySnapshot.forEach((doc) => {
            idNumberGenerated.value++
        });
        id.value = "CPSU-LRC-000" + idNumberGenerated.value.toString();
        studentData.value = {...studentData.value, ...{uid: uid.value ,email: email.value, student_id: id.value}}
    } catch(error){
        console.error("error fetching data",error);
    }
}


const image = ref(null);
let file;

// Method to handle file change
function onFileChange (e) {
  file = e.target.files[0];
  if (!file) {
    console.log("no image selected/ or invalid image");
  }
  const reader = new FileReader();

  reader.onload = (e) => {
    image.value = e.target.result;
  };

  reader.readAsDataURL(file);
};

async function onSubmit(){
    isLoading.value = true
    try{
        if(file){
            await imageStore.upload('students_image/', file)
            const { imageUrl } = await imageStore.useFirebaseStorage('students_image/', file.name)
            studentData.value.image = imageUrl
        }
        await setDoc(doc(db, "students", id.value), studentData.value);
        console.log("added successfully");
        isLoading.value = false
    } catch(error){
        console.error(error);
    }
}

</script>
<template>
    <loader v-if="isLoading"/>
    <section class="bg-gray-50 dark:bg-gray-900" v-else>
    <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16 bg-white">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Complete profile</h2>
        <form @submit.prevent="onSubmit">
            <div class="w-full">
                <div class="flex items-center justify-center w-full">
                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div v-if="image">
                            <img :src="image" width="150px" alt="">
                        </div>
                        <div class="flex flex-col items-center justify-center pt-5 pb-6" v-else>
                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input @change="onFileChange"  id="dropzone-file" type="file" class="hidden" />
                    </label>
                </div> 
            </div>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div class="w-full">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input v-model="studentData.name" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter your fullname" required="">
                </div>
                <div class="w-full">
                    <label for="buttondisplay" class="font-bold block mb-2"> Button Display </label>
                    <Calendar v-model="studentData.dob" showIcon inputId="buttondisplay" />
                </div>
                <div>
                    <label for="course" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Course</label>
                    <select v-model="studentData.course" id="course" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        <option selected="">Select course</option>
                        <option value="BSIT">BSIT</option>
                        <option value="BSHM">BSHM</option>
                        <option value="BSCRIM">BSCRIM</option>
                        <option value="BSED">BSED</option>
                    </select>
                </div>
                <div>
                    <label for="year" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
                    <select v-model="studentData.year" id="year" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        <option selected="">Select year</option>
                        <option value="1st">1st</option>
                        <option value="2nd">2nd</option>
                        <option value="3rd">3rd</option>
                        <option value="4th">4th</option>
                    </select>
                </div>
                <div class="w-full">
                    <label for="address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                    <input v-model="studentData.address" type="text" name="address" id="address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Address" required="">
                </div>
            </div>
            <Button @click="onSubmit" label="submit" class="my-5"/>
        </form>
    </div>
    </section>
</template>