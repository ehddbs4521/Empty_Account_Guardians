<template>
  <Header />
  <router-view></router-view>
</template>

<script setup>
import { onMounted, provide, ref, watch } from 'vue';
import Header from './components/Header.vue';
import { useTransactionStore } from './stores/transaction';

const transactions = ref([]);
const transactionStore = useTransactionStore();

// 거래내역 변화 감지하여 반영
watch(
  () => transactionStore.transactions,
  (newTransactions) => {
    transactions.value = newTransactions;
  },
  { immediate: true }
);

onMounted(async () => {
  const nickname = localStorage.getItem('nickname');
  console.log('nickname: ', nickname);
  if (nickname) {
    await transactionStore.fetchTransactions(nickname);
  }
});

// provide로 전달
provide('transactions', transactions);
</script>

<style scoped></style>
