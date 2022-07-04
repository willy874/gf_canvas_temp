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

  getMinStartTime() {
    const list = this.all()
    return list.length ? Math.min(...list.map(p => p.startTime)) : Date.now()
  }

  getMaxEndTime() {
    const list = this.all()
    return list.length ? Math.max(...list.map(p => p.endTime)) : Date.now()
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
 * @typedef {Object} MatrixInfo
 * @property {number} row
 * @property {number} column
 */
/**
 * @typedef {MatrixInfo & IEventModel} EventModelInfo
 */

export class TimeMatrix {
  /**
   * @param {string[]} types 
   * @param {IEventModel[]} list 
   */
  constructor(types, list) {
    this.current = []
    this.types = types
    /** @type {ICollection<EventModelInfo>} */
    this.modelInfo = new Collection()

    types.forEach((_, index) => {
      this.current[index] = []
    })
    list.forEach(p => {
      const info = this.add(p.type, p.startTime, p.endTime)
      /** @type {EventModelInfo} */
      const eventModelInfo = {
        ...p,
        ...info
      }
      this.modelInfo.set(p.id, eventModelInfo)
    })
  }

  getIndexByType(type) {
    return this.types.indexOf(type)
  }

  getTypeByIndex(index) {
    return this.types[index]
  }

  /**
   * @param {string} prev 
   * @param {string} current 
   * @param {string} value 
   * @returns {boolean}
   */
  isPrepend(prev, current, value) {
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
  isAppend(current, next, value) {
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
  addMatrix(matrix, value) {
    let insertIndex = -1
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
    if (insertIndex >= 0) {
      matrix.splice(insertIndex, 0, value)
      return insertIndex
    }
    return insertIndex
  }

  /**
   * @param {string} type 
   * @param {number} startTim 
   * @param {number} endTime 
   * @return {MatrixInfo}
   */
  add(type, startTim, endTime) {
    /** @type {number} */
    const typeIndexOf = this.getIndexByType(type)
    if (typeIndexOf === -1) {
      throw new Error("can't find this type.")
    }
    /** @type {string[][]} */
    const matrix = this.current[typeIndexOf]
    const value = startTim + '-' + endTime
    let column = -1
    let row = 0
    while (true) {
      const matrixRow = matrix[row]
      if (matrixRow) {
        column = this.addMatrix(matrixRow, value)
        if (column >= 0) {
          break
        }
      } else {
        matrix[row] = [value]
        break
      }
      row++
    }
    return {
      row,
      column
    }
  }
}