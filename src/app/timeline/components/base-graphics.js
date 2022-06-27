import {
  Container,
  Graphics
} from '@base/pixi';
import {
  easeInSine
} from '@base/utils';

export default class BaseGraphics {
  constructor() {
    this.container = new Container()
    this.children = []
  }

  /**
   * @param {GraphicsInfo} graphics
   * @param {number} target 
   * @param {number} duration
   * @param {(t: number) => number} duration 
   */
  setTarget(graphics, target, duration, timingFunction = easeInSine) {
    graphics.origin = graphics.status
    graphics.target = target
    if (duration) graphics.duration = duration
    graphics.time = 0
    graphics.timingFunction = timingFunction
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
        graphics.origin = target
      }
    }
  }


  /**
   * @param {number} t 
   */
  updateData(t) {}

  draw() {}

  create() {
    if (this.children.length) {
      this.container.addChild(...this.children)
    }
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