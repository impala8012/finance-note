<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold"
  >
    <!-- 日期 -->
    <div class="flex items-center justify-between">
      {{ date }}
    </div>

    <!-- 金額 -->
    <div class="flex items-center justify-end mr-10">
      {{ currency }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 日期
  date: {
    type: String,
    default: ''
  },
  // 交易金額
  transactions: {
    type: [],
    default: () => []
  }
})

/**
 * 總額
 * @returns {Number}
 */
const sum = computed(() => {
  let sum = 0
  props.transactions.forEach((transaction) => {
    if (transaction.type === 'Income') {
      sum += transaction.amount
    } else {
      sum -= transaction.amount
    }
  })
  return sum
})

const { currency } = useCurrency(sum)
</script>
