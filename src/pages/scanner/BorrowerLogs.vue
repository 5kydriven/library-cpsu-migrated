<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import { Html5Qrcode } from 'html5-qrcode';
import { doc, getDoc} from 'firebase/firestore';
import { db } from '@/stores/firebase';
import loader from "@/components/loader.vue"


const isLoading = ref(false)

const scannedQrCodes = ref()
const Html5Qrcodes = ref()

// const students = ref([])

// const getStudents = async () => {
//     isLoading.value = true
//     try{
//         const querySnapshot = await getDocs(collection(db, "students"));
//         querySnapshot.forEach((doc) => {
//             students.value.push({...doc.data(), ...{id: doc.id}})
//         });
//         isLoading.value = false
//     } catch(error){

//     }

// }
const createScanQRCodes = () => {
    Html5Qrcodes.value = new Html5Qrcode("qr-code-full-region")
    const config = {fps:10, qrbox: {width: 230, height: 230 }};

    Html5Qrcodes.value.start({facingMode:"environment" }, config, onScanSuccess)
}

const studentId = ref('')

const errmsg = ref("")
const student = ref({})
const isStudent = ref(false)

async function onScanSuccess(decodeResult){
        play()
        isLoading.value = true 
        scannedQrCodes.value = decodeResult
        // const result = students.value.filter(doc => doc.id == scannedQrCodes.value);
        try{

            const docRef = doc(db, "students", scannedQrCodes.value);
            const docSnap = await getDoc(docRef);
            isLoading.value = false
            if (docSnap.exists()) {
                student.value = docSnap.data();
                isStudent.value = true;
        
            } else{
                errmsg.value = "no match found";
                isStudent.value = false;
                student.value = null;
        
                setTimeout(() => {
                    errmsg.value = '';
                }, 3000);
            }
        } catch(error){
            console.log(error);
            isLoading.value = false
            errmsg.value = "error try again";
            isStudent.value = false;
            student.value = null;
    
            setTimeout(() => {
                errmsg.value = '';
            }, 3000);
        }
    }


onMounted(async ()=>{
    // await getStudents()
    scannedQrCodes.value = ''
    createScanQRCodes()

})

const audioPlayer = ref(null);
const play = () => {
      audioPlayer.value.play();
    };


</script>
<template>
    <div class="flex items-center justify-around bg-[url('/background.jpg')]" style="height: 100vh">
        <audio ref="audioPlayer">
          <source src="/beep.mp3" type="audio/mpeg">
        </audio>
        <Toast/>
            <div class="p-5 bg-white w-4/12 h-6/12 rounded-lg drop-shadow-lg">
                <h1 class="text-2xl">Scan QR Code</h1>
                <div id="qr-code-full-region"></div>
                <h1 class="text-lg p-5 text-center">OR</h1>
                <div class="flex items-center gap-5 w-full">
                    <InputText v-model="studentId" id="username" class="w-96" placeholder="ex. (CPSU-LRC-0000)" aria-describedby="username-help" />
                    <Button @click="onScanSuccess(studentId)" label="Submit" severity="success"/>
                </div>
            </div>
            <div class=" bg-white rounded-lg h-6/12 w-5/12 drop-shadow-sm"> 
                <!-- <div> -->
                    <div class="flex items-center p-5 shadow-md  bg-gradient-to-l from-green-700 to-green-500 rounded-t-lg">
                        <img src="/logo.png" class="h-16 me-3" alt="CPSU Logo" />
                        <h1 class="text-3xl font-semibold text-white">CPSU LIBRARY SYSTEM</h1>
                    </div>
                    <div class="flex justify-center items-center h-96">
                        <div class="loader" v-if="isLoading"></div>
                        <div class="w-full max-w-sm py-10 m-10 bg-white border-gray-200 border-2 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700  bg-gradient-to-t from-white to-green-500 " v-else-if="isStudent">
                            
                            <div class="flex flex-col items-center pb-10">
                                <img class="w-24 h-24 mb-3 rounded-full shadow-lg" :src="student.image" alt="Bonnie image"/>
                                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{ student.name }}</h5>
                                <span class="text-sm text-gray-500 dark:text-gray-400">{{ student.course }} {{ student.year }}</span>
                                <div class="flex gap-5 mt-4 md:mt-6">
                                    <a href class="inline-flex items-center px-4 py-2 text-sm font-medium text-center  text-white bg-green-600 rounded-sm border">Borrow</a>
                                    <a href class="inline-flex items-center px-4 py-2 text-sm font-medium text-center  bg-green-200 rounded-sm border border-green-600">Return</a>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="errmsg">
                            <span class="text-2xl text-red-600">{{ errmsg }}</span>
                        </div>
                        <div class="flex justify-center items-center h-80" v-else>
                            <!-- <div class="w-32 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
                                <span class="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]">
                                </span>
                            </div> -->
                        </div>
                    </div>
                <!-- </div> -->
            </div>
    </div>
</template>
<style scoped>
/* HTML: <div class="loader"></div> */
.loader {
  width: 50px;
  --b: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #23b665;
  -webkit-mask:
    repeating-conic-gradient(#0000 0deg,#000 1deg 70deg,#0000 71deg 90deg),
    radial-gradient(farthest-side,#0000 calc(100% - var(--b) - 1px),#000 calc(100% - var(--b)));
  -webkit-mask-composite: destination-in;
          mask-composite: intersect;
  animation: l5 1s infinite;
}
@keyframes l5 {to{transform: rotate(.5turn)}}
</style>