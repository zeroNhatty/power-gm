<script setup lang="ts">
import "ol/ol.css";
import Interaction from "ol/interaction/Interaction.js";

import { DrawMode } from "./DrawMode";

import { createCityMap } from "./map/createCityMap";

import { createNodeInteraction } from "./grid/nodeInteraction";
import {createConnectionInteraction } from "./grid/connectionInteraction";

const props = defineProps<{
  setup: boolean;
  mode: DrawMode;
}>();

let mapData: ReturnType<typeof createCityMap> | null = null;

let activeInteraction: Interaction | null = null;

function clearInteraction() {
  if ( mapData?.map && activeInteraction ) {
    mapData.map.removeInteraction( activeInteraction );
    activeInteraction = null;
  }
}

function activateMode( mode: DrawMode ) {
  if (!mapData) {
    return;
  }

  clearInteraction();

  if (!props.setup) {
    return;
  }

  if (mode === DrawMode.Node) {
    activeInteraction = createNodeInteraction(
        mapData.nodeSource,
        mapData.clipSource,
      );

    mapData.map.addInteraction( activeInteraction );

    console.log( "Node mode enabled" );
  }

  if (mode === DrawMode.Line) {
    activeInteraction = createConnectionInteraction(
        mapData.nodeLayer,
        mapData.connectionSource,
      );

    mapData.map.addInteraction( activeInteraction );

    console.log( "Connection mode enabled" );
  }

  if (mode === DrawMode.Default) {
    console.log( "Default mode" );
  }
}

onMounted(() => {
  mapData = createCityMap("map");

  // Activate whatever mode the
  // parent initially supplied.
  activateMode(props.mode);
});

watch(
  () => props.mode,
  (mode) => {
    activateMode(mode);
  },
);

watch(
  () => props.setup,
  (setup) => {
    if (!setup) {
      clearInteraction();
      return;
    }

    activateMode(props.mode);
  },
);

onUnmounted(() => {
  clearInteraction();

  if (mapData) {
    mapData.map.setTarget( undefined );

    mapData = null;
  }
});
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  margin: 1rem;
  border: 2px dashed;
  width: 50%;
  height: 800px;
  background: transparent;
}
</style>
