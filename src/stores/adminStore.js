import { defineStore } from 'pinia';
import { collection, onSnapshot } from "firebase/firestore";
import { ref } from 'vue';
import { db } from './firebase';

export const useAdminStore = defineStore('admin', () => {
    const students = ref();
    const books = ref();
    const loading = ref(false);

    const fetchStudents = () => {
        loading.value = true;

        onSnapshot(collection(db, "students"), (querySnapshot) => {
            const student = [];
            querySnapshot.forEach((doc) => {
                student.push({ ...doc.data(), id: doc.id });
            });
            students.value = student
            loading.value = false;
        });
    }

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
    }

    return {
        students,
        loading,
        fetchStudents,
        books,
        fetchBooks,
    }
})