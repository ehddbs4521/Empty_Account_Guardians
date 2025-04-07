import { ref } from "vue";
import { defineStore } from "pinia";

export const useTransactionStore = defineStore("transaction", () => {
  const transactions = ref([]);
  const error = ref(null);

  const fetchTransactions = async (month) => {
    error.value = null;

    try {
      const response = await fetch(
        `http://localhost:3000/transactions?date_like=${month}`
      );

      if (response.ok) {
        const data = await response.json();
        transactions.value = data;
      } else {
        throw new Error("서버 응답 오류: " + response.status);
      }
    } catch (err) {
      error.value = err.message;
    }
  };

  return {
    transactions,
    error,
    fetchTransactions,
  };
});
