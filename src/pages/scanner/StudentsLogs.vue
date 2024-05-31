<script setup>
import {onMounted, ref} from 'vue'
import { Html5Qrcode } from 'html5-qrcode';
import { ProductService } from '@/service/productService'


const scannedQrCodes = ref()
const Html5Qrcodes = ref()

const createScanQRCodes = () => {
    Html5Qrcodes.value = new Html5Qrcode("qr-code-full-region")
    const config = {fps:10, qrbox: {width: 230, height: 230 }};

    Html5Qrcodes.value.start({facingMode:"environment" }, config, onScanSuccess)
}

function onScanSuccess(decodeResult){
        scannedQrCodes.value = decodeResult

    }

onMounted(()=>{
    scannedQrCodes.value = ''
    createScanQRCodes()
})


</script>
<template>
    <div class="flex items-center justify-around bg-[url('/background.jpg')]" style="height: 100vh">
            <div class="p-5 bg-white w-4/12 h-6/12 rounded-lg drop-shadow-lg">
                <h1 class="text-2xl">Scan QR Code</h1>
                <div id="qr-code-full-region"></div>
                <h1 class="text-lg p-5 text-center">OR</h1>
                <div class="flex items-center gap-5 w-full">
                    <InputText id="username" class="w-96" placeholder="ex. (CPSU-LRC-0000)" v-model="value" aria-describedby="username-help" />
                    <Button label="Submit" severity="info"/>
                </div>
            </div>
            <div class=" bg-white rounded-lg h-6/12 drop-shadow-sm"> 
                <!-- <div> -->
                    <div class="flex items-center p-5 shadow-md">
                        <img src="/logo.png" class="h-16 me-3" alt="CPSU Logo" />
                        <h1 class="text-3xl font-semibold">CPSU LIBRARY SYSTEM</h1>
                    </div>
                    <div class="flex justify-center items-center h-96">
                        <!-- <div class="flex justify-center items-center h-80">
                            <div class="w-32 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
                                <span class="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]">
                                </span>
                            </div>
                        </div> -->
                        <div class="w-full max-w-sm p-5 m-10 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

                            <div class="flex flex-col items-center pb-10">
                                <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="/logo.png" alt="Bonnie image"/>
                                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Bonnie Green</h5>
                                <span class="text-sm text-gray-500 dark:text-gray-400">BSIT III</span>
                                <div class="flex mt-4 md:mt-6">
                                    <div class="inline-flex items-center px-4 py-2 text-sm font-medium text-center  bg-green-200 rounded-sm border border-green-600">WELCOME</div>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- </div> -->
            </div>
    </div>
</template>
