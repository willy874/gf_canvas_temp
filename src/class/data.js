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
   * @returns {number}  當成功插入回傳 index，當找不到插入節點回傳 -1
   */
  static addMatrix(matrix, value) {
    let insertIndex = -1
    for (let index = 0; index < matrix.length; index++) {
      // console.log(value, TimeMatrix.isPrepend(matrix[index - 1], matrix[index], value) && 'isPrepend');
      if (TimeMatrix.isPrepend(matrix[index - 1], matrix[index], value)) {
        insertIndex = index
        // console.log('isPrepend', insertIndex);
        break
      }
      // console.log(value, TimeMatrix.isAppend(matrix[index], matrix[index + 1], value) && 'isAppend');
      if (TimeMatrix.isAppend(matrix[index], matrix[index + 1], value)) {
        insertIndex = index + 1
        // console.log('isAppend', insertIndex);
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
   * @param {string[]} list
   * @param {string[][]} matrix
   * @returns {number[]}
   */
  static getMatrixRowList(list, matrix) {
    return list.map(value => {
      let row = 0
      let matrixRow
      while (true) {
        matrixRow = matrix[row]
        if (matrixRow) {
          if (TimeMatrix.addMatrix(matrixRow, value) >= 0) {
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
   * @param {string[][]} matrix
   */
  static getMappingModel(list, matrix) {
    const timeList = list.map(model => `${model.startTime}-${model.id}-${model.endTime}`)
    const rowList = TimeMatrix.getMatrixRowList(timeList, matrix)
    return rowList.map((row, index) => {
      const time = timeList[index]
      return {
        time,
        row,
        column: matrix[row].indexOf(time),
      }
    })
  }
}