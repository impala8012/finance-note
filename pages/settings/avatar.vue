<template>
  <div>
    <div class="mb-4">
      <UFormGroup :label="$t('avatar_current')" class="w-full" :help="$t('avatar_hint')">
        <UAvatar :src="avatarUrl" size="3xl" />
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup :label="$t('avatar_new')" class="w-full" name="avatar">
        <UInput type="file" ref="fileInput" />
      </UFormGroup>
    </div>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      :label="$t('save')"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script setup>
// 引用 supabase
const supabase = useSupabaseClient()
// 引用 supabase 使用者資訊
const user = useSupabaseUser()
// 彈窗訊息 hook
const { toastSuccess, toastError } = useAppToast()
// 大頭貼網址
const { url: avatarUrl } = useAvatarUrl()
// 語系
const { t } = useI18n()

// 加載狀態
const uploading = ref(false)
// 檔案
const fileInput = ref()

/**
 * 儲存大頭貼
 */
const saveAvatar = async () => {
  const file = fileInput.value.input.files[0]
  if (!file) {
    toastError({ title: t('avatar_upload_hint') })
    return
  }
  // 檔案類型
  const fileExt = file.name.split('.').pop()
  // 檔案名稱
  const fileName = `${Math.random()}.${fileExt}`

  try {
    uploading.value = true
    const currentAvatarUrl = user.value.user_metadata?.avatar_url
    // 將圖片更新到 supabase bucket
    const { error } = await supabase.storage.from('avatars').upload(fileName, file)
    if (error) throw error
    // 更新使用者資訊
    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName
      }
    })
    // 移除舊的檔案
    if (currentAvatarUrl) {
      const { error } = await supabase.storage.from('avatars').remove([currentAvatarUrl])
      if (error) throw error
    }
    // 初始表單狀態
    fileInput.value.input.value = null
    toastSuccess({ title: t('avatar_upload_msg') })
  } catch (error) {
    toastError({
      title: t('avatar_upload_fail_msg'),
      description: error.message
    })
  } finally {
    uploading.value = false
  }
}
</script>