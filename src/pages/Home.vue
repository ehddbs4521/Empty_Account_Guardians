<template>
  <div class="container position-relative">
    <TransactionInputBar
      @incomeGifShow="triggerGif('incomeGifShow')"
      @outcomeGifShow="triggerGif('outcomeGifShow')"
    />
    <TransactionList />

    <!-- GIF 모달 -->
    <div v-if="showGifModal" class="gif-modal">
      <img :src="gifSrc" alt="Transaction Gif" class="gif-img" />
    </div>
  </div>
</template>

<script setup>
import TransactionInputBar from '@/components/TransactionInputBar.vue';
import TransactionList from '@/components/TransactionList.vue';
import { ref } from 'vue';

const showGifModal = ref(false);
const gifSrc = ref('');

const triggerGif = (type) => {
  gifSrc.value =
    type === 'incomeGifShow' ? '/piggyback-7147.gif' : '/money-3408.gif';

  showGifModal.value = true;

  setTimeout(() => {
    showGifModal.value = false;
    gifSrc.value = '';
  }, 2000); // 3초간 보여줌
};
</script>

<style scoped>
.gif-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent; /* 모달 자체는 투명하게 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.gif-img {
  width: 300px;
  height: auto;
  pointer-events: none; /* 클릭 막기 */
}
</style>
