import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import chartView from "@/pages/Chart.vue";
import Calendar from "@/pages/Calendar.vue";
import Login from "@/pages/Login.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/home",
      name: "home",
      component: Home,
    },
    {
      path: "/calendar",
      name: "calendar",
      component: Calendar,
    },
    {
      path: "/chart",
      name: "chart",
      component: chartView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("id");

  if (!isLoggedIn && to.path !== "/") {
    next("/");
  } else {
    next();
  }
});

export default router;
