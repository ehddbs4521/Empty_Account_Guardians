import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDateStore = defineStore('date', () => {
  const currentDate = ref(new Date());

  const year = computed(() => currentDate.value.getFullYear());
  const month = computed(() =>
    String(currentDate.value.getMonth() + 1).padStart(2, '0')
  );

  const formattedDate = computed(() => {
    const y = currentDate.value.getFullYear();
    const m = String(currentDate.value.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  });

  const nextMonth = () => {
    const date = new Date(currentDate.value);
    date.setMonth(date.getMonth() + 1);
    currentDate.value = date;
  };

  const prevMonth = () => {
    const date = new Date(currentDate.value);
    date.setMonth(date.getMonth() - 1);
    currentDate.value = date;
  };

  const setDate = (date) => {
    currentDate.value = date;
  };

  return {
    currentDate,
    year,
    month,
    formattedDate,
    nextMonth,
    prevMonth,
    setDate,
  };
});
