<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import Footer from '../components/Footer.vue';

interface TicketDTO {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  createdAt: string;
}

const router = useRouter();
const { logout } = useAuth();

const tickets = ref<TicketDTO[]>([]);
const isModalOpen = ref(false);
const editingTicket = ref<TicketDTO | null>(null);
const deleteConfirm = ref<string | null>(null);
const successMessage = ref('');

const formData = reactive({
  title: '',
  description: '',
  status: 'open' as 'open' | 'in-progress' | 'closed',
});

const errors = reactive<Record<string, string>>({});

onMounted(() => {
  loadTickets();
});

const loadTickets = () => {
  const ticketsStr = localStorage.getItem('ticketapp_tickets');
  tickets.value = ticketsStr ? JSON.parse(ticketsStr) : [];
};

const saveTickets = (updatedTickets: TicketDTO[]) => {
  localStorage.setItem('ticketapp_tickets', JSON.stringify(updatedTickets));
  tickets.value = updatedTickets;
};

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  if (!formData.title.trim()) {
    newErrors.title = 'Title is required';
  }

  if (!formData.status) {
    newErrors.status = 'Status is required';
  }

  if (!['open', 'in-progress', 'closed'].includes(formData.status)) {
    newErrors.status = 'Status must be open, in-progress, or closed';
  }

  if (formData.description && formData.description.length > 500) {
    newErrors.description = 'Description must be less than 500 characters';
  }

  Object.assign(errors, newErrors);
  return Object.keys(newErrors).length === 0;
};

const clearError = (field: string) => {
  errors[field] = '';
};

const handleSubmit = () => {
  if (!validateForm()) return;

  if (editingTicket.value) {
    const updatedTickets = tickets.value.map((ticket) =>
      ticket.id === editingTicket.value!.id
        ? { ...ticket, ...formData }
        : ticket
    );
    saveTickets(updatedTickets);
    showSuccess('Ticket updated successfully!');
  } else {
    const newTicket: TicketDTO = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    saveTickets([...tickets.value, newTicket]);
    showSuccess('Ticket created successfully!');
  }

  closeModal();
};

const handleEdit = (ticket: TicketDTO) => {
  editingTicket.value = ticket;
  Object.assign(formData, {
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
  });
  isModalOpen.value = true;
};

const handleDelete = (id: string) => {
  const updatedTickets = tickets.value.filter((ticket) => ticket.id !== id);
  saveTickets(updatedTickets);
  deleteConfirm.value = null;
  showSuccess('Ticket deleted successfully!');
};

const openCreateModal = () => {
  editingTicket.value = null;
  Object.assign(formData, {
    title: '',
    description: '',
    status: 'open',
  });
  Object.keys(errors).forEach((key) => (errors[key] = ''));
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingTicket.value = null;
  Object.assign(formData, {
    title: '',
    description: '',
    status: 'open',
  });
  Object.keys(errors).forEach((key) => (errors[key] = ''));
};

const showSuccess = (message: string) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
};

const handleLogout = () => {
  logout();
  router.push('/');
};

const getStatusColor = (status: string) => {
  const colors = {
    open: 'bg-green-100 text-green-800 border-green-200',
    'in-progress': 'bg-amber-100 text-amber-800 border-amber-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};
</script>

<template>
  <section class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <section class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <section class="flex justify-between items-center">
          <section class="flex items-center gap-6">
            <h1 class="text-2xl font-bold text-gray-900">TicketApp</h1>
            <nav class="flex flex-col md:flex md:-row gap-4">
              <router-link
                to="/dashboard"
                class="text-gray-600 hover:text-gray-900 transition"
              >
                Dashboard
              </router-link>
              <router-link to="/tickets" class="text-indigo-600 font-semibold">
                Tickets
              </router-link>
            </nav>
          </section>
          <button
            @click="handleLogout"
            class="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </section>
      </section>
    </header>

    <section
      v-if="successMessage"
      class="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in"
    >
      {{ successMessage }}
    </section>

    <main class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <section>
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Ticket Management
          </h2>
          <p class="text-gray-600">
            Create, view, edit, and manage all your tickets
          </p>
        </section>
        <button
          @click="openCreateModal"
          class="mt-4 md:mt-0 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg flex items-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Ticket
        </button>
      </section>

      <section
        v-if="tickets.length === 0"
        class="bg-white rounded-lg shadow-lg p-12 text-center"
      >
        <svg
          class="w-16 h-16 text-gray-400 mx-auto mb-4"
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
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No tickets yet</h3>
        <p class="text-gray-600 mb-6">
          Get started by creating your first ticket
        </p>
        <button
          @click="openCreateModal"
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Create Ticket
        </button>
      </section>

      <!-- Tickets Grid -->
      <section
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <section
          v-for="ticket in tickets"
          :key="ticket.id"
          class="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6"
        >
          <section class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-gray-900 flex-1 mr-2">
              {{ ticket.title }}
            </h3>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium border',
                getStatusColor(ticket.status),
              ]"
            >
              {{ ticket.status.replace('_', ' ') }}
            </span>
          </section>

          <p
            v-if="ticket.description"
            class="text-gray-600 text-sm mb-4 line-clamp-3"
          >
            {{ ticket.description }}
          </p>

          <section
            class="flex items-center justify-between text-sm text-gray-500 mb-4"
          >
            <span>{{ formatDate(ticket.createdAt) }}</span>
          </section>

          <section class="flex gap-2 pt-4 border-t border-gray-100">
            <button
              @click="handleEdit(ticket)"
              class="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition"
            >
              Edit
            </button>
            <button
              @click="deleteConfirm = ticket.id"
              class="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
            >
              Delete
            </button>
          </section>

          <section
            v-if="deleteConfirm === ticket.id"
            class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p class="text-sm text-red-800 mb-3">
              Are you sure you want to delete this ticket?
            </p>
            <section class="flex gap-2">
              <button
                @click="handleDelete(ticket.id)"
                class="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                @click="deleteConfirm = null"
                class="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded text-sm font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </section>
          </section>
        </section>
      </section>
    </main>

    <section
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <section
        class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <section class="p-8">
          <section class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ editingTicket ? 'Edit Ticket' : 'Create New Ticket' }}
            </h2>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </section>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <section>
              <label
                for="title"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Title <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                v-model="formData.title"
                @input="clearError('title')"
                :class="[
                  'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition',
                  errors.title ? 'border-red-500' : 'border-gray-300',
                ]"
                placeholder="Enter ticket title"
              />
              <p v-if="errors.title" class="mt-1 text-sm text-red-600">
                {{ errors.title }}
              </p>
            </section>

            <section>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                v-model="formData.description"
                @input="clearError('description')"
                :class="[
                  'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition',
                  errors.description ? 'border-red-500' : 'border-gray-300',
                ]"
                placeholder="Enter ticket description (optional)"
              />
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">
                {{ errors.description }}
              </p>
            </section>

            <section>
              <label
                for="status"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Status <span class="text-red-500">*</span>
              </label>
              <select
                id="status"
                v-model="formData.status"
                @change="clearError('status')"
                :class="[
                  'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition',
                  errors.status ? 'border-red-500' : 'border-gray-300',
                ]"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <p v-if="errors.status" class="mt-1 text-sm text-red-600">
                {{ errors.status }}
              </p>
            </section>

            <section class="flex gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                {{ editingTicket ? 'Update Ticket' : 'Create Ticket' }}
              </button>
            </section>
          </form>
        </section>
      </section>
    </section>

    <Footer />
  </section>
</template>
