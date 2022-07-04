import {
  Container,
  Graphics
} from '@base/pixi';

export default class BaseContainer extends Container {
  constructor(args) {
    super();
    /** @private */
    this.getApplication = () => args.app;
  }

  /**
   * @param {number} t 
   */
  update(t) {}

  draw() {}

  create() {
    this.draw()
  }

  removeSelf() {
    this.getApplication().stage.removeChild(this)
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
  }
}