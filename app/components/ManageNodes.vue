<script setup lang="ts">
import { DrawMode } from "~/components/DrawMode";

const current_mode = ref(DrawMode.Default);
</script>

<template>
  <p>Draw initial node Designs</p>

  <CityMap
    :setup="true"
    :mode="current_mode"
  />

  <p class="font-light text-amber-900">
    * This will be extended to live edit as project progresses
  </p>

  <fieldset class="fieldset">
    <legend class="fieldset-legend">Draw Mode</legend>

    <select v-model="current_mode" class="select">
      <option selected disabled :value="DrawMode.Default">Default</option>
      <option :value="DrawMode.Node">Draw Node</option>
      <option :value="DrawMode.Line">Draw Connection</option>
    </select>
  </fieldset>

  <button class="btn btn-neutral">
    Register Nodes
  </button>
</template>
