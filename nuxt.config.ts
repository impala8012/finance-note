// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui', 
    '@nuxtjs/i18n',
  ],
  i18n: {
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.js'
      },
      {
        code: 'zh-tw',
        iso: 'zh-TW',
        file: 'zh-tw.js'
      }
    ],
    defaultLocale: 'zh-tw'
  },
})
