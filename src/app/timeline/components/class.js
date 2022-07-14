import {
  Collection,
  // dateFormat,
  getEndPointByTrigonometric,
  insertByIndex,
  isSet
} from '@base/utils'

export class TimeMark {
  constructor(args) {
    const {
      color,
      models,
      top,
      left,
      clientLeft,
      clientTop,
      graphics,
      collection,
      width,
    } = args

    // === Props Attribute ===
    /** @type {(string|number)[]} */
    this.models = models || []
    /** @type {number} */
    this.width = width
    /** @type {number} */
    this.top = top
    /** @type {number} */
    this.left = left
    /** @type {number} */
    this.clientLeft = clientLeft
    /** @type {number} */
    this.clientTop = clientTop
    /** @type {number} */
    this.color = color
    /** @type {number} */
    /** @type {ICollection<ITimeLimeChartModel>} */
    this.collection = collection
    /** @type {Graphics} */
    this.graphics = graphics
    // === Base Attribute ===
    /** @type {number} */
    this.circleSize = 6
  }

  createCollisionMatrix() {
    return new Array(this.circleSize * 3).fill(null).map(p => new Array(this.circleSize * 2))
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @returns {boolean}
   */
  isCollision(x, y) {
    const left = this.clientLeft
    const top = this.clientTop - this.circleSize * 1.5
    return this.circleSize + 2 >= Math.sqrt((left - x) ** 2 + (top - y) ** 2)
  }

  /**
   * @returns {ITimeLimeChartModel[]}
   */
  getModelList() {
    return this.models.map((id) => this.collection.get(id))
  }

  draw() {
    const x = this.left
    const y = this.top
    const color = this.color
    const triangleSize = this.circleSize * 2
    const point1 = getEndPointByTrigonometric(x, y, 115, 0 - triangleSize)
    const point2 = getEndPointByTrigonometric(x, y, 65, 0 - triangleSize)
    const point3 = getEndPointByTrigonometric(x, y, 90, 0 - triangleSize)
    this.graphics
      .beginFill(0x6c6c6c)
      .lineStyle(1, 0x6c6c6c)
      .drawPolygon([...[x, y], ...point1, ...point2])
      .drawCircle(...point3, this.circleSize)
      .beginFill(color)
      .lineStyle(1, color)
      .drawCircle(...point3, this.circleSize / 2)
  }
}

/**
 * @template T
 */
export class MatrixCollection {
  /**
   * @param {number} lengthX 
   * @param {number} lengthY 
   * @param {T} init
   */
  constructor(lengthX, lengthY, init) {
    /** @type {number} */
    this.lengthX = lengthX
    /** @type {number} */
    this.lengthY = lengthY
    /** @type {T[][]} */
    this.current = init ? this.createMatrix(init, lengthX, lengthY) : null

  }

  /**
   * @template {T} N
   * @param {N} init 
   * @param {number} [lengthX] 
   * @param {number} [lengthY] 
   * @returns {N[][]}
   */
  createMatrix(init, lengthX, lengthY) {
    const x = lengthX || this.lengthX
    const y = lengthY || this.lengthY
    return new Array(y).fill(null).map(a => new Array(x).fill(init))
  }

  setLength(x, y) {
    this.lengthX = x
    this.lengthY = y
  }
}

/**
 * @typedef {Object} MarkInfo
 * @property {number} column
 * @property {number} row
 * @property {number} type
 * @property {number} width
 * @property {(string|number)[]} models
 */
export class TimeLineMatrix extends MatrixCollection {
  constructor(args = {}) {
    const {
      collection,
      pixelTime,
      startTime,
      endTime,
      isCollapse,
      filter
    } = args
    const width = Math.floor((endTime - startTime) / pixelTime)

    super(width, 1, 0)

    /** @type {string[][]} */
    this.idMatrix = []
    /**
     * @private
     * @type {ICollection<ITimeLimeChartModel>}
     */
    this.collection = collection
    /**
     * @private
     * @type {ICollection<Array<string|number>>}
     */
    this.map = new Collection()
    /**
     * @private
     * @type {number}
     */
    this.pixelTime = pixelTime
    /**
     * @private
     * @type {number}
     */
    this.startTime = startTime
    /**
     * @private
     * @type {number}
     */
    this.endTime = endTime
    /**
     * @private
     * @type {boolean}
     */
    this.isCollapse = isCollapse || false
    /**
     * @private
     * @type {(p: ITimeLimeChartModel) => boolean}
     */
    this.filter = filter || null
    /**
     * @private
     * @type {number[]}
     */
    this.rowList = []
    /**
     * @type {MarkInfo[]}
     */
    this.marks = []
    this.matrixInit()
    this.matrixUpdate()
  }

  matrixInit() {
    this.rowList = this.collection.all().map(p => this.getMatrixRow(String(p.id), this.idMatrix))
  }

  matrixUpdate() {
    this.current = this.createDrawMatrix()
    this.marks = this.createMarkList(this.current)
  }

