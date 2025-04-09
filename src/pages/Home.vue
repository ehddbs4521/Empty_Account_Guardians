<template>
  <div class="container position-relative">
    <TransactionInputBar
      @incomeGifShow="triggerAnimation('income')"
      @outcomeGifShow="triggerGif('outcomeGifShow')"
    />
    <TransactionList />

    <!-- GIF 모달 -->
    <!-- <div v-if="showGifModal" class="gif-modal">
      <img :src="gifSrc" alt="Transaction Gif" class="gif-img" />
    </div> -->
    <div v-if="showAnimationModal" class="gif-modal">
      <div class="animation-content">
        <Vue3Lottie
          :animationData="currentAnimation"
          :height="300"
          :width="300"
          :loop="false"
          :autoPlay="true"
        />
        <p class="thanks-text">오늘도 일용할 양식 감사합니다</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import TransactionInputBar from '@/components/TransactionInputBar.vue';
import TransactionList from '@/components/TransactionList.vue';
import { Vue3Lottie } from 'vue3-lottie';

import incomeanimation from '@/assets/Animation - 1744181634184.json';

import { ref } from 'vue';

const showGifModal = ref(false);
const gifSrc = ref('');
const currentAnimation = ref(null);
const showAnimationModal = ref(false);

const triggerGif = (type) => {
  gifSrc.value =
    type === 'incomeGifShow' ? '/piggyback-7147.gif' : '/money-3408.gif';

  showGifModal.value = true;

  setTimeout(() => {
    showGifModal.value = false;
    gifSrc.value = '';
  }, 2000); // 3초간 보여줌
};

const triggerAnimation = (type) => {
  currentAnimation.value =
    type === 'income' ? incomeanimation : outcomeAnimation;

  showAnimationModal.value = true;

  setTimeout(() => {
    showAnimationModal.value = false;
    currentAnimation.value = null;
  }, 3000); // 2초간 보여줌
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
.animation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.thanks-text {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #444;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
}
</style>
