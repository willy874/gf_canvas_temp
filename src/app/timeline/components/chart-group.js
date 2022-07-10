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
    /** @type {string[][]} */
    this.matrix = [];
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

    this.chartItemGraphics = new Graphics()
    this.coordinatesGraphics = new Graphics()
    this.create()
    this.addChild(this.chartItemGraphics)
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
      chartPaddingY: this.chartPaddingY
    })
  }

  /**
   * @return {number}
   */
  getCharGroupHeight() {
    return this.matrix.length * (this.chartHeight + this.chartPaddingY * 2) + this.paddingY * 2
  }

  /**
   * @param {ITimeLimeChartModel[]} list 
   * @returns {ChartItem[]}
   */
  getCharItemList(list) {
    return TimeMatrix.getMappingModel(list, this.matrix).map((matrix, index) => this.getCharItem(list[index], matrix))
  }

  /**
   * @param {number} left
   * @param {number} top
   * @return {boolean}
   */
  isShow(left, top) {
    const chartGroupHeight = this.DateLine.y + this.DateLine.textHeight + this.DateLine.scaleHeight + this.props.lineSolidWidth + this.DateLine.paddingBottom
    const isTopLimit = top >= 0
    const isTopBottom = top <= this.props.canvasHeight - chartGroupHeight - this.RulerLine.plusButtonSize * 3
    return isTopLimit && isTopBottom
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
      if (this.isShow(this.x, this.y + item.top)) {
        item.draw(this.chartItemGraphics)
      }
    })
  }

  drawDivider() {
    const lineDiff = 0 - this.paddingY
    if (this.sort && this.isShow(this.x, this.y + lineDiff)) {
      this.chartItemGraphics.lineStyle(1, 0xEEEEEE)
      this.chartItemGraphics.moveTo(this.paddingX, lineDiff)
      this.chartItemGraphics.lineTo(this.props.canvasWidth - this.paddingX * 2, lineDiff)
    }
  }

  draw() {
    this.drawDivider()
    this.drawChartItem()
  }

}