<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';

const store = useAdminStore();

const filters = ref();
const dt = ref();

const initFilters = () => {
    filters.value = {
        global: { value: null, },
        name: { value: null },
        course: { value: null },
        studentId: { value: null },
        date: { value: null  },
    };
    console.log(filters.value.date)
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
});
</script>
<template>
    <h1 class="text-2xl font-bold mb-4">Student Time Records</h1>
    <DataTable :value="store.logs" tableStyle="min-width: 50rem" v-model:filters="filters"
        :globalFilterFields="['name', 'course', 'studentId']" ref="dt" removableSort stripedRows scrollable
        scrollHeight="400px" :loading="store.loading" :virtualScrollerOptions="{ itemSize: 46 }" filterDisplay="menu">
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
        <Column field="name" header="Name"></Column>
        <Column header="Course/Year">
            <template #body="{ data }">
                <div class="flex gap-1">
                    <span>{{ data.course }}</span>
                    <span v-if="data.year">{{ data.year }} year</span>
                </div>
            </template>
        </Column>
        <Column field="time_in" header="Time In"></Column>
        <Column field="time_out" header="Time Out">
            <template #body="{ data }">
                <span>{{ data.time_out == 'unscanned' ? '05:00:00 PM' : data.time_out }}</span>
            </template>
        </Column>
        <Column field="date" header="Date" sortable :showFilterMatchModes="false">
            <template #body="{ data }">
                {{ data.date }}
            </template>
            <template #filter="{ filterModel }">
                <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" selectionMode="range" :manualInput="false"
                    placeholder="mm/dd/yyyy" />
            </template>
        </Column>
    </DataTable>
</template>