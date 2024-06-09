<script setup>
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import { ProductService } from '../../service/productService.js';

const store = useAdminStore();

const products = ref();
const filters = ref();
const dt = ref();

const initFilters = () => {
    filters.value = {
        global: { value: null, },
        name: { value: null },
        category: { value: null },
        quantity: { value: null },
        code: { value: null },
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};

const exportCSV = () => {
    dt.value.exportCSV();
};

onMounted(() => {
    store.fetchLogs();
    ProductService.getProducts().then((data) => (products.value = data));
});
</script>
<template>
    <h1 class="text-2xl font-bold mb-4">Student Logs</h1>
    <DataTable :value="store.logs" tableStyle="min-width: 50rem" v-model:filters="filters"
        :globalFilterFields="['name', 'quantity', 'code', 'category']" ref="dt" removableSort stripedRows scrollable
        scrollHeight="400px" :loading="store.loading" :virtualScrollerOptions="{ itemSize: 46 }">
        <template #header>
            <div class="flex justify-between">
                <div class="flex gap-2">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                </div>


                <span class="relative">
                    <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search"
                        class="pl-10 font-normal" />
                </span>
            </div>
        </template>
        <template #empty> No students found.</template>
        <Column header="#">
            <template #body="slotProps">
                {{ slotProps.index + 1 }}
            </template>
        </Column>
        <Column field="studentId" header="Library ID"></Column>
        <Column header="Name"></Column>
        <Column header="Course/Year"></Column>
        <Column header="Time In"></Column>
        <Column header="Time Out"></Column>
        <Column header="Date"></Column>
    </DataTable>
</template>