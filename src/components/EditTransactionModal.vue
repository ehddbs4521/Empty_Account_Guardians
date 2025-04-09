<template>
  <div class="modal">
    <div class="box">
      <div class="filterbox d-flex d-flex flex-row-reverse" style="width: 100%">
        <i
          class="fa-solid fa-x"
          style="color: black"
          @click="emit('closeEditModal')"
        ></i>
      </div>
      <div>
        <button
          type="button"
          class="btn rounded-pill px-4 me-2"
          :class="
            selectedType === '수입' ? 'btn-warning' : 'btn-outline-warning'
          "
          @click="selectedType = '수입'"
        >
          수입
        </button>
        <button
          type="button"
          class="btn rounded-pill px-4"
          :class="
            selectedType === '지출' ? 'btn-warning' : 'btn-outline-warning'
          "
          @click="selectedType = '지출'"
        >
          지출
        </button>
      </div>

      <!-- 일자 -->
      <div class="col">
        <label class="form-label fw-semibold mb-3">일자</label>
        <input type="date" v-model="date" class="form-control" />
      </div>

      <!-- 분류 -->
      <div class="col">
        <label class="form-label fw-semibold mb-3">분류</label>
        <select v-model="category" class="form-select">
          <option
            v-for="(item, index) in categoriesStore.categories"
            :key="index"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
      <!-- 내용 -->
      <div class="col">
        <label class="form-label fw-semibold mb-3">내용</label>
        <input
          type="text"
          class="form-control"
          v-model="description"
          placeholder="짧게 입력"
        />
      </div>

      <!-- 결제수단 -->
      <div class="col">
        <label class="form-label fw-semibold mb-3">결제수단</label>
        <select v-model="paymentMethod" class="form-select">
          <option v-for="(item, index) in paytypesStore.paytypes" :key="index">
            {{ item.name }}
          </option>
        </select>
      </div>
      <!-- 금액 -->
      <div class="col">
        <label class="form-label fw-semibold mb-3">금액</label>
        <input
          type="text"
          class="form-control"
          v-model="amount"
          placeholder="숫자를 입력하라"
        />
      </div>

      <div class="button-group mt-3">
        <button class="submitbtn me-2" @click="handleSave">저장</button>
        <!-- <button class="cancelbtn" @click="emit('closeEditModal')">취소</button> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import { useCategoriesStore } from '@/stores/useCategoriesStore';
import { usePaytypesStore } from '@/stores/usePaytypesStore';
import { useTransactionStore } from '@/stores/transaction.js';

const store = useTransactionStore();

const props = defineProps({
  transaction: Object,
});

const emit = defineEmits(['closeEditModal']);

const selectedType = ref('지출');
const date = ref(new Date().toISOString().slice(0, 10));
const category = ref('');
const description = ref('');
const paymentMethod = ref('');
const amount = ref('');

// pinia store
const paytypesStore = usePaytypesStore();
const categoriesStore = useCategoriesStore();

onMounted(async () => {
  await categoriesStore.fetchCategories();
  await paytypesStore.fetchPaytypes();

  if (!props.transaction) {
    category.value = categoriesStore.categories[0]?.name || '';
    paymentMethod.value = paytypesStore.paytypes[0]?.name || '';
  }
});

watch(
  () => props.transaction,
  (newVal) => {
    if (newVal) {
      selectedType.value = newVal.expense_type;
      date.value = newVal.date;
      category.value = newVal.category;
      description.value = newVal.description;
      paymentMethod.value = newVal.paytype;
      amount.value = newVal.amount;
    }
  },
  { immediate: true }
);

const handleSave = async () => {
  const transactionData = {
    expense_type: selectedType.value,
    date: date.value,
    category: category.value,
    description: description.value,
    paytype: paymentMethod.value,
    amount: amount.value,
  };

  try {
    await store.updateTransaction(props.transaction.id, transactionData);
    alert('수정이 완료되었습니다.');

    emit('closeEditModal'); // 모달 닫기
  } catch (err) {
    alert('저장 중 오류 발생: ' + err.message);
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
  align-items: flex-start;
  justify-content: center;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: solid 1px gray;
  width: 500px;
  padding: 20px;
  gap: 1rem; /* 요소 사이 간격 */
}

.box > div {
  width: 100%;
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
  border-color: #fcbf4e;
}
i {
  color: #fcbf4e;
  cursor: pointer;
}
.button-group {
  display: flex;
  width: 100%;
  gap: 0.5rem;
}

.submitbtn,
.cancelbtn {
  flex: 1;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border-radius: 8px;
}
.submitbtn {
  background-color: #fcbf4e;
  color: white;
  border: none;
}

.cancelbtn {
  background-color: #eee;
  color: black;
  border: none;
}
</style>
