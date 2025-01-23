import { getDocs } from 'firebase/database';
import { collection } from 'firebase/firestore';
import { ref } from 'vue';
import { useFirestore } from 'vuefire';

export default function useBooks() {
	const db = useFirestore();
	const booksRef = collection(db, 'books');

	const books = ref([]);
	const isLoading = ref(false);

	async function fetchBooks() {
		isLoading.value = true;
		const booksSnapshot = await getDocs(booksRef);
		books = booksSnapshot;
		isLoading.value = false;
	}

	return {
		books,
		isLoading,
		fetchBooks,
	};
}
