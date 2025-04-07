<template>
  <div class="chart-wrapper">
    <canvas ref="chartRef"></canvas>
  </div>
</template>
<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { Chart } from 'chart.js/auto';

const chartRef = ref(null);

onMounted(async () => {
  await nextTick(); // DOM 보장

  // ✅ 각각 별도로 fetch
  const transactionRes = await fetch('http://localhost:3000/transactions');
  const transactions = await transactionRes.json();

  const categoryRes = await fetch('http://localhost:3000/categories');
  const categoryMeta = await categoryRes.json();

  // 지출만 필터
  const expenses = transactions.filter((t) => t.expense_type === '지출');

  // 카테고리별 합계 계산
  const categoryTotals = {};
  expenses.forEach((t) => {
    if (!categoryTotals[t.category]) {
      categoryTotals[t.category] = 0;
    }
    categoryTotals[t.category] += t.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  // ✅ 카테고리 이름으로 색상 매핑
  const colors = labels.map((label) => {
    const found = categoryMeta.find((cat) => cat.name === label);
    return found ? found.color : '#cccccc'; // 기본 색상 지정
  });

  const ctx = chartRef.value.getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          label: '지출 금액',
          data,
          backgroundColor: colors,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });
});
</script>

<style scoped>
.chart-wrapper {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
</style>
