<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import ImportBooks from '@/components/booksComp/ImportBooks.vue';
import { useToast } from 'primevue/usetoast';
import BookDetails from '@/components/booksComp/bookDetails.vue'
import CirculateForm from '@/components/booksComp/circulateBook.vue'
import { useAdminStore } from '@/stores/adminStore';

const store = useAdminStore();

const toast = useToast();

const filters = ref();
// const dt = ref();
const dialogPosition = ref('center');
const dialogVisible = ref(false);
const op = ref();
const viewBook = ref(false)
const circulate = ref(false)
const selectedBook = ref(null); // New reactive variable to store selected book ID
const selectedCustomer = ref();

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        title: { value: null },
        college: { value: null },
        callNumber: { value: null },
    };
};

const toggle = (data) => {
    selectedBook.value = data;
    op.value.toggle(event);
}

initFilters();

const clearFilter = () => {
    initFilters();
};

const convertArrayToCSV = (data) => {
    if (data.length === 0) return '';

    // Get all unique keys from data
    const headers = Array.from(new Set(data.flatMap(book => Object.keys(book))));

    const csvRows = [
        headers.join(','), // header row
        ...data.map(book => headers.map(field => book[field] !== undefined ? JSON.stringify(book[field]) : '').join(',')) // data rows
    ];

    return csvRows.join('\n');
};

const exportAllCSV = () => {
    const csvData = convertArrayToCSV(books.value);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'books.csv';
    a.click();
    URL.revokeObjectURL(url);
};

const openDialog = (pos) => {
    dialogPosition.value = pos;
    dialogVisible.value = true;
}

const onFormSuccess = () => {
    dialogVisible.value = false;
    toast.add({ severity: 'success', summary: 'Success', detail: 'Successfully Imported', life: 3000 });
};



onBeforeMount(() => {
    store.fetchColumns();
    store.fetchBooks()
});

</script>

<template>
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Books List</h1>
        <MultiSelect :modelValue="store.selectedColumns" :loading="store.loading" :options="store.columns"
            optionLabel="header" @update:modelValue="store.toggleColumnSelection" display="chip"
            placeholder="Select Columns" maxSelectedLabels="5" />
    </div>
    <DataTable :value="store.books" tableStyle="min-width: 50rem" v-model:filters="filters" :loading="store.loading"
        :virtualScrollerOptions="{ itemSize: 46 }" :globalFilterFields="['title', 'college', 'callNumber']"
        removableSort stripedRows dataKey="id" scrollable scrollHeight="400px" filterDisplay="menu"
        stateStorage="session" stateKey="dt-state-demo-session">
        <template #header>


            <div class="flex justify-between">
                <div class="flex gap-2">

                    <!-- <Button icon="pi pi-external-link" label="Export Displayed" @click="exportCSV()" /> -->
                    <Button icon="pi pi-file-export" label="Export" @click="exportAllCSV()" />
                    <Button icon="pi pi-file-import" label="Import" @click="openDialog('top')" />
                    <Button icon="pi pi-book" label="Circulate Book" @click="circulate = true" />
                </div>

                <div class="flex gap-2">
                    <span class="relative">
                        <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search"
                            class="pl-10 font-normal" />
                    </span>
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                </div>

            </div>
        </template>
        <template #empty> No Books found. </template>
        <Column header="#">
            <template #body="slotProps">
                {{ slotProps.index + 1 }}
            </template>
        </Column>
        <!-- <Column field="title" sortable header="Title"></Column> -->
        <Column v-for="(col, index) of store.selectedColumns" :field="col.field" :header="col.header"
            :key="col.field + '_' + index" sortable></Column>
        <!-- <Column header="borrowed"></Column> -->
        <Column header="Actions" class="text-center">
            <template #body="{ data }">
                <i class="pi pi-ellipsis-v cursor-pointer" @click="toggle(data)"></i>
                <OverlayPanel ref="op">
                    <div
                        class="z-10 w-28 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                        <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                            <li>
                                <a class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    @click="viewBook = true">View more</a>
                            </li>
                            <li>
                                <a
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

    <Dialog v-model:visible="viewBook" :draggable="false" modal header="Book Information">
        <BookDetails :book="selectedBook" />
    </Dialog>

    <Dialog v-model:visible="circulate" :draggable="false" modal header="Modal" :style="{ width: '25rem' }">
        <CirculateForm />
    </Dialog>

    <Toast />
</template>
