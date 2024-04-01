<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="font-extrabold text-4xl">
      {{ $t('summary') }}
    </h1>
    <div>
      <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
    </div>
  </section>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
    <Trend
      color="red"
      :title="$t('income')"
      :amount="incomeTotal"
      :last-amount="3000"
      :loading="isLoading"
    />
    <Trend
      color="green"
      :title="$t('expense')"
      :amount="expenseTotal"
      :last-amount="5000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      :title="$t('investments')"
      :amount="4000"
      :last-amount="3000"
      :loading="isLoading"
    />
    <Trend
      color="green"
      :title="$t('saving')"
      :amount="4000"
      :last-amount="4100"
      :loading="isLoading"
    />
  </section>

  <!-- 交易摘要 -->
  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">{{ $t('transactions') }}</h2>
      <div class="text-gray-500 dark:text-gray-400">
        {{ $t('income_expense_count_msg', { incomeCount, expenseCount }) }}
      </div>
    </div>
    <div>
      <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" />
    </div>
  </section>

  <section v-if="!isLoading">
    <div v-for="(transactionsOnDay, date) in transactionsGroupedByDate" :key="date" class="mb-10">
      <!-- 交易金額總覽 -->
      <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
      <!-- 交易金額 -->
      <Transaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refreshPage()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants'

// 引用 supabase
const supabase = useSupabaseClient()

// 交易檢視型態：預設為月份
const selectedView = ref(transactionViewOptions[1])
// 交易資訊
const transactions = ref([])
// 加載資訊
const isLoading = ref(false)

/**
 * 所得類型
 * @returns {Boolean}
 */
const income = computed(() => transactions.value.filter((item) => item.type === 'Income'))
/**
 * 花費類型
 * @returns {Boolean}
 */
const expense = computed(() => transactions.value.filter((item) => item.type === 'Expense'))
/**
 * 所得數量
 * @returns {Number}
 */
const incomeCount = computed(() => income.value.length)
/**
 * 花費數量
 * @returns {Number}
 */
const expenseCount = computed(() => expense.value.length)
/**
 * 總所得
 * @returns {Number}
 */
const incomeTotal = computed(() =>
  income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)
/**
 * 總花費
 * @returns {Number}
 */
const expenseTotal = computed(() =>
  expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

/**
 * 抓取交易資料：useAsyncData 確保資料不會重複的獲取
 */
const getData = async () => {
  isLoading.value = true
  try {
    const { data } = await useAsyncData('transactions', async () => {
      const { data, error } = await supabase.from('transactions').select()
      if (error) return []
      return data
    })

    return data.value
  } finally {
    isLoading.value = false
  }
}

/**
 * 重整頁面
 */
const refreshPage = async () => (transactions.value = await getData())

await refreshPage()

/**
 * 將交易依照日期分群
 */
const transactionsGroupedByDate = computed(() => {
  return transactions.value.reduce((prev, cur) => {
    // 只取出年日月資訊
    const date = new Date(cur.created_at).toISOString().split('T')[0]
    // 分群
    if (!prev[date]) {
      prev[date] = []
    }
    prev[date].push(cur)

    return prev
  }, {})
})
</script>