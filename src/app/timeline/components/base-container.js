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
      // direction,
      // paddingTop,
      // paddingBottom,
      // paddingLeft,
      // paddingRight,
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
    // /** @type {'column' | 'row' | 'none'} */
    // this.direction = direction || 'none';
    // /** @type {number} */
    // this.paddingTop = paddingTop || 0
    // /** @type {number} */
    // this.paddingBottom = paddingBottom || 0
    // /** @type {number} */
    // this.paddingLeft = paddingLeft || 0
    // /** @type {number} */
    // this.paddingRight = paddingRight || 0
  }

  /**
   * @param {number} t 
   */
  update(t) {}

  draw() {}

  init() {}

  // layoutTypography() {
  //   if (this.direction === 'row') {
  //     let x = this.paddingLeft
  //     this.children.forEach(container => {
  //       if (container instanceof BaseContainer) {
  //         container.x = x
  //         x += (container.width + this.paddingLeft + this.paddingRight)
  //       }
  //     })
  //   }
  //   if (this.direction === 'column') {
  //     let y = this.paddingTop
  //     this.children.forEach(container => {
  //       if (container instanceof BaseContainer) {
  //         container.y = y
  //         y += (container.height + this.paddingTop + this.paddingBottom)
  //       }
  //     })
  //   }
  // }

  create() {
    this.init()
    this.draw()
    // this.layoutTypography()
  }

  removeSelf() {
    this.getApplication().stage.removeChild(this)
  }

  refreshChildren(...children) {
    this.children.forEach(child => {
      child.removeChild(child)
    })
    this.addChild(...children)
  }

  /**
   * @param {number} t 
   */
  _update(t) {
    this.children.forEach(child => {
      if (child instanceof Graphics) {
        child.clear()
      }
      if (child instanceof BaseContainer) {
        child._update(t)
      }
    })
    this.update(t)
    this.draw()
    // this.layoutTypography()
  }
}