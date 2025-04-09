import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useTransactionStore = defineStore("transaction", () => {
  const transactions = ref([]);
  const error = ref(null);

  const fetchTransactions = async (nickname) => {
    error.value = null;
    try {
      const response = await axios.get("http://localhost:3000/transactions", {
        params: { nickname },
      });
      transactions.value = response.data;
    } catch (error) {
      console.log("transactios호출에서 오류: ", error);
    }
  };

  const addTransaction = async (newTransaction) => {
    error.value = null;

    try {
      // 전체 transactions 불러오기
      const response = await fetch(`http://localhost:3000/transactions`);
      if (!response.ok) {
        throw new Error("서버 응답 오류: " + response.status);
      }

      const allData = await response.json();

      // maxId 계산 (전체 데이터 기준)
      const maxId = allData.reduce((max, t) => {
        const numericId = Number(t.id);
        return numericId > max ? numericId : max;
      }, 0);
      console.log("maxId:", maxId);

      // 현재 월 기준 데이터 다시 필터링해서 보여줄 용도
      const nickname = localStorage.getItem("nickname");
      transactions.value = allData.filter(
        (t) =>
          t.date.startsWith(newTransaction.date.slice(0, 7)) &&
          t.nickname === nickname
      );

      // 새 트랜잭션 생성
      const transactionWithId = {
        id: String(maxId + 1),
        nickname: nickname,
        ...newTransaction,
      };

      // POST 요청으로 저장
      const postResponse = await axios.post(
        "http://localhost:3000/transactions",
        transactionWithId,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 현재 리스트에 추가
      transactions.value.push(postResponse.data);
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
        throw new Error("트랜잭션 삭제 실패: " + response.status);
      }
    } catch (err) {
      error.value = err.message;
    }
  };

  const updateTransaction = async (id, transaction) => {
    try {
      const nickname = localStorage.getItem("nickname");

      // nickname을 넣은 새로운 객체 생성
      const updatedTransaction = {
        id,
        nickname,
        ...transaction,
      };

      const response = await axios.put(
        `http://localhost:3000/transactions/${id}`,
        updatedTransaction
      );

      if (response.status === 200) {
        let index = transactions.value.findIndex((t) => t.id === id);
        transactions.value[index] = updatedTransaction;
      } else {
        throw new Error("트랜잭션 변경 실패: " + response.status);
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
