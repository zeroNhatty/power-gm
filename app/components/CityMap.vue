<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

import Map from "ol/Map.js";
import View from "ol/View.js";
import GeoJSON from "ol/format/GeoJSON.js";

import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";

import OSM from "ol/source/OSM.js";
import VectorSource from "ol/source/Vector.js";

import Fill from "ol/style/Fill.js";
import Style from "ol/style/Style.js";

import { fromLonLat } from "ol/proj.js";
import { getVectorContext } from "ol/render.js";

import { defaults as defaultInteractions } from 'ol/interaction';

let map: Map | null = null;

onMounted(() => {
  const base = new TileLayer({
    source: new OSM(),
  });

  const clipLayer = new VectorLayer({
    style: null,

    source: new VectorSource({
      url: "/addis-ababa.geojson",
      format: new GeoJSON(),
    }),
  });

  const clipSource = clipLayer.getSource()!;

  //restriction to the geojson extent
  clipSource.on("addfeature", () => {
    base.setExtent(clipSource.getExtent());

    console.log("ADDIS LOADED");
    console.log("Addis extent:", clipSource.getExtent());
  });

  const clipStyle = new Style({
    fill: new Fill({
      color: "black",
    }),
  });

 //cliping 
  base.on("postrender", (event) => {
    const vectorContext = getVectorContext(event);

    const context = event.context as CanvasRenderingContext2D;

    context.globalCompositeOperation = "destination-in";

    clipSource.forEachFeature((feature) => {
      vectorContext.drawFeature(feature, clipStyle);
    });

    context.globalCompositeOperation = "source-over";
  });

  map = new Map({
    target: "map",

    layers: [
      base,
      clipLayer,
    ],
    interactions: defaultInteractions(
      {
        dragPan: false,
      }
    ),
    view: new View({
      center: fromLonLat([38.825, 8.9571]),
      zoom: 11.7,
      minZoom: 11.7,

    }),
  });
});

onUnmounted(() => {
  if (map) {
    map.setTarget(undefined);
    map = null;
  }
});
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
    margin: 1rem;
    border: 2px;
    border-style:dashed;
    width: 50%;
    height: 800px;
    background: transparent;
}
</style>
