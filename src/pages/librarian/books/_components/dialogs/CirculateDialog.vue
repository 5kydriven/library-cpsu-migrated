<script setup>
	import { ref, onMounted, computed } from 'vue';
	import { useAdminStore } from '@/stores/adminStore.js';

	const store = useAdminStore();

	const circulate = ref(false);
	const selectedBook = ref();
	const selectedName = ref();
	const studentNames = ref();
	const bookNames = computed(() =>
		store.books.map((book) => ({
			title: book.title,
			id: book.uid,
		})),
	);

	const search = (event) => {
		if (!event.query.trim().length) {
			studentNames.value = store.students;
		} else {
			const filterData = store.students.map((student) => ({
				name: student.name,
				uid: student.id,
				image: student.image,
				year: student.year,
				course: student.course,
				bookId: student.borrowBook,
			}));
			studentNames.value = filterData.filter((student) => {
				return student.name.toLowerCase().startsWith(event.query.toLowerCase());
			});
		}
	};

	const borrow = async () => {
		try {
			await store.borrowBook(selectedName.value, selectedBook.value);
			emit('result', 'success');
		} catch (error) {
			emit('result', 'error');
			console.log(error);
		}
	};

	const returned = async () => {
		try {
			await store.returnBook(selectedName.value);
			emit('result', 'success');
		} catch (error) {
			emit('result', 'error');
			console.log(error);
		}
	};

	const emit = defineEmits(['result']);

	onMounted(() => {
		store.fetchStudents();
		store.fetchBooks();
	});
</script>

<template>
	<Button
		icon="pi pi-book"
		label="Circulate Book"
		@click="circulate = true" />
	<Dialog
		v-model:visible="circulate"
		:draggable="false"
		modal
		header="Modal"
		:style="{ width: '25rem' }">
		<div class="mb-4">
			<label class="block mb-2 text-sm font-medium text-gray-900"
				>Student Name</label
			>
			<AutoComplete
				v-model="selectedName"
				optionLabel="name"
				:suggestions="studentNames"
				@complete="search"
				inputClass="w-full"
				:pt="{
					root: {
						class: 'w-full',
					},
				}">
				<template #option="slotProps">
					<div class="flex items-center gap-2">
						<Avatar
							:image="slotProps.option.image"
							shape="circle" />
						<div>{{ slotProps.option.name }}</div>
					</div>
				</template>
			</AutoComplete>
		</div>
		<div class="mb-4">
			<Dropdown
				v-model="selectedBook"
				:options="bookNames"
				filter
				optionLabel="title"
				placeholder="Select a book"
				class="w-full">
				<template #value="slotProps">
					<div
						v-if="slotProps.value"
						class="flex items-center">
						<div>{{ slotProps.value.title }}</div>
					</div>
					<span v-else>
						{{ slotProps.placeholder }}
					</span>
				</template>
				<template #option="slotProps">
					<div class="flex items-center">
						<div>{{ slotProps.option.title }}</div>
					</div>
				</template>
			</Dropdown>
		</div>
		<div class="flex justify-end gap-2">
			<Button
				type="button"
				label="Borrow Book"
				severity="secondary"
				@click="borrow"
				:loading="store.loading"></Button>
			<Button
				type="button"
				label="Return Book"
				severity="secondary"
				@click="returned"
				:loading="store.loading"></Button>
		</div>
	</Dialog>
</template>
