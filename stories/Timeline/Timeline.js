/**
 * @typedef {Object} TimelineProps
 * @property {string} width
 * @property {string} height
 */
/**
 * @param {TimelineProps} props 
 * @returns {HTMLCanvasElement}
 */
export const createTimeline = (props) => {
  const {
    width = '500px', height = '500px'
  } = props
  const canvas = document.createElement('canvas');
  canvas.style.width = width;
  canvas.style.height = height;
  const ctx = canvas.getContext('2d')
  console.log(ctx);
  return canvas;
};