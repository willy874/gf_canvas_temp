import {
  Graphics,
} from '@base/pixi';
import BaseContainer from '@base/components/base-container'
import ChartItem from './chart-item'
import {
  TimeMatrix
} from '@base/class'

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

    this.graphics = new Graphics()
    this.create()
    this.addChild(this.graphics)
  }

  init() {
    this.charItemList = this.getCharItemList(this.model.data)
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

  draw() {
    this.drawDivider()
    this.drawChartItem()
  }

}