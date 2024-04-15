import dayjs from 'dayjs';

/**
 * 根據選取的區間顯示對應的日期
 * @param {String} period 區間
 * @returns 
 */
export const useSelectedTimePeriod = (period) => {
  const today = dayjs().format("YYYY-MM-DD");
  const current = computed(
    () => {
      switch (period.value) {
        case 'Yearly':
          return {
            from: dayjs().startOf("year").format("YYYY-MM-DD"),
            to: dayjs().endOf("year").format("YYYY-MM-DD")
          }
        case 'Monthly':
          return {
            from: dayjs().startOf("month").format("YYYY-MM-DD"),
            to: dayjs().endOf("month").format("YYYY-MM-DD")
          }
        case 'Daily':
          return {
            from: dayjs().startOf("day").format("YYYY-MM-DD"),
            to: dayjs().endOf("day").format("YYYY-MM-DD")
          }
      }
    }
  )

  const previous = computed(
    () => {
      switch (period.value) {
        case 'Yearly':
          return {
            from: dayjs().startOf("year").add(-1, "year").format("YYYY-MM-DD"),
            to: dayjs().endOf("year").add(-1, "year").format("YYYY-MM-DD"),
          }
        case 'Monthly':
          return {
            from: dayjs().startOf("month").add(-1, "month").format("YYYY-MM-DD"),
            to: dayjs().endOf("month").add(-1, "month").format("YYYY-MM-DD"),
          }
        case 'Daily':
          return {
            from: dayjs().startOf("day").add(-1, "day").format("YYYY-MM-DD"),
            to: dayjs().endOf("day").add(-1, "day").format("YYYY-MM-DD"),
          }
      }
    }
  )

  return {current, previous}
}