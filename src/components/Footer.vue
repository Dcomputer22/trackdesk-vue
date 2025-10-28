<script setup lang="ts">
import Container from './Container.vue';
</script>

<template>
  <footer class="bg-green-900 text-gray-300 py-12 mt-auto">
    <Container>
      <section class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section>
          <h3 class="text-white text-xl font-bold mb-4">TrackDesk</h3>
          <p class="text-sm">Ticket management made easy!</p>
        </section>

        <section>
          <h4 class="text-white font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="hover:text-white transition"> Home </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition"> Dashboard </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition"> Tickets </a>
            </li>
          </ul>
        </section>

        <section>
          <h4 class="text-white font-semibold mb-4">Contact</h4>
          <p class="text-sm">support@fdigitals.com</p>
        </section>
      </section>

      <section class="border-t border-white mt-8 pt-8 text-center text-sm">
        <p>&copy; 2025 Fatima Oyiza Jimoh. HNG Stage-2 Project.</p>
      </section>
    </Container>
  </footer>
</template>
