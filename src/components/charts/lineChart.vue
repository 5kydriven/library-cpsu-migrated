<template>
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-[400px]" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/stores/firebase";

const chartData = ref();
const chartOptions = ref();

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const fetchStudentLogs = async () => {
    const q = query(collection(db, "studentLogs"), where("status", "==", "IN"));
    const querySnapshot = await getDocs(q);

    const monthCounts = new Array(12).fill(0);

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = new Date(data.date);
        const month = date.getMonth();
        monthCounts[month]++;
    });

    return monthCounts;
};

const setChartData = (data) => {
    return {
        labels: months,
        datasets: [
            {
                label: 'Overview Student Logs',
                data: data,
                fill: false,
                borderColor: '#10b981',
                tension: 0.4
            }
        ]
    };
};

const setChartOptions = () => {
    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: '#020617'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#1f2937'
                },
                grid: {
                    color: '#cbd5e1'
                }
            },
            y: {
                ticks: {
                    color: '#1f2937'
                },
                grid: {
                    color: '#cbd5e1'
                }
            }
        }
    };
};

onMounted(async () => {
    const monthCounts = await fetchStudentLogs();
    chartData.value = setChartData(monthCounts);
    chartOptions.value = setChartOptions();
});
</script>
