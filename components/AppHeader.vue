<template>
  <header class="flex justify-between items-center mt-10">
    <NuxtLink to="/" class="text-xl font-bold">
      {{ $t('welcome') }} - {{ $t('finance_title') }}
    </NuxtLink>
    <div>
      <UDropdown
        :items="dropdownItems"
        :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
        v-if="user"
      >
        <UAvatar :src="url" alt="Avatar" />

        <template #account="{ item }">
          <div class="text-left">
            <p>{{ $t('sign_in_as') }}</p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ item.label }}
            </p>
          </div>
        </template>

        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>

          <UIcon
            :name="item.icon"
            class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
          />
        </template>
      </UDropdown>
    </div>
  </header>
</template>

<script setup>
// 引用 supabase
const supabase = useSupabaseClient()
// 引用 supabase 使用這資訊
const user = useSupabaseUser()
// 大頭貼網址
const { url } = useAvatarUrl()
// 引用語系
const { t } = useI18n()

// 下拉選單選項
const dropdownItems = [
  [
    {
      label: user.value?.email,
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: t('settings'),
      icon: 'i-heroicons-cog-8-tooth',
      click: () => navigateTo('/settings/profile')
    },
    {
      label: t('sign_out'),
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: async () => {
        await supabase.auth.signOut()
        return navigateTo('/login')
      }
    }
  ]
]
</script>
