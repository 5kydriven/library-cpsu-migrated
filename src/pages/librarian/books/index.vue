<script setup>
	import { ref, onMounted, onBeforeMount } from 'vue';
	import { FilterMatchMode } from 'primevue/api';
	import { useToast } from 'primevue/usetoast';
	import { useAdminStore } from '@/stores/adminStore';
	import EditForm from '@/components/booksComp/editForm.vue';
	import Header from '@/pages/librarian/books/_components/Header.vue';
	import Footer from '@/pages/librarian/books/_components/Footer.vue';
	import { useColumnStore } from '@/stores/column.js';
	import ImportDialog from '@/pages/librarian/books/_components/dialogs/ImportDialog.vue';
	import CirculateDialog from '@/pages/librarian/books/_components/dialogs/CirculateDialog.vue';
	import ViewDialog from '@/pages/librarian/books/_components/dialogs/ViewDialog.vue';
	import EditDialog from '@/pages/librarian/books/_components/dialogs/EditDialog.vue';

	const columnStore = useColumnStore();
	const store = useAdminStore();

	const toast = useToast();

	const filters = ref();
	// const dt = ref();
	const op = ref();
	const viewBook = ref(false);
	const selectedBook = ref(null);
	const selectedCustomer = ref();

	const initFilters = () => {
		filters.value = {
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			title: { value: null },
			college: { value: null },
			callNumber: { value: null },
			isbn: { value: null },
		};
	};

	const toggle = (data) => {
		selectedBook.value = data;
		op.value.toggle(event);
	};

	initFilters();

	const clearFilter = () => {
		initFilters();
	};

	const convertArrayToCSV = (data) => {
		if (data.length === 0) return '';

		// Get all unique keys from data
		const headers = Array.from(
			new Set(data.flatMap((book) => Object.keys(book))),
		);

		const csvRows = [
			headers.join(','), // header row
			...data.map((book) =>
				headers
					.map((field) =>
						book[field] !== undefined ? JSON.stringify(book[field]) : '',
					)
					.join(','),
			), // data rows
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
	};

	const onFormSuccess = () => {
		dialogVisible.value = false;
		toast.add({
			severity: 'success',
			summary: 'Success',
			detail: 'Successfully Imported',
			life: 3000,
		});
	};

	const editResult = (res) => {
		editDialog.value = false;
		if (res == 'successDelete') {
			toast.add({
				severity: 'success',
				summary: 'Success Message',
				detail: 'Successfully Deleted Book',
				life: 3000,
			});
		} else if (res == 'successUpdate') {
			toast.add({
				severity: 'success',
				summary: 'Success Message',
				detail: 'Successfully Edited Book',
				life: 3000,
			});
		} else {
			toast.add({
				severity: 'error',
				summary: 'Error Message',
				detail: 'Something went wrong!',
				life: 3000,
			});
		}
	};

	onBeforeMount(() => {
		columnStore.fetchColumns();
		store.fetchBooks();
	});
</script>

<template>
	<Header />
	<DataTable
		:value="store.books"
		tableStyle="min-width: 50rem"
		v-model:filters="filters"
		:loading="store.loading"
		:virtualScrollerOptions="{ itemSize: 46 }"
		:globalFilterFields="['title', 'college', 'callNumber', 'isbn']"
		removableSort
		stripedRows
		dataKey="id"
		scrollable
		scrollHeight="400px"
		filterDisplay="menu"
		stateStorage="session"
		stateKey="dt-state-demo-session">
		<template #header>
			<div class="flex justify-between">
				<div class="flex gap-2">
					<!-- <Button icon="pi pi-external-link" label="Export Displayed" @click="exportCSV()" /> -->
					<Button
						icon="pi pi-file-export"
						label="Export"
						@click="exportAllCSV()" />
					<ImportDialog @formSuccess="onFormSuccess" />
					<CirculateDialog />
				</div>

				<div class="flex gap-2">
					<span class="relative">
						<i
							class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
						<InputText
							v-model="filters['global'].value"
							placeholder="Keyword Search"
							class="pl-10 font-normal" />
					</span>
					<Button
						type="button"
						icon="pi pi-filter-slash"
						label="Clear"
						outlined
						@click="clearFilter()" />
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
		<Column
			v-for="(col, index) of columnStore.selectedColumns"
			:field="col.field"
			:header="col.header"
			:key="col.field + '_' + index"
			sortable>
			<template
				#body="{ data }"
				v-if="col.field == 'stocks'">
				<Tag
					:value="data.stocks == '0' ? 'Not Available' : 'Available'"
					:severity="data.stocks == '0' ? 'danger' : null" />
			</template>
		</Column>

		<Column
			header="Actions"
			class="text-center">
			<template #body="{ data }">
				<i
					class="pi pi-ellipsis-v cursor-pointer"
					@click="toggle(data)"></i>
				<OverlayPanel ref="op">
					<div
						class="z-10 w-28 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
						<ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
							<li>
								<ViewDialog :book="selectedBook" />
							</li>
							<li>
								<EditDialog
									:book="selectedBook"
									@result="editResult" />
							</li>
						</ul>
					</div>
				</OverlayPanel>
			</template>
		</Column>
	</DataTable>
	<Footer />

	<Toast />
</template>
