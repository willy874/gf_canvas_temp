import {
  Application,
} from '@base/pixi';
import {
  FontSize,
  EventType
} from '@base/enums'
import DateLine from './dateline'
import EventChart from './event-chart'
import RulerGroup from './ruler-group'
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
    /** @type {boolean} */
    this.isMouseDown = false
    /** @type {number} */
    this.translateX = 0

    this.app = new Application({
      width: this.options.width,
      height: this.options.height,
      backgroundAlpha: 0
    })
    /** @type {RootContainer} */
    this.root = new RootContainer({
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      app: this.app,
    })
    /** @type {DateLine} */
    this.dateLine = this.createDateLine()
    /** @type {EventChart} */
    this.eventChart = this.createEventChart()
    /** @type {RulerGroup} */
    this.rulerLine = this.createRulerGroup()

    this.root.addChild(this.dateLine, this.rulerLine, this.eventChart)
    this.app.stage.addChild(this.root)

    const canvas = this.app.view
    canvas.addEventListener(EventType.WEBGLCONTEXTLOST, (e) => e.preventDefault());
    canvas.addEventListener(EventType.WEBGLCONTEXTRESTORED, (e) => window.location.reload());

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
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      root: this.root,
      translateX: this.translateX,
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
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      root: this.root,
      types: this.options.types,
      app: this.app,
      DateLine: this.dateLine,
      unit: this.options.unit,
      translateX: this.translateX,
      colors: [0xFFB2C1, 0xA0D0F5, 0xFFE6AE, 0xABDFE0, 0xCCB2FF],
    })
  }

  createRulerGroup(isInit = true) {
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
    return new RulerGroup({
      isInit,
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      root: this.root,
      types: this.options.types,
      app: this.app,
      DateLine: this.dateLine,
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