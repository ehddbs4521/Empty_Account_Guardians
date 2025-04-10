<template>
  <div class="container position-relative">
    <TransactionInputBar
      @incomeAnimationShow="triggerAnimation('income')"
      @outcomeAnimationShow="triggerAnimation('expense')"
    />
    <TransactionList />

    <div v-if="showAnimationModal" class="gif-modal">
      <div class="animation-content">
        <Vue3Lottie
          :animationData="currentAnimation"
          :height="300"
          :width="300"
          :loop="false"
          :autoPlay="true"
        />
        <p class="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import TransactionInputBar from '@/components/TransactionInputBar.vue';
import TransactionList from '@/components/TransactionList.vue';
import { Vue3Lottie } from 'vue3-lottie';

import incomeanimation from '@/assets/income_animation.json';
import expenseanimation from '@/assets/expense_animation.json';
import { ref } from 'vue';

const currentAnimation = ref(null);
const showAnimationModal = ref(false);
const message = ref('');

const triggerAnimation = (type) => {
  if (type === 'income') {
    currentAnimation.value = incomeanimation;
    message.value = '오늘도 일용할 양식 감사합니다';
  } else {
    currentAnimation.value = expenseanimation;
    message.value = '와.. 강제 다이어트 오히려 좋을지도?';
  }

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

.message {
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
