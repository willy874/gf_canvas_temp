/** @typedef {import('@base/enums').TimeUnit} TimeUnit */
import BaseContainer from '@base/components/base-container'
import ChartGroup from './chart-group'
import {
  Graphics,
} from '@base/pixi';

export default class EventChart extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      isInit,
      types,
      unit,
      DateLine,
      colors,
    } = args;
    /** @type {number} */
    this.y = DateLine.y + DateLine.lineBaseY + 16
    /** @type {boolean} */
    this.isInit = isInit
    /** @type {TimeUnit|number} */
    this.unit = unit
    /** @type {IEventTypeModel[]} */
    this.types = types;
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;
    /** @type {number[]} */
    this.colors = colors;

    this.graphics = new Graphics()
    this.create()
  }

  getColor(index) {
    return this.colors[index % this.colors.length]
  }

  getCharGroup() {
    return this.types.filter(m => m.data.length).map((model, index) => {
      return new ChartGroup({
        isInit: this.isInit,
        app: this.getApplication(),
        unit: this.unit,
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight,
        event: this.event,
        model,
        sort: index,
        color: this.getColor(index),
        DateLine: this.DateLine,
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