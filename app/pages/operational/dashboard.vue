<script setup lang="ts">
definePageMeta({
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