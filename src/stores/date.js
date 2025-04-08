import { defineStore } from 'pinia';

export const useDateStore = defineStore('date', {
  state: () => ({
    currentDate: new Date(),
  }),
  getters: {
    year: (state) => state.currentDate.getFullYear(),
    month: (state) => String(state.currentDate.getMonth() + 1).padStart(2, '0'),
  },
  actions: {
    nextMonth() {
      const date = new Date(this.currentDate);
      date.setMonth(date.getMonth() + 1);
      this.currentDate = date;
    },
    prevMonth() {
      const date = new Date(this.currentDate);
      date.setMonth(date.getMonth() - 1);
      this.currentDate = date;
    },
    setDate(date) {
      this.currentDate = date;
    },
  },
});
