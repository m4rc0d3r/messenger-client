import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import RegistrationView from "@/views/RegistrationView.vue";
import LoginView from "@/views/LoginView.vue";
import { useAuthStore } from "@/stores/auth-store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: (to, from, next) =>
        useAuthStore().isLoggedIn ? next() : next("/login"),
    },
    {
      path: "/register",
      name: "registration",
      component: RegistrationView,
      beforeEnter: (to, from, next) =>
        !useAuthStore().isLoggedIn ? next() : next("/"),
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter: (to, from, next) =>
        !useAuthStore().isLoggedIn ? next() : next("/"),
    },
  ],
});

export default router;
