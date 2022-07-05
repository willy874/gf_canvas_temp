import {
  Graphics,
} from '@base/pixi';
import BaseContainer from './base-container'
import ChartItem from './chart-item'
import {
  TimeMatrix
} from '../data'

export default class ChartGroup extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      model,
      sort,
      color,
      effectWidth,
      basePixelTime,
      baseStartTime,
      baseEndTime
    } = args;
    /** @type {IEventTypeModel} */
    this.model = model;
    /** @type {number} */
    this.sort = sort;
    /** @type {number} */
    this.color = color;
    /** @type {number} */
    this.effectWidth = effectWidth;
    /** @type {number} */
    this.basePixelTime = basePixelTime;
    /** @type {number} */
    this.baseStartTime = baseStartTime;
    /** @type {number} */
    this.baseEndTime = baseEndTime;

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
        app: this.getApplication(),
        type: this.model.name,
        basePixelTime: this.basePixelTime,
        baseStartTime: this.baseStartTime,
        baseEndTime: this.baseEndTime,
        color: this.color,
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
      this.graphics.lineTo(this.effectWidth, 0)
    }
    this.children.forEach(container => {
      if (container instanceof ChartItem) {
        const box = container.getCurrentBoxInfo()
        container.x = box.left
        container.y = box.top
      }
    })

  }

}