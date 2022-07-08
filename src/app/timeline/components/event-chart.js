/** @typedef {import('@base/enums').TimeUnit} TimeUnit */
import BaseContainer from '@base/components/base-container'
import ChartGroup from './chart-group'
import {
  Graphics,
} from '@base/pixi';
import {
  GlobalEvent
} from '@base/utils';
import {
  EventType
} from '@base/enums';

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

    // === Props Attribute ===
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

    // === Base Attribute ===
    /** @type {number} */
    this.translateY = 0;

    GlobalEvent.on(EventType.SCALEMOVE, (e) => this.onPointmove(e))

    this.graphics = new Graphics()
    this.create()
  }

  /**
   * @param {PointerEvent} event 
   */
  onPointmove(event) {
    const top = this.translateY + event.movementY
    if (top <= 0) {
      this.translateY = top
    }
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
  }

  update(t) {
    // 計算群組高度給予碰撞
    let y = this.translateY
    this.children.forEach(container => {
      if (container instanceof ChartGroup) {
        container.y = y
        y += container.height
      }
    })
  }
}