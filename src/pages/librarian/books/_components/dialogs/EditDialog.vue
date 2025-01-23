<script setup>
	import { useCrud } from '@/stores/useCrudStore.js';
	import { ref } from 'vue';

	const store = useCrud();

	const props = defineProps({
		book: Object,
	});

	const editDialog = ref(false);
	const book = ref(props.book);
	const loading = ref(false);

	const deleteBook = async () => {
		loading.value = true;
		try {
			await store.deleteDocument('books', book.value.uid);
			emit('result', 'successDelete');
		} catch (error) {
			emit('result', 'error');
			console.error('Failed to delete the book:', error);
		}
		loading.value = false;
	};

	const updateBook = async () => {
		loading.value = true;
		try {
			await store.updateDocument('books', book.value.uid, book.value);
			emit('result', 'successUpdate');
		} catch (error) {
			emit('result', 'error');
			console.error('Failed to update the book:', error);
		}
		loading.value = false;
	};

	const emit = defineEmits(['result']);
</script>

<template>
	<a
		@click="editDialog = true"
		class="cursor-pointer block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
		>Edit</a
	>
	<Dialog
		v-model:visible="editDialog"
		modal
		header="Edit Books"
		:style="{ width: '35rem' }"
		:draggable="false">
		<form>
			<div class="grid gap-4 mb-4 grid-cols-2">
				<div class="col-span-1 flex flex-col gap-2">
					<label>Title</label>
					<InputText v-model="book.title" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Author</label>
					<InputText v-model="book.author" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Call Number</label>
					<InputText v-model="book.callNumber" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>ISBN</label>
					<InputText v-model="book.isbn" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>College</label>
					<InputText v-model="book.college" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Account Number</label>
					<InputText v-model="book.accountNumber" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Publisher</label>
					<InputText v-model="book.publisher" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Section</label>
					<InputText v-model="book.section" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Subject</label>
					<InputText v-model="book.subject" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Sub Area</label>
					<InputText v-model="book.subArea" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Publication Place</label>
					<InputText v-model="book.pubPlace" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Dealer Copyright</label>
					<InputText v-model="book.copyright" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Volume</label>
					<InputText v-model="book.volume" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Remarks</label>
					<InputText v-model="book.remarks" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Bibliography</label>
					<InputText v-model="book.bibliography" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Notes</label>
					<InputText v-model="book.notes" />
				</div>

				<div class="col-span-1 flex flex-col gap-2">
					<label>Additional Subject</label>
					<InputText v-model="book.additionalSubject" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Additional Title</label>
					<InputText v-model="book.additionalTitle" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Added Entry Title</label>
					<InputText v-model="book.addedEntryTitle" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Price</label>
					<InputText v-model="book.price" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Total Price</label>
					<InputText v-model="book.totalPrice" />
				</div>
				<div class="col-span-1 flex flex-col gap-2">
					<label>Stocks</label>
					<InputText v-model="book.stocks" />
				</div>
				<div class="col-span-2 flex flex-col gap-2">
					<label>Physical Description</label>
					<InputText v-model="book.physDesc" />
				</div>
			</div>
			<div class="w-full flex gap-2 justify-end">
				<Button
					label="Delete"
					severity="danger"
					@click="deleteBook"
					outlined
					:loading="loading" />
				<Button
					label="Save"
					@click="updateBook"
					:loading="loading" />
			</div>
		</form>
	</Dialog>
</template>
