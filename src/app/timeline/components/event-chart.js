import {
  // Graphics,
} from '@base/pixi';
import BaseGraphics from './base-graphics'

export default class EventChart extends BaseGraphics {
  constructor(args) {
    super()
    const {
      baseX,
      baseY,
      baseWidth,
      baseHeight
    } = args;

    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
  }

  /**
   * @param {number} t 
   */
  updateData(t) {}

  draw() {}
}