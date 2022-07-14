import {
  Graphics
} from '@base/pixi'
import BaseContainer from '@base/components/base-container'
import {
  TimeMark,
  TimeLineMatrix
} from './class'
import {
  Collection
} from '@base/utils'

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

    const model = this.props.types[sort]

    // === Props Attribute ===
    /** @type {number} */
    this.sort = sort
    /** @type {TimeLineMatrix} */
    this.matrix = null
    /** @type {IEventTypeModel} */
    this.model = model
    /** @type {ICollection<ITimeLimeChartModel>} */
    this.collection = new Collection()
    collection.all().forEach(item => {
      if (model.id === item.eventTypeId) {
        this.collection.set(item.id, item)
      }
    })
    // === Base Attribute ===
    /** @type {number} */
    this.paddingX = 16
    /** @type {number} */
    this.paddingY = 8
    /** @type {number} */
    this.chartHeight = 2
    /** @type {number} */
    this.chartPaddingY = 2
    /** @type {TimeMark[]} */
    this.markList = []
    /** @type {Graphics} */
    this.chartGraphics = new Graphics()
    /** @type {Graphics} */
    this.markGraphics = new Graphics()

    this.create()
  }

  init() {
    this.model.data.forEach(model => {
      this.collection.set(model.id, model)
    })
    this.matrix = new TimeLineMatrix({
      collection: this.collection,
      pixelTime: this.DateLine.getPixelTime(),
      startTime: this.DateLine.getViewStartTime(),
      endTime: this.DateLine.getViewEndTime(),
      isCollapse: this.model.collapse,
    })
    this.markList = this.createTimeMarkList()
    console.log('drawChartItem')
    console.time()
    this.drawChartItem()
    console.timeEnd()
    console.log('drawMarkList')
    console.time()
    this.drawMarkList()
    console.timeEnd()
    this.drawDivider()

    this.refreshChildren(this.chartGraphics, this.markGraphics)
  }

  getClientTop() {
    return this.DateLine.y + this.DateLine.textHeight + this.DateLine.scaleHeight + this.props.lineSolidWidth
  }

  /**
   * @param {number} index
   * @returns {number}
   */
  getColor(index) {
    return this.props.colors[index % this.props.colors.length]
  }

  /**
   * @return {number}
   */
  getCharGroupHeight() {
    return this.matrix.current.length * (this.chartHeight + this.chartPaddingY) * 2 + this.paddingY * 2
  }

  /**
   * @param {number} top
   * @param {number} height
   * @return {boolean}
   */
  isShowY(top, height = 1) {
    const isTopLimit = top + this.y >= 0 - this.DateLine.paddingBottom / 2
    const isBottomLimit = top + height + this.y <= this.props.canvasHeight - this.getClientTop() - this.RulerLine.plusButtonSize * 3
    return isTopLimit && isBottomLimit
  }

  getPointY(row) {
    return row * (this.chartHeight * 2 + this.chartPaddingY * 2)
  }

  getPointX(column) {
    return column - this.props.translateX
  }

  getMatrixPoint(column, row) {
    return [this.getPointX(column), this.getPointY(row)]
  }
  
  getChartClientHeight() {
    return this.chartHeight * 2 + this.chartPaddingY * 2
  }

  createTimeMarkList() {
    return this.matrix.marks.map(data => {
      const [left, top] = this.getMatrixPoint(data.column, data.row)
      return new TimeMark({
        models: data.models || [],
        width: data.width,
        type: data.type,
        left,
        top: top + this.getChartClientHeight() / 2,
        clientLeft: this.x + data.column,
        clientTop: this.y + this.getChartClientHeight() / 2 + this.DateLine.getClientHeight(),
        props: this.props,
        color: this.getColor(this.sort),
        graphics: this.markGraphics,
        collection: this.collection,
      })
    })
  }

  /**
   * @param {number} t
   */
  update(t) {
    this.markList = this.createTimeMarkList()
  }

  drawChartItem() {
    const color = this.getColor(this.sort)
    const chartClientHeight = this.getChartClientHeight()
    for (let row = 0; row < this.matrix.current.length; row++) {
      const columns = this.matrix.current[row]
      const pointY = this.getPointY(row)
      const rowY = pointY + this.chartPaddingY
      for (let column = 0; column < columns.length; column++) {
        const type = columns[column]
        if (this.isShowY(pointY, chartClientHeight)) {
          const columnX = this.getPointX(column)
          if (type) {
            this.chartGraphics
              .beginFill(0, 0)
              .lineStyle(0, 0, 0)
              .drawRect(columnX, pointY, 2, chartClientHeight)
          }
          switch (type) {
            case 1:
            this.chartGraphics
              .beginFill(color)
              .drawRect(columnX, rowY + this.chartHeight / 2, 2, this.chartHeight)
              break;
            case 2:
            this.chartGraphics
              .beginFill(color)
              .drawRect(columnX, rowY, 1, this.chartHeight * 2)
              break;
            case 3:
            this.chartGraphics
              .beginFill(0xBBBBBB)
              .drawRect(columnX, rowY, 1, this.chartHeight * 2)
              break;
          }
        }
      }
    }
  }

  drawDivider() {
    const left = this.paddingX - this.props.translateX
    const top = 0 - this.paddingY
    if (this.sort && this.isShowY(0 - this.DateLine.paddingBottom / 2)) {
      this.chartGraphics.lineStyle(1, 0xeeeeee)
        .moveTo(left, top)
        .lineTo(left + this.props.canvasWidth - this.paddingX * 2, top)
    }
  }

  drawMarkList() {
    if (this.props.isShowCoordinates) {
      this.markList.forEach(item => {
        if (this.isShowY(item.top - this.getChartClientHeight() / 2)) {
          item.draw()
        }
      })
    }
  }

  draw() {
    this.drawDivider()
    this.drawChartItem()
    this.drawMarkList()
  }
}