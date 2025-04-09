import { ref, onMounted } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const usePaytypesStore = defineStore('paytypes', () => {
  const paytypes = ref([]);
  const error = ref(null);
  const nickname = localStorage.getItem('nickname');

  const fetchPaytypes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/paytypes');
      paytypes.value = response.data.filter((t) => t.nickname === nickname);
    } catch (err) {
      error.value = err;
    }
  };

  const addPaytype = async (newPaytype) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/paytypes',
        {
          ...newPaytype,
          nickname: nickname,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('결제수단 생성 성공', response);
    } catch (error) {
      console.log('지불방법 추가 중 오류: ', error);
    }
  };

  // 자동 fetch
  onMounted(() => {
    fetchPaytypes();
  });

  return { paytypes, error, fetchPaytypes, addPaytype };
});
