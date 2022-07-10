// import {
//   Graphics,
// } from '@base/pixi';
// import BaseContainer from '@base/components/base-container'
// import DynamicProperties from '@base/components/dynamic-properties'
// import {
//   Coordinate
// } from './coordinate';
// import {
//   EventType
// } from '@base/enums';

// export default class ChartItem extends BaseContainer {
//   constructor(args) {
//     super(args)
//     const {
//       props,
//       color,
//       model,
//       matrixInfo
//     } = args;

//     // === Props Attribute ===
//     /** @type {import('./timeline-app').TimelineApplicationOptions} */
//     this.props = props
//     const {
//       DateLine,
//     } = props.getComponents()

//     const {
//       startTime,
//       endTime,
//       title,
//       type,
//     } = model
//     const {
//       column,
//       row,
//       matrix,
//     } = matrixInfo

//     // === Props Attribute ===
//     /** @type {number} */
//     this.color = color
//     /** @type {number} */
//     this.column = column
//     /** @type {number} */
//     this.row = row
//     /** @type {string[][]} */
//     this.matrix = matrix
//     /** @type {number} */
//     this.startTime = startTime
//     /** @type {number} */
//     this.endTime = endTime
//     /** @type {string} */
//     this.title = title
//     /** @type {string} */
//     this.type = type
//     /** @type {import('./dateline').default} */
//     this.DateLine = DateLine;

//     // === Base Attribute ===
//     /** @type {Graphics} */
//     this.graphics = new Graphics()
//     /** @type {IDynamicProperties} */
//     this.widthInfo = new DynamicProperties({})
//     /** @type {IDynamicProperties} */
//     this.heightInfo = new DynamicProperties({
//       status: 2,
//     })
//     /** @type {IDynamicProperties} */
//     this.leftInfo = new DynamicProperties({
//       status: this.getChartLeft(),
//     })
//     /** @type {IDynamicProperties} */
//     this.topInfo = new DynamicProperties({
//       status: this.getChartTop(),
//     })

//     this.startCoordinate = new Coordinate({
//       ...this.getArguments(),
//       color,
//       model,
//       currentTime: startTime
//     })
//     this.endCoordinate = new Coordinate({
//       ...this.getArguments(),
//       color,
//       model,
//       currentTime: endTime
//     })

//     this.create()
//     this.addChild(this.graphics, this.startCoordinate, this.endCoordinate)
//     // 目前不需要 this.heightInfo, this.leftInfo, this.topInfo
//     this.addProperties(this.widthInfo)

//     // === Event ===
//     this.on(EventType.CLICK, (e) => this.onClick(e))
//   }

//   init() {
//     if (this.props.isInit) {
//       this.widthInfo.toTarget(this.getChartWidth(), 1000).then(() => {
//         this.endCoordinate.alpha = 1
//         this.startCoordinate.alpha = 1
//       })
//     } else {
//       this.widthInfo.toTarget(this.getChartWidth(), 0)
//       this.endCoordinate.alpha = 1
//       this.startCoordinate.alpha = 1
//     }

//   }

//   onClick(event) {
//     console.log('ChartItem : onClick', event);
//   }

//   getCurrentBoxInfo() {
//     return {
//       top: this.topInfo.status,
//       left: this.leftInfo.status,
//       width: this.widthInfo.status,
//       height: this.heightInfo.status,
//     }
//   }

//   getChartWidth() {
//     const rangeTime = this.endTime - this.startTime
//     const width = Math.floor(rangeTime / this.DateLine.basePixelTime)
//     return Math.max(width, 2)
//   }

//   getChartLeft() {
//     const rangeTime = this.props.baseTime - this.startTime
//     const diff = Math.floor(rangeTime / this.DateLine.basePixelTime)
//     const left = this.DateLine.baseX - diff
//     return left
//   }

//   getChartTop() {
//     return this.row * this.heightInfo.status + this.row * 16
//   }

//   draw() {
//     this.graphics
//       // 
//       .beginFill(0xffffff, 0)
//       .drawRect(0, 0, this.widthInfo.status, this.heightInfo.status + 16)
//       .beginFill(this.color)
//       .drawRect(0, 8, this.widthInfo.status, this.heightInfo.status)
//   }

//   update(t) {
//     this.endCoordinate.x = this.widthInfo.status
//   }
// }

import {
  getEndPointByTrigonometric
} from '@base/utils'

export default class ChartItem {
  constructor(args) {
    const {
      props,
      color,
      type,
      model,
      matrixInfo,
      chartHeight,
      chartPaddingY
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
    /** @type {import('@base/class').MatrixInfo} */
    this.matrixInfo = matrixInfo
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;

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
  }

  getChartLeft() {
    const rangeTime = this.props.baseTime - this.model.startTime
    const diff = Math.floor(rangeTime / this.DateLine.basePixelTime)
    const left = this.DateLine.baseX - diff
    return left
  }

  getChartTop() {
    return this.matrixInfo.row * this.getChartHeigh()
  }

  getChartWidth() {
    const rangeTime = this.model.endTime - this.model.startTime
    const width = Math.floor(rangeTime / this.DateLine.basePixelTime)
    return Math.max(width, 2)
  }

  getChartHeigh() {
    return this.chartHeight + this.chartPaddingY * 2
  }

  update(position = {}) {
    const {
      left,
      top,
      width,
      height
    } = position
    this.left = left || this.getChartLeft()
    this.top = top || this.getChartTop()
    this.width = width || this.getChartWidth()
    this.height = height || this.getChartHeigh()
  }

  /**
   * @param {Graphics} graphics 
   */
  draw(graphics) {
    this.drawCart(graphics)
    this.drawCoordinates(graphics, this.left)
    this.drawCoordinates(graphics, this.left + this.width)
  }


  /**
   * @param {Graphics} graphics 
   */
  drawCart(graphics) {
    graphics
      .beginFill(0, 0)
      .lineStyle(0, 0)
      .drawRect(this.left, this.top, this.width, this.height)
      .beginFill(this.color)
      .drawRect(this.left, this.chartPaddingY + this.top, this.width, this.chartHeight)
  }



  /**
   * @param {Graphics} graphics 
   */
  drawCoordinates(graphics, x) {
    if (this.props.isShowCoordinates) {
      const y = this.top + this.height / 2 - this.chartHeight
      const point1 = getEndPointByTrigonometric(x, y, 115, -11)
      const point2 = getEndPointByTrigonometric(x, y, 65, -11)
      const point3 = getEndPointByTrigonometric(x, y, 90, -13)
      graphics
        .beginFill(0x6C6C6C)
        .lineStyle(1, 0x6C6C6C)
        .drawPolygon([
          ...[x, y],
          ...point1,
          ...point2
        ])
        .drawCircle(...point3, 6)
        .beginFill(this.color)
        .lineStyle(1, this.color)
        .drawCircle(...point3, 3)
    }
  }
}