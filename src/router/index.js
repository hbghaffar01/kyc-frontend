import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/auth",
    component: () => import("@/components/layout/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/auth/LoginView.vue"),
        meta: { requiresGuest: true },
      },
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/auth/RegisterView.vue"),
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/components/layout/AppLayout.vue"),
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/admin/DashboardView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "users",
        name: "Users",
        component: () => import("@/views/admin/UsersView.vue"),
      },
      {
        path: "kyc/status",
        name: "KYCStatus",
        component: () => import("@/views/kyc/StatusView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        name: "UserProfile",
        component: () => import("@/views/Profile.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.userRole;

  if (to.meta.requiresGuest && isAuthenticated) {
    return next("/dashboard");
  }
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next("/auth/login");
  }
  if (to.meta.requiresAdmin && userRole !== "admin") {
    return next("/kyc/status");
  }
  next();
});


export default router;
