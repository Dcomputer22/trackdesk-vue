<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { login } = useAuth();

const ticketForm = reactive({
  email: '',
  password: '',
});

const errors = reactive<Record<string, string>>({});
const isLoading = ref(false);

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  if (!ticketForm.email) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(ticketForm.email)) {
    newErrors.email = 'Email is invalid';
  }
  if (!ticketForm.password) {
    newErrors.password = 'Password is required';
  }

  Object.assign(errors, newErrors);
  return Object.keys(newErrors).length === 0;
};

const clearError = (field: string) => {
  errors[field] = '';
  errors.general = '';
};

const handleSubmitForm = () => {
  if (!validateForm()) return;

  isLoading.value = true;

  setTimeout(() => {
    const result = login(ticketForm.email, ticketForm.password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      errors.general = result.error || 'Login failed';
    }

    isLoading.value = false;
  }, 500);
};
</script>

<template>
  <section
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 px-4"
  >
    <section class="max-w-md w-full">
      <section class="bg-white rounded-2xl shadow-2xl p-8">
        <section class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p class="text-gray-600">Sign in to your account</p>
        </section>

        <section
          v-if="errors.general"
          class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </section>

        <form @submit="handleSubmitForm" class="space-y-6">
          <section>
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
                `w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition`,
              ]"
              placeholder="jane@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </section>

          <section>
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
                `w-full px-4 py-3 rounded-lg focus:ring-2 border focus:outline-none transition`,
              ]"
              placeholder="********"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </section>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <router-link
            to="/auth/signup"
            class="text-purple-600 font-semibold hover:text-purple-700"
          >
            Sign up
          </router-link>
        </p>

        <section class="mt-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-xs text-gray-600 text-center font-medium mb-2">
            Test Credentials:
          </p>
          <p class="text-xs text-gray-500 text-center">
            Email: test@example.com
            <br />
            Password: password123
          </p>
        </section>
      </section>

      <section class="text-center mt-6">
        <router-link
          to="/"
          class="text-white hover:text-purple-100 transition text-sm"
        >
          Back to Home
        </router-link>
      </section>
    </section>
  </section>
</template>
