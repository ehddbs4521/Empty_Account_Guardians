<template>
  <!-- 최상위 div -->
  <div>
    <div class="login-container">
      <div class="login-box">
        <div class="header">
          <img src="/wallet-icon.png" alt="텅장 수호대 캐릭터" class="logo" />
          <h1 class="title">텅장 수호대</h1>
        </div>

        <h2 class="login-title">로그인</h2>

        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <i class="fa fa-user icon"></i>
            <input type="email" v-model="email" placeholder="이메일" required />
          </div>
          <div class="input-group">
            <i class="fa fa-lock icon"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="비밀번호"
              required
            />
            <i class="fa fa-eye toggle" @click="togglePassword"></i>
          </div>
          <button type="submit" class="login-button">로그인</button>
        </form>

        <div class="link-group">
          <a href="#" @click.prevent="showRegister = true">회원가입</a>
        </div>

        <div class="mascot-box">
          <div class="speech-bubble">
            어서오세요!<br />오늘도 소비를 잘 막아줄게요!
          </div>
          <img src="/mascot.png" alt="마스코트" class="mascot" />
        </div>
      </div>
    </div>

    <RegisterModal v-if="showRegister" @close="showRegister = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RegisterModal from '@/pages/RegisterModal.vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const showRegister = ref(false);
const router = useRouter();
const userStore = useUserStore();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (email.value && password.value) {
    try {
      const { data: users } = await axios.get('http://localhost:3000/users');

      const user = users.find(
        (u) => u.email === email.value && u.password === password.value
      );

      if (user) {
        localStorage.setItem('nickname', user.nickname);
        alert(`로그인 성공: ${user.nickname}`);
        userStore.setNickname(user.nickname);
        // router.push('/home');
        router.push('/home').then(() => {
          location.reload(); // <- 새로고침!
        });
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('로그인 처리 중 오류가 발생했습니다.');
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fdf8f2;
  height: 100vh;
  position: relative;
  z-index: 1;
}

.login-box {
  background-color: #fff;
  border-radius: 16px;
  width: 520px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 2;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  background-color: #f5c15a;
  padding: 20px;
}

.logo {
  width: 48px;
  margin-right: 12px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #2e1d0d;
}

.login-title {
  font-size: 26px;
  text-align: center;
  margin: 40px 0 30px;
  color: #3b2b19;
}

form {
  padding: 0 50px;
}

.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #fffefc;
}

.input-group input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 18px;
  background: transparent;
}

.input-group .icon,
.input-group .toggle {
  color: #aaa;
  margin-right: 12px;
  font-size: 20px;
  cursor: pointer;
}

.login-button {
  width: 100%;
  padding: 18px;
  background-color: #ecc266;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #3b2b19;
  cursor: pointer;
  transition: background 0.3s;
}

.login-button:hover {
  background-color: #e2ac3f;
}

.link-group {
  display: flex;
  justify-content: flex-end;
  font-size: 18px;
  margin: 24px 50px 0;
  font-weight: 500;
}

.link-group a {
  color: #555;
  text-decoration: none;
}

.mascot-box {
  margin-top: auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 30px 50px 40px;
}

.speech-bubble {
  background-color: #f7f7f7;
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 16px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
}

.mascot {
  width: 64px;
}
</style>
