import {
  Graphics,
  Text
} from '@base/pixi';
import {
  EventType
} from '@base/enums'
import {
  GlobalEvent,
  dateFormat,
} from '@base/utils'
import BaseContainer from "@base/components/base-container";

export default class RulerItem extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      props,
      translateX,
      // appendRulerLine,
      removeRulerLine,
      toTopRulerLine
    } = args

    /** @type {import('./timeline-app').TimelineApplicationOptions} */
    this.props = props

    // === Components ===
    const {
      DateLine,
    } = this.props.getComponents()
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;

    // === Props Attribute ===
    /**
     * @description 每個尺規個別使用自己的定位 
     * @type {number}
     */
    this.translateX = translateX || 0

    // /** @type {(param: typeof args) => void} */
    // this.appendRulerLine = (param) => appendRulerLine(param)
    /** @type {(param: RulerItem) => void} */
    this.removeRulerLine = (param) => removeRulerLine(param)
    /** @type {(param: RulerItem) => void} */
    this.toTopRulerLine = (param) => toTopRulerLine(param)

    // === Base Attribute ===
    /** @type {boolean} */
    this.interactive = true
    /** @type {boolean} */
    this.buttonMode = true
    /** @type {boolean} */
    this.isDrag = false
    // /** @type {boolean} */
    // this.isPlusClick = false
    /** @type {boolean} */
    this.isDashClick = false
    /** @type {number} */
    this.currentTime = 0
    /** @type {number} */
    this.tipRectHeight = 0
    /** @type {number} */
    this.tipRectWidth = 0
    /** @type {number} */
    this.buttonSize = 16
    /** @type {number} */
    this.paddingTop = DateLine.y + 6
    /** @type {number} */
    this.paddingBottom = 6
    /** @type {number} */
    this.tipPaddingX = 6
    /** @type {number} */
    this.tipPaddingY = 2
    /** @type {number} */
    this.dashedLineSolid = 4
    /** @type {number} */
    this.dashedLineIllusory = 4
    /** @type {number} */
    this.dashedLineWidth = 2

    // === Event ===
    this.on(EventType.MOUSEDOWN, (e) => this.onMousedown(e))
    this.on(EventType.MOUSEUP, (e) => this.onMouseup(e))
    GlobalEvent.on(EventType.RULERMOVE, (e) => this.onPointmove(e))

    /** @type {Graphics} */
    this.tipRect = new Graphics()
    /** @type {Graphics} */
    this.dashedLine = new Graphics()

    /** 
     * Dash Button
     * @type {Graphics} 
     */
    this.dashButton = new Graphics()
    this.dashButton.interactive = true
    this.dashButton.cacheAsBitmap = true
    this.dashButton.on(EventType.MOUSEDOWN, (e) => this.onDashMouseDown(e))
    this.dashButton.on(EventType.MOUSEUP, (e) => this.onDashMouseUp(e))
    /** 
     * Tip Text
     * @type {Text}
     */
    this.tipText = new Text('', {
      fontWeight: '400',
      fontFamily: this.props.fontFamily,
      fontSize: this.props.fontSize,
      align: 'center'
    })

    this.addChild(this.tipRect, this.dashedLine, this.dashButton, this.tipText)
    this.create()
  }

  updateTipTime() {
    this.currentTime = this.DateLine.getViewStartTime() + this.translateX * this.DateLine.getPixelTime()
    this.tipText.text = dateFormat(this.currentTime, 'YYYY/MM/DD HH:mm:ss')
  }

  init() {
    this.updateTipTime()
    this.tipRectWidth = this.tipPaddingX * 2 + this.tipText.width
    this.translateX = this.tipRectWidth / 2
  }

  update(t) {
    this.tipRectHeight = this.tipPaddingY * 2 + this.tipText.height
    this.tipRectWidth = this.tipPaddingX * 2 + this.tipText.width
    this.tipText.x = this.translateX + this.tipPaddingX - this.tipRectWidth / 2
    this.tipText.y = this.tipPaddingY
  }

  /**
   * @param {PointerEvent | DragEvent | TouchEvent} event 
   */
  onPointmove(event) {
    if (this.root.dragTriggedCount >= 5) {
      this.isDashClick = false
      this.root.onDragStart(event)
    }
    if (event instanceof PointerEvent || event instanceof DragEvent) {
      if (this.root.target === this) {
        const move = this.translateX + event.movementX
        if (move <= 0 + this.tipRectWidth / 2) {
          this.translateX = 0 + this.tipRectWidth / 2
        } else if (move >= this.props.canvasWidth - this.tipRectWidth / 2) {
          this.translateX = this.props.canvasWidth - this.tipRectWidth / 2
        } else {
          this.translateX = move
        }
      }
    }
    this.updateTipTime()
  }

  onMousedown(event) {
    event.stopPropagation()
    this.toTopRulerLine(this)
    this.isDashClick = true
    this.root.isRulerDrag = true
    this.root.target = this
  }

  onMouseup(event) {
    this.root.onDragEnd(event)
  }

  onDashMouseDown(event) {
    this.isDashClick = true
  }

  onDashMouseUp(event) {
    if (this.isDashClick) {
      this.removeRulerLine(this)
    }
  }

  drawTip() {
    const width = this.tipRectWidth
    const height = this.tipRectHeight
    const left = this.translateX - width / 2
    // Tip Rect
    const isShow = this.root.isRulerDrag && !this.DateLine.textList.map(t => t.x).includes(this.translateX)
    if (isShow) {
      this.tipRect
        .beginFill(0xEEEEEE)
        .drawRoundedRect(left, 0, width, height, 4)
    } else {
      this.tipRect
        .beginFill(0x424242)
        .drawRect(this.translateX - 2, height, 4, this.DateLine.scaleHeight + this.paddingTop)
    }
    this.tipText.alpha = Number(isShow)
  }

  drawDashed() {
    // Dashed Line
    const lineLength = this.props.canvasHeight - this.tipRectHeight - this.paddingBottom - this.buttonSize * 2
    const dashedLineBase = this.dashedLineIllusory + this.dashedLineSolid
    const dashedLineCount = Math.floor(lineLength / dashedLineBase)
    this.dashedLine.x = this.translateX
    new Array(dashedLineCount).fill(null).forEach((_, index) => {
      this.dashedLine
        .lineStyle(this.dashedLineWidth, 0x424242, 0.5)
        .moveTo(0, this.tipRectHeight + index * dashedLineBase)
        .lineTo(0, this.tipRectHeight + index * dashedLineBase + this.dashedLineSolid)
    })
  }

  drawPlusButton() {
    const lineLength = this.props.canvasHeight - this.tipRectHeight - this.paddingBottom - this.buttonSize * 2
    // Circle Plus Button
    const circleY = this.paddingTop + this.tipRectHeight + lineLength
    const circleSize = this.buttonSize - this.dashedLineWidth * 2
    const plusIconSize = circleSize * 0.8
    this.dashButton.x = this.translateX
    this.dashButton.y = circleY + this.buttonSize
    this.dashButton
      .beginFill(0xffffff, 0.1)
      .lineStyle(this.dashedLineWidth, 0x424242)
      .drawCircle(0, 0, circleSize)
      .moveTo(0 - plusIconSize / 2, 0)
      .lineTo(0 + plusIconSize / 2, 0)
  }

  draw() {
    this.drawTip()
    this.drawDashed()
    this.drawPlusButton()
  }
}