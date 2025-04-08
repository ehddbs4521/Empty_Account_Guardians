import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);
  const error = ref(null);

  const fetchTransactions = async (month) => {
    error.value = null;

    try {
      const response = await fetch(`http://localhost:3000/transactions`);

      if (response.ok) {
        const data = await response.json();
        transactions.value = data.filter((t) => t.date.startsWith(month));
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
      await fetchTransactions(newTransaction.date.slice(0, 7));
      const maxId = transactions.value.reduce((max, t) => {
        const numericId = Number(t.id);
        return numericId > max ? numericId : max;
      }, 0);

      const transactionWithId = {
        id: String(maxId + 1),
        ...newTransaction,
      };

      const response = await axios.post(
        'http://localhost:3000/transactions',
        transactionWithId,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      transactions.value.push(response.data);
    } catch (err) {
      error.value = err.message;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/transactions/${id}`
      );

      if (response.status == 200) {
        let index = transactions.value.findIndex(
          (transaction) => transaction.id === id
        );
        transactions.value.splice(index, 1);
      } else {
        throw new Error('트랜잭션 삭제 실패: ' + response.status);
      }
    } catch (err) {
      error.value = err.message;
    }
  };

  const updateTransaction = async (id, transaction) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/transactions/${id}`,
        transaction
      );
      if (response.status === 200) {
        let index = transactions.value.findIndex(
          (transaction) => transaction.id === id
        );
        transactions.value[index] = { ...transaction, id };
      } else {
        throw new Error('트랜잭션 변경 실패: ' + response.status);
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
    deleteTransaction,
    updateTransaction,
  };
});
