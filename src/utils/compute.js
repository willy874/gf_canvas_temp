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