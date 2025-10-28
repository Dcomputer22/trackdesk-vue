import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/LandingPage.vue';
import Login from '../views/auth/Login.vue';
import Signup from '../views/auth/Signup.vue';
import Dashboard from '../views/Dashboard.vue';
import TicketManagement from '../views/TicketManagement.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
    },
    {
      path: '/auth/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/auth/signup',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: TicketManagement,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

// Navigation guard

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('ticketapp_session');

  if (to.meta.requiresAuth && !token) {
    next('/auth/login');
  } else {
    next();
  }
});

export default router;
