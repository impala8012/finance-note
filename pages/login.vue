<template>
  <UCard v-if="!success">
    <template #header> {{ $t('sign_in_msg') }} </template>

    <form @submit.prevent="handleLogin">
      <UFormGroup
        label="Email"
        name="email"
        class="mb-4"
        :required="true"
        :help="$t('email_link_msg')"
      >
        <UInput type="email" placeholder="Email" required v-model="email" />
      </UFormGroup>

      <UButton
        type="submit"
        variant="solid"
        color="black"
        :loading="isLoading"
        :disabled="isLoading"
      >
        {{ $t('sign_in') }}
      </UButton>
    </form>
  </UCard>
  <UCard v-else>
    <template #header> </template>

    <div class="text-center">
      <p class="mb-4">
        {{ $t('email_sent_msg', { email: email }) }}
      </p>
      <p>
        <strong>{{ $t('note') }}</strong> {{ $t('link_expire_msg') }}
      </p>
    </div>
  </UCard>
</template>

<script setup>
// 登入成功狀態
const success = ref(false)
// 信箱
const email = ref('')
// 加載狀態
const isLoading = ref(false)
// 引用彈窗
const { toastError } = useAppToast()
// 引用 supabase
const supabase = useSupabaseClient()
// 引用語系
const { t } = useI18n()
const redirectUrl = useRuntimeConfig().public.baseUrl

// 引用使用者登入轉址 hook
useAuthenticatedRedirect()

/**
 * 登入
 */
const handleLogin = async () => {
  isLoading.value = true
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${redirectUrl}/confirm`
      }
    })
    if (error) {
      // 提示訊息
      toastError({ title: t('auth_error'), description: error.message })
    } else {
      success.value = true
    }
  } finally {
    isLoading.value = false
  }
}
</script>
