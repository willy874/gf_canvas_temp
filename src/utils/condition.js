/**
 * @param {unknown} value 
 * @returns {boolean}
 */
export function isSet(value) {
  return value === '' || value === 0 || value === false || Boolean(value)
}