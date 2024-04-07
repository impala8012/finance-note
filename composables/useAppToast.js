export const useAppToast = () =>{
  const toast = useToast()
  
  return {
    // 成功彈窗
    toastSuccess: ({ title, description = null }) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
    },
    // 失敗彈窗
    toastError: ({ title, description = null }) => {
      toast.add({
        title,
        description,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      })
    }
  }
}