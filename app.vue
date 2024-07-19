<template>
  <div>
    <ClientOnly >
        <Panopage :key="index" :source="urls[index]" @goto-click="saythename"></Panopage> 
    </ClientOnly>
  </div> 
</template>

<script setup>

import { ref, onMounted } from "vue";
import { hotspotIcons } from "./composables/modules/hotspoticon";


const urls = ref([
        {
          src :  '/_nuxt/assets/image/testpanorama.jpg',
          infoSpot : [{
            data : 512,
            icon : hotspotIcons[0].data,
            showable : true,
            positionX : 2867.5,
            positionY : -318.56,
            positionZ : -4076.57,
            target : 1
          },
          {
            data : 512,
            icon : hotspotIcons[0].data,
            showable : true,
            positionX : 4509.38,
            positionY : -2094.06,
            positionZ :-486.08,
            target : 0
          }]
        },
        {
          src :'/_nuxt/assets/image/panorama3.jpg',
          infoSpot : []
        },
      ]);
const index = ref(0);

const hotspottest = [{
  data : 512,
  icon : hotspotIcons[0].data,
  showable : true,
  positionX : 2867.5,
  positionY : -318.56,
  positionZ : -4076.57,
  target : 1
},
{
  data : 512,
  icon : hotspotIcons[0].data,
  showable : true,
  positionX : 4509.38,
  positionY : -2094.06,
  positionZ :-486.08,
  target : 0
}
]


const saythename =(data)=>{
  console.log(data)
  index.value = data
  console.log("CHANGES")
}

</script>

