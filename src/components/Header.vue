<template>
  <div class="header-container pb-3">
    <div class="header-content">
      <!-- 왼쪽 -->
      <div class="left">
        <!-- 로고 -->
        <div class="logo-wrapper">
          <img
            class="logo fs-4 fw-bolder mt-4"
            src="/public/logo.png"
            alt="로고"
            style="width: 90px"
          />
        </div>

        <!-- 프로필 + 닉네임 -->
        <div
          v-if="userStore.nickname"
          class="d-flex flex-row align-items-center mb-2"
          style="gap: 10px"
        >
          <div class="profile-user-div">
            <img
              src="/public/mascot.png"
              alt="프로필 이미지"
              class="profile-img"
            />
          </div>

          <div style="color: white">
            <span class="fw-bold">{{ userStore.nickname }}</span
            ><span>님,</span>
            <div>반갑습니다!</div>
          </div>
        </div>
        <div v-if="userStore.nickname" class="d-flex flex-row-reverse mb-4">
          <button class="logout-btn rounded-5 ps-3 pe-3" @click="handleLogout">
            로그아웃
          </button>
        </div>
      </div>
      <!-- 가운데 -->
      <div class="center">
        <span class="arrow" @click="dateStore.prevMonth()"
          ><i class="fa-solid fa-arrow-left" style="cursor: pointer"></i
        ></span>
        <span class="text-center">
          <div class="display-3 fw-bold">{{ dateStore.month }}월</div>
          <div class="fs-5 fw-normal" style="margin-top: 5px">
            {{ dateStore.year }}
          </div>
        </span>
        <span class="arrow" @click="dateStore.nextMonth()"
          ><i class="fa-solid fa-arrow-right" style="cursor: pointer"></i
        ></span>
      </div>

      <!-- 오른쪽 -->
      <div class="right">
        <router-link to="/home" class="nav-item">
          <i
            class="icon fa-solid fa-list-ul"
            :class="{ active: $route.path === '/home' }"
          ></i>
          <span class="nav-label">홈</span>
        </router-link>
        <router-link to="/calendar" class="nav-item">
          <i
            class="icon fa-regular fa-calendar-days"
            :class="{ active: $route.path === '/calendar' }"
          ></i>
          <span class="nav-label">캘린더</span>
        </router-link>
        <router-link to="/chart" class="nav-item">
          <i
            class="icon fa-solid fa-chart-simple"
            :class="{ active: $route.path === '/chart' }"
          ></i>
          <span class="nav-label">차트</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useDateStore } from '@/stores/date';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
const router = useRouter();
const dateStore = useDateStore();
const userStore = useUserStore();

const currentDate = ref(new Date());
const displayedMonth = computed(() => currentDate.value.getMonth() + 1);
const displayedYear = computed(() => currentDate.value.getFullYear());

const prevMonth = () => {
  const date = new Date(currentDate.value);
  date.setMonth(date.getMonth() - 1);
  currentDate.value = date;
};

const nextMonth = () => {
  const date = new Date(currentDate.value);
  date.setMonth(date.getMonth() + 1);
  currentDate.value = date;
};

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};
</script>

<style scoped>
.header-container {
  width: 100%;
  background-color: #fcbf4e;
  height: 13.8125rem; /* 221px */
  display: flex;
  justify-content: center;
  position: relative;
  padding-bottom: 3rem;
}

.header-content {
  max-width: 64rem; /* 1024px */
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  box-sizing: border-box;
  position: relative;
}

/* 왼쪽 */
.left {
  flex-shrink: 0;
  min-width: auto;
  position: relative;
}

/* 가운데 */
.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

/* 오른쪽 */
.right {
  display: flex;
  gap: 1rem; /* 16px */
  flex-shrink: 0;
}
.logo {
  font-weight: bold;
  margin-bottom: 0.9375rem; /* 15px */
}

.arrow {
  font-size: 1.875rem; /* 30px */
  margin-left: 1.875rem; /* 30px */
  margin-right: 1.875rem; /* 30px */
}
.icon {
  color: #4c4c4c4f;
  font-size: 1.5rem; /* 24px */
  padding: 0 0.3125rem; /* 5px */
}
.icon.active {
  color: #ffffff;
}
.icon:not(.active):hover {
  color: #ffffff;
  opacity: 0.5;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  text-decoration: none;
  color: inherit;
}

.nav-label {
  position: absolute;
  top: 2.5rem; /* 40px */
  white-space: nowrap;
  color: #ffffff;
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 10;
}

.nav-item:hover .nav-label {
  opacity: 1;
}
.profile-user-div {
  width: 3.125rem; /* 50px */
  height: 3.125rem; /* 50px */
  border-radius: 50%;
  overflow: hidden;
}
.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.logout-btn {
  padding: 0.25rem 0.625rem; /* 4px 10px */
  font-size: 0.8rem;
  border: 0.125rem solid #ffffff73; /* 2px */
  background-color: transparent;
  color: #ffffff73;
  font-weight: bold;
}
.logout-btn:hover {
  border: none;
  border: 0.125rem solid white; /* 2px */
  background-color: transparent;
  color: white;
}
</style>
