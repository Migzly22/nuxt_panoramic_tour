<template>
  <div class="v-pano" ref="containerV" @click="onContainerClick"></div>
</template>

<script setup>
import { hotspotIcons } from "~/composables/modules/hotspoticon";
import * as PanoLens from "./assets/lib/panolens";
import * as THREE from 'three';

const props = defineProps({
  source: {
    type: String,
    required: true,
    default: "",
  },
  urls: {
    type: JSON,
    required: true,
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

const viewer = shallowRef(null);
const panorama = shallowRef(null);
const source = ref(null);
const type = ref(props.type ?? "image");
const containerV = ref(null);
const userPointsInterface = ref(props.urls.urls ?? []);
const currentId = ref(props.urls.index ?? 0);


const emit = defineEmits(['gotoClick', 'update_datas'])

watch(
  () => props.source.src,
  (newValue, oldValue) => {
    //loadPano(newValue);
    console.log(newValue);
    loadPano();
  }
);


watch(
  userPointsInterface, (newValue, oldValue) => {
    //loadPano(newValue);
    emit('update-urls', newValue);
    props.source = userPointsInterface.value[currentId.value]
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
  // containerV.value.addEventListener("click", onContainerClick, false);
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

  // if (panorama.value) {
  //   viewer.value = null;
  // }

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
      panorama.value.add(hotspotTarget);
      hotspotTarget.addEventListener("click", () => {
        emit('gotoClick', data.target)
      });
    });
  }
  console.log()
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

const onContainerClick = async (event) => { // MouseEvent
  if(!event.shiftKey){ return 0;}

  if (!viewer.value || !panorama.value) {
    return;
  }

  const mouse = new THREE.Vector2();
  mouse.x = ((viewer.value.userMouse.x ) / window.innerWidth) * 2 ;
  mouse.y = - ((viewer.value.userMouse.y )/ window.innerHeight) * 2 ;

  const intersects = viewer.value.raycaster.intersectObjects([panorama.value], true);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    const worldVector = intersect.point;
    
    console.log(`World Coordinates: x=${worldVector.x * -1}, y=${worldVector.y}, z=${worldVector.z}`, userPointsInterface.value[currentId.value], props.urls);
    const imgsrc = prompt("Image URL ");
    const target = userPointsInterface.value.findIndex((image) => image.src === imgsrc);

    userPointsInterface.value[currentId.value].infoSpot.push(
      {
            data : 512,
            icon : hotspotIcons[0].data,
            showable : true,
            positionX : worldVector.x * -1,
            positionY : worldVector.y,
            positionZ : worldVector.z,
            target : target !== -1 ? target :  userPointsInterface.value.length
      }
    );
    if(target === -1){
      userPointsInterface.value.push({
        src : imgsrc,
        infoSpot : []
      })
    }
    loadPano();
    // props.source = userPointsInterface.value[currentId.value]
    // console.log(props.source);
    // loadPano();
    // const { value: imagelink } = await Swal.fire({
    //   input : 'text',
    //   inputLabel: "Source Link",
    // });
    // if (imagelink) {
    //   userPointsInterface.value.push(
    //     { 
    //       src : imagelink,
    //       x : worldVector.x * -1,
    //       y : worldVector.y,
    //       z : worldVector.z,
    //       icon : hotspotIcons[0].data,
    //       data : 512,
    //       icon : hotspotIcons[0].data,
    //       showable : true,
    //       target : 1
    //     }
    //   );
    // }
    // console.log(userPointsInterface.value);
  }
};



</script>

<style scoped>
    .v-pano{
        width: 100%;
        height: 100%;
    }
</style>
