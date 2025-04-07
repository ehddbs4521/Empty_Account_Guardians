<template>
  <div class="modal">
    <div class="box">
      <div class="filterbox" style="background-color: #fcbf4e; width: 100%">
        <p>필터링</p>
        <button class="applybtn" @click="handleApply">적용</button>
      </div>
      <div>
        <div style="font-weight: bold">분류</div>
        <button
          v-for="item in categories"
          :key="item"
          :class="['custom-btn', selected.includes(item) ? 'selected' : '']"
          @click="toggleCategory(item)"
        >
          {{ item.name }}
          <i
            v-if="selected.includes(item)"
            class="fa-solid fa-circle-check"
          ></i>
        </button>
        <div style="font-weight: bold">결제수단</div>
        <button
          v-for="item in paytypes"
          :key="item"
          :class="['custom-btn', selected.includes(item) ? 'selected' : '']"
          @click="toggleCategory(item)"
        >
          {{ item.name }}
          <i
            v-if="selected.includes(item)"
            class="fa-solid fa-circle-check"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useCategoriesStore } from '@/stores/useCategoriesStore.js';
import { usePaytypesStore } from '@/stores/usePaytypesStore.js';

const categorystore = useCategoriesStore();
const categories = computed(() => categorystore.categories);
const emit = defineEmits(['closeModal']);

const handleApply = () => {
  emit('closeModal'); // 부모에게 이벤트 발생
};

const paytypestore = usePaytypesStore();
const paytypes = computed(() => paytypestore.paytypes);
const selected = ref([]);
const toggleCategory = (item) => {
  if (selected.value.includes(item)) {
    selected.value = selected.value.filter((v) => v !== item);
  } else {
    selected.value.push(item);
  }
};
</script>
<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}
.box {
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); /* 🔥 추가 */

  background-color: white;
  border: solid 1px gray;
  width: 500px;
  /* height: 80px; */
}
.filterbox {
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.applybtn {
  border: none;
  border: 1px solid white;
  border-radius: 10px;
  background-color: #fcbf4e;
}
.custom-btn {
  padding: 0.5rem 1rem;
  border: 1px solid lightgray;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  margin: 0.3rem;
  font-weight: bold;
}
.selected {
  /* background-color: #fcbf4e; */
  /* color: white; */
  border-color: #fcbf4e;
}
i {
  color: #fcbf4e;
}
</style>
