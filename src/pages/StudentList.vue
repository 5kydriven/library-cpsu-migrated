<script setup>
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';

const adminStore = useAdminStore();
const filters = ref();
const dt = ref();

const initFilters = () => {
    filters.value = {
        global: { value: null, },
        name: { value: null },
        course: { value: null },
        year: { value: null },
        email: { value: null },
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
    adminStore.fetchStudents();
});

</script>
<template>
    <h1 class="text-2xl font-bold mb-4">Students List</h1>
    <DataTable :value="adminStore.students" v-model:filters="filters" tableStyle="min-width: 50rem"
        :globalFilterFields="['name']" ref="dt" removableSort stripedRows scrollable scrollHeight="500px"
        :loading="adminStore.loading" dataKey="id" :virtualScrollerOptions="{ itemSize: 46 }">
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
        <template #empty> No student's found. </template>
        <Column field="id" header="Library ID"></Column>
        <Column header="Name" field="name" sortable class="flex items-center gap-3">
            <template #body="{ data }">
                <img :src="data.image" class="w-[2.5rem] h-[2.5rem] shadow-md rounded-full" />
                <div class="flex flex-col">
                    <span>{{ data.name }}</span>
                </div>
            </template>
        </Column>

        <Column field="course" header="Course"></Column>
        <Column field="year" header="Year Level"></Column>
        <Column field="email" header="Email"></Column>
    </DataTable>
</template>