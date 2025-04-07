<template>
  <div class="layout-wrapper">
    <!-- 왼쪽: 원형 차트 -->
    <div class="chart-wrapper">
      <canvas ref="chartRef"></canvas>
    </div>

    <!-- 오른쪽: 카테고리 리스트 -->
    <div class="list-wrapper">
      <h2>{{ currentMonthStr }} 총 지출 금액 {{ total.toLocaleString() }}</h2>
      <table>
        <tbody>
          <tr v-for="(label, index) in labels" :key="label">
            <td>
              <span
                class="color-box"
                :style="{ backgroundColor: colors[index] }"
              ></span>
            </td>
            <td class="label-text">{{ label }}</td>
            <td class="percentage-text">
              {{ percentages[index].toFixed(1) }}%
            </td>
            <td class="amount-text">{{ amounts[index].toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { Chart } from 'chart.js/auto';

const chartRef = ref(null);
const labels = ref([]);
const colors = ref([]);
const percentages = ref([]);
const amounts = ref([]);
const total = ref(0);
const currentMonth = ref(new Date().getMonth() + 1); // JS는 0부터 시작하므로 +1
const currentMonthStr = ref(`${currentMonth.value}월`);

onMounted(async () => {
  await nextTick();

  const transactionRes = await fetch('http://localhost:3000/transactions');
  const transactions = await transactionRes.json();

  const categoryRes = await fetch('http://localhost:3000/categories');
  const categoryMeta = await categoryRes.json();

  const expenses = transactions.filter((t) => t.expense_type === '지출');
  // 월 필터링 코드 -> db.json 수정해야 함. (다 3월로 되어 있음)
  // const expenses = transactions.filter((t) => {
  //   const date = new Date(t.date); // t.date는 문자열이라고 가정 (예: "2025-04-07")
  //   return (
  //     t.expense_type === '지출' && date.getMonth() + 1 === currentMonth.value
  //   );
  // });

  const categoryTotals = {};
  expenses.forEach((t) => {
    if (!categoryTotals[t.category]) {
      categoryTotals[t.category] = 0;
    }
    categoryTotals[t.category] += t.amount;
  });

  const rawLabels = Object.keys(categoryTotals);
  const rawData = Object.values(categoryTotals);
  total.value = rawData.reduce((sum, value) => sum + value, 0);

  const rawColors = rawLabels.map((label) => {
    const found = categoryMeta.find((cat) => cat.name === label);
    return found ? found.color : '#cccccc';
  });

  labels.value = rawLabels;
  colors.value = rawColors;
  amounts.value = rawData;
  percentages.value = rawData.map((value) => (value / total.value) * 100);

  const ctx = chartRef.value.getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: rawLabels,
      datasets: [
        {
          label: '지출 금액',
          data: rawData,
          backgroundColor: rawColors,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
    },
  });
});
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto; /* 가운데 정렬 */
  box-sizing: border-box;
}

.chart-wrapper {
  width: 400px;
  height: 400px;

  flex-shrink: 0;
}

.list-wrapper {
  flex-grow: 1;
  min-width: 300px;
}
h2 {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: left;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 6px 10px;
  vertical-align: middle;
}

.color-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-block;
}

.label-text {
  font-weight: 500;
}

.percentage-text {
  text-align: right;
  color: #666;
}

.amount-text {
  text-align: right;
  font-weight: bold;
  color: #333;
}
</style>
