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

/**
 * @typedef {Object} ChartModel
 * @property {number|string} id 
 * @property {number} startTime 
 * @property {number} endTime 
 */

/**
 * @typedef {Object} MatrixInfo
 * @property {string} time 
 * @property {number} row 
 * @property {number} column 
 */
export class TimeMatrix {
  constructor(collection) {
    this.current = []
    /** @type {ICollection<ChartModel>} */
    this.collection = collection
  }

  /**
   * @param {string} prev 
   * @param {string} current 
   * @param {string} target 
   * @returns {boolean}
   */
  isPrepend(prev, current, target) {
    const _current = this.collection.get(current)
    const _prev = this.collection.get(prev)
    const _target = this.collection.get(target)
    // 確認是不是 index 0
    if (prev) {
      const modelStartTime = _target.startTime
      const modelEndTime = _target.endTime
      const prevEndTime = _prev.endTime
      const currentStartTime = _current.startTime
      return prevEndTime <= modelStartTime && modelEndTime <= currentStartTime
    } else {
      const modelEndTime = _target.endTime
      const currentStartTime = _current.startTime
      return modelEndTime <= currentStartTime
    }
  }

  /**
   * @param {string} current 
   * @param {string} next 
   * @param {string} target 
   * @returns {boolean}
   */
  isAppend(current, next, target) {
    const _current = this.collection.get(current)
    const _next = this.collection.get(next)
    const _target = this.collection.get(target)
    // 確認是不是 index last
    if (next) {
      const modelStartTime = _target.startTime
      const modelEndTime = _target.endTime
      const nextStartTime = _next.startTime
      const currentEndTime = _current.endTime
      return currentEndTime <= modelStartTime && modelEndTime <= nextStartTime
    } else {
      const modelStartTime = _target.startTime
      const currentEndTime = _current.endTime
      return currentEndTime <= modelStartTime
    }
  }

  /**
   * @param {string[]} matrix 
   * @param {string} value 
   * @returns {number}  當成功插入回傳 index，當找不到插入節點回傳 -1
   */
  addMatrix(matrix, value) {
    let insertIndex = -1
    if (this.isPrepend(null, matrix[0], value)) {
      insertIndex = 0
    }
    if (this.isAppend(matrix[matrix.length - 1], null, value)) {
      insertIndex = matrix.length - 1
    }
    if (insertIndex === -1) {
      for (let index = 0; index < matrix.length; index++) {
        if (this.isPrepend(matrix[index - 1], matrix[index], value)) {
          insertIndex = index
          break
        }
        if (this.isAppend(matrix[index], matrix[index + 1], value)) {
          insertIndex = index + 1
          break
        }
      }
    }
    // console.log(insertIndex);
    if (insertIndex >= 0) {
      matrix.splice(insertIndex, 0, value)
      return insertIndex
    }
    return insertIndex
  }

  /**
   * @param {string[]} list
   * @param {string[][]} matrix
   * @returns {number[]}
   */
  getMatrixRowList(list, matrix) {
    return list.map(value => {
      let row = 0
      let matrixRow
      while (true) {
        matrixRow = matrix[row]
        if (matrixRow) {
          if (this.addMatrix(matrixRow, value) >= 0) {
            break
          }
        } else {
          matrix[row] = [value]
          break
        }
        row++
      }
      return row
    })
  }

  /**
   * @param {ChartModel[]} list
   */
  getMappingModel(list) {
    const matrix = this.current
    const idList = list.map(model => {
      const id = String(model.id)
      this.collection.set(id, model)
      return id
    })
    const rowList = this.getMatrixRowList(idList, matrix)
    return rowList.map((row, index) => {
      const time = idList[index]
      return {
        time,
        row,
        column: matrix[row].indexOf(time),
      }
    })
  }
}