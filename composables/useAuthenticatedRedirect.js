export const useAuthenticatedRedirect = (url = '/') =>{
  // supabase 用戶登入驗證
  const user = useSupabaseUser()
  
  watch(user, (user) => {
      if (user) {
        return navigateTo(url)
      }
    },
    { immediate: true }
  )

  return { user }
}