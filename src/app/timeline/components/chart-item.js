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
    super(args)
    const {
      startTime,
      endTime,
      baseX,
      baseY,
      baseWidth,
      baseHeight,
      model,
      color,
      modelDataCollection
    } = args;

    this.model = model
    this.startTime = startTime
    this.endTime = endTime
    this.baseX = baseX
    this.baseY = baseY
    this.baseWidth = baseWidth
    this.baseHeight = baseHeight
    this.color = color
    this.modelDataCollection = modelDataCollection
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
      status: 5,
    })
    this.leftInfo = new DynamicProperties({
      current: this.graphics,
      status: this.getChartLeft(),
    })
    this.topInfo = new DynamicProperties({
      current: this.graphics,
      status: this.getChartTop(),
    })
    const children = [this.graphics]
    this.create(children)
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
    return this.baseX + Math.floor(rangeTime / this.basePixelTime)
  }

  getChartTop() {
    const modelData = this.modelDataCollection.get(this.model.id)
    const index = modelData.row
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
  update(t) {
    this.widthInfo.updateGraphics(t)
  }

  draw() {
    this.drawChart()
  }
}