import {
  Graphics,
  Text
} from '@base/pixi';
import {
  dateFormat,
  easeInSine,
  getTextWidth,
  getEndPointByTrigonometric
} from '@base/utils'
import {
  FontFamily,
} from '@base/enums'
import BaseGraphics from './base-graphics'

export default class DateLine extends BaseGraphics {
  constructor(args) {
    super()
    const {
      startTime,
      endTime,
      baseX,
      baseY,
      baseWidth,
      baseHeight,
      fontSize,
      lineSolidWidth,
      textHorizontalSpacing,
      textVerticalSpacing
    } = args;

    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    this.fontSize = fontSize;
    this.lineSolidWidth = lineSolidWidth

    this.textHorizontalSpacing = textHorizontalSpacing
    this.textVerticalSpacing = textVerticalSpacing

    // Computed
    this.lineBaseY = this.baseY + this.fontSize + this.lineSolidWidth + this.textVerticalSpacing
    this.lineWidth = this.baseWidth - this.baseX * 2

    // Children
    // Start Time Text
    this.startTimeText = new Text('', {
      fontWeight: '400',
      fontFamily: FontFamily.SANS_SERIF,
      fontSize: this.fontSize,
    })
    this.setStartTime(startTime)
    // End Time Text
    this.endTimeText = new Text('', {
      fontWeight: '400',
      fontFamily: FontFamily.SANS_SERIF,
      fontSize: this.fontSize,
    })
    this.setEndTime(endTime)
    // Center Line
    this.centerLine = {
      current: new Graphics(),
      status: 0,
      target: 0,
      origin: this.baseX,
      duration: 1000,
      time: 0,
      timingFunction: easeInSine
    }

    this.children.push(this.centerLine.current, this.startTimeText, this.endTimeText)
  }

  /**
   * @param {number} time
   */
  setStartTime(time) {
    this.startTime = time
    this.startTimeText.text = dateFormat(time, 'YYYY/MM/DD')
    this.startTimeText.x = this.baseX + this.textHorizontalSpacing
    this.startTimeText.y = this.baseY
  }

  /**
   * @param {number} time
   */
  setEndTime(time) {
    this.endTime = time
    this.endTimeText.text = dateFormat(time, 'YYYY/MM/DD')
    const endTimeTextWidth = getTextWidth(this.endTimeText.text, `400 ${this.fontSize}px ${FontFamily.SANS_SERIF}`)
    this.endTimeText.x = this.baseX + this.lineWidth - endTimeTextWidth - this.textHorizontalSpacing
    this.endTimeText.y = this.baseY
  }

  drawArrow() {
    const current = this.centerLine.current
    current.lineStyle(this.lineSolidWidth)
    current.moveTo(this.baseX, this.lineBaseY)
    const leftPoint = getEndPointByTrigonometric(this.baseX, this.lineBaseY, -35, 15)
    current.lineTo(leftPoint.x, leftPoint.y)
    current.moveTo(this.baseX + this.lineWidth, this.lineBaseY)
    const rightPoint = getEndPointByTrigonometric(this.baseX + this.lineWidth, this.lineBaseY, -145, 15)
    current.lineTo(rightPoint.x, rightPoint.y)
    this.centerLine.target = this.lineBaseY + this.lineWidth / 2
  }

  drawArrowLine() {
    const current = this.centerLine.current
    current.lineStyle(this.lineSolidWidth)
    current.moveTo(this.baseX, this.lineBaseY)
    current.lineTo(this.centerLine.status, this.lineBaseY)
    current.moveTo(this.baseX + this.lineWidth, this.lineBaseY)
    current.lineTo(this.lineWidth - this.centerLine.status, this.lineBaseY)
  }

  /**
   * @param {number} t 
   */
  updateData(t) {
    this.updateGraphics(this.centerLine, t)
  }

  draw() {
    this.drawArrow()
    this.drawArrowLine()
  }
}

/**
 * @todo 刻度的計算方式？
 * @todo 中間刻度的文字呈現
 * @todo 日期格格式與樣式
 */