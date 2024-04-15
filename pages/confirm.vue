<template>
  <UCard>
    <template #header> {{ $t('sing_in_status') }} </template>

    {{ $t('sing_in_status_msg') }}
  </UCard>
</template>

<script setup>
// 引用使用者登入轉址 hook
useAuthenticatedRedirect()
</script>