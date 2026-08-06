<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const mapContainer = ref<HTMLElement | null>(null)
let map: any = null

onMounted(async () => {
  if (!mapContainer.value) return

  const maplibregl = await import('maplibre-gl')

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://tiles.openfreemap.org/styles/fiord',
    center: [38.76, 8.94],
    zoom: 11
  })
})

onUnmounted(() => {
  if (map) map.remove()
})
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<style scoped>
.map-wrapper, .map-container {
  width: 100%;
  height: 100vh;
}
</style>
