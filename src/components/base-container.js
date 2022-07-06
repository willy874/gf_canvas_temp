import {
  Container,
  Graphics
} from '@base/pixi';
import DynamicProperties from './dynamic-properties'

export default class BaseContainer extends Container {
  constructor(args) {
    super();
    const {
      app,
      x,
      y,
      canvasWidth,
      canvasHeight,
      event
    } = args
    /** @type {() => Application} */
    this.getApplication = () => app;
    /** @type {number} */
    if (x) this.x = x
    /** @type {number} */
    if (y) this.y = y
    /** @type {number} */
    this.canvasWidth = canvasWidth;
    /** @type {number} */
    this.canvasHeight = canvasHeight;
    /** @type {IDynamicProperties[]} */
    this.properties = []
    /** @type {import('eventemitter2').EventEmitter2} */
    this.event = event
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

  /**
   * @param {IDynamicProperties[]} items
   * @return {number}
   */
  addProperties(...items) {
    let length = 0
    items.forEach((el) => {
      if (el instanceof DynamicProperties) {
        length = this.properties.push(el)
      }
    })
    return length
  }

  /**
   * @param {IDynamicProperties[]} items
   */
  refreshProperties(...items) {
    const list = []
    items.forEach((el) => {
      if (el instanceof DynamicProperties) {
        list.push(el)
      }
    })
    this.properties = list
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
    this.properties.forEach((property) => {
      if (property instanceof DynamicProperties) {
        property.updateDate(t)
      }
    })
    this.update(t)
    this.draw()
  }
}