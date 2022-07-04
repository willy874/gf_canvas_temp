import BaseContainer from './base-container'
import TimeLimeChartItem from './chart-item'
import {
  TimeMatrix
} from '../data'
import {
  Collection,
} from '@base/utils';
import {
  Graphics,
} from '@base/pixi';

const colors = [0xFFB2C1, 0xA0D0F5, 0xFFE6AE, 0xABDFE0, 0xCCB2FF]

export default class EventChart extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      startTime,
      endTime,
      x,
      y,
      canvasWidth,
      canvasHeight,
      collection,
      basePixelTime,
    } = args;
    this.startTime = startTime;
    this.endTime = endTime;
    this.x = x;
    this.y = y;
    this.baseWidth = canvasWidth;
    this.baseHeight = canvasHeight;
    /** @type {IEventCollection<IEventModel>} */
    this.collection = collection;
    /** @type {ICollection<TimeLimeChartItem>} */
    this.chartItemCollection = new Collection()
    /** @type {ICollection<IEventModel[]>} */
    this.typeCollection = this.getTypeList()
    /** @type {string[]} */
    this.typeList = this.typeCollection.keys()
    /** @type {TimeMatrix} */
    this.timeMatrix = new TimeMatrix(this.typeList, this.collection.all())
    this.collection.all().forEach(model => {
      this.chartItemCollection.set(model.id, new TimeLimeChartItem({
        ...args,
        model,
        typeList: this.typeList,
        timeMatrix: this.timeMatrix,
        color: colors[this.typeList.indexOf(model.type) % colors.length],
        basePixelTime,
      }))
    })

    /** @type {number[]} */
    this.effectList = this.getEffectList()

    this.graphics = new Graphics()
    const children = this.chartItemCollection.all()
    this.addChild(...children)
  }

  getTypeList() {
    /** @type {ICollection<IEventModel[]>} */
    const types = new Collection()
    this.collection.all().forEach(model => {
      if (types.has(model.type)) {
        types.get(model.type).push(model)
      } else {
        types.set(model.type, [model])
      }
    })
    return types
  }

  getEffectList() {
    return this.collection.all().filter(p => p.startTime < this.endTime || p.endTime > this.startTime).map(p => p.id)
  }
}