import BaseGraphics from './base-graphics'
import TimeLimeChartItem from './chart-item'
import {
  Collection,
} from '@base/utils';
// import dayjs from 'dayjs';

const colors = [0xFFB2C1, 0xA0D0F5, 0xFFE6AE, 0xABDFE0, 0xCCB2FF]

export default class EventChart extends BaseGraphics {
  constructor(args) {
    super(args)
    const {
      startTime,
      endTime,
      baseX,
      baseY,
      baseWidth,
      baseHeight,
      collection,
    } = args;
    this.startTime = startTime;
    this.endTime = endTime;
    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    /** @type {IEventCollection<IEventModel>} */
    this.collection = collection;
    /** @type {ICollection<TimeLimeChartItem>} */
    this.chartItemCollection = new Collection()
    /** @type {ICollection<IEventModel[]>} */
    this.typeCollection = this.getTypeList()
    this.typeList = this.typeCollection.keys()
    this.modelDataCollection = this.getModelDataCollection()
    this.collection.all().forEach(model => {
      this.chartItemCollection.set(model.id, new TimeLimeChartItem({
        ...args,
        model,
        typeList: this.typeList,
        modelDataCollection: this.modelDataCollection,
        color: colors[this.typeList.indexOf(model.type) % colors.length],
      }))
    })

    /** @type {number[]} */
    this.effectList = this.getEffectList()

    const children = this.chartItemCollection.all()
    this.create(children.map(chart => chart.container))
    this.children.push(...children)
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

  getModelDataCollection() {
    const typeCollection = {}
    let lastRow = 0
    this.typeList.forEach((type) => {
      const children = this.typeCollection.get(type)
      const matrix = this.getTimeMatrix(children)
      typeCollection[type] = {
        sort: children.map(p => p.id),
        matrix,
        lastRow,
      }
      lastRow += matrix.length
    })
    const indexCollection = new Collection()
    this.collection.all().forEach(model => {
      const typeData = typeCollection[model.type]
      const index = typeData.matrix.map(p => p.some(t => t === model.startTime) && p.some(t => t === model.endTime)).indexOf(true)
      indexCollection.set(model.id, {
        ...model,
        row: typeData.lastRow + index,
        sort: typeData.sort,
        matrix: typeData.matrix
      })
    })
    return indexCollection
  }

  getTimeMatrix(list = []) {
    const matrix = []
    list.forEach(model => {
      const times = [model.startTime, model.endTime]
      let column = 0
      let isLoop = true
      while (isLoop) {
        if (matrix[column]) {
          let i = 0
          const length = matrix[column].length
          while (i < matrix[column].length) {
            const t = matrix[column][i]
            if (i % 2 === 0 && model.endTime <= t) {
              if (i === 0) {
                matrix[column].unshift(...times)
                break
              } else {
                const pt = matrix[column][i - 1]
                if (model.startTime >= pt) {
                  matrix[column].splice(i, 0, ...times)
                  break
                }
              }
            }
            if (i % 2 === 1 && model.startTime >= t) {
              if (i === matrix[column].length - 1) {
                matrix[column].push(...times)
                break
              } else {
                const nt = matrix[column][i + 1]
                if (model.endTime >= nt) {
                  matrix[column].splice(i + 1, 0, ...times)
                  break
                }
              }
            }
            i++
          }
          if (length !== matrix[column].length) {
            isLoop = false
          }
        } else {
          matrix[column] = times
          isLoop = false
          break
        }
        column++
      }
    })
    return matrix
  }

  getEffectList() {
    return this.collection.all().filter(p => p.startTime < this.endTime || p.endTime > this.startTime).map(p => p.id)
  }
}