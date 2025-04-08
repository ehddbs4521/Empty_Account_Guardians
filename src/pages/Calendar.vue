<template>
  <div class="calendar-wrapper">
    <FullCalendar :options="calendarOptions" />

    <div v-if="isModalOpen" class="modal-popup">
      <div class="modal-content">
        <h3>{{ selectedDate }} 거래 내역</h3>
        <ul v-if="selectedTransactions.length" class="transaction-list">
          <li
            v-for="(item, index) in selectedTransactions"
            :key="index"
            class="transaction-item"
          >
            <span
              class="badge"
              :style="{
                backgroundColor: item.categoryColor,
                color: '#fff',
                textShadow: '0 0 1px #000, 0 0 1px #000, 0 0 1px #000',
              }"
            >
              {{ item.category }}
            </span>
            <span class="description">{{ item.description }}</span>
            <span
              class="amount"
              :class="
                item.expense_type === '수입'
                  ? 'amount-income'
                  : 'amount-expense'
              "
            >
              {{ item.expense_type === "수입" ? "+" : "-"
              }}{{ item.amount.toLocaleString() }}
            </span>
          </li>
        </ul>
        <p v-else>해당 날짜에 거래 내역이 없습니다.</p>
        <button @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
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

const selectedDate = ref(null);
const isModalOpen = ref(false);
const selectedTransactions = ref([]);
const categories = ref([]);

const fetchCategories = async () => {
  const res = await fetch("http://localhost:3000/categories");
  categories.value = await res.json();
};

const getCategoryColor = (categoryName) => {
  const found = categories.value.find((c) => c.name === categoryName);
  return found?.color || "#ccc";
};

const openModal = (date) => {
  selectedDate.value = date;
  selectedTransactions.value = transactionStore.transactions
    .filter((t) => t.date === date)
    .map((t) => ({
      ...t,
      categoryColor: getCategoryColor(t.category),
    }));
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedDate.value = null;
  selectedTransactions.value = [];
};

const getParsedYearMonth = () => {
  const text = document.querySelector(".fc-toolbar-title")?.textContent?.trim();
  const match = text?.match(/(\d{4})년\s*(\d{1,2})월/);
  return match ? `${match[1]}-${match[2].padStart(2, "0")}` : null;
};

watchEffect(() => {
  const currentMonth = route.query.month || initialMonth.value;
  transactionStore.fetchTransactions(currentMonth);
});

onMounted(() => {
  fetchCategories();
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
  dateClick(info) {
    const clickedDate = info.dateStr;
    const hasData = transactionStore.transactions.some(
      (t) => t.date === clickedDate
    );
    if (hasData) openModal(clickedDate);
  },
  eventClick(info) {
    openModal(info.event.startStr);
  },
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
    el.style.cursor = "pointer";
    el.classList.add("hoverable-event");

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
  font-size: 0.9rem;
  padding: 0 !important;
}

.hoverable-event:hover {
  filter: brightness(1.15);
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
    font-size: 0.7rem;
  }

  .fc-toolbar-title {
    font-size: 1.2rem !important;
  }

  .fc-daygrid-day-number {
    font-size: 0.75rem !important;
  }
}

.modal-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  width: 90%;
  max-width: 520px;
  background-color: white;
  border: 2px solid #666;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
}

.modal-content {
  background-color: #fff;
  padding: 28px;
  border-radius: 12px;
  width: 90%;
  max-width: 460px;
  margin: 0 auto;
  box-sizing: border-box;
}

.modal-content h3 {
  font-size: 1.6rem;
  margin-bottom: 24px;
  color: #222;
  text-align: center;
}

.transaction-list {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  gap: 16px;
  font-size: 1.2rem;
}

.badge {
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: bold;
  white-space: nowrap;
  color: #333;
  display: inline-block;
  flex-shrink: 0;
}

.description {
  flex: 1;
  font-size: 1.2rem;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.amount {
  font-weight: bold;
  font-size: 1.3rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.amount-income {
  color: #2e8b57;
}

.amount-expense {
  color: #c0392b;
}

.modal-content button {
  display: block;
  margin: 28px auto 0;
  padding: 12px 24px;
  font-size: 1.1rem;
  background: #f4f4f4;
  border: 1px solid #333;
  border-radius: 6px;
  cursor: pointer;
}
</style>
