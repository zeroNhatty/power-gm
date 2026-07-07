<script setup lang="ts">
definePageMeta({
  layout: 'operational-logged-in',
  middleware: ['sanctum:auth'],
});
</script>

<template>
  works ig
<NuxtLink href="profile">Profile</NuxtLink>
</template>

<style scoped>

</style>