<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { signup } = useAuth();

const ticketForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const errors = reactive<Record<string, string>>({});
const isLoading = ref(false);

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  if (!ticketForm.name.trim()) {
    newErrors.name = 'Name is required';
  }

  if (!ticketForm.email) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(ticketForm.email)) {
    newErrors.email = 'Email is invalid';
  }

  if (!ticketForm.password) {
    newErrors.password = 'Password is required';
  } else if (ticketForm.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }

  if (!ticketForm.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password';
  } else if (ticketForm.password !== ticketForm.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  Object.assign(errors, newErrors);
  return Object.keys(newErrors).length === 0;
};

const clearError = (field: string) => {
  errors[field] = '';
};

const handleSubmitForm = () => {
  if (!validateForm()) return;

  isLoading.value = true;

  setTimeout(() => {
    const result = signup(
      ticketForm.name,
      ticketForm.email,
      ticketForm.password
    );

    if (result.success) {
      router.push('/dashboard');
    } else {
      errors.general = result.error || 'Signup failed';
    }

    isLoading.value = false;
  }, 500);
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-12"
  >
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p class="text-gray-600">Join TicketApp today</p>
        </div>

        <div
          v-if="errors.general"
          class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </div>

        <form @submit.prevent="handleSubmitForm" class="space-y-5">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              v-model="ticketForm.name"
              @input="clearError('name')"
              :class="[
                'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none transition',
                errors.name ? 'border-red-500' : 'border-gray-300',
              ]"
              placeholder="John Doe"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              v-model="ticketForm.email"
              @input="clearError('email')"
              :class="[
                'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none transition',
                errors.email ? 'border-red-500' : 'border-gray-300',
              ]"
              placeholder="you@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              v-model="ticketForm.password"
              @input="clearError('password')"
              :class="[
                'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none transition',
                errors.password ? 'border-red-500' : 'border-gray-300',
              ]"
              placeholder="••••••••"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              v-model="ticketForm.confirmPassword"
              @input="clearError('confirmPassword')"
              :class="[
                'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none transition',
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300',
              ]"
              placeholder="••••••••"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition disabled:opacity-50"
          >
            {{ isLoading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <router-link
            to="/auth/login"
            class="text-purple-600 font-semibold hover:text-purple-700"
          >
            Sign in
          </router-link>
        </p>
      </div>

      <div class="text-center mt-6">
        <router-link
          to="/"
          class="text-white hover:text-purple-100 transition text-sm"
        >
          ← Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>
