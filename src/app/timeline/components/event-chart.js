/** @typedef {import('@base/enums').TimeUnit} TimeUnit */
import BaseContainer from '@base/components/base-container'
import ChartGroup from './chart-group'
import {
  Graphics,
  Text
} from '@base/pixi';
import {
  Collection,
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

    /** @type {import('./timeline-app').TimelineApplicationOptions} */
    this.props = props

    // === Components ===
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
    /** @type {ICollection} */
    this.collection = new Collection()
    /** @type {number} */
    this.tipX = 0
    /** @type {number} */
    this.tipY = 0
    /** @type {boolean} */
    this.isShowTip = false
    /** @type {import('@base/app/timeline/components/chart-item').default} */
    this.target = null
    /** @type {Text} */
    this.tipText = new Text('', {
      fontWeight: '400',
      fontSize: this.props.fontSize,
      fontFamily: this.props.fontFamily
    })

    GlobalEvent.on(EventType.SCALEMOVE, (e) => this.onScalemove(e))
    GlobalEvent.on(EventType.CANVASMOVE, (e) => this.onCanvasMove(e))

    this.tipGraphics = new Graphics()
    this.create()
  }

  /**
   * @param {PointerEvent} event 
   */
  onScalemove(event) {
    const top = this.translateY + event.movementY
    if (top <= 0) {
      this.translateY = top
    }
  }

  /**
   * @param {InteractionEvent} event 
   */
   onCanvasMove(event) {
    const originalEvent = event.data.originalEvent
    if (originalEvent instanceof MouseEvent || originalEvent instanceof PointerEvent) {
      this.tipX = originalEvent.offsetX
      this.tipY = originalEvent.offsetY - this.DateLine.clientHeight
    }
  }

  getCharGroup() {
    return this.props.types.filter(m => m.data.length).map((_, index) => {
      return new ChartGroup({
        ...this.getArguments(),
        sort: index,
        DateLine: this.DateLine,
        RulerLine: this.RulerLine,
        collection: this.collection
      })
    })
  }

  init() {
    const children = this.getCharGroup()
    this.refreshChildren(...children, this.tipGraphics, this.tipText)
  }

  draw() {
    this.children.forEach(container => {
      if (container instanceof ChartGroup) {
        const offsetX = 12
        const offsetY = 12
        const paddingX = 8
        const paddingY = 8
        if (this.target) {
          this.tipText.alpha = Number(this.isShowTip)
          this.tipText.text = this.target.model.title
        }
        const width = this.tipText.width + paddingX * 2
        const height = this.tipText.height + paddingY * 2
        const tipX = this.tipX + width >= this.props.canvasWidth ? this.tipX - width : this.tipX
        const tipY = this.tipY + height >= this.props.canvasHeight ? this.tipY - height : this.tipY
        if (this.target) {
          this.tipText.x = tipX + offsetX + paddingX
          this.tipText.y = tipY + offsetY + paddingY
        }
        this.tipGraphics
          .beginFill(0xEEEEEE, Number(this.isShowTip))
          .lineStyle(1, 0xBDBDBD, Number(this.isShowTip))
          .drawRoundedRect(tipX + offsetX, tipY + offsetY, width, height, 8)
      }
    })
  }

  update(t) {
    // 計算自己的碰撞座標
    this.y = this.DateLine.clientHeight
    // 計算群組高度給予碰撞
    let y = this.translateY
    this.children.forEach(container => {
      if (container instanceof ChartGroup) {
        container.y = y
        y += container.getCharGroupHeight()
      }
    })
  }
}