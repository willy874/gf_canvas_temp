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
      isInit,
      model,
      sort,
      color,
      DateLine,
    } = args;
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
        isInit: this.isInit,
        app: this.getApplication(),
        event: this.event,
        type: this.model.name,
        color: this.color,
        DateLine: this.DateLine,
        ...model,
        ...matrixInfo
      })
    })
  }

  /**
   * @param {number} t 
   */
  update(t) {}

  draw() {

    if (this.sort) {
      this.graphics.lineStyle(1, 0xEEEEEE)
      this.graphics.moveTo(0, 0)
      this.graphics.lineTo(this.canvasWidth, 0)
    }
    this.children.forEach(container => {
      if (container instanceof ChartItem) {
        const box = container.getCurrentBoxInfo()
        container.x = box.left + this.DateLine.translateX
        container.y = box.top
      }
    })

  }

}