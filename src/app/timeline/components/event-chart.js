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
    /** @type {ITimeLimeChartModel[]} */
    this.target = null
    /** @type {Text} */
    this.tipText = new Text('', {
      fontWeight: '400',
      fontSize: this.props.fontSize,
      fontFamily: this.props.fontFamily
    })

    GlobalEvent.on(EventType.SCALEMOVE, (e) => this.onScalemove(e))

    /** @type {Graphics} */
    this.graphics = new Graphics()
    /** @type {Graphics} */
    this.tipGraphics = new Graphics()
    this.create()
  }

  init() {
    const children = this.getCharGroup()
    children.forEach(container => {
      container.markGraphics.interactive = true
      container.markGraphics.buttonMode = true
      container.markGraphics.on(EventType.MOUSEOVER, (e) => {
        this.target = []
      })
      container.markGraphics.on(EventType.MOUSEOUT, (e) => {
        this.target = null
      })
      container.markGraphics.on(EventType.POINTERMOVE, (e) => this.onMarkMouseMove(e, container))
    })
    this.refreshChildren(...children, this.tipGraphics, this.tipText)
  }

  /**
   * @param {PointerEvent|MouseEvent} event 
   */
  onScalemove(event) {
    const top = this.translateY + event.movementY
    if (top <= this.DateLine.paddingBottom / 2) {
      this.translateY = top
    }
    this.children.forEach(container => {
      if (container instanceof ChartGroup) {
        container.matrix.update({
          pixelTime: this.DateLine.getPixelTime(),
          startTime: this.DateLine.getViewStartTime(),
          endTime: this.DateLine.getViewEndTime(),
        })
        container.matrix.matrixUpdate()
      }
    })
  }

  /**
   * @param {InteractionEvent} event 
   * @param {ChartGroup} container 
   */
  onMarkMouseMove(event, container) {
    const originalEvent = event.data.originalEvent
    // console.log('x', this.x);
    // console.log('y', this.y);
    if (originalEvent instanceof MouseEvent || originalEvent instanceof PointerEvent) {
      this.tipX = event.data.global.x
      this.tipY = event.data.global.y
      if (this.target) {
        // console.log('onMarkMouseMove', this.tipX, this.tipY);
        const marks = container.markList.filter(m => m.isCollision(this.tipX, this.tipY))
        if (marks.length) {
          this.target = marks.map(p => p.getModelList()).flat()
        }
      }
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

  drawTip() {
    const tipAlpha = Number(this.target && this.target.length ? 1 : 0)
    const offsetX = 12
    const offsetY = 12
    const paddingX = 8
    const paddingY = 8
    this.tipText.alpha = tipAlpha
    if (tipAlpha) {
      if (this.target.length === 1) {
        this.tipText.text = this.target.find(p => p).title
      } else {
        this.tipText.text = `count: ${this.target.length}`
      }
    }
    const width = this.tipText.width + paddingX * 2
    const height = this.tipText.height + paddingY * 2
    if (tipAlpha) {
      if (this.tipX + width + offsetX * 2 >= this.props.canvasWidth) {
        this.tipText.x = this.tipX - width - offsetX - this.x + paddingX
        this.tipGraphics.x = this.tipX - width - offsetX - this.x 
      } else {
        this.tipText.x = this.tipX + offsetX - this.x + paddingX
        this.tipGraphics.x = this.tipX + offsetX - this.x
      }
      if (this.tipY + height + offsetY * 2 >= this.props.canvasHeight) {
        this.tipText.y = this.tipY - height - offsetY - this.y + paddingY
        this.tipGraphics.y = this.tipY - height - offsetY - this.y
      } else {
        this.tipText.y = this.tipY + offsetY - this.y + paddingY
        this.tipGraphics.y = this.tipY + offsetY - this.y
      }
    }
    this.tipGraphics
      .beginFill(0xEEEEEE, tipAlpha)
      .lineStyle(1, 0xBDBDBD, tipAlpha)
      .drawRoundedRect(0, 0, width, height, 8)
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