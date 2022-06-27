import {
  Graphics
} from "@base/pixi";
import {
  easeInSine
} from '@base/utils';

/**
 * @implements {GraphicsInfo}
 */
export default class DynamicProperties {
  constructor(args = {}) {
    const {
      current,
      status,
      target,
      origin,
      duration,
      time,
      timingFunction
    } = args;
    this.current = current || new Graphics()
    this.status = status || 0
    this.target = target || 0
    this.origin = origin || 0
    this.duration = duration || 0
    this.time = time || 0
    this.timingFunction = timingFunction || easeInSine
  }

  /**
   * @param {number} target 
   * @param {number} duration
   * @param {(t: number) => number} duration 
   */
  setTarget(target, duration, timingFunction = easeInSine) {
    this.origin = this.status
    this.target = target
    if (duration) this.duration = duration
    this.time = 0
    this.timingFunction = timingFunction
  }

  /**
   * @param {number} t
   */
  updateGraphics(t) {
    if (this.time < this.duration) {
      const timing = this.timingFunction(this.time / this.duration)
      this.status = (this.target - this.origin) * timing
      this.time += (t)
    } else {
      if (this.status !== this.target) {
        this.status = this.target
        this.origin = this.target
      }
    }
  }
}