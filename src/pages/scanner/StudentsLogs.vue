<script setup>
import {computed, onMounted, ref} from 'vue'
import { useTimeAndDate } from '@/stores/dateAndTimeStore';
import { useCrud } from '@/stores/useCrudStore';
import { Html5Qrcode } from 'html5-qrcode';
import { doc, collection, getDocs, getDoc, updateDoc, setDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '@/stores/firebase';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const isLoading = ref(false)
const dateStore = useTimeAndDate()
const crud = useCrud()

const { currentDate } = dateStore.getCurrentDate()
const time = ref()

//time update per second
setInterval(async () => {
    const { currentTime, currentTimeInSeconds } = dateStore.getCurrentTime()
    time.value = currentTime
    const sevenPMInSeconds = 19 * 3600;

    // automatically update if time is 7 pm
    if(currentTimeInSeconds > sevenPMInSeconds){
        const queryStudent = query(
            collection(db, 'students'),
            where('status', '==', 'IN'),
        );
        const studentSnapshot = await getDocs(queryStudent);
        if(!studentSnapshot.empty){
            console.log("in but not out");
            studentSnapshot.forEach(async student => {
                const studentData = {...student.data(), ...{status: 'OUT'}}

                const queryRecord = query(
                    collection(db, 'studentLogs'),
                    where('studentId', '==', student.id),
                    where('status', '==', 'IN'),
                    where('date', '==', currentDate.value),
                );
                const logsSnapshot = await getDocs(queryRecord);
                logsSnapshot.forEach(async log => {
                    
                    const updatedRecord = {
                        ...log.data(),
                        time_out: 'unscanned',
                        status: 'unscanned',
                    };
                    
                    await crud.updateDocument('studentLogs', log.id, updatedRecord)
                    
                });
                await crud.updateDocument('students', student.id,  studentData)
            })
        }
    }
}, 1000);

const show = (sev, sum, msg) => {
    toast.add({ severity: sev, summary: sum, detail: msg, life: 3000 });
};

const scannedQrCodes = ref()
const Html5Qrcodes = ref()

const createScanQRCodes = () => {
    Html5Qrcodes.value = new Html5Qrcode("qr-code-full-region")
    const config = {fps:10, qrbox: {width: 230, height: 230 }};

    Html5Qrcodes.value.start({facingMode:"environment" }, config, onScanSuccess)
}

const studentId = ref('')
const lastScanned = ref('')

const errmsg = ref("")
const message = ref("")
const student = ref({})
const isStudent = ref(false)
const isIN = ref( false)

async function onScanSuccess(decodeResult){
    play()
    scannedQrCodes.value = decodeResult
    if(lastScanned.value != decodeResult){
            lastScanned.value = scannedQrCodes.value
            isLoading.value = true

            try{
                const docRef = doc(db, "students", scannedQrCodes.value);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    isLoading.value = false
                    student.value = docSnap.data();
                    isStudent.value = true;
                    try{
                             if(student.value.status == 'IN'){
                                isIN.value = false
                                message.value = "GOODBYE!!!";
                                student.value = {...student.value, ...{status: 'OUT'}} //set status
                                const docRef = doc(db, 'students', scannedQrCodes.value)
                                await crud.updateDocument('students', scannedQrCodes.value,  student.value)
                                    
                                //time out
                                const queryRecord = query(
                                    collection(db, 'studentLogs'),
                                    where('studentId', '==', scannedQrCodes.value),
                                    where('status', '==', 'IN'),
                                    where('date', '==', currentDate.value),
                                );
                                const logsSnapshot = await getDocs(queryRecord);
    
                                logsSnapshot.forEach(async log => {
                                  
                                    const updatedRecord = {
                                        ...log.data(),
                                        time_out: time.value,
                                        status: 'OUT',
                                    };
                                    
                                    await crud.updateDocument('studentLogs', log.id, updatedRecord)
                                    
                                });
                                
                            } else{
                                isLoading.value = false
                                isIN.value = true
                                message.value = "WELCOME!!!";
                                student.value = {...student.value, ...{status: 'IN'}} //set status
                                await crud.updateDocument('students', scannedQrCodes.value,  student.value)
                                
                                //logs record
                                const record = ref({
                                    date: currentDate,
                                    studentId: student.value.id,
                                    time_in: time.value,
                                    time_out: '',
                                    status: 'IN',
                                })
                                
                                //time in
                                await crud.addDocument("studentLogs", record.value)
                                 
                             }
                             scann//  setInterval(() => {
                            //     isStudent.value = false
                            //  }, 5000)edQrCodes.value = ''
                            
                        } catch(error){
                             console.error(error);
                        }
    
                } else {
                    isLoading.value = false
                    errmsg.value = "no match found";
                    isStudent.value = false;
                    student.value = null;
            
                    setTimeout(() => {
                        errmsg.value = '';
                    }, 3000);
                    lastScanned.value = scannedQrCodes.value
                } 
            } catch(error){
                isLoading.value = false
                show('error', 'error', 'Try again')
            }

        } else{
            show('error', 'error', 'Already scanned')
        }
    }


