<template>
  <div class="v-pano" ref="containerV"></div>
</template>

<script setup>
import { hotspotIcons } from "~/composables/modules/hotspoticon";
import * as PanoLens from "./assets/lib/panolens";

const props = defineProps({
  source: {
    type: String,
    required: true,
    default: "",
  },
  hotspots: {
    type: Array,
    required: false,
    default: [],
  },
  type: {
    type: String,
    default: "image",
  },
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 100,
  },
});

const size = ref({
  width: props.width ?? 100,
  height: props.height ?? 100,
});

const viewer = ref(null);
const panorama = ref(null);
const source = ref(null);
const type = ref(props.type ?? "image");
const containerV = ref(null);


const emit = defineEmits(['gotoClick'])

watch(
  () => props.source.src,
  (newValue, oldValue) => {
    //loadPano(newValue);
    console.log(newValue);
    loadPano();
  }
);
onMounted(() => {
    source.value = props.source.src ?? "" 
  window.addEventListener("resize", onResize, false);
  if (size.value.width === undefined || size.value.height === undefined) {
    size.value = {
      width: containerV.value.offsetWidth,
      height: containerV.value.offsetHeight,
    };
  }
  viewer.value = new PanoLens.Viewer({
    container: containerV.value,
    cameraFov: 100,
    controlBar: true,
    autoHideInfospot: false,
    output: "console",
  });

  //viewer.value.add()

  loadPano();
});

const onResize = () => {
  if (size.value.width === undefined || size.value.height === undefined) {
    nextTick(() => {
      if (container_test.value) {
        size.value = {
          width: container_test.value.offsetWidth,
          height: container_test.value.offsetHeight,
        };
        // You might want to update the viewer size here as well
        viewer.value.onWindowResize();
      }
    });
  }
};
const setPano = (pano) => {
  if (!pano) return;

  if (panorama.value) {
    viewer.value = null;
  }

  panorama.value = pano;

  if (props.source.infoSpot && props.source.infoSpot.length > 0) {
    props.source.infoSpot.forEach((data) => {
      let hotspotTarget = new PanoLens.Infospot(
        data.data,
        data.icon,
        data.showable
      );
      hotspotTarget.position.set(
        data.positionX,
        data.positionY,
        data.positionZ
      );
      console.log("Hotspot created:", hotspotTarget);
      panorama.value.add(hotspotTarget);
      console.log("Hotspot added to viewer:", viewer.value);
      hotspotTarget.addEventListener("click", () => {
        emit('gotoClick', data.target)
      });
    });
  }
  viewer.value.add(panorama.value);
  viewer.value.setPanorama(panorama.value);

  // Use arrow function to retain context
  // panorama.value.addEventListener('load', () => {
  //     emit('on-load')
  // })
};
const loadPano = () => {
  if (!source.value) return;
  let pano;
  switch (type.value) {
    case "cube":
      const l = props.source.src.replace("%s", "l");
      const f = props.source.src.replace("%s", "f");
      const r = props.source.src.replace("%s", "r");
      const b = props.source.src.replace("%s", "b");
      const u = props.source.src.replace("%s", "u");
      const d = props.source.src.replace("%s", "d");
      pano = new PanoLens.CubePanorama([r, l, u, d, f, b]);
      break;
    case "video":
      pano = new PanoLens.VideoPanorama(props.source.src, {
        autoplay: true,
      });
      break;
    default:
      pano = new PanoLens.ImagePanorama(props.source.src);
      break;
  }
  setPano(pano);
};
onUnmounted(() => {
  window.removeEventListener("resize", onResize, false);
  if (panorama.value && panorama.value.dispose) {
    panorama.value.dispose();
  }
});


</script>

<style scoped>
    .v-pano{
        width: 100%;
        height: 100dvh;
    }
</style>
