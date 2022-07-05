import {
  Application,
  Graphics
} from '@base/pixi';
import {
  FontSize
} from '@base/enums'

import DateLine from './dateline'
import EventChart from './event-chart'

// * @property {number} startTime
// * @property {number} endTime
/**
 * @typedef {Object} TimelineApplicationOptions
 * @property {number | string} unit
 * @property {number} width
 * @property {number} height
 * @property {number} x
 * @property {number} y
 * @property {ITimeLimeChartModel[]} types
 */

export default class TimelineApplication {
  constructor(args = {}) {
    /** @type {TimelineApplicationOptions} */
    this.options = {
      unit: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      types: []
    }
    this.setOptions(args)
    this.graphics = new Graphics()

    this.app = new Application({
      width: this.options.width,
      height: this.options.height,
      backgroundColor: 0x000000,
      backgroundAlpha: 0.02
    })

    const dateLine = new DateLine({
      app: this.app,
      unit: this.options.unit,
      translateX: 0,
      translateY: 0,
      x: this.options.x,
      y: this.options.y,
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      fontSize: FontSize.SMALL,
      lineSolidWidth: 1,
      textPaddingX: 2,
      textPaddingY: 2,
    })

    const eventChart = new EventChart({
      app: this.app,
      startTime: dateLine.startTime,
      endTime: dateLine.endTime,
      effectWidth: dateLine.baseEndX - dateLine.baseStartX,
      x: this.options.x + dateLine.baseStartX,
      y: dateLine.y + dateLine.lineBaseY,
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      types: this.options.types,
      colors: [0xFFB2C1, 0xA0D0F5, 0xFFE6AE, 0xABDFE0, 0xCCB2FF],
    })

    this.app.stage.addChild(dateLine, eventChart, this.graphics)

    this.useTickerEvent((t) => {
      dateLine._update(t)
      eventChart._update(t)
    })

    // this.graphics.lineStyle(1, 0xff0000)
    // const textX = this.options.x + dateLine.baseStartX
    // const textY = dateLine.y + dateLine.lineBaseY
    // this.graphics.moveTo(textX, textY)
    // this.graphics.lineTo(textX + (dateLine.baseEndX - dateLine.baseStartX), textY)
  }

  setOptions(args) {
    this.options.unit = args.unit
    this.options.width = args.width
    this.options.height = args.height
    this.options.x = args.x
    this.options.y = args.y
    this.options.types = args.types
  }

  useTickerEvent(callback) {
    let time = 0
    this.app.ticker.add(() => {
      requestAnimationFrame((_time) => {
        const t = _time - time
        time = _time
        callback(t)
      })
    })
  }
}