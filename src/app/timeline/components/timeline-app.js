import {
  Application,
} from '@base/pixi';
import {
  EventCollection
} from '../data'
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
 * @property {EventCollection<IEventModel> | null} collection
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
      collection: null
    }
    this.setOptions(args)


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
      startX: dateLine.baseStartX,
      endX: dateLine.baseEndX,
      x: this.options.x,
      y: dateLine.y + dateLine.height,
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      collection: this.options.collection,
    })

    this.app.stage.addChild(dateLine, eventChart)

    this.useTickerEvent((t) => {
      dateLine._update(t)
      eventChart._update(t)
    })
  }

  setOptions(args) {
    const collection = new EventCollection(args.list)
    this.options.unit = args.unit
    this.options.width = args.width
    this.options.height = args.height
    this.options.x = args.x
    this.options.y = args.y
    this.options.collection = collection
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