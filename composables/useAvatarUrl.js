
export const useAvatarUrl = () => {
  // 引用 supabase
  const supabase = useSupabaseClient()
  // 引用 supabase 使用者資訊
  const user = useSupabaseUser()

  // 取得當前使用者大頭貼的 url
  const getPublicUrl = () => {
    if (!user.value?.user_metadata?.avatar_url) return null

    const { data } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(user.value?.user_metadata?.avatar_url)

    return data.publicUrl
  }

  const url = ref(getPublicUrl())

  // 根據使用者更新大頭貼
  watch(user, () => url.value = getPublicUrl(), { immediate: true })

  return { url }
}