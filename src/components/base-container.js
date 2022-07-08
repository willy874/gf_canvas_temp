import {
  Container,
  Graphics
} from '@base/pixi';
import DynamicProperties from './dynamic-properties'

export default class BasePrototype extends Container {
  constructor(args) {
    super()
    const {
      app,
      x,
      y,
      root,
      isInit,
      canvasWidth,
      canvasHeight,
    } = args
    /** @type {() => Application} */
    this.getApplication = () => app;
    /** @type {number} */
    if (x) this.x = x
    /** @type {number} */
    if (y) this.y = y
    /** @type {import('./root').default} */
    this.root = root || null
    /** @type {boolean} */
    this.isInit = isInit || false
    /** @type {number} */
    this.canvasWidth = canvasWidth || 0;
    /** @type {number} */
    this.canvasHeight = canvasHeight || 0;
    /** @type {IDynamicProperties[]} */
    this.properties = []
    /** @type {import('./base-container').default[]} */
    this.children = []
  }

  getArguments() {
    return {
      app: this.getApplication(),
      root: this.root,
      isInit: this.isInit,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      properties: this.properties,
    }
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
      if (child.tickerRender) {
        child.tickerRender(t)
      }
      if (child instanceof Graphics) {
        child.clear()
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