<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAdminStore } from '@/stores/adminStore';

const store = useAdminStore();

const filters = ref();
const dt = ref();
const selectedDate = ref();

const initFilters = () => {
    filters.value = {
        global: { value: null, },
        name: { value: null },
        course: { value: null },
        studentId: { value: null },
        date: { value: null}, // Use .value to get the computed value
    };
};

const clearFilter = () => {
    initFilters();
    selectedDate.value = null
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

// Computed property to format the selected date range
const formattedDateRange = computed(() => {
    if (selectedDate.value && selectedDate.value.length === 2) {
        const [startDate, endDate] = selectedDate.value;
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return null;
});

initFilters();

onMounted(() => {
    store.fetchLogs();
});
</script>

<template>
    <h1 class="text-2xl font-bold mb-4">Student Time Records</h1>
    <DataTable :value="store.logs" tableStyle="min-width: 50rem" v-model:filters="filters"
        :globalFilterFields="['name', 'course', 'studentId', 'year']" ref="dt" removableSort stripedRows scrollable
        scrollHeight="400px" :loading="store.loading" :virtualScrollerOptions="{ itemSize: 46 }">
        <template #header>
            <div class="flex justify-between">
                <div class="flex gap-2">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                    <Calendar v-model="selectedDate" showIcon iconDisplay="input" selectionMode="range"
                        :manualInput="false" />
                    {{ formattedDateRange }}
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
        <Column field="date" header="Date" sortable>
        </Column>
    </DataTable>
</template>
