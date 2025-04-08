<template>
  <div class="container">
    <div class="layout-wrapper">
      <!-- 왼쪽: 원형 차트 -->
      <div class="pie-chart-wrapper">
        <canvas ref="chartRef"></canvas>
      </div>

      <!-- 오른쪽: 카테고리 리스트 -->
      <div class="list-wrapper">
        <h2>{{ currentMonth }}월 총 지출 금액 {{ total.toLocaleString() }}</h2>
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
  </div>
  <div class="container">
    <div class="line-chart-wrapper">
      <canvas id="lineChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { useTransactionStore } from '@/stores/transaction.js';
import { useCategoriesStore } from '@/stores/useCategoriesStore.js';
import { useDateStore } from '@/stores/date.js';
import { Chart } from 'chart.js/auto';

const transactionStore = useTransactionStore();
const categoriesStore = useCategoriesStore();
const dateStore = useDateStore();
const chartRef = ref(null);
const labels = ref([]);
const colors = ref([]);
const percentages = ref([]);
const amounts = ref([]);
const total = ref(0);
const currentMonth = ref(new Date().getMonth() + 1);

onMounted(async () => {
  await nextTick();

  const now = new Date();

  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}`; //2025-04 형식

  await transactionStore.fetchTransactions(monthKey);
  await categoriesStore.fetchCategories();

  const transactions = transactionStore.transactions;
  const categories = categoriesStore.categories;

  const expenses = transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      t.expense_type === '지출' && date.getMonth() + 1 === currentMonth.value
    );
  });

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
    const found = categories.find((cat) => cat.name === label);
    return found ? found.color : '#cccccc';
  });

  labels.value = rawLabels;
  colors.value = rawColors;
  amounts.value = rawData;
  percentages.value = rawData.map((value) => (value / total.value) * 100);

  const ctx1 = chartRef.value.getContext('2d');
  new Chart(ctx1, {
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

  // line chart
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}`;

    await transactionStore.fetchTransactions(key);
    months.push({
      label: `${d.getFullYear()}년 ${d.getMonth() + 1}월`,
      key,
      total: 0,
    });
  }
  // transactions 중 지출만 걸러내고 월별로 합산
  const expenses2 = transactions.filter((t) => t.expense_type === '지출');
  expenses2.forEach((t) => {
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

  const ctx2 = document.getElementById('lineChart').getContext('2d');
  new Chart(ctx2, {
    type: 'line',
    data: {
      labels: lineLabels,
      datasets: [
        {
          label: '월별 지출',
          data: lineData,
          fill: false,
          borderColor: 'rgba(75, 192, 192)',
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
});
</script>

<style scoped>
.container {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 24px;
  margin: 40px auto;
  display: table;
}
.container {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 24px;
  margin: 40px auto;
  display: table;
}
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
.pie-chart-wrapper {
  width: 400px;
  height: 400px;

  flex-shrink: 0;
}

.list-wrapper {
  flex-grow: 1;
  min-width: 300px;
}

.line-chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto; /* 가운데 정렬 */
  box-sizing: border-box;
}

.line-chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;
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
