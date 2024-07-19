// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app:{
    head :{
      script : [
        // {
        //   src : '/_nuxt/assets/lib/imagedata.js',
        //   tagPosition : 'head',
        //   async : true
        // },
        // {
        //   src : '/_nuxt/assets/lib/three.min.js',
        //   tagPosition : 'head',
        // },
        // {
        //   src : '/_nuxt/assets/lib/panolens.min.js',
        //   tagPosition : 'head',
        //   async : true
        // },
        {
          src : '/_nuxt/assets/lib/panolens.js',
          type : 'module',
          tagPosition : 'head',
          async : true
        },
      ]
    }
  },
  css: [
    '~/assets/css/main.css',
  ],
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  // app:{
  //   head :{
  //     script : [
  //       // '~/assets/lib/imagedata.js',
  //       '~/assets/lib/imagedata.js'
  //       // '@/assets/lib/panolens.min.js',
  //       // '@/assets/lib/three.min.js',

  //     ]
  //   }
  // }
})
