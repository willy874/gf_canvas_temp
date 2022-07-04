import {
  Graphics,
} from '@base/pixi';
import {
  easeInSine
} from '@base/utils';
import BaseContainer from './base-container'
import DynamicProperties from './dynamic-properties'


export default class TimeLimeChartItem extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      startTime,
      endTime,
      x,
      y,
      baseWidth,
      baseHeight,
      model,
      color,
      timeMatrix,
      startX,
      endX,
    } = args;

    this.model = model
    this.startTime = startTime
    this.endTime = endTime
    this.x = x
    this.y = y
    this.baseWidth = baseWidth
    this.baseHeight = baseHeight
    this.color = color
    this.timeMatrix = timeMatrix
    this.paddingBottom = 4
    this.basePixelTime = (endTime - startTime) / (endX - startX)

    this.graphics = new Graphics()
    this.widthInfo = new DynamicProperties({
      current: this.graphics,
      target: this.getChartWidth(),
      duration: 1000,
      timingFunction: easeInSine,
    })
    this.heightInfo = new DynamicProperties({
      current: this.graphics,
      status: 2,
    })
    this.leftInfo = new DynamicProperties({
      current: this.graphics,
      status: this.getChartLeft(),
    })
    this.topInfo = new DynamicProperties({
      current: this.graphics,
      status: this.getChartTop(),
    })
    this.addChild(this.graphics)
  }

  getCurrentBoxInfo() {
    return {
      top: this.topInfo.status,
      left: this.leftInfo.status,
      width: this.widthInfo.status,
      height: this.heightInfo.status,
    }
  }

  getChartWidth() {
    const rangeTime = this.model.endTime - this.model.startTime
    return Math.floor(rangeTime / this.basePixelTime)
  }

  getChartLeft() {
    const rangeTime = this.model.startTime - this.startTime
    return Math.floor(rangeTime / this.basePixelTime)
  }

  getChartTop() {
    const modelData = this.timeMatrix.modelInfo.get(this.model.id)
    const index = modelData.row
    return index * this.heightInfo.status + index * this.paddingBottom
  }

  drawChart() {
    const current = this.graphics
    current.beginFill(this.color, 1)
    current.drawRoundedRect(this.leftInfo.status, this.topInfo.status, this.widthInfo.status, this.heightInfo.status, 16)
  }

  /**
   * @param {number} t 
   */
  update(t) {
    this.widthInfo.updateDate(t)
  }

  draw() {
    this.drawChart()
  }
}