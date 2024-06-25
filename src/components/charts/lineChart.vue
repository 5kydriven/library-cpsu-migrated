<template>
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-[400px]"/>
</template>

<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {

    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Overview Student Logs',
                data: [65, 59, 80, 81, 56, 55, 40],
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
}
</script>
