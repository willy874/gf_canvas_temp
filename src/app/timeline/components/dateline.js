import {
  Text
} from '@base/pixi';
import {
  dateFormat,
  getTextWidth,
} from '@base/utils'
import {
  FontFamily,
} from '@base/enums'
import BaseGraphics from './base-graphics'
import DynamicProperties from './dynamic-properties'

export default class DateLine extends BaseGraphics {
  constructor(args) {
    super(args)
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
      textVerticalSpacing,
      paddingBottom
    } = args;

    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    this.fontSize = fontSize;
    this.lineSolidWidth = lineSolidWidth
    this.textHorizontalSpacing = textHorizontalSpacing
    this.textVerticalSpacing = textVerticalSpacing
    this.height = fontSize + lineSolidWidth + textVerticalSpacing + paddingBottom

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
    this.centerLine = new DynamicProperties({
      origin: this.baseX,
      duration: 1000,
    })

    const children = [this.centerLine.current, this.startTimeText, this.endTimeText]
    this.create(children)
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
    const graphics = this.centerLine.current
    graphics.lineStyle(this.lineSolidWidth)
    this.centerLine.target = this.lineBaseY + this.lineWidth / 2
  }

  drawArrowLine() {
    const graphics = this.centerLine.current
    graphics.lineStyle(this.lineSolidWidth)
    graphics.moveTo(this.baseX, this.lineBaseY)
    graphics.lineTo(this.centerLine.status, this.lineBaseY)
    graphics.moveTo(this.baseX + this.lineWidth, this.lineBaseY)
    graphics.lineTo(this.lineWidth - this.centerLine.status, this.lineBaseY)
  }

  /**
   * @param {number} t 
   */
  update(t) {
    this.centerLine.updateGraphics(t)
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