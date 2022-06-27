import {
  Graphics,
} from '@base/pixi';
import {
  easeInSine
} from '@base/utils';
import BaseGraphics from './base-graphics'
import DynamicProperties from './dynamic-properties'


export default class TimeLimeChartItem extends BaseGraphics {
  constructor(args) {
    super()
    const {
      startTime,
      endTime,
      baseX,
      baseY,
      baseWidth,
      baseHeight,
      model,
      color,
      timeMatrix
    } = args;

    this.model = model
    this.startTime = startTime
    this.endTime = endTime
    this.baseX = baseX
    this.baseY = baseY
    this.baseWidth = baseWidth
    this.baseHeight = baseHeight
    this.color = color
    this.timeMatrix = timeMatrix
    this.paddingBottom = 4

    const effectWidth = this.baseWidth - this.baseX * 2
    const rangeTime = this.endTime - this.startTime
    this.basePixelTime = rangeTime / effectWidth

    this.graphics = new Graphics()
    this.widthInfo = new DynamicProperties({
      current: this.graphics,
      target: this.getChartWidth(),
      duration: 1000,
      timingFunction: easeInSine,
    })
    this.heightInfo = new DynamicProperties({
      current: this.graphics,
      status: 30,
    })
    this.leftInfo = new DynamicProperties({
      current: this.graphics,
      status: this.getChartLeft(),
    })
    this.topInfo = new DynamicProperties({
      current: this.graphics,
      status: this.getChartTop(),
    })
    this.children.push(this.graphics)
  }

  getChartWidth() {
    const rangeTime = this.model.endTime - this.model.startTime
    return Math.floor(rangeTime / this.basePixelTime)
  }

  getChartLeft() {
    const rangeTime = this.model.startTime - this.startTime
    return this.baseX + Math.floor(rangeTime / this.basePixelTime)
  }

  getChartTop() {
    const index = this.timeMatrix.map(p => p.some(t => t === this.model.startTime) && p.some(t => t === this.model.endTime)).indexOf(true)
    return this.baseY + index * this.heightInfo.status + index * this.paddingBottom
  }

  drawChart() {
    const current = this.graphics
    current.beginFill(this.color, 1)
    current.drawRoundedRect(this.leftInfo.status, this.topInfo.status, this.widthInfo.status, this.heightInfo.status, 16)
  }

  /**
   * @param {number} t 
   */
  updateData(t) {
    this.widthInfo.updateGraphics(t)
  }

  draw() {
    this.drawChart()
  }
}