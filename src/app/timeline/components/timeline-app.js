import {
  Application,
  Graphics
} from '@base/pixi';
import {
  FontSize,
} from '@base/enums'
import DateLine from './dateline'
import EventChart from './event-chart'
import RootContainer from '@base/components/root'
import {
  fetchEventData
} from '../mock'

/**
 * @typedef {Object} TimelineApplicationOptions
 * @property {number | string} unit
 * @property {number} width
 * @property {number} height
 * @property {ITimeLimeChartModel[]} types
 */

export default class TimelineApplication {
  constructor(args = {}) {
    /** @type {TimelineApplicationOptions} */
    this.options = this.resolveOptions(args)
    /** @type {Graphics} */
    this.graphics = new Graphics()
    /** @type {boolean} */
    this.isMouseDown = false
    /** @type {number} */
    this.translateX = 0
    /** @type {number} */
    this.translateY = 0

    this.app = new Application({
      width: this.options.width,
      height: this.options.height,
      backgroundColor: 0x000000,
      backgroundAlpha: 0.02
    })
    /** @type {RootContainer} */
    this.root = new RootContainer({
      app: this.app,
    })
    /** @type {DateLine} */
    this.dateLine = this.createDateLine()
    /** @type {EventChart} */
    this.eventChart = this.createEventChart()

    this.root.addChild(this.dateLine, this.eventChart, this.graphics)
    this.app.stage.addChild(this.root)


    fetchEventData().then(data => {
      if (data) this.eventChart.setAttribute('types', data)
    })
  }

  createDateLine(isInit = true) {
    if (!this.app) {
      throw new Error('Application is not defined.')
    }
    if (!this.options) {
      throw new Error('Options is not defined.')
    }
    if (!this.root) {
      throw new Error('RootContainer is not defined.')
    }
    return new DateLine({
      isInit,
      app: this.app,
      unit: this.options.unit,
      translateX: 0,
      translateY: 0,
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      event: this.root.event,
      fontSize: FontSize.SMALL,
      lineSolidWidth: 1,
      textPaddingX: 4,
      textPaddingY: 4,
    })
  }

  createEventChart(isInit = true) {
    if (!this.app) {
      throw new Error('Application is not defined.')
    }
    if (!this.options) {
      throw new Error('Options is not defined.')
    }
    if (!this.dateLine) {
      throw new Error('DateLine is not defined.')
    }
    if (!this.root) {
      throw new Error('RootContainer is not defined.')
    }
    return new EventChart({
      isInit,
      app: this.app,
      startTime: this.dateLine.startTime,
      endTime: this.dateLine.endTime,
      effectWidth: this.dateLine.baseEndX - this.dateLine.baseStartX,
      x: this.dateLine.baseStartX,
      y: this.dateLine.y + this.dateLine.lineBaseY,
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      types: this.options.types,
      event: this.root.event,
      colors: [0xFFB2C1, 0xA0D0F5, 0xFFE6AE, 0xABDFE0, 0xCCB2FF],
    })
  }

  /**
   * @param {Partial<TimelineApplicationOptions>} args
   */
  setOptions(args) {
    const options = this.resolveOptions(args)
    this.options.unit = options.unit
    this.options.width = options.width
    this.options.height = options.height
    this.options.types = options.types
  }

  /**
   * @param {Partial<TimelineApplicationOptions>} args 
   * @returns {TimelineApplicationOptions}
   */
  resolveOptions(args) {
    return {
      unit: args.unit,
      width: args.width,
      height: args.height,
      types: args.types
    }
  }

}