<script setup lang="ts">
definePageMeta({
  layout: 'operational-logged-in',
  middleware: ['sanctum:auth'],
});
</script>
<template>
    hi usera
</template>