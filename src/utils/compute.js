import {
  TimeUnit
} from '@base/enums'

/**
 * @param {string} text
 * @param {string} font style weight size/line-height family;
 * @returns {number}
 */
export function getTextWidth(text, font) {
  if (text && font) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = font;
    const info = ctx.measureText(text);
    return info.width;
  }
  return 0;
}

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} angle 
 * @param {number} distance 
 * @returns 
 */
export function getEndPointByTrigonometric(x, y, angle, distance) {
  const radian = (angle * Math.PI) / 180;
  const endPointX = x + distance * Math.cos(radian);
  const endPointY = y + distance * Math.sin(radian);
  return {
    x: endPointX,
    y: endPointY
  };
}

/**
 * @param {TimeUnit | number} unit 
 * @returns {number}
 */
export function getUnitValue(unit) {
  const seconds = 1000
  const minute = 1000 * 60
  const hour = 1000 * 60 * 60
  const day = 1000 * 60 * 60 * 24
  switch (unit) {
    case TimeUnit.SECOND:
      return seconds
    case TimeUnit.MINUTE:
      return minute
    case TimeUnit.HALF_HOUR:
      return minute * 30
    case TimeUnit.HOUR:
      return hour
    case TimeUnit.HOUR12:
      return hour * 12
    case TimeUnit.DAY:
      return day
    case TimeUnit.DAY3:
      return day * 3
    case TimeUnit.WEEK:
      return day * 7
    case TimeUnit.HALF_MONTH:
      return day * 15
    case TimeUnit.MONTH:
      return day * 30
    case TimeUnit.QUARTER:
      return day * 90
    default:
      return NaN
  }
}

/**
 * @param {TimeUnit | number} unit 
 * @returns {string}
 */
export function getUnitFormat(unit) {
  switch (unit) {
    case TimeUnit.SECOND:
      return 'mm:ss'
    case TimeUnit.MINUTE:
      return 'HH:mm'
    case TimeUnit.HALF_HOUR:
      return 'HH:mm'
    case TimeUnit.HOUR:
      return 'HH:mm'
    case TimeUnit.HOUR12:
      return 'MM/DD HH:mm'
    case TimeUnit.DAY:
      return 'MM/DD'
    case TimeUnit.DAY3:
      return 'MM/DD'
    case TimeUnit.WEEK:
      return 'MM/DD'
    case TimeUnit.HALF_MONTH:
      return 'MM/DD'
    case TimeUnit.MONTH:
      return 'YYYY/MM'
    case TimeUnit.QUARTER:
      return 'YYYY/MM'
    default:
      return 'YYYY/MM/DD HH:mm:ss'
  }
}