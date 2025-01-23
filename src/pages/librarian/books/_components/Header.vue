<script setup>
	import { useColumnStore } from '@/stores/column.js';

	const columnStore = useColumnStore();
</script>

<template>
	<div class="flex justify-between items-center mb-4">
		<h1 class="text-2xl font-bold">Books List</h1>
		<MultiSelect
			:modelValue="columnStore.selectedColumns"
			:options="columnStore.columns"
			optionLabel="header"
			@update:modelValue="columnStore.toggleColumnSelection"
			display="chip"
			placeholder="Select Columns" />
	</div>
</template>
