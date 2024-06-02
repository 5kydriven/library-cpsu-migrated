<script setup>
    import { useToast } from "primevue/usetoast";
    const toast = useToast();
    
    const onAdvancedUpload = () => {
        toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    
    };
    
    </script>
    <template>
        <section class="bg-gray-50 dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16 bg-white">
            <div class="flex flex-col items-center">
                <img src="/logo.png" alt="">
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
            </div>
        </div>
        </section>
    </template>