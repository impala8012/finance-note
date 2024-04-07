/**
 * 獲取交易資訊
 * 
 */
export const useGetTransaction = (period) => {
  console.log('period', period.value);
  // 引用 supabase
  const supabase = useSupabaseClient()
  // 交易資訊
  const transactions = ref([])
  // 加載資訊
  const isLoading = ref(false)

  /**
   * 所得類型
   * @returns {Array}
   */
  const income = computed(() => transactions.value.filter((item) => item.type === 'Income'))
  /**
   * 花費類型
   * @returns {Array}
   */
  const expense = computed(() => transactions.value.filter((item) => item.type === 'Expense'))
  /**
   * 投資類型
   * @returns {Array}
   */
  const investment = computed(() => transactions.value.filter((item) => item.type === 'Investment'))
  /**
   * 儲蓄類型
   * @returns {Array}
   */
  const saving = computed(() => transactions.value.filter((item) => item.type === 'Saving'))



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
   * 總投資
   * @returns {Number}
   */
  const investmentTotal = computed(() =>
   investment.value.reduce((sum, transaction) =>  sum + transaction.amount, 0)
  )
  /**
   * 總儲蓄
   * @returns {Number}
   */
  const savingTotal = computed(() => 
    saving.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  )

  /**
   * 抓取交易資料：useAsyncData 確保資料不會重複的獲取
   */
  const getData = async() => {
    isLoading.value = true
    try {
      const { data } = await useAsyncData(`transactions-${period.value.from}-${period.value.to}`, async () => {
        const { data, error } = await supabase
        .from('transactions')
        .select()
        .gte('created_at', period.value.from)
        .lte('created_at', period.value.to)
        .order('created_at', { ascending: false })
        if (error) return []

        return data
      })

      transactions.value = data.value
      return data.value
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 重整頁面
   */
  const refresh = async() => await getData()

  // 區間變動則重新抓取資訊
  watch(period, async() => await refresh())

  /**
   * 將交易依照日期分群
   */
  const transactionsGroupedByDate = computed(() => {
    const groupData = transactions.value.reduce((prev, cur) => {
      // 只取出年日月資訊
      const date = cur.created_at.split('T')[0]
      // 分群
      if (!prev[date]) {
        prev[date] = []
      }
      prev[date].push(cur)

      return prev
    }, {})

    // // 排序所有日期 key
    // const sortedKey = Object.keys(groupData).sort().reverse()
    // const sortedGroupData = {}
    // // 將對應的日期資料塞入
    // sortedKey.forEach((key) => {
    //   sortedGroupData[key] = groupData[key]
    // })

    return groupData
  })


  return {
    transactions,
    transactionsGroupedByDate,
    income,
    expense,
    incomeTotal,
    expenseTotal,
    incomeCount,
    expenseCount,
    investment,
    investmentTotal,
    savingTotal,
    refresh,
    isLoading
  }
}