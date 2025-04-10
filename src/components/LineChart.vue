<template>
  <canvas ref="lineChartRef" />
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue';
import { Chart } from 'chart.js/auto';

const props = defineProps({
  transactions: Array,
  selectedYear: Number,
  selectedMonth: Number,
  selectedType: String,
});

const lineChart = ref(null);
const lineChartRef = ref(null);

const drawLineChart = () => {
  if (!lineChartRef.value) return;

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(props.selectedYear, props.selectedMonth - 1 - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    months.push({
      label: `${d.getFullYear()}년 ${d.getMonth() + 1}월`,
      key,
      total: 0,
    });
  }

  const filtered = props.transactions.filter(
    (t) => t.expense_type === props.selectedType
  );
  filtered.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    const month = months.find((m) => m.key === key);
    if (month) {
      month.total += t.amount;
    }
  });

  const lineLabels = months.map((m) => m.label);
  const lineData = months.map((m) => m.total);

  const ctx = lineChartRef.value.getContext('2d');
  if (lineChart.value) {
    lineChart.value.destroy();
  }

  lineChart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: lineLabels,
      datasets: [
        {
          label: `월별 ${props.selectedType}`,
          data: lineData,
          fill: false,
          borderColor:
            props.selectedType === '지출'
              ? 'rgba(255,99,132)'
              : 'rgba(54, 162, 235)',
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

onMounted(drawLineChart);

watch(
  () => [
    props.transactions,
    props.selectedYear,
    props.selectedMonth,
    props.selectedType,
  ],
  drawLineChart,
  { deep: true }
);

onBeforeUnmount(() => {
  if (lineChart.value) {
    lineChart.value.destroy();
  }
});
</script>
