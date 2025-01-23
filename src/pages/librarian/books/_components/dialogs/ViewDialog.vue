<script setup>
	import { ref } from 'vue';

	const viewBook = ref(false);
	const selectedBook = ref(null);
	const props = defineProps({
		book: Object,
	});
</script>

<template>
	<a
		class="cursor-pointer block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
		@click="viewBook = true"
		>View more</a
	>
	<Dialog
		v-model:visible="viewBook"
		:draggable="false"
		modal
		header="Book Information">
		<div>
			<span class="font-thin text-sm">Title: </span>
			<span class="font-semibold">
				{{ props.book.title }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">ISBN: </span>
			<span class="font-semibold">
				{{ props.book.isbn }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Price: </span>
			<span class="font-semibold">
				{{ props.book.price }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Notes: </span>
			<span class="font-semibold">
				{{ props.book.notes }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Account Number: </span>
			<span class="font-semibold">
				{{ props.book.accountNumber }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">College: </span>
			<span class="font-semibold">
				{{ props.book.college }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Bibliography: </span>
			<span class="font-semibold">
				{{ props.book.bibliography }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Copyright: </span>
			<span class="font-semibold">
				{{ props.book.copyright }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Additional Title: </span>
			<span class="font-semibold">
				{{ props.book.additionalTitle }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Sub Area: </span>
			<span class="font-semibold">
				{{ props.book.subArea }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Author: </span>
			<span class="font-semibold">
				{{ props.book.author }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Dealer: </span>
			<span class="font-semibold">
				{{ props.book.dealer }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Price: </span>
			<span class="font-semibold">
				{{ props.book.price }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Volume: </span>
			<span class="font-semibold">
				{{ props.book.volume }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Call Number: </span>
			<span class="font-semibold">
				{{ props.book.callNumber }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Section: </span>
			<span class="font-semibold">
				{{ props.book.section }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Additional Subject: </span>
			<span class="font-semibold">
				{{ props.book.additionalSubject }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Publisher: </span>
			<span class="font-semibold">
				{{ props.book.publisher }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Publication Place: </span>
			<span class="font-semibold">
				{{ props.book.pubPlace }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Total Price: </span>
			<span class="font-semibold">
				{{ props.book.totalPrice }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Remarks: </span>
			<span class="font-semibold">
				{{ props.book.remarks }}
			</span>
		</div>
		<div>
			<span class="font-thin text-sm">Added Entry Title: </span>
			<span class="font-semibold">
				{{ props.book.addedEntryTitle }}
			</span>
		</div>
	</Dialog>
</template>
