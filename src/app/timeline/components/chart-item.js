import {
  Graphics,
} from '@base/pixi';
import {
  easeInSine,
} from '@base/utils';
import BaseContainer from './base-container'
import DynamicProperties from './dynamic-properties'

export default class ChartItem extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      model,
      color,
      column,
      row,
      matrix,
      startTime,
      endTime,
      title,
      type,
      basePixelTime,
      baseStartTime,
      baseEndTime
    } = args;

    this.model = model
    /** @type {number} */
    this.color = color
    /** @type {number} */
    this.column = column
    /** @type {number} */
    this.row = row
    /** @type {string[][]} */
    this.matrix = matrix
    /** @type {number} */
    this.startTime = startTime
    /** @type {number} */
    this.endTime = endTime
    /** @type {string} */
    this.title = title
    /** @type {string} */
    this.type = type
    /** @type {number} */
    this.basePixelTime = basePixelTime
    /** @type {number} */
    this.baseStartTime = baseStartTime;
    /** @type {number} */
    this.baseEndTime = baseEndTime;

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
    this.create()
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
    const rangeTime = this.endTime - this.startTime
    return Math.floor(rangeTime / this.basePixelTime)
  }

  getChartLeft() {
    const baseTime = this.startTime - this.baseStartTime
    return Math.floor(baseTime / this.basePixelTime)
  }

  getChartTop() {
    return this.row * this.heightInfo.status + this.row * 16
  }

  drawChart() {
    const graphics = this.graphics
    graphics.beginFill(0xffffff, 0)
    graphics.drawRect(0, 0, this.widthInfo.status, this.heightInfo.status + 16)
    graphics.beginFill(this.color)
    graphics.drawRect(0, 8, this.widthInfo.status, this.heightInfo.status)
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