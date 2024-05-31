<script setup>
import { ref, onMounted } from 'vue';
import { ProductService } from '../../service/productService.js';
import ImportBooks from '@/components/booksComp/ImportBooks.vue';
import { useToast } from 'primevue/usetoast';
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import {db} from '@/stores/firebase.js'

const toast = useToast();

const books = ref();
const filters = ref();
const dt = ref();
const dialogPosition = ref('center');
const dialogVisible = ref(false);
const op = ref();
const loading = ref(false)
const lazyParams = ref({});

const initFilters = () => {
    filters.value = {
        global: { value: null, },
        name: { value: null },
        category: { value: null },
        quantity: { value: null },
        code: { value: null },
    };
};

const toggle = (event) => {
    op.value.toggle(event);
}

initFilters();

const clearFilter = () => {
    initFilters();
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const openDialog = (pos) => {
    dialogPosition.value = pos;
    dialogVisible.value = true;
}

const onFormSuccess = () => {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Successfully Imported', life: 3000 });
};

const loadLazyData = () => {
    loading.value = true

    onSnapshot(collection(db, "books"), (querySnapshot) => {
        const book = [];
        querySnapshot.forEach((doc) => {
            book.push({ ...doc.data() });
        });
        books.value = book;
        loading.value = false
    });
}

onMounted(() => {
    loadLazyData();
});
</script>

<template>
    <h1 class="text-2xl font-bold mb-4">Books List</h1>
    <DataTable :value="books" tableStyle="min-width: 50rem" v-model:filters="filters" lazy :loading="loading"
        :virtualScrollerOptions="{ itemSize: 46 }" :globalFilterFields="['name', 'quantity', 'code', 'category']"
        ref="dt" removableSort stripedRows scrollable scrollHeight="500px">
        <template #header>
            <div class="flex justify-between">
                <div class="flex gap-2">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                    <Button icon="pi pi-arrow-up" label="Import" @click="openDialog('top')" />
                </div>


                <span class="relative">
                    <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search"
                        class="pl-10 font-normal" />
                </span>
            </div>
        </template>
        <template #empty> No Books found. </template>
        <Column header="#">
            <template #body="slotProps">
                {{ slotProps.index + 1 }}
            </template>
        </Column>
        <Column field="title" sortable header="Title"></Column>
        <Column field="college" header="College"></Column>
        <Column field="callNumber" header="Call Number"></Column>
        <Column header="borrowed"></Column>
        <Column header="Actions" class="text-center">
            <template #body="{ data }">
                <i class="pi pi-ellipsis-v cursor-pointer" @click="toggle"></i>
                <OverlayPanel ref="op">
                    <div
                        class="z-10 w-28 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                        <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                            <li>
                                <a href="#"
                                    class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white "
                                    @click="showProfile">Show</a>
                            </li>
                            <li>
                                <a href="#"
                                    class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                        </ul>
                    </div>
                </OverlayPanel>
            </template>
        </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" :style="{ width: '40rem' }" :position="dialogPosition" :draggable="false"
        modal header="Import File">
        <ImportBooks @formSuccess="onFormSuccess" />
    </Dialog>

    <Toast />
</template>