<template>
  <div class="grid grid-cols-6 gap-8">
    <UVerticalNavigation :links="links" class="col-span-2" />
    <div class="col-span-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
// 引用語系
const { t } = useI18n()
// 連結
const links = [
  {
    label: t('profile'),
    to: '/settings/profile'
  },
  {
    label: t('avatar'),
    to: '/settings/avatar'
  },
  {
    label: t('settings'),
    to: '/settings/settings'
  }
]
</script>