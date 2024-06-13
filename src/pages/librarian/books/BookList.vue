<script setup>
import { ref, onMounted } from 'vue';
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

const columns = ref([
    { field: 'title', header: 'Title' },
    { field: 'college', header: 'College' },
    { field: 'callNumber', header: 'Call Number' },
]);

const optColumn = ref([
    { field: 'title', header: 'Title' },
    { field: 'college', header: 'College' },
    { field: 'callNumber', header: 'Call Number' },
    { field: 'accountNumber', header: 'Account Number' },
    { field: 'addedEntryTitle', header: 'Added Entry Title' },
    { field: 'additionalSubject', header: 'Additional Subject' },
    { field: 'additionalTitle', header: 'Additional Title' },
    { field: 'author', header: 'Author' },
    { field: 'bibliography', header: 'Bibliography' },
    { field: 'copyright', header: 'Copyright' },
    { field: 'dealer', header: 'Dealer' },
    { field: 'isbn', header: 'ISBN' },
    { field: 'notes', header: 'Notes' },
    { field: 'physDesc', header: 'Physical Description' },
    { field: 'price', header: 'Price' },
    { field: 'pubPlace', header: 'Publication Place' },
    { field: 'publisher', header: 'Publisher' },
    { field: 'remarks', header: 'Remarks' },
    { field: 'section', header: 'Section' },
    { field: 'subArea', header: 'Sub Area' },
    { field: 'subject', header: 'Subject' },
    { field: 'totalPrice', header: 'Total Price' },
    { field: 'volume', header: 'volume' },
])

const selectedColumns = ref([]);
const onToggle = (val) => {
    selectedColumns.value = optColumn.value.filter(col => val.includes(col));
};

const fetchDefaultColumns = async () => {
    // const defaultColumns = await store.fetchDefaultColumns();
    if (columns.length > 0) {
        selectedColumns.value = optColumn.value.filter(col => columns.includes(col.field));
    } else {
        selectedColumns.value = columns.value; // Fallback to default columns if none from DB
    }
};

onMounted(() => {
    store.fetchBooks()
    fetchDefaultColumns()
});
</script>

<template>
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold mb-4">Books List</h1>
        <MultiSelect :modelValue="selectedColumns" :options="optColumn" optionLabel="header"
            @update:modelValue="onToggle" display="chip" placeholder="Select Columns" />
    </div>
    <DataTable :value="store.books" tableStyle="min-width: 50rem" v-model:filters="filters" :loading="store.loading"
        :virtualScrollerOptions="{ itemSize: 46 }" :globalFilterFields="['title', 'college', 'callNumber']"
        removableSort stripedRows dataKey="id" scrollable scrollHeight="400px" filterDisplay="menu" stateStorage="local"
        stateKey="dt-state-demo-session">
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
        <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header"
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
