<script setup lang="ts">
definePageMeta({
  layout: 'operational-logged-in',
  middleware: ['sanctum:auth'],
});

const client = useSanctumClient()
const { data, error, pending } = await useAsyncData('nodes', () =>
    client('/api/nodes'));
</script>

<template>
<NuxtLink href="profile">Profile</NuxtLink>

  <div>
    <div v-if="pending">Loading nodes...</div>
    <div v-else-if="error">Error loading data: {{ error.message }}</div>
    <ul v-else>
      <li v-for="node in data" >{{ node }}</li>
    </ul>
  </div>
</template>

<style scoped>

</style>