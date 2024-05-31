<script setup>
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
</script>
<template>
    <h1 class="text-2xl font-bold mb-4">Students List</h1>
    <DataTable :value="products" tableStyle="min-width: 50rem" v-model:filters="filters"
        :globalFilterFields="['name', 'quantity', 'code', 'category']" ref="dt" removableSort  stripedRows
        scrollable scrollHeight="500px">
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
        <Column header="Name" sortable sortField="name" class="flex items-center gap-3">
            <template #body="slotProps">
                <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="w-[2.5rem] h-[2.5rem] shadow-md rounded-full" />
                <div class="flex flex-col">
                    <span>{{ slotProps.data.name }}</span>
                    <span class="text-gray-400 text-sm font-thin">sample@gmail.com</span>
                </div>
            </template>
        </Column>
        <Column field="code" sortable="" header="ID"></Column>
        <Column field="name" sortable header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
    </DataTable>
</template>