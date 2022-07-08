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
      props,
    } = args;
    // === Props Attribute ===
    /** @type {import('./timeline-app').TimelineApplicationOptions} */
    this.props = props
    const {
      DateLine,
      RulerLine,
    } = this.props.getComponents()
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;
    /** @type {import('./ruler-group').default} */
    this.RulerLine = RulerLine;

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
    return this.props.colors[index % this.props.colors.length]
  }

  getCharGroup() {
    return this.props.types.filter(m => m.data.length).map((model, index) => {
      return new ChartGroup({
        ...this.getArguments(),
        model,
        sort: index,
        color: this.getColor(index),
        DateLine: this.DateLine,
        RulerLine: this.RulerLine,
      })
    })
  }

  init() {
    const children = this.getCharGroup()
    this.refreshChildren(...children)
  }

  update(t) {
    // 計算自己的碰撞座標
    this.y = this.DateLine.y + this.DateLine.textHeight + this.DateLine.scaleHeight + this.props.lineSolidWidth + this.DateLine.paddingBottom
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