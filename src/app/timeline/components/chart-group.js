import {
  Graphics,
} from '@base/pixi';
import BaseContainer from '@base/components/base-container'
import ChartItem from './chart-item'
import {
  EventType,
  TimeMatrix
} from '@base/class'
import {
  getEndPointByTrigonometric
} from '@base/utils'
// import { GlobalEvent } from '@base/utils';

export default class ChartGroup extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      props,
      sort,
      collection
    } = args;

    /** @type {import('./timeline-app').TimelineApplicationOptions} */
    this.props = props

    // === Components ===
    const {
      DateLine,
      RulerLine,
    } = this.props.getComponents()
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;
    /** @type {import('./ruler-group').default} */
    this.RulerLine = RulerLine;

    // === Props Attribute ===
    /** @type {number} */
    this.sort = sort;
    // /** @type {string[][]} */
    this.matrix = new TimeMatrix(collection);

    // === Base Attribute ===
    /** @type {ChartItem[]} */
    this.charItemList = [];
    /** @type {IEventTypeModel} */
    this.model = this.props.types[sort];
    /** @type {number} */
    this.paddingX = 16
    /** @type {number} */
    this.paddingY = 8
    /** @type {number} */
    this.chartHeight = 2
    /** @type {number} */
    this.chartPaddingY = 4
    /** @type {Graphics} */
    this.graphics = new Graphics()
    /** @type {Graphics[]} */
    this.coordinatesList = []

    this.create()
  }

  // /**
  //  * @param {InteractionEvent} event 
  //  */
  // onPointover(event) {
  //   this.isShowTip = true
  // }

  // /**
  //  * @param {InteractionEvent} event 
  //  */
  // onPointout(event) {
  //   this.isShowTip = false
  // }

  init() {
    this.charItemList = this.getCharItemList(this.model.data)
    this.coordinatesList = this.charItemList.map(item => {
      const graphics = new Graphics()
      graphics.interactive = true
      graphics.buttonMode = true
      graphics.on(EventType.POINTEROVER, (e) => {
        this.parent.target = item
        this.parent.isShowTip = true
      })
      graphics.on(EventType.POINTEROUT, (e) => {
        this.parent.isShowTip = false
      })
      return graphics
    })
    this.refreshChildren(this.graphics, ...this.coordinatesList)
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
      graphics: this.graphics
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
    const chartGroupHeight = this.DateLine.y + this.DateLine.textHeight + this.DateLine.scaleHeight + this.props.lineSolidWidth + this.DateLine.paddingBottom
    const isTopLimit = top >= 0
    const isBottomLimit = top + height <= this.props.canvasHeight - chartGroupHeight - this.RulerLine.plusButtonSize * 3
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
      this.graphics.lineStyle(1, 0xEEEEEE)
      this.graphics.moveTo(this.paddingX, lineDiff)
      this.graphics.lineTo(this.props.canvasWidth - this.paddingX * 2, lineDiff)
    }
  }

  drawCoordinatesList() {
    if (this.props.isShowCoordinates) {
      this.charItemList.forEach((item, index) => this.drawCoordinates(item, index))
    }
  }

  drawCoordinates(item, index) {
    const graphics = this.coordinatesList[index]
    const top = item.top + item.height / 2 - item.chartHeight
    if (item.width > item.chartHeight) {
      this.drawCoordinateItem(graphics, item.left, top)
      this.drawCoordinateItem(graphics, item.left + item.width, top)
    } else {
      this.drawCoordinateItem(graphics, item.left + item.width / 2, top)
    }
  }

  /**
   * @param {number} x 
   * @param {number} y
   */
  drawCoordinateItem(graphics, x, y) {
    const color = this.getColor(this.sort)
    const point1 = getEndPointByTrigonometric(x, y, 115, -11)
    const point2 = getEndPointByTrigonometric(x, y, 65, -11)
    const point3 = getEndPointByTrigonometric(x, y, 90, -13)
    graphics
      .beginFill(0x6C6C6C)
      .lineStyle(1, 0x6C6C6C)
      .drawPolygon([
        ...[x, y],
        ...point1,
        ...point2
      ])
      .drawCircle(...point3, 6)
      .beginFill(color)
      .lineStyle(1, color)
      .drawCircle(...point3, 3)
  }

  draw() {
    this.drawDivider()
    this.drawChartItem()
    this.drawCoordinatesList()
  }

}