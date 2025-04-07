import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTransactionStore = defineStore('transaction', () => {
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
        throw new Error('서버 응답 오류: ' + response.status);
      }
    } catch (err) {
      error.value = err.message;
    }
  };

  const addTransaction = async (newTransaction) => {
    error.value = null;

    try {
      await fetchTransactions(newTransaction.date.slice(0, 7)); // 예: "2025-03"
      // 1. 현재 가장 큰 id 찾기
      const maxId = transactions.value.reduce((max, t) => {
        const numericId = Number(t.id);
        return numericId > max ? numericId : max;
      }, 0);

      // 2. 새 id 지정
      const transactionWithId = {
        id: String(maxId + 1),
        ...newTransaction,
      };

      // 3. POST 요청
      const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionWithId),
      });

      if (response.ok) {
        const data = await response.json();
        transactions.value.push(data); // 목록 반영
      } else {
        throw new Error('트랜잭션 추가 실패: ' + response.status);
      }
    } catch (err) {
      error.value = err.message;
    }
  };

  return {
    transactions,
    error,
    fetchTransactions,
    addTransaction,
  };
});
