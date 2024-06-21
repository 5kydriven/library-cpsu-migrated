import { defineStore } from 'pinia';
import { doc, onSnapshot, updateDoc, collection } from "firebase/firestore";
import { ref, computed } from 'vue';
import { db } from './firebase';

export const useAdminStore = defineStore('admin', () => {
    const students = ref([]);
    const books = ref([]);
    const logs = ref([]);
    const loading = ref(false);
    const columns = ref([]);
    const selectedColumns = ref([]);

    const fetchStudents = () => {
        loading.value = true;
        onSnapshot(collection(db, "students"), (querySnapshot) => {
            const student = [];
            querySnapshot.forEach((doc) => {
                student.push({ ...doc.data(), id: doc.id });
            });
            students.value = student;
            loading.value = false;
        });
    };

    const fetchBooks = () => {
        loading.value = true;
        onSnapshot(collection(db, "books"), (querySnapshot) => {
            const book = [];
            querySnapshot.forEach((doc) => {
                book.push({ ...doc.data() });
            });
            books.value = book;
            loading.value = false;
        });
    };

    const fetchLogs = () => {
        loading.value = true;
        onSnapshot(collection(db, "studentLogs"), (querySnapshot) => {
            const log = [];
            querySnapshot.forEach((doc) => {
                log.push({ ...doc.data() });
            });
            logs.value = log;
            loading.value = false;
        });
    };

    const fetchColumns = () => {
        loading.value = true;

        const columnsDocRef = doc(db, "columns", "Folax89B5AHlTCa1U84L"); 
        onSnapshot(columnsDocRef, (doc) => {
            if (doc.exists()) {
                columns.value = doc.data().column.map(column => ({
                    ...column
                }));
                selectedColumns.value = columns.value.filter(col => col.isSelected);
            }
            loading.value = false;
        });
    };

    const toggleColumnSelection = async (val) => {
        loading.value = true
        // Update isSelected property of each column based on the selection
        columns.value.forEach(col => {
            col.isSelected = val.includes(col);
        });
        // Update selectedColumns to only include the val columns
        selectedColumns.value = columns.value.filter(col => col.isSelected);

        // Update the array in the Firestore document
        const columnsDocRef = doc(db, "columns", "Folax89B5AHlTCa1U84L");
        await updateDoc(columnsDocRef, { column: columns.value });

        loading.value = false
    };

    const totalStudents = computed(() => students.value.length);
    const totalBooks = computed(() => books.value.length);

    return {
        students,
        loading,
        fetchStudents,
        books,
        fetchBooks,
        logs,
        fetchLogs,
        totalStudents,
        totalBooks,
        fetchColumns,
        columns,
        selectedColumns,
        toggleColumnSelection
    };
});
