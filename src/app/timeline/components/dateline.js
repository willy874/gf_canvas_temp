import {
  Text,
  Graphics
} from '@base/pixi';
import {
  dateFormat,
  dateSubtract,
} from '@base/utils'
import {
  // uniq
} from '@base/utils/lodash'
import {
  FontFamily,
  FontSize,
  TimeUnit
} from '@base/enums'
import BaseContainer from './base-container'
import DynamicProperties from './dynamic-properties'


export default class DateLine extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      x,
      y,
      canvasWidth,
      canvasHeight,
      fontSize,
      lineSolidWidth,
      textPaddingX,
      textPaddingY,
      unit,
      translateX,
      translateY,
      fontFamily
    } = args;
    // === Props Attribute
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
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
    // === Base Attribute
    /** @type {number} */
    this.scaleHeight = 6
    /** @type {number} */
    this.lineWidth = this.canvasWidth - this.x * 2
    /** @type {number} */
    this.textWidth = 0
    /** @type {number} */
    this.headerWidth = 0
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
    this.middleTexts = []
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

    // Center Line
    this.centerLine.toTarget(this.x + this.lineWidth / 2, 1000).then(() => {
      this.scaleLine.toTarget(this.scaleHeight, 300)
    })

    this.addChild(this.centerLineGraphics)
    this.create()
  }

  setAttribute(key, value) {
    if (key === 'x') this.x = value;
    if (key === 'y') this.y = value;
    if (key === 'canvasWidth') this.canvasWidth = value;
    if (key === 'canvasHeight') this.canvasHeight = value;
    if (key === 'lineSolidWidth') this.lineSolidWidth = value
    if (key === 'textPaddingX') this.textPaddingX = value
    if (key === 'textPaddingY') this.textPaddingY = value
    if (key === 'fontSize') this.fontSize = value;
    if (key === 'fontFamily') this.fontFamily = value
    if (key === 'unit') this.unit = value
    if (key === 'translateX') this.translateX = value
    if (key === 'translateY') this.translateY = value
    const initDateTimeDepend = ['textPaddingX', 'textPaddingY', 'fontSize', 'fontFamily', 'unit', 'translateX', 'translateY']
    if (initDateTimeDepend.includes(key)) {
      this.init()
    }
  }

  init() {
    this.endTime = Date.now() + this.translateX
    this.middleTexts = this.getTexts()
    this.startTimeText = this.middleTexts.pop()
    this.endTimeText = this.middleTexts.shift()
    this.textList = [this.startTimeText, ...this.middleTexts.reverse(), this.endTimeText]
    if (this.textList.length) {
      this.lineBaseY = Math.max(...this.textList.map(t => t.height)) + this.scaleHeight + this.textPaddingY * 2
    } else {
      this.lineBaseY = this.scaleHeight + this.textPaddingY * 2
    }
    // 中間日期定位
    this.middleTexts.forEach((text, index) => {
      const startX = this.textPaddingX + this.headerWidth
      const diffCenter = (this.textWidth - text.width) / 2
      text.x = startX + this.textWidth * index + diffCenter
      text.y = this.textPaddingY
    })
    // 結束日期定位
    const lastIndex = this.middleTexts.length - 1
    this.endTimeText.x = this.middleTexts[lastIndex].x + this.textWidth
    this.endTimeText.y = this.textPaddingY
    // 開始日期定位
    this.startTimeText.x = this.middleTexts[0].x - this.startTimeText.width - this.textWidth / 2
    this.startTimeText.y = this.textPaddingY

    this.baseStartX = this.headerWidth - this.textWidth / 2
    this.baseEndX = this.baseStartX + this.textWidth * (this.middleTexts.length + 1)

    this.refreshText(...this.textList)
  }

  refreshText(...texts) {
    this.children.forEach(child => {
      if (child instanceof Text) {
        child.removeChild(child)
      }
    })
    this.addChild(...texts)
  }

  drawArrowLine() {
    const graphics = this.centerLineGraphics
    graphics.lineStyle(this.lineSolidWidth)

    graphics.moveTo(0, this.lineBaseY)
    graphics.lineTo(this.centerLine.status, this.lineBaseY)

    graphics.moveTo(this.lineWidth, this.lineBaseY)
    graphics.lineTo(this.lineWidth - this.centerLine.status, this.lineBaseY)

    this.middleTexts.forEach((text, index, arr) => {
      const left = text.x + text.width / 2
      if (index === 0) {
        const firstLeft = left - this.textWidth
        graphics.moveTo(firstLeft, this.lineBaseY)
        graphics.lineTo(firstLeft, this.lineBaseY - this.scaleLine.status)
      }
      if (index === arr.length - 1) {
        const lastLeft = left + this.textWidth
        graphics.moveTo(lastLeft, this.lineBaseY)
        graphics.lineTo(lastLeft, this.lineBaseY - this.scaleLine.status)
      }
      graphics.moveTo(left, this.lineBaseY)
      graphics.lineTo(left, this.lineBaseY - this.scaleLine.status)
    })


    // graphics.moveTo(this.baseEndX, 0)
    // graphics.lineTo(this.canvasWidth, 0)
  }

  /**
   * @param {number} t 
   */
  update(t) {
    this.centerLine.updateDate(t)
    this.scaleLine.updateDate(t)
  }

  draw() {
    this.drawArrowLine()
  }

  getTextWidth(font, fontSize) {
    const text = new Text(font, {
      fontWeight: '700',
      fontFamily: this.fontFamily,
      fontSize: fontSize + 2,
    })
    return text.width + this.textPaddingX * 2
  }

  getTexts() {
    const minute = 1000 * 60
    const hour = 1000 * 60 * 60
    const day = 1000 * 60 * 60 * 24
    if (this.unit === TimeUnit.HALF_HOUR) {
      return this.getDateTimeTexts(minute * 30, 'MM/DD HH:mm', 'HH:mm')
    }
    if (this.unit === TimeUnit.HOUR) {
      return this.getDateTimeTexts(hour, 'MM/DD HH:mm', 'HH:mm')
    }
    if (this.unit === TimeUnit.HOUR12) {
      return this.getDateTimeTexts(hour * 12, 'YYYY/MM/DD HH:mm', 'HH:mm')
    }
    if (this.unit === TimeUnit.DAY) {
      return this.getDateTimeTexts(day, 'YYYY/MM/DD', 'MM/DD')
    }
    if (this.unit === TimeUnit.DAY3) {
      return this.getDateTimeTexts(day * 3, 'YYYY/MM/DD', 'MM/DD')
    }
    if (this.unit === TimeUnit.WEEK) {
      return this.getDateTimeTexts(day * 7, 'YYYY/MM/DD', 'MM/DD')
    }
    if (this.unit === TimeUnit.HALF_MONTH) {
      return this.getDateTimeTexts(day * 15, 'YYYY/MM/DD', 'MM/DD')
    }
    if (this.unit === TimeUnit.MONTH) {
      return this.getMonthDateTimeTexts(1)
    }
    if (this.unit === TimeUnit.QUARTER) {
      return this.getMonthDateTimeTexts(3)
    }
    const time = Number(this.unit)
    if (time) {
      return this.getDateTimeTexts(time, 'YYYY/MM/DD HH:mm', 'MM/DD HH:mm')
    }
    return []
  }

  /**
   * 
   * @param {number} time 
   * @param {string} headerFormat
   * @param {string} textFormat
   * @returns 
   */
  getDateTimeTexts(time, headerFormat, textFormat) {
    this.headerWidth = this.getTextWidth(headerFormat, this.fontSize + 2)
    this.textWidth = this.getTextWidth(textFormat, this.fontSize)
    const block = Math.floor((this.lineWidth - this.headerWidth * 2) / this.textWidth)
    this.startTime = this.endTime - (block + 2) * time
    let isMonth = false
    let isYear = false
    return new Array(block + 2).fill(null).map((_, index, arr) => {
      const item = this.endTime - index * time
      const prev = this.endTime - index * time - time
      const isLast = arr.length - 1 === index
      if (index === 0 || isLast) {
        return new Text(dateFormat(item, headerFormat), {
          fontWeight: '700',
          fontFamily: this.fontFamily,
          fontSize: this.fontSize + 2,
        })
      }
      if (new Date(item).getDay() !== new Date(prev).getDay()) {
        return new Text(dateFormat(item, 'MM/DD'), {
          fontWeight: isMonth ? '400' : '700',
          fontFamily: this.fontFamily,
          fontSize: this.fontSize,
          align: 'center'
        })
      }
      if (new Date(item).getMonth() !== new Date(prev).getMonth()) {
        isMonth = true
        return new Text(dateFormat(item, 'MM/DD'), {
          fontWeight: isYear ? '400' : '700',
          fontFamily: this.fontFamily,
          fontSize: this.fontSize,
        })
      }
      if (new Date(item).getFullYear() !== new Date(prev).getFullYear()) {
        isYear = true
        return new Text(dateFormat(item, 'YYYY/MM'), {
          fontWeight: '700',
          fontFamily: this.fontFamily,
          fontSize: this.fontSize,
        })
      }
      return new Text(dateFormat(item, textFormat), {
        fontWeight: '400',
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
      })
    })
  }

  getMonthDateTimeTexts(time) {
    this.textWidth = this.getTextWidth('YYYY/MM', this.fontSize)
    this.headerWidth = this.getTextWidth('YYYY/MM', this.fontSize + 2)
    const block = Math.floor((this.lineWidth - this.headerWidth * 2) / this.textWidth)
    this.startTime = dateSubtract(this.endTime, (block + 2) * time, 'month').valueOf()
    return new Array(block + 2).fill(null).map((_, index, arr) => {
      const date = dateSubtract(this.endTime, index * time, 'month')
      if (index === 0 || arr.length - 1 === index) {
        return new Text(dateFormat(date, 'YYYY/MM'), {
          fontWeight: '700',
          fontFamily: this.fontFamily,
          fontSize: this.fontSize + 2,
        })
      }
      if (date.getMonth() === 0) {
        return new Text(dateFormat(date, 'YYYY/MM'), {
          fontWeight: '700',
          fontFamily: this.fontFamily,
          fontSize: this.fontSize,
        })
      }
      return new Text(dateFormat(date, 'YYYY/MM'), {
        fontWeight: '400',
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
      })
    })
  }
}