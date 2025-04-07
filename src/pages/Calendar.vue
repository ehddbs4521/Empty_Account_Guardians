<template>
  <div class="calendar-wrapper">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import { useTransactionStore } from "@/stores/transaction";

const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();

const initialMonth = ref(
  route.query.month || new Date().toISOString().slice(0, 7)
);
const initialDate = ref(`${initialMonth.value}-01`);

const getParsedYearMonth = () => {
  const text = document.querySelector(".fc-toolbar-title")?.textContent?.trim();
  const match = text?.match(/(\d{4})년\s*(\d{1,2})월/);
  return match ? `${match[1]}-${match[2].padStart(2, "0")}` : null;
};

watchEffect(() => {
  const currentMonth = route.query.month || initialMonth.value;
  transactionStore.fetchTransactions(currentMonth);
});

const calendarEvents = computed(() => {
  const grouped = transactionStore.transactions.reduce(
    (acc, { date, expense_type, amount }) => {
      if (!acc[date]) acc[date] = { income: 0, expense: 0 };
      if (expense_type === "수입") acc[date].income += Number(amount);
      else if (expense_type === "지출") acc[date].expense += Number(amount);
      return acc;
    },
    {}
  );

  return Object.entries(grouped).map(([date, { income, expense }]) => ({
    title: `수입 ${income.toLocaleString()}원\n지출 ${expense.toLocaleString()}원`,
    date,
  }));
});

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  locale: koLocale,
  initialView: "dayGridMonth",
  initialDate: initialDate.value,
  events: calendarEvents.value,
  eventDisplay: "block",
  fixedWeekCount: true,
  aspectRatio: 1.3,
  height: "auto",
  datesSet() {
    const currentMonth = getParsedYearMonth();
    if (currentMonth) {
      router.replace({ query: { ...route.query, month: currentMonth } });
    }
  },
  eventDidMount(info) {
    const el = info.el;
    const [incomeText, expenseText] = info.event.title.split("\n");

    el.style.backgroundColor = "transparent";
    el.style.border = "none";
    el.innerHTML = `
        <div style="color: #007bff">${incomeText}</div>
        <div style="color: #dc3545">${expenseText}</div>
      `;
  },
}));
</script>

<style>
.calendar-wrapper {
  height: 100vh;
  padding: 0 10px;
  box-sizing: border-box;
  overflow-y: auto;
}

.fc-daygrid-event {
  background: none !important;
  border: none !important;
  white-space: pre-line;
  font-size: 0.8rem;
  padding: 0 !important;
}

.fc-daygrid-day-frame {
  min-height: 100px;
  display: flex;
  flex-direction: column;
}

.fc-daygrid-day-top {
  flex-shrink: 0;
}

.fc-daygrid-day-events {
  flex-grow: 1;
  overflow-y: auto;
}

.fc-theme-standard td,
.fc-theme-standard th {
  border: 1px solid #999 !important;
}

.fc .fc-col-header-cell-cushion,
.fc .fc-daygrid-day-number {
  color: #7c7b7b !important;
}

@media (max-width: 768px) {
  .fc-daygrid-day-frame {
    min-height: 70px;
  }

  .fc-daygrid-event {
    font-size: 0.65rem;
  }

  .fc-toolbar-title {
    font-size: 1.2rem !important;
  }

  .fc-daygrid-day-number {
    font-size: 0.75rem !important;
  }
}
</style>
