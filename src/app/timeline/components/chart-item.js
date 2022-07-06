import {
  Graphics,
} from '@base/pixi';
import {
  easeInSine,
} from '@base/utils';
// import {
//   EventType
// } from '@base/enums'
import BaseContainer from '@base/components/base-container'
import DynamicProperties from '@base/components/dynamic-properties'

export default class ChartItem extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      isInit,
      color,
      column,
      row,
      matrix,
      startTime,
      endTime,
      title,
      type,
      DateLine
    } = args;
    /** @type {boolean} */
    this.isInit = isInit
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
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;

    /** @type {Graphics} */
    this.graphics = new Graphics()
    this.buttonMode = true
    if (this.isInit) {
      /** @type {IDynamicProperties} */
      this.widthInfo = new DynamicProperties({
        current: this.graphics,
        target: this.getChartWidth(),
        duration: 1000,
        timingFunction: easeInSine,
      })
    } else {
      /** @type {IDynamicProperties} */
      this.widthInfo = new DynamicProperties({
        current: this.graphics,
        status: this.getChartWidth(),
      })
    }
    /** @type {IDynamicProperties} */
    this.heightInfo = new DynamicProperties({
      current: this.graphics,
      status: 2,
    })
    /** @type {IDynamicProperties} */
    this.leftInfo = new DynamicProperties({
      current: this.graphics,
      status: this.getChartLeft(),
    })
    /** @type {IDynamicProperties} */
    this.topInfo = new DynamicProperties({
      current: this.graphics,
      status: this.getChartTop(),
    })
    this.create()
    this.addChild(this.graphics)
    // 目前不需要 this.heightInfo, this.leftInfo, this.topInfo
    this.addProperties(this.widthInfo)
    // this.event.on(EventType.SCALEMOVE, (e) => this.onScaledMove(e))
  }

  onScaledMove(event) {

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
    const width = Math.floor(rangeTime / this.DateLine.basePixelTime)
    return Math.max(width, 2)
  }

  getChartLeft() {
    const rangeTime = this.DateLine.baseTime - this.startTime
    const diff = Math.floor(rangeTime / this.DateLine.basePixelTime)
    const left = this.DateLine.baseX - diff
    return left
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

  draw() {
    this.drawChart()
  }
}