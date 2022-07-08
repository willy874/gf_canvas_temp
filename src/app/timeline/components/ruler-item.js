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
      DateLine,
      translateX,
      // appendRulerLine,
      removeRulerLine,
      toTopRulerLine
    } = args

    // === Props Attribute ===
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine
    /** @type {number} */
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
    this.dashedLineLeft = 0
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
     * Plus Button
     * @type {Graphics} 
     */
    this.plusButton = new Graphics()
    // this.plusButton.interactive = true
    // this.plusButton.on(EventType.MOUSEDOWN, (e) => this.onPlusMouseDown(e))
    // this.plusButton.on(EventType.MOUSEUP, (e) => this.onPlusMouseUp(e))
    /** 
     * Drag Button
     * @type {Graphics} 
     */
    this.dragButton = new Graphics()
    this.dragButton.interactive = true
    this.dragButton.on(EventType.MOUSEDOWN, (e) => this.onDragMouseDown(e))
    this.dragButton.on(EventType.MOUSEUP, (e) => this.onDragMouseUp(e))
    /** 
     * Dash Button
     * @type {Graphics} 
     */
    this.dashButton = new Graphics()
    this.dashButton.interactive = true
    this.dashButton.on(EventType.MOUSEDOWN, (e) => this.onDashMouseDown(e))
    this.dashButton.on(EventType.MOUSEUP, (e) => this.onDashMouseUp(e))
    /** 
     * Tip Text
     * @type {Text} 
     */
    this.tipText = new Text('', {
      fontWeight: '400',
      fontFamily: this.DateLine.fontFamily,
      fontSize: this.DateLine.fontSize,
      align: 'center'
    })

    this.addChild(this.tipRect, this.dashedLine, this.plusButton, this.dragButton, this.dashButton, this.tipText)
    this.create()
  }

  updateTipTime() {
    this.dashedLineLeft = this.translateX
    this.currentTime = this.DateLine.baseTime - this.DateLine.basePixelTime * (this.DateLine.baseX - this.dashedLineLeft)
    this.tipText.text = dateFormat(this.currentTime, 'YYYY/MM/DD HH:mm:ss')
  }

  init() {
    this.updateTipTime()
    this.tipRectWidth = this.tipPaddingX * 2 + this.tipText.width
    this.translateX = this.tipRectWidth / 2
  }

  update(t) {
    this.updateTipTime()
    // Tip Text
    this.tipRectHeight = this.tipPaddingY * 2 + this.tipText.height
    this.tipRectWidth = this.tipPaddingX * 2 + this.tipText.width
    this.tipText.x = this.translateX + this.tipPaddingX - this.tipRectWidth / 2
    this.tipText.y = this.tipPaddingY
    this.dashedLineLeft = this.translateX
  }

  /**
   * @param {PointerEvent | DragEvent | TouchEvent} event 
   */
  onPointmove(event) {
    // this.isPlusClick = false
    this.isDashClick = false
    if (event instanceof PointerEvent || event instanceof DragEvent) {
      if (this.root.target === this) {
        const move = this.translateX + event.movementX
        if (move <= 0 + this.tipRectWidth / 2) {
          this.translateX = 0 + this.tipRectWidth / 2
        } else if (move >= this.canvasWidth - this.tipRectWidth / 2) {
          this.translateX = this.canvasWidth - this.tipRectWidth / 2
        } else {
          this.translateX = move
        }
      }
    }
  }

  onMousedown(event) {
    event.stopPropagation()
    this.toTopRulerLine(this)
    // this.isPlusClick = true
    this.isDashClick = true
    this.root.isRulerDrag = true
    this.root.target = this
    this.root.onDragStart(event)
  }

  onMouseup(event) {
    this.root.onDragEnd(event)
  }

  onDragMouseDown(event) {}

  onDragMouseUp(event) {
    this.root.onDragEnd(event)
  }

  // onPlusMouseDown(event) {
  //   this.isPlusClick = true
  // }

  // onPlusMouseUp(event) {
  //   if (this.isPlusClick) {
  //     this.appendRulerLine()
  //   }
  // }

  onDashMouseDown(event) {
    this.isDashClick = true
  }

  onDashMouseUp(event) {
    if (this.isDashClick) {
      this.removeRulerLine(this)
    }
  }

  draw() {
    const width = this.tipRectWidth
    const height = this.tipRectHeight
    const left = this.translateX - width / 2
    // Tip Rect
    const isShow = this.root.isRulerDrag && !this.DateLine.scaleLeftList.includes(this.dashedLineLeft)
    if (isShow) {
      this.tipRect
        .beginFill(0xEEEEEE)
        .drawRoundedRect(left, 0, width, height, 4)
    } else {
      this.tipRect
        .beginFill(0x424242)
        .drawRect(this.dashedLineLeft - 2, height, 4, this.DateLine.scaleHeight + this.paddingTop)
    }
    this.tipText.alpha = Number(isShow)
    // Dashed Line
    const lineLength = this.canvasHeight - height - this.paddingBottom - this.buttonSize * 3
    const dashedLineBase = this.dashedLineIllusory + this.dashedLineSolid
    const dashedLineCount = Math.floor(lineLength / dashedLineBase)
    new Array(dashedLineCount).fill(null).forEach((_, index) => {
      this.dashedLine
        // 
        .lineStyle(this.dashedLineWidth, 0x424242, 0.5)
        .moveTo(this.dashedLineLeft, height + index * dashedLineBase)
        .lineTo(this.dashedLineLeft, height + index * dashedLineBase + this.dashedLineSolid)
    })
    // Circle Plus Button
    const circleX = this.dashedLineLeft
    const circleY = this.paddingTop + height + lineLength
    const circleSize = this.buttonSize - this.dashedLineWidth * 2
    const plusIconSize = circleSize * 0.8
    const dotSize = this.buttonSize * 0.25
    this.dragButton
      // 
      .beginFill(0xffffff, 0.1)
      .lineStyle(this.dashedLineWidth, 0x424242)
      .drawCircle(circleX, circleY, circleSize)
      .beginFill(0x424242)
      .drawCircle(circleX + dotSize, circleY + dotSize, dotSize / 2)
      .drawCircle(circleX + dotSize, circleY - dotSize, dotSize / 2)
      .drawCircle(circleX - dotSize, circleY + dotSize, dotSize / 2)
      .drawCircle(circleX - dotSize, circleY - dotSize, dotSize / 2)
    // this.plusButton
    //   .beginFill(0xffffff, 0.1)
    //   .lineStyle(this.dashedLineWidth, 0x424242)
    //   .drawCircle(circleX, circleY, circleSize)
    //   .moveTo(circleX - plusIconSize / 2, circleY)
    //   .lineTo(circleX + plusIconSize / 2, circleY)
    //   .moveTo(circleX, circleY - plusIconSize / 2)
    //   .lineTo(circleX, circleY + plusIconSize / 2)
    // Circle Dash Button
    const circleY2 = circleY + this.buttonSize * 1.5 + this.dashedLineWidth * 2
    this.dashButton
      // 
      .beginFill(0xffffff, 0.1)
      .lineStyle(this.dashedLineWidth, 0x424242)
      .drawCircle(circleX, circleY2, circleSize)
      .moveTo(circleX - plusIconSize / 2, circleY2)
      .lineTo(circleX + plusIconSize / 2, circleY2)
  }
}