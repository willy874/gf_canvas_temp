import {
  Container,
  Graphics
} from '@base/pixi';
import {
  easeInSine
} from '@base/utils';

export default class BaseGraphics {
  constructor(args) {
    /** @private */
    this._app = args.app;

    /** 
     * @private
     * @type {DisplayObject[]}
     */
    this._containers = [];

    /** 
     * 
     * @public
     * @type {BaseGraphics[]}
     */
    this.children = [];

    /** 
     * @public 
     * @type {Container}
     */
    this.container = new Container()
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
  update(t) {}

  draw() {}

  /**
   * @param {DisplayObject[]} children 
   */
  create(children = []) {
    this._containers.push(...children)
    if (this._containers.length) {
      this.container.addChild(...this._containers)
      this._app.stage.addChild(this.container)
    }
    this.draw()
  }

  /**
   * @param {DisplayObject[]} children 
   */
  setChild(children = []) {
    this._containers = children
    this.containerUpdate()
  }

  containerUpdate() {
    this._app.stage.removeChild(this.container)
    this.container = new Container()
    this.container.addChild(...this._containers)
  }

  remove() {
    this._app.stage.removeChild(this.container)
  }

  /**
   * @param {number} t 
   */
  _update(t) {
    this.container.children.forEach(child => {
      if (child instanceof Graphics) {
        child.clear()
      }
    })
    this.children.forEach(child => {
      child._update(t)
    })
    this.update(t)
    this.draw()
  }
}