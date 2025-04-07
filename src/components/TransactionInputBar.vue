<template>
  <div class="card shadow-sm p-2 mt-2 mb-4 bg-white rounded-3 text-warning">
    <div class="row align-items-end g-2">
      <!-- 수입/지출 토글 -->
      <div class="col-auto">
        <div class="d-flex flex-column">
          <button
            type="button"
            class="btn rounded-pill px-4 mb-2"
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
          placeholder="10,000원"
        />
      </div>

      <!-- 추가 버튼 -->
      <div class="col-auto">
        <button class="btn border border-warning" @click="addTransaction">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCategoriesStore } from '@/stores/useCategoriesStore';
import { usePaytypesStore } from '@/stores/usePaytypesStore';
import { useTransactionStore } from '@/stores/transaction';
import { onMounted, ref } from 'vue';

const selectedType = ref('지출');
const date = ref(new Date().toISOString().slice(0, 10));
const category = ref('');
const description = ref('');
const paymentMethod = ref('');
const amount = ref('');

// pinia에서 가져옴
const paytypesStore = usePaytypesStore();
const categoriesStore = useCategoriesStore();
const transactionStore = useTransactionStore();

// 데이터 가져오기
onMounted(async () => {
  await categoriesStore.fetchCategories();
  await paytypesStore.fetchPaytypes();

  // 첫 번째 요소 선택되도록 초기화
  category.value = categoriesStore.categories[0]?.name || '';
  paymentMethod.value = paytypesStore.paytypes[0]?.name || '';
});

const addTransaction = async () => {
  const parsedAmount = parseInt(amount.value.replace(/[^0-9]/g, ''), 10);
  if (isNaN(parsedAmount)) {
    alert('금액을 숫자로 입력해주세요.');
    return;
  }

  const newTransaction = {
    paytype: paymentMethod.value,
    category: category.value,
    date: date.value,
    description: description.value,
    amount: parsedAmount,
    expense_type: selectedType.value,
  };

  await transactionStore.addTransaction(newTransaction);

  // 초기화
  description.value = '';
  amount.value = '';
};
</script>

<style></style>
