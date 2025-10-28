<script setup lang="ts">
defineProps<{
  className?: string;
}>();
</script>

<template>
  <section
    class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8"
    :class="className"
  >
    <slot />
  </section>
</template>
