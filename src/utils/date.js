import dayjs from 'dayjs';

/**
 * @param {string | number | Date} [date] 
 * @param {string} [format] 
 * @returns {string}
 */
export function dateFormat(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(format);
}

/**
 * @param {string | number | Date} date 
 * @returns {number}
 */
export function dateToNumber(date) {
  return dayjs(date).valueOf();
}

export function dateIsSame(date1, date2, format = 'YYYY/MM/DD') {
  return dayjs(date1).format(format) === dayjs(date2).format(format)
}

/**
 * @param {string | number | Date | undefined} date
 * @param {number} value
 * @param {import('dayjs').ManipulateType} unit
 * @returns {Date}
 */
export function dateSubtract(date, value, unit) {
  return dayjs(date).subtract(value, unit).toDate()
}