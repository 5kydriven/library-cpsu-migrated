import { defineStore } from 'pinia';
import { doc, onSnapshot, updateDoc, collection, where, query, orderBy, serverTimestamp, getDoc, addDoc, setDoc } from "firebase/firestore";
import { ref, computed } from 'vue';
import { db } from './firebase';

export const useAdminStore = defineStore('admin', () => {
    const students = ref([]);
    const books = ref([]);
    const logs = ref([]);
    const loading = ref(false);
    const columns = ref([]);
    const selectedColumns = ref([]);
    const bookLogs = ref([]);

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
                book.push({ ...doc.data(), uid: doc.id });
            });
            books.value = book;
            loading.value = false;
        });
    };

    const fetchLogs = () => {
        loading.value = true;
        const q = query(collection(db, "studentLogs"), orderBy("time_in", "desc"));
        onSnapshot(q, (querySnapshot) => {
            const log = [];
            querySnapshot.forEach((doc) => {
                log.push({ ...doc.data() });
            });
            logs.value = log;
            loading.value = false;
        });
    };

    const fetchLogsByDateRange = (startDate, endDate) => {
        loading.value = true;
        const q = query(
            collection(db, "studentLogs"),
            where("time_in", ">=", new Date(startDate)),
            where("time_in", "<=", new Date(endDate)),
            orderBy("time_in", "desc")
        );
        onSnapshot(q, (querySnapshot) => {
            const log = [];
            querySnapshot.forEach((doc) => {
                log.push({ ...doc.data() });
            });
            logs.value = log;
            loading.value = false;
        });
    };

    const fetchBookLogs = () => {
        loading.value = true;
        onSnapshot(collection(db, "book-logs"), (querySnapshot) => {
            const bookLog = [];
            querySnapshot.forEach((doc) => {
                bookLog.push({ ...doc.data() });
            });
            bookLogs.value = bookLog;
        });
        loading.value = false;
    }

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

    const totalBorrowedBooks = computed(() => {
        return bookLogs.value.filter(log => !log.isReturned).length;
    });

    const totalReturnedBooks = computed(() => {
        return bookLogs.value.filter(log => log.isReturned).length;
    });

    const borrowBook = async (student, book) => {
        loading.value = true;
        try {
            const bookRef = doc(db, "books", book.id);
            const bookDoc = await getDoc(bookRef);

            if (!bookDoc.exists()) {
                throw new Error("Book does not exist");
            }

            const currentStocks = bookDoc.data().stocks;
            if (currentStocks <= 0) {
                throw new Error("No stocks available");
            }

            await updateDoc(bookRef, {
                stocks: currentStocks - 1
            });

            const logRef = await addDoc(collection(db, "book-logs"), {
                borrower: student.name,
                student_id: student.uid,
                year: student.year,
                course: student.course,
                bookName: book.title,
                book_id: book.id,
                isReturned: false,
                dateBorrowed: serverTimestamp(),
                dateReturned: null
            });

            await updateDoc(doc(db, "students", student.uid), {
                borrowBook: logRef.id
            })

            console.log("success");
        } catch (error) {
            console.error("Error borrowing book:", error);
        }

        loading.value = false;
    };

    const returnBook = async (student) => {
        loading.value = true;
        const studentDoc = await getDoc(doc(db, "students", student.uid));
        const bookDoc = await getDoc(doc(db, "book-logs", studentDoc.data().borrowBook));
        const bookData = await getDoc(doc(db, "books", bookDoc.data().book_id));

        console.log(studentDoc.data().borrowBook)
        await updateDoc(doc(db, "book-logs", studentDoc.data().borrowBook), {
            isReturned: true,
            dateReturned: serverTimestamp()
        });

        await updateDoc(doc(db, "students", student.uid), {
            borrowBook: ''
        });

        await updateDoc(doc(db, "books", bookDoc.data().book_id), {
            stocks: bookData.data().stocks + 1
        });

        loading.value = false;

        console.log('Success')
    }

    return {
        students,
        loading,
        fetchStudents,
        books,
        fetchBooks,
        logs,
        fetchLogs,
        fetchLogsByDateRange,
        totalStudents,
        totalBooks,
        fetchColumns,
        columns,
        selectedColumns,
        toggleColumnSelection,
        fetchBookLogs,
        bookLogs,
        borrowBook,
        returnBook,
        totalBorrowedBooks,
        totalReturnedBooks
    };
});
