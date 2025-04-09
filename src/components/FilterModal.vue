<template>
  <div class="modal">
    <div class="box">
      <div class="filterbox d-flex flex-row" style="width: 100%">
        <i class="fa-solid fa-sliders mt-3 ms-2" style="color: black"> 필터</i>
        <i
          class="fa-solid fa-x mt-3 me-2"
          style="color: black; cursor: pointer"
          @click="handleApply"
        ></i>
      </div>
      <div class="p-3">
        <!-- 분류 -->
        <div style="font-weight: bold">카테고리</div>
        <button
          v-for="item in categories"
          :key="'cat-' + item.id"
          :class="[
            'custom-btn',
            selected.some((v) => v.id === item.id && v.type === 'category')
              ? 'selected'
              : '',
          ]"
          @click="toggleItem({ ...item, type: 'category' })"
        >
          {{ item.name }}
          <i
            v-if="
              selected.some((v) => v.id === item.id && v.type === 'category')
            "
            class="fa-solid fa-circle-check"
          ></i>
        </button>

        <div style="font-weight: bold">결제수단</div>
        <button
          v-for="item in paytypes"
          :key="'pay-' + item.id"
          :class="[
            'custom-btn',
            selected.some((v) => v.id === item.id && v.type === 'paytype')
              ? 'selected'
              : '',
          ]"
          @click="toggleItem({ ...item, type: 'paytype' })"
        >
          {{ item.name }}
          <i
            v-if="
              selected.some((v) => v.id === item.id && v.type === 'paytype')
            "
            class="fa-solid fa-circle-check"
          ></i>
        </button>
      </div>
      <div class="button-group mb-3 px-3">
        <button class="btn-reset me-2" @click="handleReset">초기화</button>
        <button class="btn-apply" @click="handleApply">적용</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import { useCategoriesStore } from '@/stores/useCategoriesStore.js';
import { usePaytypesStore } from '@/stores/usePaytypesStore.js';

const categorystore = useCategoriesStore();
const categories = computed(() => categorystore.categories);
const paytypestore = usePaytypesStore();
const paytypes = computed(() => paytypestore.paytypes);
const selected = ref([]);

const emit = defineEmits(['closeModal']);

const props = defineProps({
  appliedFilters: {
    type: Array,
    default: () => [],
  },
});

const toggleItem = (item) => {
  const idx = selected.value.findIndex(
    (v) => v.id === item.id && v.type === item.type
  );
  if (idx !== -1) {
    selected.value.splice(idx, 1);
  } else {
    selected.value.push(item);
  }
  console.log(selected.value);
};

watch(
  () => props.appliedFilters,
  (newFilters) => {
    selected.value = [...newFilters];
  },
  { immediate: true }
);

const handleApply = () => {
  emit('applyFilter', selected.value);
};

const handleReset = () => {
  selected.value = [];
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

.button-group {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.btn-reset,
.btn-apply {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn-reset {
  background-color: #e0e0e0;
  color: #333;
}

.btn-apply {
  background-color: #fcbf4e;
  color: white;
}

button {
  font-size: 12px;
}
</style>
