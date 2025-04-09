import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const nickname = ref(localStorage.getItem('nickname') || '');

  const setNickname = (newName) => {
    nickname.value = newName;
    localStorage.setItem('nickname', newName);
  };

  const logout = () => {
    nickname.value = '';
    localStorage.removeItem('nickname');
  };

  return { nickname, setNickname, logout };
});
