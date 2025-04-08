import { ref, onMounted } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const usePaytypesStore = defineStore('paytypes', () => {
  const paytypes = ref([]);
  const error = ref(null);

  const fetchPaytypes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/paytypes');
      //   console.log('response', response);
      paytypes.value = response.data;
    } catch (err) {
      error.value = err;
    }
  };

  const addPaytype = async (newPaytype) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/paytypes',
        newPaytype,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
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
