import MainLayout from "@/layouts/MainLayout.vue";
import { useAuthStore } from "@/stores/auth-store";
import AboutView from "@/views/AboutView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import RegistrationView from "@/views/RegistrationView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "/",
          name: "home",
          component: HomeView,
          beforeEnter: (to, from, next) =>
            useAuthStore().isLoggedIn ? next() : next("/login"),
        },
        {
          path: "/about",
          name: "about",
          component: AboutView,
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
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
    },
  ],
});

export default router;
