import {
  Graphics
} from '@base/pixi';
import {
  getUnitValue,
  getUnitFormat,
  GlobalEvent
} from '@base/utils'
import {
  TimeUnit,
  EventType
} from '@base/enums'
import BaseContainer from '@base/components/base-container'
import DynamicProperties from '@base/components/dynamic-properties'
import {
  TimeText
} from './class'

export default class DateLine extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      props,
    } = args;

    /** @type {TimelineApplicationOptions} */
    this.props = props

    // === Props Attribute ===

    // === Base Attribute ===
    /** @type {number} */
    this.startTime = 0
    /** @type {number} */
    this.startTimeX = 0
    /** @type {number} */
    this.endTime = null
    /** @type {number} */
    this.endTimeX = 0
    /** @type {number} */
    this.basePointIndex = 0
    /** @type {number} */
    this.textWidth = 40
    /** @type {number} */
    this.textHeight = 25
    /** @type {number} */
    this.paddingTop = 0
    /** @type {number} */
    this.paddingBottom = 20
    /** @type {number} */
    this.scaleHeight = 6
    /** @type {number} */
    this.scaleLineWidth = 2
    /** @type {number} */
    this.subScaleHeight = 4
    /** @type {number} */
    this.subScaleLineWidth = 1
    /** @type {number} */
    this.lineBaseY = 0
    /** @type {number} */
    this.clientHeight = 0
    /** @type {number[]} */
    this.dateList = []
    /** @type {TimeText[]} */
    this.textList = []
    /** @type {Graphics} */
    this.centerLineGraphics = new Graphics()
    /** @type {Graphics} */
    this.scaleLineGraphics = new Graphics()
    /** @type {Graphics} */
    this.paddingSpaceGraphics = new Graphics()
    /** @type {IDynamicProperties} */
    this.centerLine = new DynamicProperties({
      origin: this.x
    })
    /** @type {IDynamicProperties} */
    this.scaleLine = new DynamicProperties()
    /** @type {IDynamicProperties} */
    this.subScaleLine = new DynamicProperties()

    // Center Line
    if (this.props.isInit) {
      this.centerLine.toTarget(this.x + this.props.canvasWidth / 2, 1000).then(() => {
        this.scaleLine.toTarget(this.scaleHeight, 300).then(() => {
          this.subScaleLine.toTarget(this.subScaleHeight, 300)
        })
      })
    }

    GlobalEvent.on(EventType.SCALEMOVE, (e) => this.onPointmove(e))
    this.graphicsList = [this.paddingSpaceGraphics, this.centerLineGraphics, this.scaleLineGraphics]
    this.addProperties(this.centerLine, this.scaleLine, this.subScaleLine)
    this.create()
  }

  /**
   * @param {PointerEvent} event 
   */
  onPointmove(event) {
    const left = this.props.translateX + event.movementX
    this.props.translateX = left
    this.textUpdate()
  }

  /**
   * @param {number} t 
   */
  update(t) {
    this.startTimeX = this.getStartLeft()
    this.endTimeX = this.getEndLeft()
    this.updateTextsPosition()
  }

  draw() {
    this.drawArrowLine()
  }

  init() {
    this.dateList = [this.props.baseTime]
    this.insertDateList()
    this.startTime = this.dateList[0]
    this.endTime = this.dateList[this.dateList.length - 1]
    this.textList = this.dateList.map((date, index) => this.getText(date, index))
    this.textUpdate()
    this.refreshText(...this.textList)
  }

  refreshText(...texts) {
    this.removeChildren()
    this.addChild(...this.graphicsList, ...texts)
  }

  drawArrowLine() {
    this.x = this.getStartLeft() + this.props.translateX
    const lineBaseY = this.paddingTop + this.textHeight + this.scaleHeight
    this.centerLineGraphics.x = 0 - this.x
    this.centerLineGraphics.y = lineBaseY
    this.centerLineGraphics
      // centerLine
      .lineStyle(this.props.lineSolidWidth)
      .moveTo(0, 0)
      .lineTo(this.centerLine.status, 0)
      .moveTo(this.props.canvasWidth, 0)
      .lineTo(this.props.canvasWidth - this.centerLine.status, 0)
    this.textList.forEach(text => {
      const left = text.x + text.width / 2
      const subLeft = left - this.textWidth / 2 - this.props.textPaddingX
      this.scaleLineGraphics
        // scaleLine
        .lineStyle(this.scaleLineWidth)
        .moveTo(left, lineBaseY)
        .lineTo(left, lineBaseY - this.scaleLine.status)
        .lineStyle(this.subScaleLineWidth)
        .moveTo(subLeft, lineBaseY)
        .lineTo(subLeft, lineBaseY - this.subScaleLine.status)
    })
  }

  getPixelTime() {
    return getUnitValue(this.props.unit) / this.getScaleWidth()
  }

  getScaleWidth() {
    return this.textWidth + this.props.textPaddingX * 2
  }

  getTotalWidth() {
    return this.textList.length * this.getScaleWidth()
  }

  getClientHeight() {
    return this.y + this.textHeight + this.scaleHeight + this.props.lineSolidWidth + this.paddingBottom
  }

  getStartLeft() {
    const diffSpacing = Math.floor((this.props.baseTime - this.startTime) / this.getPixelTime())
    return 0 - diffSpacing
  }

  getViewStartTime() {
    return this.props.baseTime - this.props.translateX * this.getPixelTime()
  }

  getViewEndTime() {
    return this.props.baseTime - (this.props.translateX - this.props.canvasWidth) * this.getPixelTime()
  }

  getEndLeft() {
    const diffSpacing = Math.floor((this.endTime - this.props.baseTime) / this.getPixelTime())
    return diffSpacing
  }

  getScaleBlock() {
    return Math.floor(this.props.canvasWidth / this.getScaleWidth()) + 1
  }

  prependText() {
    const date = this.textList[0].date - this.getPixelTime() * this.getScaleWidth()
    this.startTime = date
    this.dateList.unshift(date)
    const text = this.getText(date, 0)
    this.textList.unshift(text)
    this.addChild(text)
  }

  appendText() {
    const last = this.textList.length - 1
    const date = this.textList[last].date + this.getPixelTime() * this.getScaleWidth()
    this.endTime = date
    this.dateList.push(date)
    const text = this.getText(date, last)
    this.textList.push(text)
    this.addChild(text)
  }

  addText(start, end) {
    if (end < 0) {
      this.appendText()
    }
    if (start > 0) {
      this.prependText()
    }
  }

  getBaseToStartWidth() {
    return this.getStartLeft() + this.props.translateX
  }

  getBaseToEndWidth() {
    const initDiff = this.props.canvasWidth - this.getScaleWidth() * 2
    return this.getEndLeft() - initDiff + this.props.translateX
  }

  textUpdate() {
    const start = this.getBaseToStartWidth()
    const end = this.getBaseToEndWidth()
    this.addText(start, end)
    this.basePointIndex = this.dateList.findIndex(t => t === this.props.baseTime)
    this.updateTextsPosition()
  }

  /**
   * @dependency
   * ```
   * textList, textPaddingY
   * ```
   */
  updateTextsPosition() {
    this.textList.forEach((text) => {
      const currentIndex = this.dateList.indexOf(text.date)
      text.setPosition(currentIndex * this.getScaleWidth(), this.paddingTop)
    })
  }

  insertDateList() {
    if (this.basePointIndex - this.getScaleBlock() < 0) {
      this.dateList.unshift(this.dateList[0] - this.getPixelTime() * this.getScaleWidth())
      this.basePointIndex = this.dateList.findIndex(t => t === this.props.baseTime)
      this.insertDateList()
    }
  }

  /**
   * @param {number} date 
   * @param {number} index 
   * @returns {TimeText}
   * @dependency
   * ```
   * unit, dateList
   * ```
   */
  getText(date, index) {
    const unit = getUnitValue(this.props.unit)
    const format = getUnitFormat(this.props.unit)
    const current = this.dateList[index]
    // const next = current + this.getPixelTime() * this.getScaleWidth()
    const prev = current - this.getPixelTime() * this.getScaleWidth()
    if (unit <= getUnitValue(TimeUnit.SECOND) && new Date(current).getHours() !== new Date(prev).getHours()) {
      return new TimeText({
        props: this.props,
        date,
        index,
        format: 'HH:mm:ss',
        fontWeight: '700',
      })
    }
    if (unit <= getUnitValue(TimeUnit.DAY) && new Date(current).getDay() !== new Date(prev).getDay()) {
      return new TimeText({
        props: this.props,
        date,
        index,
        format: 'MM/DD',
        fontWeight: '700',
      })
    }
    if (new Date(current).getFullYear() !== new Date(prev).getFullYear()) {
      return new TimeText({
        props: this.props,
        date,
        format: 'YYYY/MM',
        index,
        fontWeight: '700',
      })
    }
    return new TimeText({
      props: this.props,
      date,
      format,
      index,
      fontWeight: '400',
    })
  }
}