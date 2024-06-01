<script setup>
import { db } from '@/stores/firebase.js';
import { ref, onMounted } from 'vue';
import { ProductService } from '../service/productService.js';


const products = ref();
const filters = ref();
const dt = ref();

const initFilters = () => {
    filters.value = {
        global: { value: null,},
        name: {value: null},
        category: {value: null},
        quantity: {value: null},
        code: { value: null},
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
    ProductService.getProducts().then((data) => (products.value = data));
});

const getSeverity = (product) => {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};
</script>
<template>
    <h1 class="text-2xl font-bold mb-4">Students List</h1>
    <DataTable :value="products" tableStyle="min-width: 50rem"
        v-model:filters="filters" :globalFilterFields="['name', 'quantity', 'code', 'category']" ref="dt" removableSort
        stripedRows scrollable scrollHeight="500px">
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
        <template #empty> No customers found. </template>
        <Column field="code" header="Library ID"></Column>
        <Column header="Name" sortable sortField="name" class="flex items-center gap-3">
            <template #body="slotProps">
                <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
                    :alt="slotProps.data.image" class="w-[2.5rem] h-[2.5rem] shadow-md rounded-full" />
                <div class="flex flex-col">
                    <span>{{ slotProps.data.name }}</span>
                </div>
            </template>
        </Column>

        <Column field="name" sortable header="Course"></Column>
        <Column field="category" header="Year Level"></Column>
        <Column field="quantity" header="Gender"></Column>
        <Column header="Status">
            <template #body="slotProps">
                <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)" />
            </template>
        </Column>
    </DataTable>
</template>