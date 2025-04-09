<template>
  <div class="modal">
    <div class="box">
      <div class="d-flex flex-row-reverse">
        <i
          class="fa-solid fa-x"
          style="color: black"
          @click="$emit('close')"
        ></i>
      </div>
      <h4 class="mb-4" style="font-weight: bold">회원가입</h4>
      <div class="input-group">
        <input
          class="form-control"
          type="email"
          v-model="email"
          placeholder="이메일(아이디)"
        />
      </div>
      <p v-if="emailInvalid" class="error">유효한 이메일을 입력해주세요.</p>

      <div class="input-group">
        <input
          class="form-control"
          type="password"
          v-model="password"
          placeholder="비밀번호"
        />
      </div>

      <div class="input-group">
        <input
          class="form-control"
          type="password"
          v-model="confirmPassword"
          placeholder="비밀번호 재입력"
        />
      </div>
      <p v-if="passwordMismatch" class="error">비밀번호가 일치하지 않습니다.</p>

      <div class="input-group">
        <input
          class="form-control"
          type="text"
          v-model="nickname"
          placeholder="닉네임"
        />
      </div>

      <button :disabled="!canRegister" @click="register" style="color: white">
        회원가입
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const emit = defineEmits(['close']);

const email = ref('');
const nickname = ref('');
const password = ref('');
const confirmPassword = ref('');

const passwordMismatch = computed(
  () => confirmPassword.value && password.value !== confirmPassword.value
);

const emailInvalid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.value && !emailRegex.test(email.value);
});

const canRegister = computed(
  () =>
    email.value &&
    nickname.value &&
    password.value &&
    !passwordMismatch.value &&
    !emailInvalid.value
);

const register = async () => {
  try {
    await axios.post('http://localhost:3000/users', {
      email: email.value,
      nickname: nickname.value,
      password: password.value,
    });
    alert('회원가입 성공!');
    emit('close');
  } catch (error) {
    alert('회원가입 실패!');
    console.error(error);
  }
};
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}
.box {
  border-radius: 12px;
  background-color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 2rem;
}

.input-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  background-color: #f5c15a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
}

.close {
  background: none;
  color: #888;
  margin-top: 8px;
  font-size: 14px;
}
</style>
