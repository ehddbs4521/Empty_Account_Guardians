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

  // 자동 fetch
  onMounted(() => {
    fetchPaytypes();
  });

  return { paytypes, error, fetchPaytypes };
});
