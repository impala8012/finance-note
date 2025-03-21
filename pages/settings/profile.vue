<template>
  <UForm :state="userInfo" :validate="formValidate" @submit="saveProfile">
    <UFormGroup class="mb-4" :label="$t('name')" name="name">
      <UInput v-model="userInfo.name" />
    </UFormGroup>

    <UFormGroup class="mb-4" label="Email" name="email" :help="$t('email_confirm_msg')">
      <UInput v-model="userInfo.email" />
    </UFormGroup>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      :label="$t('save')"
      :pending="isLoading"
      :disabled="isLoading"
    />
  </UForm>
</template>

<script setup>
// 引用 supabase
const supabase = useSupabaseClient()
// 引用 supabase 使用者資訊
const user = useSupabaseUser()
// 彈窗訊息 hook
const { toastSuccess, toastError } = useAppToast()
// 引用語系
const { t } = useI18n()

// 加載狀態
const isLoading = ref(false)
// 使用者資訊
const userInfo = ref({
  // 姓名
  name: user.value.user_metadata?.full_name,
  // 電子信箱
  email: user.value.email
})

/**
 * 表單驗證器
 */
const formValidate = (state) => {
  const { name, email } = state
  const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
  const errors = []
  if (!emailRule.test(email)) errors.push({ path: 'email', message: t('email_invalid_msg') })
  if (!name) errors.push({ path: 'name', message: t('required') })
  return errors
}

/**
 * 表單送出
 */
const saveProfile = async () => {
  isLoading.value = true
  try {
    const data = {
      data: {
        full_name: userInfo.value.name
      }
    }
    // 更新 email 資訊
    if (userInfo.value.email !== user.value.email) {
      data.email = userInfo.value.email
    }

    const { error } = await supabase.auth.updateUser(data)
    if (error) throw error
    toastSuccess({
      title: t('profile_update_msg'),
      description: t('profile_updated_msg')
    })
  } catch (error) {
    toastError({
      title: t('profile_update_fail_msg'),
      description: error.message
    })
  } finally {
    isLoading.value = false
  }
}
</script>
