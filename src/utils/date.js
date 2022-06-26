import dayjs from 'dayjs';

/**
 * @param {string | number | Date} [date] 
 * @param {string} [format] 
 * @returns 
 */
export function dateFormat(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(format);
}