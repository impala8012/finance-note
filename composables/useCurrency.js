/**
 * 格式化貨幣金額
 * @param {Number} amount 金額
 * @returns {String}
 */
export const useCurrency = (amount) => {
  const currency = computed(()=>{
    return new Intl.NumberFormat('en-In',{
      style: 'currency', currency:'USD'
    }).format(isRef(amount) ? amount.value : amount)
  })

  return { currency }
}