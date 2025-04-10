<template>
  <div class="mt-5" style="width: 100%" v-show="transactions">
    <p class="totalcount">전체 내역 {{ totalcount }}건</p>
    <button @click="changeModal" class="filterbtn mb-3">
      필터 <i class="fa-solid fa-sliders"></i>
    </button>

    <FilterModal
      v-if="isModal"
      @applyFilter="applyFilter"
      :appliedFilters="appliedFilters"
    />

    <div
      class="applied-filter-container"
      style="display: flex; justify-content: flex-start"
    >
      <div class="applyfilter me-1 rounded-5" v-for="filter in appliedFilters">
        <span class="me-1" style="font-weight: bold">{{ filter.name }} </span
        ><i class="fa-solid fa-x" @click="removeFilter(filter)"></i>
      </div>
    </div>
    <div style="display: flex; justify-content: flex-end">
      <div class="mb-3">
        <label class="me-3">
          <input class="income-checkbox" type="checkbox" v-model="showIncome" />
          수입: {{ totalincome.toLocaleString() }}
        </label>
        <label>
          <input
            class="expense-checkbox"
            type="checkbox"
            v-model="showExpense"
          />
          지출: {{ totalexpenditure.toLocaleString() }}
        </label>
      </div>
    </div>
    <div class="d-flex justify-content-end mb-4">
      <select
        v-model="sortType"
        class="form-select w-auto"
        style="font-size: 14px"
      >
        <option value="desc" selected>최신순</option>
        <option value="asc">오래된순</option>
      </select>
    </div>
    <table class="table" style="text-align: center">
      <thead class="table-warning">
        <tr>
          <th>분류</th>
          <th>내용</th>
          <th>결제 수단</th>
          <th>비용</th>
          <th>작성일</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedTransactions" :key="index">
          <td>
            <span
              class="badge rounded-pill"
              :style="{
                backgroundColor: getCategoryColor(item.category),
                color: 'white',
              }"
              >{{ item.category }}</span
            >
          </td>
          <td>{{ item.description }}</td>
          <td>{{ item.paytype }}</td>
          <td>
            {{ item.expense_type === '수입' ? '+' : '-'
            }}{{ item.amount.toLocaleString() }}원
          </td>
          <td>{{ item.date }}</td>
          <td class="option-cell">
            <i
              @click="toggleOption(index)"
              class="fa-solid fa-ellipsis-vertical"
            ></i>
            <div v-if="showOptionIndex === index" class="option-popup">
              <button class="optionbtn" @click="openEditModal(item)">
                <i class="fa-solid fa-pen-to-square"></i> 수정하기
              </button>

              <EditTransactionModal
                v-if="isEditModal"
                :transaction="selectedTransaction"
                @closeEditModal="isEditModal = false"
              />
              <button class="optionbtn" @click="() => handleDelete(item.id)">
                <div>
                  <i class="fa-solid fa-trash-can"></i>
                  삭제하기
                </div>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
        <i class="fa-solid fa-less-than"></i>
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        <i class="fa-solid fa-greater-than"></i>
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, inject } from 'vue';
import { useTransactionStore } from '@/stores/transaction.js';
import { useCategoriesStore } from '@/stores/useCategoriesStore';
import FilterModal from './FilterModal.vue';
import EditTransactionModal from './EditTransactionModal.vue';
import { useDateStore } from '@/stores/date.js';
const store = useTransactionStore();
const categoryStore = useCategoriesStore();
const dateStore = useDateStore(); // 월별 이동 시, 데이터 로딩
const isModal = ref(false);
const isEditModal = ref(false);
const showOptionIndex = ref(null);

// const transactions = computed(() => store.transactions);
const transactions = inject('transactions');

const totalcount = computed(() => filteredTransactions.value.length);

// 수입 지출 체크박스
const showIncome = ref(true);
const showExpense = ref(true);

const totalincome = computed(() => {
  return filteredTransactions.value
    .filter((item) => item.expense_type === '수입')
    .reduce((sum, item) => sum + Number(item.amount), 0);
});
const totalexpenditure = computed(() => {
  return filteredTransactions.value
    .filter((item) => item.expense_type === '지출')
    .reduce((sum, item) => sum + Number(item.amount), 0);
});
const sortType = ref('desc');
const changeModal = () => {
  isModal.value = true;
};
const toggleOption = (index) => {
  showOptionIndex.value = index === showOptionIndex.value ? null : index;
};

// 페이지 네이션

const currentPage = ref(1); // 현재 페이지
const itemsPerPage = 10; // 페이지 당 항목 수

