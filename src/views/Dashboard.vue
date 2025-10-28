<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import Footer from '../components/Footer.vue';

const router = useRouter();
const { logout, getCurrentUser } = useAuth();

const user = ref(getCurrentUser());
const stats = ref({
  total: 0,
  open: 0,
  inProgress: 0,
  closed: 0,
});

onMounted(() => {
  loadStats();
});

const loadStats = () => {
  const ticketsStr = localStorage.getItem('ticketapp_tickets');
  const tickets = ticketsStr ? JSON.parse(ticketsStr) : [];

  stats.value = {
    total: tickets.length,
    open: tickets.filter((t: any) => t.status === 'open').length,
    inProgress: tickets.filter((t: any) => t.status === 'in_progress').length,
    closed: tickets.filter((t: any) => t.status === 'closed').length,
  };
};

const handleLogout = () => {
  logout();
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">TicketApp</h1>
            <p class="text-sm text-gray-600">Welcome back, {{ user?.name }}</p>
          </div>
          <button
            @click="handleLogout"
            class="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Dashboard
        </h2>
        <p class="text-gray-600">Overview of your ticket management system</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div
          class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-500"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase">
                Total Tickets
              </p>
              <p class="text-3xl font-bold text-gray-900 mt-2">
                {{ stats.total }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase">
                Open Tickets
              </p>
              <p class="text-3xl font-bold text-gray-900 mt-2">
                {{ stats.open }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-amber-500"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase">
                In Progress
              </p>
              <p class="text-3xl font-bold text-gray-900 mt-2">
                {{ stats.inProgress }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-gray-500"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase">
                Closed Tickets
              </p>
              <p class="text-3xl font-bold text-gray-900 mt-2">
                {{ stats.closed }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-12"
      >
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="mb-6 md:mb-0">
            <h3 class="text-2xl font-bold mb-2">Manage Your Tickets</h3>
            <p class="text-indigo-100">
              Create, view, edit, and organize all your tickets in one place
            </p>
          </div>
          <router-link
            to="/tickets"
            class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition shadow-lg"
          >
            Go to Tickets
          </router-link>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