onMounted(async ()=>{
    scannedQrCodes.value = ''
    createScanQRCodes()

})

const audioPlayer = ref(null);
const play = () => {
      audioPlayer.value.play();
    };


</script>
<template>
    <!-- <loader v-if="isLoading"/> -->
    <div class="flex items-center justify-around bg-[url('/background.jpg')]" style="height: 100vh" >
        <audio ref="audioPlayer">
          <source src="/beep.mp3" type="audio/mpeg">
        </audio>
        <Toast/>
            <div class="p-5 bg-white w-4/12 h-6/12 rounded-lg drop-shadow-lg">
                <h1 class="text-2xl">Scan QR Code</h1>
                <div id="qr-code-full-region"></div>
                <h1 class="text-lg p-5 text-center">OR</h1>
                <div class="flex items-center gap-5 w-full">
                    <InputText v-model="studentId" id="username" class="w-96" placeholder="ex. (CPSU-LRC-0000)"  aria-describedby="username-help" />
                    <Button @click="onScanSuccess(studentId)" label="Submit" severity="success"/>
                </div>
                {{ currentDate }}
                {{time}}<br>
                <!-- <button @click="crud.deleteAllDocuments('studentLogs')"> Delete all</button> -->
            </div>
            <div class=" bg-white rounded-lg h-6/12 w-5/12 drop-shadow-sm"> 
                <!-- <div> -->
                    <div class="flex items-center p-5 shadow-md  bg-gradient-to-l from-green-700 to-green-500 rounded-t-lg">
                        <img src="/logo.png" class="h-16 me-3" alt="CPSU Logo" />
                        <h1 class="text-3xl font-semibold text-white">CPSU LIBRARY SYSTEM</h1>
                    </div>
                    <div class="flex justify-center items-center h-96">
                        <div class="loader" v-if="isLoading"></div>
                        <span class="text-2xl text-red-500" v-else-if="errmsg">{{errmsg}}</span>
                        <div class="w-full max-w-sm py-10 m-10 bg-white border-gray-200 border-2 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700  bg-gradient-to-t from-white to-green-500 " v-else-if="isStudent">
                            
                            <div class="flex flex-col items-center pb-10">
                                <img class="w-24 h-24 mb-3 rounded-full shadow-lg border-4 border-green-700" :src="student.image" alt="Bonnie image"/>
                                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{ student.name }}</h5>
                                <span class="text-sm text-gray-500 dark:text-gray-400">{{ student.course }}  {{ student.year }}</span>
                                <div class="flex gap-5 mt-4 md:mt-6">
                                    <div class="inline-flex items-center px-4 py-2 text-sm font-medium text-center  bg-green-600 text-white  rounded-sm" v-if="isIN">{{ message }}</div>
                                    <div class="inline-flex items-center px-4 py-2 text-sm font-medium text-center  bg-red-600 text-white  rounded-sm" v-else>{{ message }}</div>
                                </div>
                            </div>
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