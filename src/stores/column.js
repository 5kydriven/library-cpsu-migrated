import { defineStore } from 'pinia';
import { ref } from 'vue';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useFirestore } from 'vuefire';

export const useColumnStore = defineStore('column-store', () => {
	const db = useFirestore();
	const isLoading = ref(false);
	const columns = ref([]);
	const selectedColumns = ref([]);

	const toggleColumnSelection = async (val) => {
		isLoading.value = true;
		columns.value.forEach((col) => {
			col.isSelected = val.includes(col);
		});
		selectedColumns.value = columns.value.filter((col) => col.isSelected);

		const columnsDocRef = doc(db, 'columns', 'Folax89B5AHlTCa1U84L');
		await updateDoc(columnsDocRef, { column: columns.value });

		isLoading.value = false;
	};

	function fetchColumns() {
		isLoading.value = true;

		const columnsDocRef = doc(db, 'columns', 'Folax89B5AHlTCa1U84L');
		onSnapshot(columnsDocRef, (doc) => {
			if (doc.exists()) {
				columns.value = doc.data().column.map((column) => ({
					...column,
				}));
				selectedColumns.value = columns.value.filter((col) => col.isSelected);
			}
			isLoading.value = false;
		});
	}

	return {
		columns,
		selectedColumns,
		isLoading,
		toggleColumnSelection,
		fetchColumns,
	};
});
