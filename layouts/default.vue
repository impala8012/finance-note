<template>
  <div class="container mx-auto max-w-4xl">
    <AppHeader />
    <main class="my-10">
      <!-- 放置 content pages -->
      <slot />
    </main>
  </div>
</template>

<script setup>
/**
 * Google 字型連結
 */
useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
      crossorigin: ''
    }
  ]
})
</script>

<style>
/* 主畫面字體 */
body {
  font-family: 'Inter';
}
/* 主畫面背景色 */
body {
  @apply dark:bg-gray-900 bg-white;
}
</style>