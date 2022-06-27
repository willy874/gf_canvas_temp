import BaseGraphics from './base-graphics'
import TimeLimeChartItem from './chart-item'
import {
  Collection,
} from '@base/utils';
import {
  uniq,
  flatten
} from '@base/utils/lodash';

/**
 * @template T
 * @typedef {import('../data').EventCollection<T>} EventCollection
 */

const colors = [0xFFB2C1, 0xA0D0F5, 0xFFE6AE, 0xABDFE0, 0xCCB2FF, 0xA0D0F5]

export default class EventChart extends BaseGraphics {
  constructor(args) {
    super()
    const {
      startTime,
      endTime,
      baseX,
      baseY,
      baseWidth,
      baseHeight,
      collection
    } = args;

    this.startTime = startTime;
    this.endTime = endTime;
    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    /** @type {EventCollection<EventModel>} */
    this.collection = collection;
    /** @type {Collection<TimeLimeChartItem>} */
    this.chartItemCollection = new Collection()

    this.typeList = uniq(this.collection.all().map(model => model.type))
    const timeTypeMatrix = this.typeList.map((type) => {
      const timeMatrix = []
      this.collection.all().filter(p => p.type === type).sort((s, e) => s.startTime - e.startTime).forEach(model => {
        this.setTimeMatrix(timeMatrix, model.startTime, model.endTime)
      })
      return timeMatrix
    })
    this.timeMatrix = flatten(timeTypeMatrix)
    console.log('timeMatrix', this.timeMatrix);
    this.collection.all().forEach(model => {
      this.chartItemCollection.set(model.id, new TimeLimeChartItem({
        ...args,
        model,
        typeList: this.typeList,
        timeMatrix: this.timeMatrix,
        color: colors[this.typeList.indexOf(model.type) % colors.length],
      }))
    })


    /** @type {number[]} */
    this.effectList = this.getEffectList()

    this.children.push(...this.chartItemCollection.all().map(chart => chart.container))
    this.chartItemCollection.all().forEach(chart => chart.create())
  }

  setTimeMatrix(matrix, startTime, endTime) {
    let column = 0
    for (let index = 0; index < matrix.length + 1; index++) {
      if (matrix[column]) {
        const copy = matrix[column].map(p => p)
        const last = copy.pop()
        if (startTime >= last) {
          break
        }
      } else {
        matrix[column] = []
        break
      }
      column++
    }
    matrix[column].push(startTime, endTime)
  }

  getEffectList() {
    return this.collection.all().filter(p => p.startTime < this.endTime || p.endTime > this.startTime).map(p => p.id)
  }

  /**
   * @param {number} t 
   */
  updateData(t) {
    this.chartItemCollection.all().forEach(chart => chart.update(t))
  }

  draw() {
    this.chartItemCollection.all().forEach(chart => chart.draw())
  }
}