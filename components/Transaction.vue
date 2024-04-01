<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex items-center justify-between">
      <!-- 敘述 -->
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]" />
        <div>{{ transaction.description }}</div>
      </div>
      <!-- 分類 -->
      <div>
        <UBadge color="white" v-if="transaction.category">{{ transaction.category }}</UBadge>
      </div>
    </div>

    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 交易
  transaction: {
    type: Object,
    default: () => {}
  }
})

// 定義上傳事件
const emit = defineEmits(['deleted'])

// 貨幣金額轉換
const { currency } = useCurrency(props.transaction.amount)

/**
 * 是否為所得
 * @returns {Boolean}
 */
const isIncome = computed(() => props.transaction.type === 'Income')
/**
 * 敘述圖標顯示
 * @returns {String}
 */
const icon = computed(() =>
  isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
)
/**
 * 敘述圖標色碼
 * @returns {String}
 */
const iconColor = computed(() => (isIncome.value ? 'text-green-600' : 'text-red-600'))

// 加載狀態
const isLoading = ref(false)
// 引入 Nuxt UI Toast：提示彈窗
const toast = useToast()
// 引入 supabase
const supabase = useSupabaseClient()

/**
 * 刪除交易金額
 */
const deleteTransaction = async () => {
  isLoading.value = true
  try {
    await supabase.from('transactions').delete().eq('id', props.transaction.id)
    // 提示彈窗
    toast.add({
      title: $t('delete_transaction_msg'),
      icon: 'i-heroicons-check-circle'
    })
    emit('deleted', props.transaction.id)
  } catch (err) {
    // 提示彈窗
    toast.add({
      title: 'Transaction deleted',
      icon: 'i-heroicons-exclamation-circle'
    })
  } finally {
    isLoading.value = false
  }
}

// 下拉選單
const items = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => console.log('Edit')
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => deleteTransaction
    }
  ]
]
</script>
