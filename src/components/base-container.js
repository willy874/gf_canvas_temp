import {
  Container,
  Graphics
} from '@base/pixi';

export default class BaseContainer extends Container {
  constructor(args) {
    super();
    const {
      app,
      x,
      y,
      canvasWidth,
      canvasHeight,
    } = args
    /** @type {() => Application} */
    this.getApplication = () => app;
    /** @type {number} */
    if (x) this.x = x
    /** @type {number} */
    if (y) this.y = y
    /** @type {number} */
    this.baseWidth = canvasWidth;
    /** @type {number} */
    this.baseHeight = canvasHeight;
  }

  /**
   * @param {number} t 
   */
  update(t) {}

  draw() {}

  init() {}

  setAttribute(key, value) {
    this[key] = value
    this.init()
  }

  create() {
    this.init()
    this.draw()
  }

  removeSelf() {
    this.getApplication().stage.removeChild(this)
  }

  refreshChildren(...children) {
    this.removeChildren()
    this.addChild(...children)
  }

  /**
   * @param {number} t 
   */
  tickerRender(t) {
    this.children.forEach(child => {
      if (child instanceof Graphics) {
        child.clear()
      }
      if (child instanceof BaseContainer) {
        child.tickerRender(t)
      }
    })
    this.update(t)
    this.draw()
  }
}