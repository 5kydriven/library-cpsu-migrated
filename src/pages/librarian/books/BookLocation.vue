<script setup>
import { ref, onMounted } from 'vue';
import { ProductService } from '@/service/productService.js';

const products = ref();
const filters = ref();
const dt = ref();
const visible = ref(false);

const initFilters = () => {
    filters.value = {
        global: { value: null, },
        name: { value: null },
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
    <h1 class="text-2xl font-bold mb-4">Books Location</h1>
    <DataTable :value="products" tableStyle="min-width: 50rem" v-model:filters="filters"
        :globalFilterFields="['name', 'quantity', 'code', 'category']" ref="dt" removableSort showGridlines stripedRows
        scrollable scrollHeight="400px">
        <template #header>
            <div class="flex justify-between">
                <div class="flex gap-2">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <Button icon="pi pi-plus" label="Add" @click="visible = true" />
                </div>


                <span class="relative">
                    <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search"
                        class="pl-10 font-normal" />
                </span>
            </div>
        </template>
        <template #empty> No customers found. </template>
        <Column header="#" style="max-width: .5rem">
            <template #body="slotProps">
                {{ slotProps.index + 1 }}
            </template>
        </Column>
        <Column field="name" sortable header="Name"></Column>
        <Column header="Actions"></Column>
    </DataTable>

    <Dialog v-model:visible="visible" modal header="Add Book Location" :style="{ width: '25rem' }">
        <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Add category or book location.</span>
        <div class="flex items-center gap-3 mb-3">
            <InputText id="username" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Add" @click="visible = false"></Button>
        </div>
    </Dialog>
</template>