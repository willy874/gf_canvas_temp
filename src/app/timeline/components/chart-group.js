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
      isInit,
      model,
      sort,
      color,
    } = args;
    // === Props Attribute ===
    /** @type {import('./timeline-app').TimelineApplicationOptions} */
    this.props = props
    const {
      DateLine,
      RulerLine,
    } = this.props.getComponents()

    /** @type {boolean} */
    this.isInit = isInit
    /** @type {IEventTypeModel} */
    this.model = model;
    /** @type {number} */
    this.sort = sort;
    /** @type {number} */
    this.color = color;
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;
    /** @type {import('./ruler-group').default} */
    this.RulerLine = RulerLine;

    this.graphics = new Graphics()
    this.create()
    this.addChild(this.graphics)
  }

  init() {
    const children = this.getCharItem()
    this.refreshChildren(...children)
  }

  getCharItem() {
    /** @type {MatrixInfo[]} */
    const matrixInfoList = TimeMatrix.getInfo(this.model.data)
    return this.model.data.map((model, index) => {
      const matrixInfo = matrixInfoList[index]
      return new ChartItem({
        ...this.getArguments(),
        type: this.model.name,
        color: this.color,
        DateLine: this.DateLine,
        model,
        matrixInfo
      })
    })
  }


  /**
   * @param {ChartItem} item
   */
  updateChartGroup(item) {
    // console.log(this.y);
    if (item) {
      const box = item.getCurrentBoxInfo()
      item.x = box.left + this.props.translateX
      item.y = box.top
      const itemY = this.y + box.top
      const chartGroupHeight = this.DateLine.y + this.DateLine.textHeight + this.DateLine.scaleHeight + this.props.lineSolidWidth + this.DateLine.paddingBottom
      if (itemY >= 0 && itemY <= this.props.canvasHeight - chartGroupHeight - this.RulerLine.plusButtonSize * 3) {
        item.alpha = 1
      } else {
        item.alpha = 0
      }
    }
  }

  /**
   * @param {number} t 
   */
  update(t) {
    this.children.forEach(container => {
      if (container instanceof ChartItem) {
        this.updateChartGroup(container)
      }
    })
  }

  draw() {
    // if (this.sort) {
    //   this.graphics.lineStyle(1, 0xEEEEEE)
    //   this.graphics.moveTo(0, 0)
    //   this.graphics.lineTo(this.canvasWidth, 0)
    // }
  }

}