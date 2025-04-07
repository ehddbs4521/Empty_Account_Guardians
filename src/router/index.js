import { createRouter, createWebHistory } from 'vue-router';
import chartView from '@/pages/Chart.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/chart',
      name: 'chart',
      component: chartView,
    },
  ],
});

export default router;
