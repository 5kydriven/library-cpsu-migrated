import { ref } from 'vue';
import { collection, getCountFromServer } from 'firebase/firestore';
import { useFirestore } from 'vuefire';

export default function useAggregation() {
	const db = useFirestore();
	const booksCount = ref(0);
	const studentsCount = ref(0);
	const isLoading = ref(false);

	async function getBooksCount() {
		isLoading.value = true;
		const booksRef = collection(db, 'books');
		const snapshot = await getCountFromServer(booksRef);
		booksCount.value = snapshot.data().count;
		isLoading.value = false;
	}

	async function getStudentsCount() {
		isLoading.value = true;
		const studentsRef = collection(db, 'students');
		const snapshot = await getCountFromServer(studentsRef);
		studentsCount.value = snapshot.data().count;
		isLoading.value = false;
	}

	return {
		booksCount,
		studentsCount,
		getStudentsCount,
		getBooksCount,
	};
}
