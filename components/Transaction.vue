<template>
  <div
    class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <!-- 敘述 -->
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]" />
        <UBadge
          class="whitespace-nowrap"
          :color="isIncome || isInvestment ? 'primary' : 'red'"
          variant="soft"
        >
          {{ $t(transaction.type.toLowerCase()) }}
        </UBadge>
        <div>{{ transaction.description }}</div>
      </div>
      <!-- 分類 -->
      <div>
        <UBadge class="whitespace-nowrap" color="white" v-if="transaction.category">
          {{ $t(transaction.category.toLowerCase()) }}
        </UBadge>
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
          <TransactionModal
            v-if="isOpen && transaction"
            v-model="isOpen"
            :transaction="transaction"
            @saved="emit('edited')"
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
const emit = defineEmits(['deleted', 'edited'])

// 彈窗開關
const isOpen = ref(false)

// 貨幣金額轉換
const { currency } = useCurrency(props.transaction.amount)

/**
 * 是否為所得
 * @returns {Boolean}
 */
const isIncome = computed(() => props.transaction.type === 'Income')
/**
 * 是否為投資
 * @returns {Boolean}
 */
const isInvestment = computed(() => props.transaction.type === 'Investment')
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
const iconColor = computed(() =>
  isIncome.value || isInvestment.value ? 'text-green-600' : 'text-red-600'
)

// 加載狀態
const isLoading = ref(false)
// 引入 Nuxt UI Toast：提示彈窗
const { toastSuccess, toastError } = useAppToast()
// 引入 supabase
const supabase = useSupabaseClient()
// 引入語系
const { t } = useI18n()
/**
 * 刪除交易金額
 */
const deleteTransaction = async () => {
  isLoading.value = true
  try {
    await supabase.from('transactions').delete().eq('id', props.transaction.id)
    // 提示彈窗
    toastSuccess({ title: t('delete_transaction_msg') })
    emit('deleted', props.transaction.id)
  } catch (err) {
    // 提示彈窗
    toastError({ title: t('delete_transaction_fail_msg') })
  } finally {
    isLoading.value = false
  }
}

// 下拉選單
const items = [
  [
    {
      label: t('edit'),
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => (isOpen.value = true)
    },
    {
      label: t('delete'),
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction
    }
  ]
]
</script>
