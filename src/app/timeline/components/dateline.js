import {
  Text,
  Graphics
} from '@base/pixi';
import {
  dateFormat,
  getUnitValue,
  getUnitFormat
} from '@base/utils'
import {
  FontFamily,
  FontSize,
  TimeUnit,
  EventType
} from '@base/enums'
import BaseContainer from '@base/components/base-container'
import DynamicProperties from '@base/components/dynamic-properties'


export default class DateLine extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      isInit,
      canvasWidth,
      canvasHeight,
      fontSize,
      lineSolidWidth,
      textPaddingX,
      textPaddingY,
      unit,
      translateX,
      fontFamily,
    } = args;
    // === Props Attribute
    /** @type {number} */
    this.canvasWidth = canvasWidth;
    /** @type {number} */
    this.canvasHeight = canvasHeight;
    /** @type {number|string} */
    this.unit = unit
    /** @type {number} */
    this.translateX = translateX
    /** @type {number} */
    this.fontSize = fontSize || FontSize.SMALL;
    /** @type {string} */
    this.fontFamily = fontFamily || FontFamily.SANS_SERIF
    /** @type {number} */
    this.lineSolidWidth = lineSolidWidth
    /** @type {number} */
    this.textPaddingX = textPaddingX
    /** @type {number} */
    this.textPaddingY = textPaddingY
    // === Base Attribute
    /** @type {number} */
    this.scaleHeight = 6
    /** @type {number} */
    this.scaleWidth = 2
    /** @type {number} */
    this.subScaleHeight = 4
    /** @type {number} */
    this.subScaleWidth = 1
    /** @type {number[]} */
    this.scaleLeftList = []
    /** @type {number} */
    this.scaleSpaceWidth = 0
    /** @type {number} */
    this.lineWidth = this.canvasWidth - this.x * 2
    /** @type {number} */
    this.minTextWidth = this.getTextWidth('mm:ss', this.fontSize)
    /** @type {number} */
    this.maxTextWidth = this.getTextWidth('YYYY/MM/DD', this.fontSize)
    /** @type {number} */
    this.textWidth = 0
    /** @type {number} 取得每 px 代表的時間長度 */
    this.basePixelTime = this.getPixelTime()
    /** @type {number} */
    this.textTotalWidth = 0
    /** @type {number} */
    this.lineBaseY = 0
    /** @type {number} */
    this.baseX = 0
    /** @type {number} */
    this.baseTime = Date.now()
    /** @type {Text} */
    this.endTimeText = null
    /** @type {number[]} */
    this.dateList = []
    /** @type {number[]} */
    this.textWidthList = []
    /** @type {number[]} */
    this.textLeftList = []
    /** @type {Text[]} */
    this.textList = []
    /** @type {Graphics} */
    this.centerLineGraphics = new Graphics()
    /** @type {IDynamicProperties} */
    this.centerLine = new DynamicProperties({
      origin: this.x
    })
    /** @type {IDynamicProperties} */
    this.scaleLine = new DynamicProperties()
    /** @type {IDynamicProperties} */
    this.subScaleLine = new DynamicProperties()

    // Center Line
    if (isInit) {
      this.centerLine.toTarget(this.x + this.lineWidth / 2, 1000).then(() => {
        this.scaleLine.toTarget(this.scaleHeight, 300).then(() => {
          this.subScaleLine.toTarget(this.subScaleHeight, 300)
        })
      })
    }

    this.event.on(EventType.DRAGMOVE, (e) => this.onDragmove(e))
    this.addChild(this.centerLineGraphics)
    this.addProperties(this.centerLine, this.scaleLine, this.subScaleLine)
    this.create()
  }

  onDragmove(event) {
    const left = this.translateX + event.moveX
    if (left >= 0) {
      this.translateX = left
      this.event.emit(EventType.SCALEMOVE, event)
    }
    this.textUpdate()
  }

  textListDependSync() {
    if (this.textList.length) {
      this.endTimeText = this.textList[0]
      this.textWidthList = this.textList.map(text => text.width)
      this.textWidth = Math.max(...this.textWidthList)
      this.textTotalWidth = this.textList.reduce((acc, text) => acc + text.width + this.textPaddingX * 2, 0)
      this.lineBaseY = Math.max(...this.textList.map(t => t.height)) + this.scaleHeight + this.textPaddingY * 2
    }
  }

  textUpdate() {
    if (this.textTotalWidth - this.lineWidth - this.translateX < 0) {
      this.dateList.push(this.getDateValue(this.dateList.length))
      const index = this.dateList.length - 2
      const text = this.getText(dateFormat(this.dateList[index], 'YYYY/MM/DD HH:mm:ss'), index)
      this.textList.push(text)
      this.addChild(text)
      this.textListDependSync()
    }
    this.textLeftList = this.textList.map((text, index) => this.getTextLeft(text, index))
    this.updateTextsPosition()
    /** 需要實際取位置，所以要先進行文字定位設置 */
    this.scaleLeftList = this.textList.map(text => text.x + text.width / 2)
    this.baseX = this.scaleLeftList[0]
    this.scaleSpaceWidth = this.baseX - this.scaleLeftList[1]
    this.basePixelTime = this.getPixelTime()
  }

  init() {
    this.dateList = this.getDateValueList()
    this.textList = this.dateList.map(time => dateFormat(time, 'YYYY/MM/DD HH:mm:ss')).map((text, index) => this.getText(text, index))
    if (this.dateList.length <= this.textList.length) {
      this.dateList.push(this.getDateValue(this.dateList.length))
    }
    this.textListDependSync()
    this.textUpdate()
    this.refreshText(...this.textList)
  }

  refreshText(...texts) {
    this.removeChildren()
    this.addChild(this.centerLineGraphics, ...texts)
  }

  drawArrowLine() {
    const graphics = this.centerLineGraphics
    // centerLine
    graphics.lineStyle(this.lineSolidWidth)
    graphics.moveTo(0, this.lineBaseY)
    graphics.lineTo(this.centerLine.status, this.lineBaseY)
    graphics.moveTo(this.lineWidth, this.lineBaseY)
    graphics.lineTo(this.lineWidth - this.centerLine.status, this.lineBaseY)
    // scaleLine
    this.textList.forEach(text => {
      const left = text.x + text.width / 2
      graphics.lineStyle(this.scaleWidth)
      graphics.moveTo(left, this.lineBaseY)
      graphics.lineTo(left, this.lineBaseY - this.scaleLine.status)
      const subLeft = left - this.textWidth / 2 - this.textPaddingX
      graphics.lineStyle(this.subScaleWidth)
      graphics.moveTo(subLeft, this.lineBaseY)
      graphics.lineTo(subLeft, this.lineBaseY - this.subScaleLine.status)
    })
  }

  /**
   * @param {number} t 
   */
  update(t) {
    this.updateTextsPosition()
  }

  draw() {
    this.drawArrowLine()
  }

  /**
   * @dependency
   * ```
   * unit, scaleSpaceWidth
   * ```
   * @returns {number}
   */
  getPixelTime() {
    return getUnitValue(this.unit) / this.scaleSpaceWidth
  }

  /**
   * @dependency
   * ```
   * textList, textPaddingY
   * ```
   */
  updateTextsPosition() {
    this.textLeftList.forEach((left, index) => {
      const text = this.textList[index]
      text.x = left
      text.y = this.textPaddingY
    })
  }

  /**
   * @param {Text} text 
   * @param {number} index 
   * @returns {number}
   * @dependency
   * ```
   * textWidth, textPaddingX, lineWidth, translateX
   * ```
   */
  getTextLeft(text, index) {
    const blockWidth = this.textWidth + this.textPaddingX * 2
    const diffCenter = (blockWidth - text.width) / 2
    return this.lineWidth - blockWidth - (blockWidth * index) + diffCenter + this.translateX
  }

  /**
   * @param {string} font 
   * @param {number} fontSize 
   * @returns {number}
   * @dependency
   * ```
   * fontFamily, textPaddingX
   * ```
   */
  getTextWidth(font, fontSize) {
    const text = new Text(font, {
      fontFamily: this.fontFamily,
      fontSize,
    })
    return text.width + this.textPaddingX * 2
  }

  /**
   * @returns {number[]}
   * @dependency
   * ```
   * lineWidth, minTextWidth, baseTime, unit
   * ```
   */
  getDateValueList() {
    const block = Math.floor(this.lineWidth / this.minTextWidth) + 1
    return new Array(block).fill(null).map((_, index) => this.getDateValue(index))
  }

  /**
   * @param {number} index 
   * @returns {number}
   * @dependency
   * ```
   * unit, baseTime
   * ```
   */
  getDateValue(index) {
    return this.baseTime - (getUnitValue(this.unit) * index)
  }

  /**
   * @param {string} text 
   * @param {number} index 
   * @returns {Text}
   * @dependency
   * ```
   * unit, dateList, fontFamily, fontSize
   * ```
   */
  getText(text, index) {
    const unit = getUnitValue(this.unit)
    const format = getUnitFormat(this.unit)
    const current = this.dateList[index]
    const prev = this.dateList[index - 1]
    const next = this.dateList[index + 1]
    const isLast = !prev
    const isFirst = !next
    if (isLast || isFirst) {
      return new Text(dateFormat(text, format), {
        fontWeight: '400',
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        align: 'center'
      })
    }
    if (unit <= getUnitValue(TimeUnit.SECOND) && new Date(current).getHours() !== new Date(next).getHours()) {
      return new Text(dateFormat(text, 'HH:mm:ss'), {
        fontWeight: '700',
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        align: 'center'
      })
    }
    if (unit <= getUnitValue(TimeUnit.DAY) && new Date(current).getDay() !== new Date(next).getDay()) {
      return new Text(dateFormat(text, 'MM/DD'), {
        fontWeight: '700',
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        align: 'center'
      })
    }
    if (new Date(current).getFullYear() !== new Date(next).getFullYear()) {
      return new Text(dateFormat(text, 'YYYY/MM'), {
        fontWeight: '700',
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        align: 'center'
      })
    }
    return new Text(dateFormat(text, format), {
      fontWeight: '400',
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      align: 'center'
    })
  }
}