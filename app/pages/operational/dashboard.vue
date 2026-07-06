<script setup lang="ts">
definePageMeta({
  layout: 'operational',
  middleware: ['sanctum:auth'],
});

const user = useSanctumUser();

</script>

<template>
Holla

  <LazyBody>{{user}}</LazyBody>
</template>

<style scoped>

</style>