<template>
    <div>
  
     <QRCodeVue3
            :width="200"
            :height="200"
            value="https://scholtz.sk"
            :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
            :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
            :dotsOptions="{
              type: 'dots',
              color: 'green',
              gradient: {
                type: 'linear',
                rotation: 0,
                colorStops: [
                  { offset: 0, color: 'black' },
                  { offset: 1, color: 'black' },
                ],
              },
            }"
            :backgroundOptions="{ color: '#ffffff' }"
            :cornersSquareOptions="{ type: 'dot', color: '#000000' }"
            :cornersDotOptions="{ type: undefined, color: '#000000' }"
            fileExt="png"
            :download="true"
            myclass="my-qur"
            imgclass="img-qr"
            image="/logo.png"
            downloadButton="my-button"
            :downloadOptions="{ name: 'vqr', extension: 'png' }"
            
          />
    </div>
  </template>
  
  <script>
  import QRCodeVue3 from "qrcode-vue3";
  
  export default {
    name: 'QRCodeVue3Example',
    components: {
      QRCodeVue3
    },
  }
  </script>