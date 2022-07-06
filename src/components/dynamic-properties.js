import {
  easeInSine
} from '@base/utils';

/**
 * @implements {IDynamicProperties}
 */
export default class DynamicProperties {
  constructor(args = {}) {
    const {
      status,
      target,
      origin,
      duration,
      time,
      timingFunction
    } = args;
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
   * @returns {Promise<DynamicProperties>}
   */
  toTarget(target, duration, timingFunction = easeInSine) {
    return new Promise((resolve) => {
      this.origin = this.status
      this.target = target
      if (duration) this.duration = duration
      this.time = 0
      this.timingFunction = timingFunction
      this.resolve = resolve
    })
  }

  /**
   * @param {number} t
   */
  updateDate(t) {
    if (this.time < this.duration) {
      const timing = this.timingFunction(this.time / this.duration)
      this.status = (this.target - this.origin) * timing
      this.time += (t)
    } else {
      if (this.status !== this.target) {
        this.status = this.target
        this.origin = this.target
        if (this.resolve) {
          this.resolve(this)
          this.resolve = null
        }
      }
    }
  }
}