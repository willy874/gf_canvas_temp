import {
  Container,
  Graphics
} from '@base/pixi';

/**
 * @typedef {Object} GraphicsInfo
 * @property {Graphics} current
 * @property {number} status
 * @property {number} target
 * @property {number} origin
 * @property {number} duration
 * @property {number} time
 * @property {(x: number) => number} timingFunction
 */


export default class BaseGraphics {
  constructor() {
    this.container = new Container()
  }

  /**
   * @param {number} t 
   * @param {GraphicsInfo} graphics
   */
  updateGraphics(graphics, t) {
    const {
      time,
      duration,
      timingFunction,
      target,
      status,
      origin
    } = graphics
    if (time < duration) {
      const timing = timingFunction(time / duration)
      graphics.status = (target - origin) * timing
      graphics.time += (t)
    } else {
      if (status !== target) {
        graphics.status = target
      }
    }
  }


  /**
   * @param {number} t 
   */
  updateData(t) {}

  draw() {}

  create() {
    this.draw()
  }

  /**
   * @param {number} t 
   */
  update(t) {
    this.container.children.forEach(child => {
      if (child instanceof Graphics) {
        child.clear()
      }
    })
    this.updateData(t)
    this.draw()
  }
}