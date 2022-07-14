import {
  Collection,
  // dateFormat,
  getEndPointByTrigonometric,
  insertByIndex
} from '@base/utils'

export class ChartItem {
  constructor(args) {
    const {
      props,
      color,
      type,
      model,
      chartHeight,
      chartPaddingY,
      graphics
    } = args;

    /** @type {import('./timeline-app').TimelineApplicationOptions} */
    this.props = props

    // === Components ===
    const {
      DateLine,
    } = props.getComponents()
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;
    // /** @type {import('./ruler-group').default} */
    // this.RulerLine = RulerLine;

    // === Props Attribute ===
    /** @type {number} */
    this.color = color
    /** @type {number} */
    this.type = type
    /** @type {ITimeLimeChartModel} */
    this.model = model
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;
    /** @type {Graphics} */
    this.graphics = graphics;

    // === Base Attribute ===
    /** @type {number} */
    this.left = 0
    /** @type {number} */
    this.top = 0
    /** @type {number} */
    this.width = 0
    /** @type {number} */
    this.height = 0
    /** @type {number} */
    this.chartHeight = chartHeight
    /** @type {number} */
    this.chartPaddingY = chartPaddingY
    /** @type {Area[]} */
    this.coordinates = []
  }

  // getChartLeft() {
  //   const rangeTime = this.props.baseTime - this.model.startTime
  //   const diff = Math.floor(rangeTime / this.DateLine.basePixelTime)
  //   const left = this.DateLine.baseX - diff
  //   return left
  // }

  // getChartTop() {
  //   return this.matrixInfo.row * this.getChartHeigh()
  // }

  // getChartWidth() {
  //   const rangeTime = this.model.endTime - this.model.startTime
  //   const width = Math.floor(rangeTime / this.DateLine.basePixelTime)
  //   return Math.max(width, this.chartHeight)
  // }

  // getChartHeigh() {
  //   return this.chartHeight + this.chartPaddingY * 2
  // }

  update(position = {}) {
    // const {
    //   left,
    //   top,
    //   width,
    //   height
    // } = position
    // this.left = left || this.getChartLeft()
    // this.top = top || this.getChartTop()
    // this.width = width || this.getChartWidth()
    // this.height = height || this.getChartHeigh()
  }

  draw() {
    this.drawChart()
  }

  drawChart() {
    this.graphics
      .beginFill(0, 0)
      .lineStyle(0, 0)
      .drawRect(this.left, this.top, this.width, this.height)
      .beginFill(this.color)
      .drawRect(this.left, this.chartPaddingY + this.top, this.width, this.chartHeight)
  }
}


export class Coordinate {
  constructor(args) {
    const {
      graphics,
      color,
      eventId,
      top,
      left
    } = args

    /** @type {number} */
    this.top = top
    /** @type {number} */
    this.left = left
    /** @type {number} */
    this.color = color
    /** @type {number} */
    this.circleSize = 6
    /** @type {string|number} */
    this.eventId = eventId
    /** @type {Graphics} */
    this.graphics = graphics
    /** @type {number[]} */
    this.collision = [0, 0, 0, 0]
  }

  isCollision(x, y) {
    return this.circleSize + 2 >= Math.sqrt((this.left - x) ** 2 + (this.top - y + this.circleSize) ** 2)
  }

  drawCoordinateItem() {
    const x = this.left
    const y = this.top
    const color = this.color
    const point1 = getEndPointByTrigonometric(x, y, 115, -11)
    const point2 = getEndPointByTrigonometric(x, y, 65, -11)
    const point3 = getEndPointByTrigonometric(x, y, 90, -13)
    this.graphics
      .beginFill(0x6c6c6c)
      .lineStyle(1, 0x6c6c6c)
      .drawPolygon([...[x, y], ...point1, ...point2])
      .drawCircle(...point3, this.circleSize)
      .beginFill(color)
      .lineStyle(1, color)
      .drawCircle(...point3, this.circleSize / 2)
    return this
  }
}

/**
 * @template T
 */
export class Matrix {
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
    this.current = init ? this.createMatrix(lengthX, lengthY, init) : null

  }

  /**
   * @template {T} N
   * @param {N} init 
   * @returns {N[][]}
   */
  createMatrix(lengthX, lengthY, init) {
    return new Array(lengthY || this.lengthY).fill(null).map(a => new Array(lengthX || this.lengthX).fill(init))
  }
  
  setLength(x, y) {
    this.lengthX = x
    this.lengthY = y
  }
}

/**
 * @template {number} T
 */
export class TimeMatrix extends Matrix {
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
     * @type {ITimeLimeChartModel[]}
     */
    this.list = []
    /**
     * @private
     * @type {number[]}
     */
    this.rowList = []
    this.matrixInit()
    this.matrixUpdate()
  }

  matrixInit() {
    this.list = this.filter ? this.collection.all().filter(p => this.filter(p)) : this.collection.all()
    this.rowList = this.list.map(p => this.getMatrixRow(String(p.id), this.idMatrix))
  }

  matrixUpdate() {
    const lengthX = this.lengthX
    const lengthY = this.isCollapse ? 0 : this.idMatrix.length
    const matrix = this.createMatrix(lengthX, lengthY, 0)
    this.map.clear()
    this.list.forEach((model, index) => {
      const row = this.rowList[index]
      if (model.startTime < this.endTime && model.endTime > this.startTime) {
        // console.log(`${model.startTime} < ${this.endTime}`, `${model.endTime} > ${this.startTime}`);
        if (this.isCollapse) {
          this.createStackMatrix(model, matrix)
        } else {
          this.createExpandMatrix(model, matrix, row)
        }
      }
    })
    this.setLength(matrix[0].length, matrix.length)
    this.current = matrix
    // console.log(this.map);
    // console.log(this.current);
  }

  /**
   * @param {ITimeLimeChartModel} model 
   * @param {number[][]} matrix 
   * @param {number} row 
   */
  createExpandMatrix(model, matrix, row) {
    const startColumn = Math.floor((model.startTime - this.startTime) / this.pixelTime)
    let endColumn = Math.floor((model.endTime - this.startTime) / this.pixelTime)
    if (startColumn === endColumn) {
      endColumn += 1
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
   * @param {ITimeLimeChartModel} model 
   * @param {number[][]} matrix 
   * @param {number} row 
   */
  createStackMatrix(model, matrix, row = 0) {
    let currentTime = 0
    if (!matrix[row]) {
      matrix[row] = new Array(this.lengthX).fill(0)
    }
    for (let column = 0; column < matrix[row].length; column++) {
      currentTime = this.startTime + column * this.pixelTime
      const isInRange = currentTime > model.startTime && currentTime < model.endTime
      const isPoint = currentTime > model.startTime + this.pixelTime && currentTime <  model.startTime + this.pixelTime
      if (isInRange || isPoint) {
        const value = matrix[row][column]
        if (value === 0) {
          matrix[row][column] = 1
          this.map.set(`${column},${row}`, [model.id])
          continue
        }
        const models = this.map.get(`${column},${row}`)
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