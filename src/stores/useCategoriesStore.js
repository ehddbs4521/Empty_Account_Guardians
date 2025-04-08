import { ref, onMounted } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([]);
  const error = ref(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      categories.value = response.data;
    } catch (err) {
      error.value = err;
    }
  };

  const addCategory = async (newCategory) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/categories',
        newCategory,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.log('에러: ', error);
    }
  };

  onMounted(() => {
    fetchCategories();
  });

  return { categories, error, fetchCategories, addCategory };
});
