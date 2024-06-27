<script setup>
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';


const store = useAdminStore();

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

function formatTimestamp(timestamp) {
    const seconds = timestamp.seconds;
    const nanoseconds = timestamp.nanoseconds;

    // Convert seconds to milliseconds
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;

    // Create a new Date object
    const date = new Date(milliseconds);

    // Extract date components
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    // Format as mm/dd/yyyy
    return `${month}/${day}/${year}`;
}

onMounted(() => {
    store.fetchBookLogs()
});
</script>
<template>
    <h1 class="text-2xl font-bold mb-4">Borrow & Return books</h1>
    <DataTable :value="store.bookLogs" tableStyle="min-width: 50rem" v-model:filters="filters"
        :globalFilterFields="['name', 'quantity', 'code', 'category']" ref="dt" removableSort showGridlines stripedRows
        scrollable scrollHeight="400px" :loading="store.loading" :virtualScrollerOptions="{ itemSize: 46 }">
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
        <Column field="student_id" header="Student ID"></Column>
        <Column field="borrower" header="Name"></Column>
        <Column header="Course/Year">
            <template #body="{ data }">
                <div class="flex gap-1">
                    <span>{{ data.course }}</span>
                    <span v-if="data.year">{{ data.year }} year</span>
                </div>
            </template>
        </Column>
        <Column header="Borrowed Date">
            <template #body="{data}">
                {{ formatTimestamp(data.dateBorrowed) }}
            </template>
        </Column>
        <Column header="Returned Date">
            <template #body="{ data }">
                {{ formatTimestamp(data.dateReturned) }}
            </template>
        </Column>
        <Column header="Status">
            <template #body="{ data }">
                <Tag :value="data.isReturned ? 'returned' : 'borrowed'"
                    :severity="!data.isReturned ? 'danger' : null" />
            </template>
        </Column>
    </DataTable>
</template>