import {
  Collection,
  dateToNumber
} from '@base/utils';

/**
 * @template {EventModel} T
 * @extends {Collection<T>}
 * @implements {IEventCollection<T>}
 */
export class EventCollection extends Collection {
  /**
   * @param {T[]} args 
   */
  constructor(args = []) {
    super();
    args.forEach((p) => {
      this.set(p.id, new EventModel(p));
    })
  }
}

/**
 * @implements {IEventModel}
 */
export class EventModel {
  constructor(args = {}) {
    this.id = args.id
    this.startTime = dateToNumber(args.startTime)
    this.endTime = dateToNumber(args.endTime)
    this.title = args.title
    this.type = args.type
  }
}


/**
 * @typedef {MatrixInfo & IEventModel} EventModelInfo
 */

export class TimeMatrix {
  /**
   * @param {string} prev 
   * @param {string} current 
   * @param {string} value 
   * @returns {boolean}
   */
  static isPrepend(prev, current, value) {
    // 確認是不是 index 0
    if (prev) {
      const modelStartTime = Number(value.match(/^\d+/)[0])
      const modelEndTime = Number(value.match(/\d+$/)[0])
      const prevEndTime = Number(prev.match(/\d+$/)[0])
      const currentStartTime = Number(current.match(/^\d+/)[0])
      return prevEndTime <= modelStartTime && modelEndTime <= currentStartTime
    } else {
      const modelEndTime = Number(value.match(/\d+$/)[0])
      const currentStartTime = Number(current.match(/^\d+/)[0])
      return modelEndTime <= currentStartTime
    }
  }

  /**
   * @param {string} current 
   * @param {string} next 
   * @param {string} value 
   * @returns {boolean}
   */
  static isAppend(current, next, value) {
    // 確認是不是 index last
    if (next) {
      const modelStartTime = Number(value.match(/^\d+/)[0])
      const modelEndTime = Number(value.match(/\d+$/)[0])
      const nextStartTime = Number(next.match(/^\d+/)[0])
      const currentEndTime = Number(current.match(/\d+$/)[0])
      return currentEndTime <= modelStartTime && modelEndTime <= nextStartTime
    } else {
      const modelStartTime = Number(value.match(/^\d+/)[0])
      const currentEndTime = Number(current.match(/\d+$/)[0])
      return currentEndTime <= modelStartTime
    }
  }

  /**
   * @param {string[]} matrix 
   * @param {string} value 
   * @returns {number}
   */
  static addMatrix(matrix, value) {
    let insertIndex = -1
    for (let index = 0; index < matrix.length; index++) {
      if (matrix[index] === value) {
        return insertIndex
      }
      if (TimeMatrix.isPrepend(matrix[index - 1], matrix[index], value)) {
        insertIndex = index
        break
      }
      if (TimeMatrix.isAppend(matrix[index], matrix[index + 1], value)) {
        insertIndex = index + 1
        break
      }
    }
    if (insertIndex >= 0) {
      matrix.splice(insertIndex, 0, value)
      return insertIndex
    }
    return insertIndex
  }

  /**
   * @param {ITimeLimeChartModel[]} list
   * @returns {MatrixInfo[]}
   */
  static getInfo(list) {
    const matrix = []
    return list.map(model => {
      const value = model.startTime + '-' + model.endTime
      let column = -1
      let row = 0
      while (true) {
        const matrixRow = matrix[row]
        if (matrixRow) {
          column = TimeMatrix.addMatrix(matrixRow, value)
          if (column >= 0) {
            break
          }
        } else {
          column = 0
          matrix[row] = [value]
          break
        }
        row++
      }
      return {
        row,
        column,
        matrix
      }
    })
  }
}