<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import { useStorage } from "@/stores/imageUpload";
import { query, where, collection, onSnapshot, setDoc, doc, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/stores/firebase.js";
import loader from "@/components/loader.vue";

// State Variables
const isLoading = ref(false);
const imageStore = useStorage();
const buttondisplay = ref();
const icondisplay = ref();
const idNumberGenerated = ref(1);
const id = ref();
const isNew = ref();
const studentData = ref({
    image: '',
    name: "",
    gender: "",
    course: "",
    year: "",
    address: "",
});
const uid = ref();
const email = ref();
const image = ref(null);
let file;
let newId;

// Initialization
onMounted(() => {
    isLoading.value = true
    onAuthStateChanged(auth, async (userDetails) => {
        if (userDetails) {
            uid.value = userDetails.uid;
            email.value = userDetails.email;
            await checkStudentExistence();
            await getNewId();
        } else {
            console.log("not signed in");
        }
    });
});

// Functions
async function checkStudentExistence() {
    try {
        const queryStudent = query(collection(db, 'students'), where('uid', '==', uid.value));
        const studentSnap = await getDocs(queryStudent);

        if (!studentSnap.empty) {
            isNew.value = false;
            studentSnap.forEach(doc => {
                studentData.value = {...studentData.value, ...doc.data()};
            });
        } else {
            isNew.value = true
            console.log("not exist");
        }
    } catch (error) {
        console.error("Error checking student existence: ", error);
    }
}

async function getNewId() {
    try {
        const docRef = doc(db, "idGenerator", 'KIMavxAVbS6PQn6Iyndk');
        const docSnap = await getDoc(docRef);

        idNumberGenerated.value = docSnap.data();
        newId = idNumberGenerated.value.count + 1;
        id.value = "CPSU-LRC-000" + newId.toString();

        isLoading.value = false
    } catch (error) {
        console.error("error fetching data", error);
    }
}

// Method to handle file change
function onFileChange(e) {
    file = e.target.files[0];
    if (!file) {
        console.log("no image selected/ or invalid image");
        return;
    }
    const reader = new FileReader();

    reader.onload = (e) => {
        image.value = e.target.result;
    };

    reader.readAsDataURL(file);
}

async function onSubmit(e) {
    isLoading.value = true;
    if (file) {
        await imageStore.upload('students_image/', file);
        const { imageUrl } = await imageStore.useFirebaseStorage('students_image/', file.name);
        studentData.value.image = imageUrl;
    }

    try {

        if(e){
            studentData.value = { ...studentData.value, ...{ uid: uid.value, email: email.value, student_id: id.value } };

            await setDoc(doc(db, "students", id.value), studentData.value);
            console.log("added successfully");

        } else{
            await updateDoc(doc(db, 'students', studentData.value.id), studentData.value);
            console.log("update successful")
        }

        // Increment idGenerator
        await updateDoc(doc(db, 'idGenerator', 'KIMavxAVbS6PQn6Iyndk'), { count: newId });

    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}

</script>
<template>
    <loader v-if="isLoading"/>
    <section class="bg-gray-50 dark:bg-gray-900" v-else>
    <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16 bg-white">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">{{isNew? 'Complete' : 'update'}} profile</h2>
        <form @submit.prevent="onSubmit">
            <div class="w-full">
                <div class="flex items-center justify-center w-full">
                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div v-if="image || studentData.image">
                            <img :src="image? image : studentData.image" width="150px" alt="">
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
                    <input v-model="studentData.name" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-0 focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter your fullname" required="">
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
                    <input v-model="studentData.address" type="text" name="address" id="address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-0 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Address" required="">
                </div>
            </div>
            <div class="flex justify-center">
                <Button @click="onSubmit(isNew? true : false)" label="submit" class="my-5"/>
            </div>
        </form>
    </div>
    </section>
</template>