import BaseContainer from '@base/components/base-container'
import ChartGroup from './chart-group'
import {
  Graphics,
} from '@base/pixi';

export default class EventChart extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      startTime,
      endTime,
      effectWidth,
      types,
      colors
    } = args;
    /** @type {number} */
    this.startTime = startTime;
    /** @type {number} */
    this.endTime = endTime;
    /** @type {number} */
    this.effectWidth = effectWidth;
    /** @type {IEventTypeModel[]} */
    this.types = types;
    /** @type {number[]} */
    this.colors = colors;

    this.graphics = new Graphics()
    this.create()
  }

  getCharGroup() {
    return this.types.filter(m => m.data.length).map((model, index) => {
      return new ChartGroup({
        app: this.getApplication(),
        model,
        sort: index,
        color: this.colors[index % this.colors.length],
        effectWidth: this.effectWidth,
        basePixelTime: (this.endTime - this.startTime) / this.effectWidth,
        baseStartTime: this.startTime,
        baseEndTime: this.endTime
      })
    })
  }

  init() {
    const children = this.getCharGroup()
    this.refreshChildren(...children)
    // 計算群組高度給予碰撞
    let y = 0
    children.forEach((child) => {
      child.y = y
      y += child.height
    })
  }
}