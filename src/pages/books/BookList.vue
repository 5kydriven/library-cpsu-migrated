<script setup>
import { ref, onMounted } from 'vue';
import { ProductService } from '../../service/productService.js';
import ImportBooks from '@/components/booksComp/ImportBooks.vue';

const products = ref();
const filters = ref();
const dt = ref();
const dialogPosition = ref('center');
const dialogVisible = ref(false);

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

const openDialog = (pos) => {
    dialogPosition.value = pos;
    dialogVisible.value = true;
}

const onFormSuccess = (message) => {
    toast.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
};

onMounted(() => {
    ProductService.getProducts().then((data) => (products.value = data));
});
</script>
<template>
    <h1 class="text-2xl font-bold mb-4">Books List</h1>
    <DataTable :value="products" tableStyle="min-width: 50rem" v-model:filters="filters"
        :globalFilterFields="['name', 'quantity', 'code', 'category']" ref="dt" removableSort showGridlines stripedRows
        scrollable scrollHeight="500px">
        <template #header>
            <div class="flex justify-between">
                <div class="flex gap-2">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                    <Button icon="pi pi-arrow-up" label="Import" @click="openDialog('top')"/>
                </div>


                <span class="relative">
                    <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search"
                        class="pl-10 font-normal" />
                </span>
            </div>
        </template>
        <template #empty> No customers found. </template>
        <Column field="code" header="Code"></Column>
        <Column field="name" sortable header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
        <Column header="borrowed"></Column>
        <Column header="Actions"></Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" :style="{ width: '40rem' }" :position="dialogPosition"
        :draggable="false" modal header="Import File">
        <ImportBooks @formSuccess="onFormSuccess" />
    </Dialog>

    <Toast />
</template>