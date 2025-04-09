<template>
  <div>
    <div class="card p-2 pt-2 pb-2 mb-4 bg-white rounded-4 text-warning">
      <div class="row align-items-stretch g-2">
        <!-- 수입/지출 토글 -->

        <div class="col-auto pe-2">
          <div class="toggle-wrapper position-relative">
            <div
              class="slide-bg bg-warning rounded-pill position-absolute"
              :style="{
                top: selectedType === '수입' ? '0' : '2.8125rem',
                transition: 'top 0.3s ease',
              }"
            ></div>

            <!-- 버튼들 -->
            <button
              type="button"
              class="btn toggle-btn w-100 mb-2"
              :class="{ 'text-white': selectedType === '수입' }"
              @click="selectedType = '수입'"
            >
              수입
            </button>
            <button
              type="button"
              class="btn toggle-btn w-100"
              :class="{ 'text-white': selectedType === '지출' }"
              @click="selectedType = '지출'"
            >
              지출
            </button>
          </div>
        </div>

        <!-- 일자 -->
        <div class="col pe-2">
          <label class="form-label fw-semibold mb-3">일자</label>
          <input type="date" v-model="date" class="form-control" />
        </div>

        <!-- 분류 -->
        <div class="col pe-2">
          <label class="form-label fw-semibold mb-3">분류</label>
          <select v-model="category" class="form-select">
            <option
              v-for="(item, index) in categoriesStore.categories"
              :key="index"
            >
              {{ item.name }}
            </option>
            <option value="__add__">+ 분류 추가하기</option>
          </select>
        </div>

        <!-- 내용 -->
        <div class="col pe-2">
          <label class="form-label fw-semibold mb-3">내용</label>
          <input
            type="text"
            class="form-control"
            v-model="description"
            placeholder="짧게 입력"
          />
        </div>

        <!-- 결제수단 -->
        <div class="col pe-2" v-if="selectedType === '지출'">
          <label class="form-label fw-semibold mb-3">결제수단</label>
          <select v-model="paymentMethod" class="form-select">
            <option
              v-for="(item, index) in paytypesStore.paytypes"
              :key="index"
            >
              {{ item.name }}
            </option>
            <option value="__add__">+ 결제수단 추가하기</option>
          </select>
        </div>

        <!-- 금액 -->
        <div class="col pe-2">
          <label class="form-label fw-semibold mb-3">금액</label>
          <input
            type="text"
            class="form-control"
            v-model="amount"
            placeholder="금액을 입력하세요."
          />
        </div>

        <!-- 버튼 -->
        <div
          class="col-auto d-flex flex-column justify-content-between gap-2 square-button-col"
        >
          <button class="btn form-control" @click="initTransaction">
            <i class="fa-solid fa-arrows-rotate"></i>
          </button>
          <button class="btn form-control" @click="addTransaction">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- AddCategory 모달 or 영역 -->
    <AddCategoryModal
      v-if="showAddCategory"
      :type="addMode"
      @close="handleCategoryClose"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import AddCategoryModal from './AddCategoryModal.vue';
import { useCategoriesStore } from '@/stores/useCategoriesStore';
import { usePaytypesStore } from '@/stores/usePaytypesStore';
import { useTransactionStore } from '@/stores/transaction';

const emit = defineEmits(['incomeGifShow']);

const selectedType = ref('지출');
const date = ref(new Date().toISOString().slice(0, 10));
const category = ref('');
const description = ref('');
const paymentMethod = ref('');
const amount = ref('');
const showAddCategory = ref(false);
const addMode = ref(''); // 'category' or 'payment'

// pinia store
const paytypesStore = usePaytypesStore();
const categoriesStore = useCategoriesStore();
const transactionStore = useTransactionStore();

onMounted(async () => {
  await categoriesStore.fetchCategories();
  await paytypesStore.fetchPaytypes();

  category.value = categoriesStore.categories[0]?.name || '';
  paymentMethod.value = paytypesStore.paytypes[0]?.name || '';
});

// 카테고리 추가 선택 시
watch([category, paymentMethod], ([newCategory, newPayment]) => {
  if (newCategory === '__add__') {
    addMode.value = 'category';
    showAddCategory.value = true;
  }
  if (newPayment === '__add__') {
    addMode.value = 'payment';
    showAddCategory.value = true;
  }
});

// AddCategory 닫기
const handleCategoryClose = async () => {
  showAddCategory.value = false;

  if (addMode.value === 'category') {
    await categoriesStore.fetchCategories();
    category.value = categoriesStore.categories[0]?.name || '';
  } else if (addMode.value === 'payment') {
    await paytypesStore.fetchPaytypes();
    paymentMethod.value = paytypesStore.paytypes[0]?.name || '';
  }

  addMode.value = '';
};

const initTransaction = () => {
  selectedType.value = '지출';
  date.value = new Date().toISOString().slice(0, 10);
  category.value = categoriesStore.categories[0]?.name || '';
  description.value = '';
  paymentMethod.value = paytypesStore.paytypes[0]?.name || '';
  amount.value = '';
};

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

  if (selectedType.value === '수입') {
    emit('incomeGifShow');
  } else {
    emit('outcomeGifShow');
  }

  // 초기화 일부
  description.value = '';
  amount.value = '';
};
</script>

<style scoped>
.toggle-wrapper {
  width: 6.25rem; /* 100px */
  height: 5.625rem; /* 90px */
  position: relative;
}

.slide-bg {
  height: 2.5rem; /* 40px */
  left: 0;
  right: 0;
  z-index: 0;
}

.toggle-btn {
  position: relative;
  background: transparent;
  z-index: 1;
}

.border-end {
  border-left: 0.125rem solid #ddd !important; /* 2px */
}

.toggle-btn {
  border: none !important;
}

.card {
  box-shadow: 0.3125rem 0.3125rem 0.625rem rgba(221, 221, 221, 0.5); /* 5px 5px 10px */
  margin-top: -1.25rem; /* -20px */
}

.row > .col:not(:first-child) {
  border-left: 0.125rem solid #ddd; /* 2px */
  padding-left: 1rem;
}
</style>
