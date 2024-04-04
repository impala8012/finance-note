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
      :last-amount="prevIncomeTotal"
      :loading="isLoading"
    />
    <Trend
      color="green"
      :title="$t('expense')"
      :amount="expenseTotal"
      :last-amount="prevExpenseTotal"
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
      <!-- 新增交易彈窗 -->
      <TransactionModal v-model="isModalOpen" @saved="refresh()" />
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        :label="$t('add')"
        @click="isModalOpen = true"
      />
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
        @deleted="refresh()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants'

// 交易檢視型態：預設為月份
const selectedView = ref(transactionViewOptions[1])
// 彈窗開關
const isModalOpen = ref(false)

// 引用選取時間區間 hook
const { current, previous } = useSelectedTimePeriod(selectedView)

// 引用交易 hook：取得當前的資訊
const {
  isLoading,
  refresh,
  transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    grouped: { transactionsGroupedByDate }
  }
} = useGetTransaction(current)

await refresh()

// 引用交易 hook：取得上一個的資訊
const {
  refresh: refreshPrevious,
  transactions: { incomeTotal: prevIncomeTotal, expenseTotal: prevExpenseTotal }
} = useGetTransaction(previous)
await refreshPrevious()
</script>