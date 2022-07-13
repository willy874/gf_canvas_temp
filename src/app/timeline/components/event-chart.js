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
    /** @type {ICollection<ITimeLimeChartModel>} */
    this.collection = new Collection()
    /** @type {number} */
    this.tipX = 0
    /** @type {number} */
    this.tipY = 0
    /** @type {boolean} */
    this.isShowTip = false
    /** @type {ITimeLimeChartModel} */
    this.target = null
    /** @type {Text} */
    this.tipText = new Text('', {
      fontWeight: '400',
      fontSize: this.props.fontSize,
      fontFamily: this.props.fontFamily
    })

    GlobalEvent.on(EventType.SCALEMOVE, (e) => this.onScalemove(e))
    GlobalEvent.on(EventType.CANVASMOVE, (e) => this.onCanvasMove(e))

    /** @type {Graphics} */
    this.graphics = new Graphics()
    /** @type {Graphics} */
    this.tipGraphics = new Graphics()
    this.create()
  }

  /**
   * @param {PointerEvent|MouseEvent} event 
   */
  onPointmove(event) {
    let isCollision
    this.children.forEach(container => {
      if (container instanceof ChartGroup) {
        container.coordinatesList.forEach(coordinate => {
          if (coordinate.isCollision(event.clientX - container.x - container.paddingX, event.clientY - container.y - container.getClientTop())) {
            this.target = this.collection.get(coordinate.eventId)
            isCollision = true
          }
        })
      }
    })
    if (!isCollision) {
      this.target = null
    }
  }

  /**
   * @param {PointerEvent|MouseEvent} event 
   */
  onScalemove(event) {
    const top = this.translateY + event.movementY
    this.translateY = top
    this.children.forEach(container => {
      if (container instanceof ChartGroup) {
        container.matrix.update({
          pixelTime: this.DateLine.getPixelTime(),
          startTime: this.DateLine.getViewStartTime(),
          endTime: this.DateLine.getViewEndTime(),
        })
        container.matrix.matrixUpdate()
        // console.log(container.matrix);
      }
    })
  }

  /**
   * @param {InteractionEvent} event 
   */
   onCanvasMove(event) {
    const originalEvent = event.data.originalEvent
    if (originalEvent instanceof MouseEvent || originalEvent instanceof PointerEvent) {
      this.tipX = originalEvent.offsetX
      this.tipY = originalEvent.offsetY - this.DateLine.getClientHeight()
      this.onPointmove(originalEvent)
    }
  }

  getCharGroup() {
    return this.props.types.filter(m => m.data.length).map((_, index) => {
      return new ChartGroup({
        ...this.getArguments(),
        sort: index,
        DateLine: this.DateLine,
        RulerLine: this.RulerLine,
        collection: this.collection,
        graphics: this.graphics
      })
    })
  }

  init() {
    const children = this.getCharGroup()
    this.refreshChildren(...children, this.tipGraphics, this.tipText)
  }

  drawTip() {
    const tipAlpha = Number(this.target ? 1 : 0)
    const offsetX = 12
    const offsetY = 12
    const paddingX = 8
    const paddingY = 8
    this.tipText.alpha = tipAlpha
    if (tipAlpha) {
      this.tipText.text = this.target.title
    }
    const width = this.tipText.width + paddingX * 2
    const height = this.tipText.height + paddingY * 2
    const tipX = this.tipX + width >= this.props.canvasWidth ? this.tipX - width : this.tipX
    const tipY = this.tipY + height >= this.props.canvasHeight ? this.tipY - height : this.tipY
    if (tipAlpha) {
      this.tipText.x = tipX + offsetX + paddingX
      this.tipText.y = tipY + offsetY + paddingY
    }
    this.tipGraphics
      .beginFill(0xEEEEEE, tipAlpha)
      .lineStyle(1, 0xBDBDBD, tipAlpha)
      .drawRoundedRect(tipX + offsetX, tipY + offsetY, width, height, 8)
  }

  draw() {
    this.drawTip()
  }

  update(t) {
    // 計算自己的碰撞座標
    this.x = this.props.translateX
    this.y = this.DateLine.getClientHeight()
    // 計算群組高度給予碰撞
    let groupY = this.translateY
    this.children.forEach(container => {
      if (container instanceof ChartGroup) {
        container.y = groupY
        groupY += container.getCharGroupHeight()
      }
    })
  }
}