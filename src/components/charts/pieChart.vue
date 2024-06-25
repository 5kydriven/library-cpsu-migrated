<template>
    <Chart type="pie" :data="chartData" :options="chartOptions" class="w-[350px]" />
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
        labels: ['BSIT','BSHM','BSCRIM','BSED'],
        datasets: [
            {
                data: [540, 325, 702,10],
                backgroundColor: ['#10b981', '#06b6d4', '#6366f1','#f43f5e'],
                hoverBackgroundColor: ['#34d399', '#22d3ee', '#818cf8','#fb7185']
            }
        ]
    };
};

const setChartOptions = () => {
    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: '#111827'
                }
            }
        }
    };
};
</script>
