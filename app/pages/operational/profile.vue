<script setup lang="ts">
  definePageMeta({
    layout: 'operational-logged-in',
    middleware: ['sanctum:auth'],
  });

  const user = useUserSession()['user']
</script>

<template>
  <div class="hero w-full">
    <div class="card w-96 bg-base-100 card-md shadow-sm">
      <div class="card-body">
        <h2 class="card-title">{{user?.firstname}}</h2>
        <p>{{user?.middle_name}}</p>
        <p>{{user?.lastname}}</p>
        <p>{{user?.date_of_birth}}</p>
        <p>{{user?.gender}}</p>
        <p>{{user?.role}}</p>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>