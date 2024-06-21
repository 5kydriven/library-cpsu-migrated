<template>
    <div class="flex justify-between items-center">
        <div>
            <input @change="handleFileChange"
                class="block w-full text-sm py-2 px-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                type="file" accept=".csv">
            <p class="text-xs text-gray-500 dark:text-gray-300" id="file_input_help">Only csv file.</p>
        </div>
        <Button @click="uploadFile" :disabled="!file" label="Upload" />
    </div>

    <div>
        <div>
            <DataTable :value="files" tableStyle="min-width: 20rem" v-show="files" removableSort paginator :rows="5">
                <Column field="sec" header="Section" sortable></Column>
                <Column field="college" header="College"></Column>
                <Column field="title" header="Title"></Column>
                <Column field="price" header="Price"></Column>
                <template #footer> In total there are {{ files ? files.length : 0 }} Book's </template>
            </DataTable>
        </div>
    </div>

    <span v-show="dialogLoading"
        class="bg-gray-800/[.7] w-full h-full flex gap-2 flex-col items-center justify-center leading-none rounded-lg dark:bg-blue-900 dark:text-blue-200 absolute -translate-y-1/2 -translate-x-1/2 top-2/4 left-1/2">
        <div role="status">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary-500"
                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor" />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill" />
            </svg>
        </div>
        <label class="text-gray-50  rounded px-0.5 py-0.5 font-semibold ">"Please wait, this may take a moment."</label>
    </span>

</template>

<script setup>
import { ref } from 'vue';
import Papa from 'papaparse';
import { db } from '@/stores/firebase.js';
import { writeBatch, doc, collection } from "firebase/firestore";

const emit = defineEmits(['formSuccess']);

const files = ref();
const file = ref(null);
const dialogLoading = ref(false);

const handleFileChange = (event) => {
    file.value = event.target.files[0];
    Papa.parse(file.value, {
        header: true,
        complete: (results) => {
            let removeEmpty = [];

            // Lowercase the headers
            const lowerCaseHeaders = results.meta.fields.map(field => field.toLowerCase());

            // Transform the data to use lowercase headers
            const transformedData = results.data.map(row => {
                let newRow = {};
                lowerCaseHeaders.forEach((header, index) => {
                    newRow[header] = row[results.meta.fields[index]];
                });
                return newRow;
            });

            // Filter out rows with no values
            transformedData.forEach(row => {
                const hasValues = Object.values(row).some(value => value != null && value != '');
                console.log(row)
                if (hasValues) {
                    removeEmpty.push({ ...row });
                }
            });

            files.value = removeEmpty;
        },
        error: (error) => {
            console.error('Error parsing CSV file:', error);
        }
    });
};


const uploadFile = async () => {
    dialogLoading.value = true;
    const batch = writeBatch(db);
    const booksCollection = collection(db, "books");

    files.value.forEach(fileData => {
        const newDocRef = doc(booksCollection); // Automatically generates a unique ID

        // Function to clean and parse price values
        const parsePrice = (priceString) => {
            if (typeof priceString === 'string') {
                return parseFloat(priceString.replace(/,/g, '')) || 0;
            }
            return parseFloat(priceString) || 0;
        };

        // Map CSV fields to Firestore properties
        const cleanedData = {
            section: fileData.sec || "N/A",
            college: fileData.college || "N/A",
            subArea: fileData.subarea || "N/A",
            notes: fileData["NOTE/Remarks"] || "N/A",
            subject: fileData.subject || "N/A",
            callNumber: fileData.callnumber || "N/A",
            title: fileData.title || "N/A",
            author: fileData.author || "N/A",
            copyright: fileData.copyright == "N/A",
            accountNumber: fileData.accountnumber || "N/A",
            additionalTitle: fileData.title_1 || "N/A",
            volume: fileData.volume || "N/A",
            additionalSubject: fileData.subject_1 || "N/A",
            publisher: fileData.publisher || "N/A",
            dealer: fileData.dealer || "N/A",
            price: parsePrice(fileData.price), // Clean and parse the price field
            totalPrice: parsePrice(fileData.totalprice), // Clean and parse the totalPrice field
            physDesc: fileData.physdesc || "N/A",
            bibliography: fileData["Bibliography/Notes"] || "N/A",
            isbn: fileData.isbn || "N/A",
            pubPlace: fileData.pubplace || "N/A",
            addedEntryTitle: fileData["AddedEntryTitle / Series Title"] || "N/A",
            remarks: fileData.remarks || "N/A",
        };

        batch.set(newDocRef, cleanedData);
    });

    // Commit the batch
    await batch.commit();
    emit('formSuccess');
    dialogLoading.value = false;
};

</script>
