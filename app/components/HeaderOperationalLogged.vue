<script setup lang="ts">
 const userFirstName : string | undefined = useUserSession()['user'].value?.firstname
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <a class="btn btn-ghost text-xl">PGM - Operational</a>
    </div>
    <div class="navbar-center">
      <div role="tablist" class="tabs tabs-border">
        <a role="tab" class="tab">Tab 1</a>
        <a role="tab" class="tab">Tab 2</a>
        <a role="tab" class="tab">Tab 3</a>
      </div>
    </div>
    <div class="navbar-end">
      <div class="avatar avatar-placeholder">
        <div class="bg-neutral text-neutral-content w-10 rounded-full">
          <span v-if="userFirstName" class="text-2xl">
            {{userFirstName[0]}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>