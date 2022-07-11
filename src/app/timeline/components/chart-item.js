import {
  getEndPointByTrigonometric
} from '@base/utils'

export default class ChartItem {
  constructor(args) {
    const {
      props,
      color,
      type,
      model,
      matrixInfo,
      chartHeight,
      chartPaddingY,
      graphics
    } = args;

    /** @type {import('./timeline-app').TimelineApplicationOptions} */
    this.props = props

    // === Components ===
    const {
      DateLine,
    } = props.getComponents()
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;
    // /** @type {import('./ruler-group').default} */
    // this.RulerLine = RulerLine;

    // === Props Attribute ===
    /** @type {number} */
    this.color = color
    /** @type {number} */
    this.type = type
    /** @type {ITimeLimeChartModel} */
    this.model = model
    /** @type {import('@base/class').MatrixInfo} */
    this.matrixInfo = matrixInfo
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;
    /** @type {Graphics} */
    this.graphics = graphics;

    // === Base Attribute ===
    /** @type {number} */
    this.left = 0
    /** @type {number} */
    this.top = 0
    /** @type {number} */
    this.width = 0
    /** @type {number} */
    this.height = 0
    /** @type {number} */
    this.chartHeight = chartHeight
    /** @type {number} */
    this.chartPaddingY = chartPaddingY
  }

  getChartLeft() {
    const rangeTime = this.props.baseTime - this.model.startTime
    const diff = Math.floor(rangeTime / this.DateLine.basePixelTime)
    const left = this.DateLine.baseX - diff
    return left
  }

  getChartTop() {
    return this.matrixInfo.row * this.getChartHeigh()
  }

  getChartWidth() {
    const rangeTime = this.model.endTime - this.model.startTime
    const width = Math.floor(rangeTime / this.DateLine.basePixelTime)
    return Math.max(width, this.chartHeight)
  }

  getChartHeigh() {
    return this.chartHeight + this.chartPaddingY * 2
  }

  update(position = {}) {
    const {
      left,
      top,
      width,
      height
    } = position
    this.left = left || this.getChartLeft()
    this.top = top || this.getChartTop()
    this.width = width || this.getChartWidth()
    this.height = height || this.getChartHeigh()
  }

  draw() {
    this.drawChart()
    this.drawCoordinates()
  }

  drawChart() {
    this.graphics
      .beginFill(0, 0)
      .lineStyle(0, 0)
      .drawRect(this.left, this.top, this.width, this.height)
      .beginFill(this.color)
      .drawRect(this.left, this.chartPaddingY + this.top, this.width, this.chartHeight)
  }

  drawCoordinates() {
    if (this.props.isShowCoordinates) {
      const top = this.top + this.height / 2 - this.chartHeight
      if (this.width > this.chartHeight) {
        this.drawCoordinateItem(this.left, top)
        this.drawCoordinateItem(this.left + this.width, top)
      } else {
        this.drawCoordinateItem(this.left + this.width / 2, top)
      }
    }
  }

  /**
   * @param {number} x 
   * @param {number} y
   */
  drawCoordinateItem(x, y) {
    const point1 = getEndPointByTrigonometric(x, y, 115, -11)
    const point2 = getEndPointByTrigonometric(x, y, 65, -11)
    const point3 = getEndPointByTrigonometric(x, y, 90, -13)
    this.graphics
      .beginFill(0x6C6C6C)
      .lineStyle(1, 0x6C6C6C)
      .drawPolygon([
        ...[x, y],
        ...point1,
        ...point2
      ])
      .drawCircle(...point3, 6)
      .beginFill(this.color)
      .lineStyle(1, this.color)
      .drawCircle(...point3, 3)
  }
}