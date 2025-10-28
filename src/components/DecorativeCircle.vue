<script setup lang="ts">
defineProps<{
  size?: string;
  position: string;
  color?: string;
}>();
</script>

<template>
  <div
    :class="`${size} ${color} rounded-full absolute opacity-20 blur-3xl ${position}`"
  />
</template>