// 필터링 된 입.출금 목록
const selectedMonth = computed(() => dateStore.formattedDate);
const filteredTransactions = computed(() => {
  let list = [...transactions.value];

  // [1] 월 필터링
  list = list.filter((item) => {
    return item.date.startsWith(selectedMonth.value); // selectedMonth는 computed이므로 .value 사용
  });

  // [2] 수입/지출 필터
  list = list.filter((item) => {
    if (item.expense_type === '수입' && showIncome.value) return true;
    if (item.expense_type === '지출' && showExpense.value) return true;
    return false;
  });

  // [3] 카테고리/결제수단 필터
  const selectedCategories = appliedFilters.value
    .filter((f) => f.type === 'category')
    .map((f) => f.name);

  const selectedPaytypes = appliedFilters.value
    .filter((f) => f.type === 'paytype')
    .map((f) => f.name);

  if (selectedCategories.length > 0) {
    list = list.filter((item) => selectedCategories.includes(item.category));
  }

  if (selectedPaytypes.length > 0) {
    list = list.filter((item) => selectedPaytypes.includes(item.paytype));
  }

  return list;
});

// const filteredTransactions = computed(() => {
//   let list = [...transactions.value];

//   // 수입/지출 필터
//   list = list.filter((item) => {
//     if (item.expense_type === '수입' && showIncome.value) return true;
//     if (item.expense_type === '지출' && showExpense.value) return true;
//     return false;
//   });

//   // 카테고리/결제수단 필터
//   const selectedCategories = appliedFilters.value
//     .filter((f) => f.type === 'category')
//     .map((f) => f.name);

//   const selectedPaytypes = appliedFilters.value
//     .filter((f) => f.type === 'paytype')
//     .map((f) => f.name);

//   if (selectedCategories.length > 0) {
//     list = list.filter((item) => selectedCategories.includes(item.category));
//   }

//   if (selectedPaytypes.length > 0) {
//     list = list.filter((item) => selectedPaytypes.includes(item.paytype));
//   }
//   return list;
// });

const paginatedTransactions = computed(() => {
  let list = [...filteredTransactions.value];
  if (sortType.value === 'desc') {
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortType.value === 'asc') {
    list.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  // console.log('list: ', list);

  return list.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// 카테고리, 결제수단 필터
const appliedFilters = ref([]);

const applyFilter = (filterItems) => {
  appliedFilters.value = filterItems;
  isModal.value = false;

  console.log(appliedFilters.value);
};

//필터 제거
const removeFilter = (filter) => {
  appliedFilters.value = appliedFilters.value.filter((f) => f.id !== filter.id);
};

//아이템 삭제
const handleDelete = (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    store.deleteTransaction(id);
  }
};

//카테고리 생상 가져오기
const getCategoryColor = (categoryName) => {
  const category = categoryStore.categories.find(
    (c) => c.name === categoryName
  );
  return category ? category.color : '#007bff';
};

//수정하기
const selectedTransaction = ref(null);
const openEditModal = (transaction) => {
  selectedTransaction.value = transaction;
  isEditModal.value = true;
};

const handleClickOutside = (event) => {
  const optionPopups = document.querySelectorAll('.option-popup');
  const optionIcons = document.querySelectorAll('.fa-ellipsis-vertical');

  let clickedInsidePopupOrIcon = false;

  optionPopups.forEach((popup) => {
    if (popup.contains(event.target)) {
      clickedInsidePopupOrIcon = true;
    }
  });

  optionIcons.forEach((icon) => {
    if (icon.contains(event.target)) {
      clickedInsidePopupOrIcon = true;
    }
  });

  if (!clickedInsidePopupOrIcon) {
    showOptionIndex.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
<style scoped>
.option-cell {
  position: relative;
}

.option-popup {
  position: absolute;
  top: 30px;
  right: 0;
  background-color: white;
  border: 1px solid #6a6a6a;
  padding: 0.5rem;
  border-radius: 0.3rem;
  z-index: 10;
  min-width: 120px;
  text-align: left;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

i {
  cursor: pointer;
}
.badge {
  width: 5rem;
}
.optionbtn {
  border: none;
  background-color: white;
}
.totalcount {
  color: #ffb428;
  font-size: large;
  font-weight: bold;
}
.filterbtn {
  border: none;

  border: 2px solid lightgray;
  background-color: white;
  border-radius: 0.5rem;
  padding: 0.2rem 1rem;
  font-weight: bold;
}
.filterbtn:hover {
  color: #ffb428;
}
.custom-checkbox {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 32px;
}

.incomecheck {
  opacity: 0;
  width: 0;
  height: 0;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
.pagination button {
  /* border: 1px solid #ccc; */
  border: none;
  background-color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
}
.pagination button.active {
  /* background-color: #fcbf4e; */
  font-weight: bold;
  color: blue;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.applyfilter {
  background-color: rgb(238, 238, 238);
  /* border-radius: 10px; */
  padding: 0 10px;
  height: 30px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px; /* 글자 크기 줄이기 */
  line-height: 1;
}

.applyfilter span,
.applyfilter i {
  font-size: 12px; /* span과 아이콘 크기 통일 */
}

.applied-filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.expense-checkbox {
  accent-color: rgb(255, 59, 59);
}
</style>
