import {
  Graphics,
} from '@base/pixi';
// import {
//   EventType
// } from '@base/enums'
import BaseContainer from '@base/components/base-container'
import DynamicProperties from '@base/components/dynamic-properties'
import {
  Coordinate
} from './coordinate';

export default class ChartItem extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      isInit,
      color,
      DateLine,
      model,
      matrixInfo
    } = args;
    const {
      startTime,
      endTime,
      title,
      type,
    } = model
    const {
      column,
      row,
      matrix,
    } = matrixInfo

    // === Props Attribute ===
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

    // === Base Attribute ===
    /** @type {boolean} */
    this.interactive = true
    /** @type {boolean} */
    this.buttonMode = true

    /** @type {Graphics} */
    this.graphics = new Graphics()
    /** @type {IDynamicProperties} */
    this.widthInfo = new DynamicProperties({
      current: this.graphics,
    })
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

    this.startCoordinate = new Coordinate({
      app: this.getApplication(),
      isInit,
      color,
      model,
      currentTime: startTime
    })
    this.endCoordinate = new Coordinate({
      app: this.getApplication(),
      isInit,
      color,
      model,
      currentTime: startTime
    })
    /** @type {IDynamicProperties} */
    this.coordinateTop = new DynamicProperties()

    if (this.isInit) {
      this.widthInfo.toTarget(this.getChartWidth(), 1000).then(() => {
        this.endCoordinate.alpha = 1
        this.startCoordinate.alpha = 1
        this.coordinateTop.toTarget(20, 500)
      })
    } else {
      this.widthInfo.toTarget(this.getChartWidth(), 0)
      this.endCoordinate.alpha = 1
      this.startCoordinate.alpha = 1
      this.coordinateTop.toTarget(20, 0)
    }

    this.create()
    this.addChild(this.graphics, this.startCoordinate, this.endCoordinate)
    // 目前不需要 this.heightInfo, this.leftInfo, this.topInfo
    this.addProperties(this.widthInfo, this.coordinateTop)

    // === Event ===
    this.on('click', (e) => this.onClick(e))
  }

  onClick(event) {

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

  draw() {
    const graphics = this.graphics
    graphics.beginFill(0xffffff, 0)
    graphics.drawRect(0, 0, this.widthInfo.status, this.heightInfo.status + 16)
    graphics.beginFill(this.color)
    graphics.drawRect(0, 8, this.widthInfo.status, this.heightInfo.status)
  }

  update(t) {
    this.startCoordinate.y = -20 + this.coordinateTop.status
    this.endCoordinate.x = this.widthInfo.status
    this.endCoordinate.y = -20 + this.coordinateTop.status
  }
}