  /**
   * @param {number[][]} matrix
   * @return {MarkInfo[]}
   */
  createMarkList(matrix) {
    const marks = []
    for (let row = 0; row < matrix.length; row++) {
      const columns = matrix[row]
      let prev = null
      let current = null
      let next = null
      let level1 = 0
      let level2 = 0
      let level3 = 0
      for (let column = 0; column < columns.length; column++) {
        prev = columns[column - 1]
        current = columns[column]
        next = columns[column + 1]
        const models = this.map.get(`${column},${row}`)
        if (current >= 1) level1++
        if (current >= 2) level2++
        if (current >= 3) level3++
        if (isSet(prev) && isSet(current) && prev < current) {
          marks.push({
            column,
            row,
            models,
            type: current,
            width: -1,
            isDraw: true
          })
          continue
        }
        if (isSet(current) && isSet(next) && current > next) {
          let width = null
          if (current === 0) {
            width = level1
            level1 = 0
          }
          if (current === 2) {
            width = level2
            level2 = 0
          }
          if (current === 3) {
            width = level3
            level3 = 0
          }
          marks.push({
            column,
            row,
            models,
            type: current,
            width,
            isDraw: width >= 3
          })
          continue
        }
      }
    }
    return marks
  }

  /**
   * @return {number[][]}
   */
  createDrawMatrix() {
    const list = this.collection.all()
    const isCollapse = this.isCollapse
    this.setLength(this.lengthX, isCollapse ? 1 : this.idMatrix.length)
    const matrix = this.createMatrix(0)
    this.map.clear()
    for (let index = 0; index < list.length; index++) {
      const model = list[index]
      const row = this.rowList[index]
      if (model.startTime < this.endTime && model.endTime > this.startTime) {
        if (isCollapse) {
          this.writeStackMatrix(matrix, model)
        } else {
          this.writeExpandMatrix(matrix, model, row)
        }
      }
    }
    return matrix
  }

  /**
   * @param {number[][]} matrix 
   * @param {ITimeLimeChartModel} model 
   * @param {number} row 
   */
  writeStackMatrix(matrix, model, row = 0) {
    let currentTime = 0
    for (let column = 0; column < matrix[row].length; column++) {
      currentTime = this.startTime + column * this.pixelTime
      const isInRange = currentTime > model.startTime && currentTime < model.endTime
      const isPoint = currentTime > model.startTime && currentTime < model.startTime + this.pixelTime
      if (isInRange || isPoint) {
        const value = matrix[row][column]
        if (value === 0) {
          matrix[row][column] = 1
          this.map.set(`${column},${row}`, [model.id])
          continue
        }
        const models = this.map.get(`${column},${row}`)
        if (!models) {
          throw new Error('Models is not catch.')
        }
        if (value === 1 || value === 2) {
          if (models.length && models.map(id => this.collection.get(id)).some(m => m.eventTypeId !== model.eventTypeId)) {
            matrix[row][column] = 3
          }
        }
        if (value === 1) {
          matrix[row][column] = 2
          models.push(model.id)
          continue
        }
      }
    }
  }

  /**
   * @param {number[][]} matrix 
   * @param {ITimeLimeChartModel} model 
   * @param {number} row 
   */
  writeExpandMatrix(matrix, model, row) {
    const startColumn = Math.floor((model.startTime - this.startTime) / this.pixelTime)
    let endColumn = Math.floor((model.endTime - this.startTime) / this.pixelTime)
    if (startColumn === endColumn) {
      endColumn += 1
    }
    if (!matrix[row]) {
      throw new Error('Matrix create fail.')
    }
    for (let column = startColumn; column < endColumn; column++) {
      const value = matrix[row][column]
      if (value === 0) {
        matrix[row][column] = 1
        this.map.set(`${column},${row}`, [model.id])
      }
    }
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
      return _prev.endTime <= _target.startTime && _target.endTime <= _current.startTime
    } else {
      return _target.endTime <= _current.startTime
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
      return _current.endTime <= _target.startTime && _target.endTime <= _next.startTime
    } else {
      return _current.endTime <= _target.startTime
    }
  }

  /**
   * @param {string[]} matrix 
   * @param {string} value 
   * @returns {boolean}
   */
  addMatrix(matrix, value) {
    let insertIndex = -1
    if (this.isPrepend(null, matrix[0], value)) {
      insertIndex = 0
    }
    if (this.isAppend(matrix[matrix.length - 1], null, value)) {
      insertIndex = matrix.length
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
    if (insertIndex >= 0) {
      insertByIndex(matrix, insertIndex, value)
    }
    return Boolean(insertIndex >= 0)
  }

  /**
   * @param {string} value
   * @param {string[][]} matrix
   * @returns {number}
   */
  getMatrixRow(value, matrix) {
    let row = 0
    let matrixRow
    while (true) {
      matrixRow = matrix[row]
      if (matrixRow) {
        if (this.addMatrix(matrixRow, value)) {
          break
        }
      } else {
        matrix[row] = [value]
        break
      }
      row++
    }
    return row
  }

  /**
   * @param {number|string} id 
   * @param {ITimeLimeChartModel} value 
   */
  setCollection(id, value) {
    this.collection.set(id, value)
    this.matrixInit()
  }

  update(args) {
    this.pixelTime = args.pixelTime
    this.startTime = args.startTime
    this.endTime = args.endTime
  }
}