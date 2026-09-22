<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import "ol/ol.css";

import Map from "ol/Map.js";
import View from "ol/View.js";
import GeoJSON from "ol/format/GeoJSON.js";

import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";

import OSM from "ol/source/OSM.js";
import VectorSource from "ol/source/Vector.js";

import Fill from "ol/style/Fill.js";
import Style from "ol/style/Style.js";

import { fromLonLat, toLonLat } from "ol/proj.js";
import { getVectorContext } from "ol/render.js";

import { defaults as defaultInteractions } from "ol/interaction/defaults.js";
import Draw from "ol/interaction/Draw"
import Point from "ol/geom/Point"
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle"
import { DrawMode } from "./DrawMode";

let map: Map | null = null;

const props = defineProps<{
  setup: Boolean,
  mode: DrawMode,
}>()

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

  // wait for the geojson to load
  clipSource.on("addfeature", () => {
    const extent = clipSource.getExtent();

    if (extent != null) {
      base.setExtent(extent);

      console.log("ADDIS LOADED");
      console.log("Addis extent:", extent);
    }
  });

  const clipStyle = new Style({
    fill: new Fill({
      color: "black",
    }),
  });

  // Clip the OSM layer to the Addis polygon
  base.on("postrender", (event) => {
    const vectorContext = getVectorContext(event);


    const context = event.context as CanvasRenderingContext2D;

    context.globalCompositeOperation = "destination-in";

    clipSource.forEachFeature((feature) => {
      vectorContext.drawFeature(feature, clipStyle);
    });

    context.globalCompositeOperation = "source-over";
  });

  const nodeSource = new VectorSource();

  const nodeLayer = new VectorLayer({
    source: nodeSource,

    style: new Style({
      image: new CircleStyle({
        radius: 8,

        fill: new Fill({
          color: "#ef4444",
        }),

        stroke: new Stroke({
          color: "#ffffff",
          width: 3,
        }),
      }),
    }),
  });

  map = new Map({
    target: "map",

    layers: [
      base,
      clipLayer,
      nodeLayer,
    ],

    interactions: defaultInteractions({
      dragPan: false,
    }),

    view: new View({
      center: fromLonLat([38.78, 8.9571]),
      zoom: 11.7,
      minZoom: 11.7,
    }),
  });


  if (props.setup) {
    if (props.mode == DrawMode.Node) {
      console.log("draw node")
      const drawNode = new Draw({
        source: nodeSource,
        type: "Point",

        condition: (event) => {
          let insideAddis = false;

          clipSource.forEachFeature((feature) => {
            const geometry = feature.getGeometry();

            if (geometry?.intersectsCoordinate(event.coordinate)) {
              insideAddis = true;
            }
          });

          return insideAddis;
        },
      });

      map.addInteraction(drawNode);

      drawNode.on("drawend", (event) => {
        const feature = event.feature;

        const coordinate =
          (feature.getGeometry() as Point).getCoordinates();

        const [longitude, latitude] = toLonLat(coordinate);

        feature.set("type", "substation");
        feature.set("longitude", longitude);
        feature.set("latitude", latitude);

        console.log("Node created:", {
          longitude,
          latitude,
        });
      });


    }

    if (props.mode == DrawMode.Line) {
      console.log("Draw Line")
    }
  }
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
  border: 2px dashed;
  width: 50%;
  height: 800px;
  background: transparent;
}
</style>
