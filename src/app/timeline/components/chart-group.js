import {
  Graphics
} from '@base/pixi'
import BaseContainer from '@base/components/base-container'
import {
  ChartItem,
  Coordinate,
  TimeMatrix
} from './class'


export default class ChartGroup extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      props,
      sort,
      collection
    } = args

    /** @type {import('./timeline-app').TimelineApplicationOptions} */
    this.props = props

    // === Components ===
    const {
      DateLine,
      RulerLine
    } = this.props.getComponents()
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine
    /** @type {import('./ruler-group').default} */
    this.RulerLine = RulerLine

    // console.log('viewStartTime', dateFormat(DateLine.getViewStartTime()));
    // console.log('viewEndTime', dateFormat(DateLine.getViewEndTime()));
    // === Props Attribute ===
    /** @type {number} */
    this.sort = sort
    /** @type {TimeMatrix} */
    this.matrix = null
    /** @type {ICollection<ITimeLimeChartModel>} */
    this.collection = collection

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
    this.chartPaddingY = 2
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
    this.model.data.forEach(model => {
      this.collection.set(model.id, model)
    })
    this.matrix = new TimeMatrix({
      filter: (p) => this.model.id === p.eventTypeId,
      collection: this.collection,
      pixelTime: this.DateLine.getPixelTime(),
      startTime: this.DateLine.getViewStartTime(),
      endTime: this.DateLine.getViewEndTime(),
      isCollapse: this.model.collapse,
    })
    // console.log('matrix', this.matrix);
    this.charItemList = this.model.data.map(m => this.getCharItem(m))
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
            list.push(new Coordinate({
              ...args,
              left: item.left
            }))
          }
          if (this.isShowX(item.left + item.width, item.width)) {
            list.push(new Coordinate({
              ...args,
              left: item.left + item.width
            }))
          }
        } else {
          if (this.isShowX(item.left + item.width / 2, item.width)) {
            list.push(new Coordinate({
              ...args,
              left: item.left + item.width / 2
            }))
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
   * @param {any} model
   * @returns {ChartItem}
   */
  getCharItem(model) {
    return new ChartItem({
      props: this.props,
      color: this.getColor(this.sort),
      type: this.model.name,
      chartHeight: this.chartHeight,
      chartPaddingY: this.chartPaddingY,
      graphics: this.chartGraphics,
      model,
    })
  }

  /**
   * @return {number}
   */
  getCharGroupHeight() {
    return this.matrix.current.length * (this.chartHeight + this.chartPaddingY) * 2 + this.paddingY * 2
  }

  /**
   * @param {number} left
   * @param {number} width
   * @return {boolean}
   */
  isShowX(left, width) {
    // const right = this.DateLine.baseX - this.props.translateX
    // const isRightLimit = left <= right - this.paddingX
    // const isLeftLimit = left + width >= right - this.DateLine.lineWidth + this.paddingX * 2
    // return isRightLimit && isLeftLimit
    return true
  }

  /**
   * @param {number} top
   * @param {number} height
   * @return {boolean}
   */
  isShowY(top, height) {
    const isTopLimit = top >= 0 - this.DateLine.paddingBottom / 2
    const isBottomLimit = top + height <= this.props.canvasHeight - this.getClientTop() - this.RulerLine.plusButtonSize * 3
    return isTopLimit && isBottomLimit
  }

  /**
   * @param {number} t
   */
  update(t) {
    // this.charItemList.forEach(item => {
    //   item.update()
    // })
  }

  drawChartItem() {
    const color = this.getColor(this.sort)
    const chartClientHeight = this.chartHeight * 2 + this.chartPaddingY * 2
    this.matrix.current.forEach((columns, row) => {
      const rowY = row * chartClientHeight
      columns.forEach((type, column) => {
        if (this.isShowY(rowY + this.y, chartClientHeight)) {
          if (type) {
            this.chartGraphics
              // .beginFill(color, 0.1)
              .beginFill(0, 0)
              .lineStyle(0, 0, 0)
              .drawRect(column - this.props.translateX, rowY, 2, chartClientHeight)
          }
          if (type === 1) {
            this.chartGraphics
              .beginFill(color)
              .drawRect(column - this.props.translateX, rowY + this.chartPaddingY + this.chartHeight / 2, 2, this.chartHeight)
          }
          if (type === 2) {
            this.chartGraphics
              .beginFill(color)
              .drawRect(column - this.props.translateX, rowY + this.chartPaddingY, 1, this.chartHeight * 2)
          }
          if (type === 3) {
            this.chartGraphics
              .beginFill(0xBBBBBB)
              .drawRect(column - this.props.translateX, rowY + this.chartPaddingY, 1, this.chartHeight * 2)
          }
        }
      })
    })
  }

  drawDivider() {
    const left = this.paddingX - this.props.translateX
    const top = 0 - this.paddingY
    if (this.sort && this.isShowY(this.y - this.DateLine.paddingBottom / 2, 1)) {
      this.chartGraphics.lineStyle(1, 0xeeeeee)
        .moveTo(left, top)
        .lineTo(left + this.props.canvasWidth - this.paddingX * 2, top)
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
    // this.drawCoordinatesList()
  }
}