import {
  Text,
  Graphics
} from '@base/pixi';
import {
  dateFormat,
} from '@base/utils'
import {
  FontFamily,
  FontSize,
  TimeUnit,
  EventType
} from '@base/enums'
import BaseContainer from '@base/components/base-container'
import DynamicProperties from './dynamic-properties'


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
      translateY,
      fontFamily,
      event
    } = args;
    // === Props Attribute
    /** @type {number} */
    this.canvasWidth = canvasWidth;
    /** @type {number} */
    this.canvasHeight = canvasHeight;
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
    /** @type {number|string} */
    this.unit = unit
    /** @type {number} */
    this.translateX = translateX
    /** @type {number} */
    this.translateY = translateY
    /** @type {import('eventemitter2').EventEmitter2} */
    this.event = event
    // === Base Attribute
    /** @type {number} */
    this.scaleHeight = 6
    /** @type {number} */
    this.lineWidth = this.canvasWidth - this.x * 2
    /** @type {number} */
    this.minTextWidth = this.getTextWidth('mm:ss', this.fontSize)
    /** @type {number} */
    this.maxTextWidth = this.getTextWidth('YYYY/MM/DD', this.fontSize)
    /** @type {number} */
    this.maxTextHeight = this.getTextHeight('YYYY/MM/DD\nHH:mm:ss', this.fontSize)
    /** @type {number} */
    this.textWidth = 0
    /** @type {number} */
    this.textTotalWidth = 0
    /** @type {number} */
    this.lineBaseY = 0
    /** @type {number} */
    this.baseStartX = 0
    /** @type {number} */
    this.baseEndX = 0
    /** @type {number} */
    this.startTime = 0
    /** @type {number} */
    this.endTime = 0
    /** @type {Text} */
    this.startTimeText = null
    /** @type {Text} */
    this.endTimeText = null
    /** @type {Text[]} */
    this.textList = []
    /** @type {Text[]} */
    this.reverseTextList = []
    /** @type {Graphics} */
    this.centerLineGraphics = new Graphics()
    /** @type {IDynamicProperties} */
    this.centerLine = new DynamicProperties({
      origin: this.x
    })
    /** @type {IDynamicProperties} */
    this.scaleLine = new DynamicProperties()

    // Center Line
    if (isInit) {
      this.centerLine.toTarget(this.x + this.lineWidth / 2, 1000).then(() => {
        this.scaleLine.toTarget(this.scaleHeight, 300)
      })
    }

    this.event.on(EventType.DRAGMOVE, (e) => this.onDragmove(e))
    this.addChild(this.centerLineGraphics)
    this.create()
  }

  onDragmove(event) {
    if (this.translateX + event.moveX >= 0) {
      this.translateX = this.translateX + event.moveX
    }
    this.textUpdate()
  }

  textUpdate() {
    if (this.textTotalWidth - this.lineWidth - this.translateX < 0) {
      this.dateList.push(this.getDateValue(this.dateList.length))
      const index = this.dateList.length - 2
      const text = this.getText(dateFormat(this.dateList[index], 'YYYY/MM/DD HH:mm:ss'), index)
      this.textList.push(text)
      this.addChild(text)
      this.textTotalWidth = this.textList.reduce((acc, text) => acc + text.width + this.textPaddingX * 2, 0)
    }
  }

  init() {
    this.endTime = Date.now()
    this.dateList = this.getDateValueList()
    this.textList = this.dateList.map(time => dateFormat(time, 'YYYY/MM/DD HH:mm:ss')).map((text, index) => this.getText(text, index))
    this.dateList.push(this.getDateValue(this.dateList.length))
    const textWidthList = this.textList.map(text => text.width)
    this.textWidth = textWidthList.length ? Math.max(...textWidthList) : this.minTextWidth
    this.textTotalWidth = this.textList.reduce((acc, text) => acc + text.width + this.textPaddingX * 2, 0)
    this.textUpdate()
    if (this.textList.length) {
      this.lineBaseY = Math.max(...this.textList.map(t => t.height)) + this.scaleHeight + this.textPaddingY * 2
    } else {
      this.lineBaseY = this.scaleHeight + this.textPaddingY * 2
    }
    this.baseStartX = this.textWidth - this.textWidth / 2
    this.baseEndX = this.baseStartX + this.textWidth * (this.textList.length - 1)
    this.refreshText(...this.textList)
  }

  refreshText(...texts) {
    this.removeChildren()
    this.addChild(this.centerLineGraphics, ...texts)
  }

  drawArrowLine() {
    const graphics = this.centerLineGraphics
    graphics.lineStyle(this.lineSolidWidth)

    graphics.moveTo(0, this.lineBaseY)
    graphics.lineTo(this.centerLine.status, this.lineBaseY)

    graphics.moveTo(this.lineWidth, this.lineBaseY)
    graphics.lineTo(this.lineWidth - this.centerLine.status, this.lineBaseY)

    this.textList.forEach(text => {
      const left = text.x + text.width / 2
      graphics.moveTo(left, this.lineBaseY)
      graphics.lineTo(left, this.lineBaseY - this.scaleLine.status)
    })
  }

  /**
   * @param {number} t 
   */
  update(t) {
    this.textList.forEach((text, index) => {
      const blockWidth = this.textWidth + this.textPaddingX * 2
      const diffCenter = (blockWidth - text.width) / 2
      text.x = this.lineWidth - blockWidth - (blockWidth * index) + diffCenter + this.translateX
      text.y = this.textPaddingY
    })
    this.centerLine.updateDate(t)
    this.scaleLine.updateDate(t)
  }

  draw() {
    this.drawArrowLine()
  }

  getTextWidth(font, fontSize) {
    const text = new Text(font, {
      fontFamily: this.fontFamily,
      fontSize,
    })
    return text.width + this.textPaddingX * 2
  }

  getTextHeight(font, fontSize) {
    const text = new Text(font, {
      fontFamily: this.fontFamily,
      fontSize,
    })
    return text.height + this.textPaddingY * 2
  }

  getDateValueList() {
    const block = Math.floor(this.lineWidth / this.minTextWidth) + 1
    return new Array(block).fill(null).map((_, index) => this.getDateValue(index))
  }

  getDateValue(index) {
    return this.endTime - (this.getUnitValue(this.unit) * index)
  }

  getUnitValue(unit) {
    const seconds = 1000
    const minute = 1000 * 60
    const hour = 1000 * 60 * 60
    const day = 1000 * 60 * 60 * 24
    switch (unit) {
      case TimeUnit.SECOND:
        return seconds
      case TimeUnit.MINUTE:
        return minute
      case TimeUnit.HALF_HOUR:
        return minute * 30
      case TimeUnit.HOUR:
        return hour
      case TimeUnit.HOUR12:
        return hour * 12
      case TimeUnit.DAY:
        return day
      case TimeUnit.DAY3:
        return day * 3
      case TimeUnit.WEEK:
        return day * 7
      case TimeUnit.HALF_MONTH:
        return day * 15
      case TimeUnit.MONTH:
        return day * 30
      case TimeUnit.QUARTER:
        return day * 90
      default:
        return NaN
    }
  }

  getUnitFormat(unit) {
    switch (unit) {
      case TimeUnit.SECOND:
        return 'mm:ss'
      case TimeUnit.MINUTE:
        return 'HH:mm'
      case TimeUnit.HALF_HOUR:
        return 'HH:mm'
      case TimeUnit.HOUR:
        return 'HH:mm'
      case TimeUnit.HOUR12:
        return 'MM/DD HH:mm'
      case TimeUnit.DAY:
        return 'MM/DD'
      case TimeUnit.DAY3:
        return 'MM/DD'
      case TimeUnit.WEEK:
        return 'MM/DD'
      case TimeUnit.HALF_MONTH:
        return 'MM/DD'
      case TimeUnit.MONTH:
        return 'YYYY/MM'
      case TimeUnit.QUARTER:
        return 'YYYY/MM'
      default:
        return 'YYYY/MM/DD HH:mm:ss'
    }
  }


  /**
   * @param {string} text 
   * @param {number} index 
   * @returns 
   */
  getText(text, index) {
    const unit = this.getUnitValue(this.unit)
    const format = this.getUnitFormat(this.unit)
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
    if (unit <= this.getUnitValue(TimeUnit.SECOND) && new Date(current).getHours() !== new Date(next).getHours()) {
      return new Text(dateFormat(text, 'HH:mm:ss'), {
        fontWeight: '700',
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        align: 'center'
      })
    }
    if (unit <= this.getUnitValue(TimeUnit.DAY) && new Date(current).getDay() !== new Date(next).getDay()) {
      return new Text(dateFormat(text, 'MM/DD'), {
        fontWeight: '700',
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        align: 'center'
      })
    }
    if (new Date(current).getFullYear() !== new Date(next).getFullYear()) {
      return new Text(dateFormat(text, 'YYYY/MM/DD'), {
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