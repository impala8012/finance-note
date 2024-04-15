// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    // UI 畫面
    '@nuxt/ui',
    // 語系 
    '@nuxtjs/i18n',
    // 後端資料庫
    '@nuxtjs/supabase'
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
  supabase: {
    redirect: true
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL ?? 'http://localhost:3000'
    }
  }
})
