<template>
  <div class="header-container">
    <div class="header-content">
      <div>텅장 수호대</div>
      <div>4월</div>
      <div>이동용 아이콘</div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.header-container {
  width: 100%;
  background-color: #fcbf4e;
  height: 196px;
  display: flex;
  justify-content: center; /* 가운데 정렬 */
}

.header-content {
  max-width: 1024px;
  width: 100%;
  display: flex;
  justify-content: space-between; /* 필요에 따라 center, space-around 등으로 조절 */
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}
</style>
