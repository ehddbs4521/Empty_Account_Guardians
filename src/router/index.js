import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import chartView from '@/pages/Chart.vue';
import Calendar from "@/pages/Calendar.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
    {
      path: "/calendar",
      name: "calendar",
      component: Calendar,
    },
    {
      path: '/chart',
      name: 'chart',
      component: chartView,
    },
  ],
});

export default router;
