<template>
  <div class="modal">
    <div class="box p-4">
      <p v-if="type == 'category'" class="fs-5 fw-semibold mb-3">
        추가할 카테고리를 입력해주세요
      </p>
      <p v-if="type == 'payment'" class="fs-5 fw-semibold mb-3">
        추가할 결제수단을 입력해주세요
      </p>
      <!-- 카테고리 이름 입력 -->
      <input
        type="text"
        v-model="categoryName"
        class="form-control mb-3"
        placeholder="입력하세요"
      />

      <!-- 색상 선택 -->
      <div class="color-picker-wrapper mb-3" v-if="type == 'category'">
        <input
          type="color"
          v-model="selectedColor"
          class="form-control form-control-color rounded-circle p-0 border-0 color-input"
          style="width: 30px; height: 30px"
        />
        <input
          type="text"
          v-model="selectedColor"
          class="hex-input"
          maxlength="7"
          placeholder="#000000"
        />
      </div>

      <!-- 버튼 영역 -->
      <div class="d-flex justify-content-end gap-3">
        <button class="btn btn-light" @click="$emit('close')">취소</button>
        <button class="btn btn-warning" @click="submitCategory">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import { useCategoriesStore } from '@/stores/useCategoriesStore';
import { usePaytypesStore } from '@/stores/usePaytypesStore';
const categoryName = ref('');
const selectedColor = ref('#9d2a0e');
const props = defineProps({
  type: {
    type: String,
    required: true, // 'category' or 'payment'
  },
});

const categoriesStore = useCategoriesStore();
const paytypesStore = usePaytypesStore();
const emit = defineEmits(['close', 'added']);

const submitCategory = async () => {
  if (!categoryName.value.trim()) {
    alert('카테고리명을 입력해주세요.');
    return;
  }

  if (props.type === 'category') {
    const newCategory = {
      name: categoryName.value.trim(),
      color: selectedColor.value,
    };
    // console.log('추가할 카테고리:', newCategory);
    await categoriesStore.addCategory(newCategory);
  } else if (props.type === 'payment') {
    const newPaytype = {
      name: categoryName.value.trim(),
    };
    // console.log('추가할 지불타입:', newPaytype);
    await paytypesStore.addPaytype(newPaytype);
  }

  // 성공적으로 추가되었으므로 모달 닫기
  emit('close');
  // 상위 컴포넌트로 전달
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
}
.color-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
}
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.color-input {
  border: none;
  background: none;
  width: 40px;
  height: 32px;
  padding: 0;
  cursor: pointer;
}

.hex-input {
  width: 90px;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
