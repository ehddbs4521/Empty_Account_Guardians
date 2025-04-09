<template>
  <div class="calendar-wrapper">
    <div class="day-header">
      <div v-for="day in days" :key="day" class="day-label">
        {{ day }}
      </div>
    </div>

    <FullCalendar
      :options="calendarOptions"
      ref="calendarRef"
      class="calendar-content"
    />

    <div v-if="showPopup" class="popup-overlay" @click.self="showPopup = false">
      <div class="popup-content">
        <button class="close-button" @click="showPopup = false">×</button>

        <h3>{{ selectedDate }} 거래 내역</h3>
        <div
          v-if="selectedTransactions.length > 0"
          v-for="tx in selectedTransactions"
          :key="tx.id"
          class="popup-item"
        >
          <span
            class="category-badge"
            :style="{
              backgroundColor: getCategoryColor(tx.category, tx.nickname),
            }"
          >
            {{ tx.category }}
          </span>
          <span class="desc">{{ tx.description }}</span>
          <span :class="tx.expense_type === '수입' ? 'income' : 'expense'">
            {{ tx.expense_type === "수입" ? "+" : "-" }}
            {{ Number(tx.amount).toLocaleString() }}
          </span>
        </div>
        <p v-else>거래 내역이 없습니다.</p>

        <div v-if="selectedTransactions.length > 0" class="popup-total">
          <div>
            <span class="total-label net">총 합:</span>
            <span
              class="total-value net"
              :style="{ color: netTotal >= 0 ? '#1abc9c' : '#e74c3c' }"
            >
              {{ netTotal >= 0 ? "+" : "-"
              }}{{ Math.abs(netTotal).toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const calendarRef = ref(null);
const days = ["일", "월", "화", "수", "목", "금", "토"];

const transactions = inject("transactions", ref([]));
const categories = ref([]);
const yearMonth = "2025-04";

const showPopup = ref(false);
const selectedDate = ref("");
const selectedTransactions = computed(() =>
  transactions.value.filter((tx) => tx.date === selectedDate.value)
);

function getCategoryColor(categoryName, nickname) {
  const found = categories.value.find(
    (c) => c.name === categoryName && c.nickname === nickname
  );
  return found?.color || "#ccc";
}

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3000/categories");
    categories.value = await res.json();
  } catch (err) {
    console.error("카테고리 불러오기 실패:", err);
  }
});

const totalIncome = computed(() =>
  selectedTransactions.value
    .filter((tx) => tx.expense_type === "수입")
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
);

const totalExpense = computed(() =>
  selectedTransactions.value
    .filter((tx) => tx.expense_type === "지출")
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
);

const netTotal = computed(() => totalIncome.value - totalExpense.value);

const calendarEvents = computed(() => {
  const filtered = transactions.value.filter((tx) =>
    tx.date?.startsWith?.(yearMonth)
  );

  const grouped = {};
  filtered.forEach((tx) => {
    const date = tx.date;
    if (!grouped[date]) grouped[date] = { income: 0, expense: 0 };

    const amount = Number(tx.amount);
    if (tx.expense_type === "지출") grouped[date].expense += amount;
    else if (tx.expense_type === "수입") grouped[date].income += amount;
  });

  return Object.entries(grouped).map(([date, { income, expense }]) => ({
    title: "",
    start: date,
    extendedProps: {
      income: `+${income.toLocaleString()}`,
      expense: `-${expense.toLocaleString()}`,
    },
    classNames: ["custom-event"],
  }));
});

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: false,
  dayHeaders: false,
  height: "auto",
  events(fetchInfo, successCallback) {
    successCallback(calendarEvents.value);
  },
  eventContent({ event }) {
    const { income, expense } = event.extendedProps;
    return {
      html: `
        <div class="event-line income">${income}</div>
        <div class="event-line expense">${expense}</div>
      `,
    };
  },
  eventClick(info) {
    selectedDate.value = info.event.startStr;
    showPopup.value = true;
  },
};

watch(
  () => transactions.value,
  () => {
    const api = calendarRef.value?.getApi?.();
    if (api) api.refetchEvents();
  },
  { deep: true }
);
</script>

<style scoped>
.calendar-wrapper {
  max-width: 900px;
  margin: auto;
  margin-top: 20px;
}

.day-header {
  display: flex;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 12px 0;
  margin-bottom: 10px;
  justify-content: space-between;
  font-weight: 600;
}

.day-label {
  flex: 1;
  text-align: center;
  font-size: 15px;
  color: #333;
}

::v-deep .fc {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

::v-deep .fc-scrollgrid {
  border: 2px solid #ccc !important;
  border-radius: 16px !important;
  overflow: hidden;
}

::v-deep .fc-daygrid-day-frame {
  padding: 6px;
}

::v-deep .fc-daygrid-day {
  height: 120px;
  vertical-align: top;
  border: 1px solid #919191;
}

::v-deep .fc-daygrid-day-number {
  font-size: 12px;
  color: #888;
  text-align: right;
  display: block;
  margin-bottom: 4px;
}

::v-deep .fc-daygrid-day-events {
  font-size: 13px;
}

::v-deep .fc-event.custom-event {
  background: none !important;
  border: none !important;
  padding: 0;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.1s ease;
}

::v-deep .fc-event.custom-event:hover {
  transform: scale(1.05);
}

::v-deep .event-line.income {
  color: #1abc9c !important;
}

::v-deep .event-line.expense {
  color: #e74c3c !important;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 32px 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 500px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #aaa;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #333;
}

.popup-content h3 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
}

.popup-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 10px 0;
  gap: 10px;
}

.category-badge {
  font-size: 12px;
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  margin-right: 8px;
  min-width: 60px;
  text-align: center;
}

.income {
  color: #1abc9c;
  font-weight: bold;
}

.expense {
  color: #e74c3c;
  font-weight: bold;
}

.desc {
  flex: 1;
  font-size: 14px;
  margin-left: 4px;
  margin-right: 8px;
}

.popup-total {
  border-top: 1px solid #ddd;
  padding-top: 16px;
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
}

.total-label {
  font-weight: 600;
  margin-right: 8px;
}

.total-value {
  font-weight: bold;
}

.total-value.income {
  color: #1abc9c;
}

.total-value.expense {
  color: #e74c3c;
}

.total-value.net {
  color: #333;
  font-weight: 700;
}
</style>
