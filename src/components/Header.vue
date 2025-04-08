<template>
  <div class="header-container">
    <div class="header-content">
      <!-- 왼쪽 -->
      <div class="left">
        <div class="row">
          <div class="col">
            <div class="logo fs-4 fw-bolder">텅장수호대</div>
          </div>
        </div>
        <div class="row">
          <span
            ><i class="fa-regular fa-user fa-2x" style="margin: 5px"></i
          ></span>
          <span>
            <span class="fw-bold" style="color: #f97316">{{ name }}</span
            ><span>님,</span>
            <div>반갑습니다!</div>
          </span>
        </div>
      </div>

      <!-- 가운데 -->
      <div class="center">
        <span class="arrow" @click="dateStore.prevMonth()"
          ><i class="fa-solid fa-arrow-left"></i
        ></span>
        <span class="text-center">
          <div class="display-2 fw-bold">{{ dateStore.month }}월</div>
          <div class="fs-5 fw-normal" style="margin-top: 5px">
            {{ dateStore.year }}
          </div>
        </span>
        <span class="arrow" @click="dateStore.nextMonth()"
          ><i class="fa-solid fa-arrow-right"></i
        ></span>
      </div>

      <!-- 오른쪽 -->
      <div class="right">
        <router-link to="/">
          <i
            class="icon fa-solid fa-list-ul"
            :class="{ active: $route.path === '/' }"
          ></i>
        </router-link>
        <router-link to="/calendar">
          <i
            class="icon fa-regular fa-calendar-days"
            :class="{ active: $route.path === '/calendar' }"
          ></i>
        </router-link>
        <router-link to="/chart">
          <i
            class="icon fa-solid fa-chart-simple"
            :class="{ active: $route.path === '/chart' }"
          ></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

import { useDateStore } from '@/stores/date';
const dateStore = useDateStore();

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

const name = ref('천재개발자');
</script>

<style scoped>
.header-container {
  width: 100%;
  background-color: #fcbf4e;
  height: 196px;
  display: flex;
  justify-content: center;
  position: relative;
}

.header-content {
  max-width: 1024px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
  position: relative;
}

/* 왼쪽 */
.left {
  flex-shrink: 0;
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
  gap: 16px;
  flex-shrink: 0;
}
.logo {
  /* color: #f97316; */
  font-weight: bold;
  margin-bottom: 15px;
}

.arrow {
  font-size: 30px;
  margin-left: 30px;
  margin-right: 30px;
}
.icon {
  color: #888888;
  font-size: 24px;
  padding: 0 5px;
}
.icon.active {
  color: #ffffff;
}
.icon:not(.active):hover {
  color: #dddddd;
}
</style>
