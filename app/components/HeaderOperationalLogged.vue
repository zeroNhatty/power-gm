<script setup lang="ts">
 const userFirstName : string | undefined = useUserSession()['user'].value?.firstname
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <p class="text-xl">PGM - Operational</p>
    </div>
    <div class="navbar-center">
      <div role="tablist" class="tabs tabs-border">
        <NuxtLink to="dashboard" role="tab" class="tab">Status</NuxtLink>
        <NuxtLink to="tickets" role="tab" class="tab">Tickets</NuxtLink>
        <NuxtLink to="management" role="tab" class="tab">User Management</NuxtLink>
        <NuxtLink to="" role="tab" class="tab"></NuxtLink>
      </div>
    </div>
    <div class="navbar-end">
      <div class="avatar avatar-placeholder">
        <div class="bg-neutral text-neutral-content w-10 rounded-full">
          <NuxtLink to="profile">
             <span v-if="userFirstName" class="text-2xl">
              {{userFirstName[0]}}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>