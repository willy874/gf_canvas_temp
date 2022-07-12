import { Graphics } from '@base/pixi'
import BaseContainer from '@base/components/base-container'
import ChartItem from './chart-item'
import { TimeMatrix } from '@base/class'
import Coordinate from './coordinate'

export default class ChartGroup extends BaseContainer {
  constructor(args) {
    super(args)
    const { props, sort, collection } = args

    /** @type {import('./timeline-app').TimelineApplicationOptions} */
    this.props = props

    // === Components ===
    const { DateLine, RulerLine } = this.props.getComponents()
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine
    /** @type {import('./ruler-group').default} */
    this.RulerLine = RulerLine

    // === Props Attribute ===
    /** @type {number} */
    this.sort = sort
    /** @type {TimeMatrix} */
    this.matrix = new TimeMatrix(collection)

    // === Base Attribute ===
    /** @type {ChartItem[]} */
    this.charItemList = []
    /** @type {IEventTypeModel} */
    this.model = this.props.types[sort]
    /** @type {number} */
    this.paddingX = 16
    /** @type {number} */
    this.paddingY = 8
    /** @type {number} */
    this.chartHeight = 2
    /** @type {number} */
    this.chartPaddingY = 4
    /** @type {Coordinate[]} */
    this.coordinatesList = []
    /** @type {Graphics} */
    this.chartGraphics = new Graphics()
    /** @type {Graphics} */
    this.coordinatesGraphics = new Graphics()
    this.coordinatesGraphics.interactive = true
    this.coordinatesGraphics.buttonMode = true

    this.create()
  }

  init() {
    this.charItemList = this.getCharItemList(this.model.data)
    this.refreshChildren(this.chartGraphics, this.coordinatesGraphics)
  }

  getCoordinates() {
    const list = []
    this.charItemList.forEach(item => {
      if (this.isShowY(this.y + item.top, item.height)) {
        const top = item.top + item.height / 2 - item.chartHeight
        const args = {
          top,
          eventId: item.model.id,
          graphics: this.coordinatesGraphics,
          color: this.getColor(this.sort),
        }
        if (item.width > item.chartHeight) {
          if (this.isShowX(item.left, item.width)) {
            list.push(new Coordinate({ ...args, left: item.left }))
          }
          if (this.isShowX(item.left + item.width, item.width)) {
            list.push(new Coordinate({ ...args, left: item.left + item.width }))
          }
        } else {
          if (this.isShowX(item.left + item.width / 2, item.width)) {
            list.push(new Coordinate({ ...args, left: item.left + item.width / 2 }))
          }
        }
      }
    })
    return list
  }

  getClientTop() {
    return this.DateLine.y + this.DateLine.textHeight + this.DateLine.scaleHeight + this.props.lineSolidWidth + this.DateLine.paddingBottom
  }

  /**
   * @param {number} index
   * @returns {number}
   */
  getColor(index) {
    return this.props.colors[index % this.props.colors.length]
  }

  /**
   * @param {import('@base/class').ChartModel} model
   * @param {import('@base/class').MatrixInfo} matrixInfo
   * @returns {ChartItem}
   */
  getCharItem(model, matrixInfo) {
    return new ChartItem({
      props: this.props,
      color: this.getColor(this.sort),
      type: this.model.name,
      model,
      matrixInfo,
      chartHeight: this.chartHeight,
      chartPaddingY: this.chartPaddingY,
      graphics: this.chartGraphics
    })
  }

  /**
   * @return {number}
   */
  getCharGroupHeight() {
    return this.matrix.current.length * (this.chartHeight + this.chartPaddingY * 2) + this.paddingY * 2
  }

  /**
   * @param {ITimeLimeChartModel[]} list
   * @returns {ChartItem[]}
   */
  getCharItemList(list) {
    return this.matrix.getMappingModel(list).map((matrix, index) => this.getCharItem(list[index], matrix))
  }

  /**
   * @param {number} left
   * @param {number} width
   * @return {boolean}
   */
  isShowX(left, width) {
    const right = this.DateLine.baseX - this.props.translateX
    const isRightLimit = left <= right - this.paddingX
    const isLeftLimit = left + width >= right - this.DateLine.lineWidth + this.paddingX * 2
    return isRightLimit && isLeftLimit
  }

  /**
   * @param {number} top
   * @param {number} height
   * @return {boolean}
   */
  isShowY(top, height) {
    const isTopLimit = top >= 0
    const isBottomLimit = top + height <= this.props.canvasHeight - this.getClientTop() - this.RulerLine.plusButtonSize * 3
    return isTopLimit && isBottomLimit
  }

  /**
   * @param {number} t
   */
  update(t) {
    this.charItemList.forEach(item => {
      item.update()
    })
  }

  drawChartItem() {
    this.charItemList.forEach(item => {
      if (this.isShowX(this.x + item.left, item.width) && this.isShowY(this.y + item.top, item.height)) {
        item.draw()
      }
    })
  }

  drawDivider() {
    const lineDiff = 0 - this.paddingY
    if (this.sort && this.isShowY(this.y + lineDiff, 1)) {
      this.chartGraphics.lineStyle(1, 0xeeeeee)
      this.chartGraphics.moveTo(this.paddingX, lineDiff)
      this.chartGraphics.lineTo(this.props.canvasWidth - this.paddingX * 2, lineDiff)
    }
  }

  drawCoordinatesList() {
    if (this.props.isShowCoordinates) {
      this.coordinatesList = this.getCoordinates().map(item => item.drawCoordinateItem())
    }
  }

  draw() {
    this.drawDivider()
    this.drawChartItem()
    this.drawCoordinatesList()
  }
}
