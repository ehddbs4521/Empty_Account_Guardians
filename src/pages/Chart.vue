<template>
  <div class="toggle-wrapper">
    <button
      :class="{ active: selectedType === '지출' }"
      @click="updateChart('지출')"
    >
      지출
    </button>
    <button
      :class="{ active: selectedType === '수입' }"
      @click="updateChart('수입')"
    >
      수입
    </button>
  </div>
  <div class="container">
    <div class="layout-wrapper">
      <div class="pie-chart-wrapper">
        <canvas ref="pieChartRef"></canvas>
      </div>

      <div class="list-wrapper">
        <h2>
          {{ selectedMonth }}월 총 <span>{{ selectedType }}</span> 금액
          <span class="fw-bold">{{ total.toLocaleString() }}</span>
        </h2>
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
              <td class="amount-text">
                {{ amounts[index].toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- line chart -->
  <div class="container">
    <div class="layout-wrapper">
      <div class="line-chart-wrapper">
        <canvas ref="lineChartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject, watch, nextTick, computed } from 'vue';
import { Chart } from 'chart.js/auto';
import { useDateStore } from '@/stores/date';

const dateStore = useDateStore();
const yearMonth = computed(() => dateStore.formattedDate);
const selectedYear = computed(() =>
  parseInt(yearMonth.value.split('-')[0], 10)
);
const selectedMonth = computed(() =>
  parseInt(yearMonth.value.split('-')[1], 10)
);

watch([selectedYear, selectedMonth], () => {
  updateChart(selectedType.value);
});

const selectedType = ref('지출');
const pieChart = ref(null);
const lineChart = ref(null);
const labels = ref([]);
const colors = ref([]);
const percentages = ref([]);
const amounts = ref([]);
const total = ref(0);
const pieChartRef = ref(null);
const lineChartRef = ref(null);

const userTransactions = inject('transactions');
if (!userTransactions) {
  console.warn('userTransactions 주입 실패!');
}

const updateChart = (type) => {
  selectedType.value = type;
  drawPieChart(type);
  drawLineChart(type);
};

const drawPieChart = async (type) => {
  if (!pieChartRef.value) return;

  const transactions = userTransactions.value;
  const userNickname = transactions[0].nickname;
  console.log('nickname : ' + userNickname);

  // fetch 카테고리 메타 정보
  const categoryRes = await fetch('http://localhost:3000/categories');
  const categoryMeta = await categoryRes.json();

  // 닉네임으로 필터링된 카테고리만 사용
  const filteredCategories = categoryMeta.filter(
    (cat) => cat.nickname === userNickname
  );

  // selectedYear & selectedMonth에 맞는 거래만 필터링
  const filtered = transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      t.expense_type === type &&
      date.getFullYear() === selectedYear.value &&
      date.getMonth() + 1 === selectedMonth.value
    );
  });

  // 카테고리별 합산
  const categoryTotals = {};
  filtered.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const rawLabels = Object.keys(categoryTotals);
  const rawData = Object.values(categoryTotals);
  total.value = rawData.reduce((sum, value) => sum + value, 0);

  const combined = rawLabels
    .map((label, i) => {
      const color =
        filteredCategories.find((cat) => cat.name === label)?.color ||
        '#cccccc';
      const value = rawData[i];
      return {
        label,
        amount: value,
        color,
        percentage: (value / total.value) * 100,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  const sortedLabels = combined.map((item) => item.label);
  const sortedData = combined.map((item) => item.amount);
  const sortedColors = combined.map((item) => item.color);

  labels.value = sortedLabels;
  amounts.value = sortedData;
  colors.value = sortedColors;
  percentages.value = combined.map((item) => item.percentage);

  // 차트 생성
  const ctx = pieChartRef.value.getContext('2d');
  if (pieChart.value) {
    pieChart.value.destroy();
  }

  pieChart.value = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: sortedLabels,
      datasets: [
        {
          label: `${type} 금액`,
          data: sortedData,
          backgroundColor: sortedColors,
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
};

const drawLineChart = async (type) => {
  if (!lineChartRef.value) {
    return;
  }
  const transactions = userTransactions.value;

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(selectedYear.value, selectedMonth.value - 1 - i, 1);
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

  const filtered = transactions.filter((t) => t.expense_type === type);
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
  if (lineChart.value) lineChart.value.destroy();

  lineChart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: lineLabels,
      datasets: [
        {
          label: `월별 ${type}`,
          data: lineData,
          fill: false,
          borderColor:
            type === '지출' ? 'rgba(255,99,132)' : 'rgba(54, 162, 235)',
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

watch(
  () => userTransactions.value,
  (val) => {
    if (val && val.length > 0) {
      updateChart(selectedType.value);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await nextTick();

  await updateChart(selectedType.value);
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
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto; /* 가운데 정렬 */
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

.toggle-wrapper {
  text-align: left;
  margin: 40px auto 20px 120px;
}

.toggle-wrapper button {
  /* background-color: #eee; */
  border: none;
  padding: 8px 20px;
  margin: 0 4px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.toggle-wrapper button.active {
  background-color: #fcbf4e;
  color: white;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
