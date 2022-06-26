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