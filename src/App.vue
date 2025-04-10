<template>
  <Header />
  <router-view :key="$route.fullPath"></router-view>
</template>

<script setup>
import { provide, ref, watch } from 'vue';
import Header from './components/Header.vue';
import { useTransactionStore } from './stores/transaction';
import { useUserStore } from './stores/user';

const transactions = ref([]);
const transactionStore = useTransactionStore();
const userStore = useUserStore();

// 거래내역 변화 감지하여 반영
watch(
  () => transactionStore.transactions,
  (newTransactions) => {
    transactions.value = newTransactions;
  },
  { immediate: true }
);

// nickname 변화 감지해서 fetchTransactions 실행
watch(
  () => userStore.nickname,
  async (newNickname) => {
    if (newNickname) {
      await transactionStore.fetchTransactions(newNickname);
    }
  },
  { immediate: true } // 페이지 처음 열었을 때도 localStorage에 값 있으면 fetch
);

// provide로 전달
provide('transactions', transactions);
</script>

<style scoped></style>
