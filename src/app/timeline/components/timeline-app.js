import {
  Application,
} from '@base/pixi';
import {
  EventCollection
} from '../data'
import {
  FontSize,
} from '@base/enums'
import dayjs from 'dayjs';

import DateLine from './dateline'
import EventChart from './event-chart'

/**
 * @typedef {Object} TimelineApplicationOptions
 * @property {number} startTime
 * @property {number} endTime
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
      startTime: 0,
      endTime: 0,
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
      startTime: this.options.startTime,
      endTime: this.options.endTime,
      baseX: this.options.x,
      baseY: this.options.y,
      baseWidth: this.options.width,
      baseHeight: this.options.height,
      fontSize: FontSize.SMALL,
      lineSolidWidth: 1,
      paddingBottom: 20,
      textHorizontalSpacing: 24,
      textVerticalSpacing: 2
    })

    const eventChart = new EventChart({
      app: this.app,
      startTime: this.options.startTime,
      endTime: this.options.endTime,
      baseX: this.options.x,
      baseY: this.options.y + dateLine.height,
      baseWidth: this.options.width,
      baseHeight: this.options.height,
      collection: this.options.collection,
    })

    this.useTickerEvent((t) => {
      dateLine._update(t)
      eventChart._update(t)
    })
  }

  setOptions(args) {
    const collection = new EventCollection(args.list)
    this.options.startTime = dayjs(args.startTime || collection.getMinStartTime()).valueOf()
    this.options.endTime = dayjs(args.endTime || collection.getMaxEndTime()).valueOf()
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