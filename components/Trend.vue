<template>
  <div>
    <!-- 標題 -->
    <div class="font-bold" :class="[color]">{{ title }}</div>

    <!-- 金額 -->
    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton class="w-full h-8" v-if="isLoading" />
      <div v-else>{{ currency }}</div>
    </div>

    <!-- 上期比較金額 -->
    <div>
      <USkeleton class="w-full h-6" v-if="isLoading" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon :name="icon" class="w-6 h-6" :class="[trendingUp ? 'red' : 'green']" />
        <div class="text-gray-500 dark:text-gray-400">
          {{ $t('vs_last_period', { percentage: percentageTrend }) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 標題
  title: {
    type: String,
    default: ''
  },
  // 當前金額
  amount: {
    type: Number,
    default: undefined
  },
  // 上期金額
  lastAmount: {
    type: Number,
    default: undefined
  },
  // 類別顏色
  color: {
    type: String,
    default: ''
  },
  // 加載狀態
  isLoading: {
    type: Boolean,
    default: false
  }
})

/**
 * 股市是否上漲
 * @returns {Boolean}
 */
const trendingUp = computed(() => props.amount >= props.lastAmount)

/**
 * 上漲下跌圖標
 * @returns {string}
 */
const icon = computed(() =>
  trendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'
)

// 貨幣金額
const { currency } = useCurrency(props.amount)

/**
 * 計算當期與上期比率
 * @returns {String}
 */
const percentageTrend = computed(() => {
  const { amount, lastAmount } = props
  if (amount === 0 || lastAmount === 0) return '∞%'

  const bigger = Math.max(amount, lastAmount)
  const lower = Math.min(amount, lastAmount)
  const ratio = ((bigger - lower) / lower) * 100

  return `${Math.ceil(ratio)}%`
})
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>