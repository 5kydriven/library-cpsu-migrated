<script setup>
import {onMounted, ref} from 'vue'
import { Html5Qrcode } from 'html5-qrcode';

const scannedQrCodes = ref()
const Html5Qrcodes = ref()

const createScanQRCodes = () => {
    Html5Qrcodes.value = new Html5Qrcode("qr-code-full-region")
    const config = {fps:10, qrbox: {width: 350, height: 350 }};

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
    <div class=" flex items-center">
        <Splitter style="width: 100%; height: 100%" class="mb-5">
            <SplitterPanel class="p-10">
                <h1 class="text-2xl">Scan QR Code</h1>
                <div id="qr-code-full-region"></div>
                <h1 class="text-lg p-5 text-center">OR</h1>
                <div class="flex items-center gap-10 w-full">
                    <InputText id="username" placeholder="ex. (CPSU-LRC-0000)" v-model="value" aria-describedby="username-help" />
                    <Button label="Submit"/>
                </div>
            </SplitterPanel>
            <SplitterPanel> 
                <div>
                    <div class="flex items-center mb-4 p-5">
                        <img src="/logo.png" class="h-16 me-3" alt="CPSU Logo" />
                        <h1 class="text-3xl font-semibold">CPSU LIBRARY SYSTEM</h1>
                    </div>
                    <div class="flex justify-between mt-4">
                    </div>
                </div>
            </SplitterPanel>
        </Splitter>
    </div>
</template>