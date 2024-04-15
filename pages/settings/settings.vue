<template>
  <UForm :state="settingState" :validate="formValidate" @submit="saveSettings">
    <UFormGroup :label="$t('transaction_view')" class="mb-4" :help="$t('transaction_view_msg')">
      <USelectMenu v-model="settingState.transactionView" :options="transactionViewOptions">
        <template #label> {{ $t(settingState.transactionView.toLowerCase()) }}</template>
        <template #option="{ option }">
          <span>{{ $t(option.toLowerCase()) }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>

    <UFormGroup :label="$t('language_setting')" class="mb-4">
      <USelectMenu v-model="settingState.lang" :options="langOpts">
        <template #label> {{ $t(settingState.lang.toLowerCase()) }}</template>
        <template #option="{ option }">
          <span>{{ $t(option.toLowerCase()) }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      :label="$t('save')"
      :loading="isLoading"
      :disabled="isLoading"
    />
  </UForm>
</template>

<script setup>
// 時段區間
const transactionViewOptions = ['Yearly', 'Monthly', 'Daily']
// 語系
const langOpts = ['chinese', 'english']

// 引用 supabase
const supabase = useSupabaseClient()
// 引用 supabase 使用者資訊
const user = useSupabaseUser()
// 彈窗訊息 hook
const { toastSuccess, toastError } = useAppToast()
// 引用語系
const { t, setLocale } = useI18n()

// 加載資訊
const isLoading = ref(false)
// 設定狀態
const settingState = ref({
  transactionView: user.value.user_metadata?.transaction_view ?? transactionViewOptions[1],
  lang: user.value.user_metadata?.lang ?? langOpts[0]
})

/**
 * 表單驗證器
 */
const formValidate = (state) => {
  const { transactionView } = state
  const errors = []
  if (!transactionViewOptions.includes(transactionView))
    errors.push({ path: 'transactionView', message: t('email_invalid_msg') })
  return errors
}

/**
 * 儲存設定
 */
const saveSettings = async () => {
  isLoading.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: settingState.value.transactionView,
        lang: settingState.value.lang
      }
    })
    const localVal = settingState.value.lang === 'chinese' ? 'zh-tw' : 'en'
    setLocale(localVal)
    if (error) throw error
    toastSuccess({
      title: t('settings_update_msg')
    })
  } catch (error) {
    toastError({
      title: t('settings_update_fail_msg'),
      description: error.message
    })
  } finally {
    isLoading.value = false
  }
}
</script>