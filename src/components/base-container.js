import {
  Container,
  Graphics
} from '@base/pixi';
import DynamicProperties from './dynamic-properties'

/**
 * @typedef {Object} BaseContainerConstructorArguments
 * @property {any} props
 * @property {number} x
 * @property {number} y
 * @property {Application} app
 * @property {any} root
 */
/**
 * @callback BaseContainerConstructor
 * @param {Partial<BaseContainerConstructorArguments>} args 
 */

export default class BasePrototype extends Container {
  /**
   * @type {BaseContainerConstructor}
   */
  constructor(args) {
    super()
    const {
      x,
      y,
      props,
      app,
      root,
    } = args
    /** @type {any} */
    this.props = props
    /** @type {number} */
    if (x) this.x = x
    /** @type {number} */
    if (y) this.y = y
    /** @type {() => Application} */
    this.getApplication = () => app;
    /** @type {import('./root').default} */
    this.root = root || null
    /** @type {IDynamicProperties[]} */
    this.properties = []
    /** @type {import('./base-container').default[]} */
    this.children = []
  }

  getArguments() {
    return {
      app: this.getApplication(),
      root: this.root,
      canvasWidth: this.props.canvasWidth,
      canvasHeight: this.props.canvasHeight,
      props: this.props,
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

  findParentComponent(containerClass) {
    /** @type {Container} */
    let target = this
    while (true) {
      if (containerClass && target instanceof containerClass) {
        return target
      }
      if (target.parent) {
        target = target.parent
      } else {
        return target
      }
    }
  }
}