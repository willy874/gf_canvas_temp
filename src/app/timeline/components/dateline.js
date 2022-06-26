import {
  Graphics,
  Text
} from '@base/pixi';
import {
  dateFormat,
  easeInSine,
  getTextWidth
} from '@base/utils'
import BaseGraphics from './base-graphics'
import {
  FontFamily,
  FontSize,
} from '@base/enums'

export default class DateLine extends BaseGraphics {
  constructor(args) {
    super()
    const {
      startTime,
      endTime,
      baseX,
      baseY,
      baseWidth,
      baseHeight
    } = args;

    this.startTime = startTime;
    this.endTime = endTime;
    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;

    /** @enum {string} */
    const TextWeight = '400'

    this.arrowSpacing = 16
    this.lineSolidWidth = 1

    // Computed
    this.lineBaseY = this.baseY + FontSize.SMALL + this.lineSolidWidth
    this.lineWidth = this.baseWidth - this.baseX * 2

    // Children
    // Start Time Text
    const startTimeText = dateFormat(startTime, 'YYYY/MM/DD')
    this.startTimeText = new Text(startTimeText, {
      fontWeight: TextWeight,
      fontFamily: FontFamily.SANS_SERIF,
      fontSize: FontSize.SMALL,
      align: 'left',
    })
    this.startTimeText.x = this.baseX + this.arrowSpacing
    this.startTimeText.y = this.baseY
    // End Time Text
    const endTimeText = dateFormat(endTime, 'YYYY/MM/DD')
    const endTimeTextWidth = getTextWidth(endTimeText, `${TextWeight} ${FontSize.SMALL}px ${FontFamily.SANS_SERIF}`)
    this.endTimeText = new Text(endTimeText, {
      fontWeight: TextWeight,
      fontFamily: FontFamily.SANS_SERIF,
      fontSize: FontSize.SMALL,
      align: 'left',
    })
    this.endTimeText.x = this.baseX + this.lineWidth - endTimeTextWidth - this.arrowSpacing
    this.endTimeText.y = this.baseY
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

    this.children = [this.centerLine.current, this.startTimeText, this.endTimeText]
    this.container.addChild(...this.children)
  }


  drawArrow() {
    const current = this.centerLine.current
    current.lineStyle(this.lineSolidWidth)
    current.moveTo(this.baseX, this.lineBaseY)
    current.lineTo(this.baseX + 10, this.lineBaseY - 5)
    current.moveTo(this.baseX + this.lineWidth, this.lineBaseY)
    current.lineTo(this.baseX + this.lineWidth - 10, this.lineBaseY - 5)
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