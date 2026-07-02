<script setup>
  const route = useRoute()
</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=arrow_forward" /> <!-- this is the '->' arrow import -->
  <LazyHeaderOperational v-if="route.path === '/operational'"/>
  <LazyHeader v-else/>
  <NuxtPage/>
  <Footer/>
</template>
