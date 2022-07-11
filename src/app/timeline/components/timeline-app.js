import {
  Application,
} from '@base/pixi';
import {
  FontSize,
  EventType,
  TimeUnit,
  FontFamily
} from '@base/enums'
import DateLine from './dateline'
import EventChart from './event-chart'
import RulerGroup from './ruler-group'
import RootContainer from '@base/components/root'
import {
  fetchEventData
} from '../mock'
import {
  dateFormat,
  dateToNumber,
  getUnitValue
} from '@base/utils';



/**
 * @typedef {Object} TimelineApplicationArguments
 * @property {boolean} isInit
 * @property {boolean} isShowCoordinates
 * @property {number | string} unit
 * @property {number|string|Date} baseTime
 * @property {number} width
 * @property {number} height
 * @property {IEventTypeModel[]} types
 */
/**
 * @typedef {Object} TimelineComponents
 * @property {DateLine} DateLine
 * @property {RulerGroup} RulerLine
 * @property {EventChart} EventChart
 */
/**
 * @typedef {Object} TimelineApplicationOptions
 * @property {boolean} isInit
 * @property {boolean} isShowCoordinates
 * @property {number | string} unit
 * @property {number} canvasWidth
 * @property {number} canvasHeight
 * @property {number} baseTime
 * @property {IEventTypeModel[]} types
 * @property {number} translateX
 * @property {number} translateY
 * @property {FontSize} fontSize
 * @property {FontFamily} fontFamily
 * @property {number} lineSolidWidth
 * @property {number} textPaddingX
 * @property {number} textPaddingY
 * @property {number[]} colors
 * @property {() => TimelineComponents} getComponents
 */
export default class TimelineApplication {
  constructor(args = {}) {
    /** @type {TimelineApplicationOptions} */
    this.options = this.resolveOptions(args)

    this.app = new Application({
      width: this.options.canvasWidth,
      height: this.options.canvasHeight,
      backgroundAlpha: 0
    })
    /** @type {RootContainer} */
    this.root = new RootContainer({
      props: this.options,
      app: this.app,
    })
    /** @type {DateLine} */
    this.dateLine = this.createDateLine()
    /** @type {RulerGroup} */
    this.rulerLine = this.createRulerGroup()
    /** @type {EventChart} */
    this.eventChart = this.createEventChart()

    // console.log('dateLine', this.dateLine);
    // console.log('rulerLine', this.rulerLine);
    // console.log('eventChart', this.eventChart);

    this.root.addChild(this.dateLine, this.rulerLine, this.eventChart)
    this.app.stage.addChild(this.root)

    const canvas = this.app.view
    canvas.addEventListener(EventType.WEBGLCONTEXTLOST, (e) => e.preventDefault());
    canvas.addEventListener(EventType.WEBGLCONTEXTRESTORED, (e) => window.location.reload());

    fetchEventData().then(data => {
      if (data) {
        this.options.types = data
        this.eventChart.init()
        // data.forEach(typeModel => {
        //   const map = {};
        //   typeModel.data.forEach(p => {
        //     if (map[p.inScrubbingCenterTime]) {
        //       map[p.inScrubbingCenterTime].push(p)
        //     } else {
        //       map[p.inScrubbingCenterTime] = [p]
        //     }
        //   });
        //   console.log(typeModel.name, 'Event', map);
        // })
      }
    })
  }

  checkDepend() {
    if (!this.app) {
      throw new Error('Application is not defined.')
    }
    if (!this.options) {
      throw new Error('Options is not defined.')
    }
    if (!this.root) {
      throw new Error('RootContainer is not defined.')
    }
    return false;
  }

  createDateLine() {
    if (this.checkDepend()) {
      throw new Error('About depend is not defined.')
    }
    return new DateLine({
      props: this.options,
      app: this.app,
      root: this.root,
    })
  }

  createRulerGroup() {
    if (this.checkDepend()) {
      throw new Error('About depend is not defined.')
    }
    if (!this.dateLine) {
      throw new Error('DateLine is not defined.')
    }
    return new RulerGroup({
      props: this.options,
      app: this.app,
      root: this.root,
    })
  }

  createEventChart() {
    if (this.checkDepend()) {
      throw new Error('About depend is not defined.')
    }
    if (!this.dateLine) {
      throw new Error('DateLine is not defined.')
    }
    if (!this.rulerLine) {
      throw new Error('RulerLine is not defined.')
    }
    return new EventChart({
      props: this.options,
      app: this.app,
      root: this.root,
    })
  }

  /**
   * @param {Partial<TimelineApplicationArguments>} args
   */
  setOptions(args) {
    const options = this.resolveOptions(args)
    if (typeof args.isShowCoordinates !== 'undefined') this.options.isShowCoordinates = options.isShowCoordinates
    if (typeof args.unit !== 'undefined') this.options.unit = options.unit
    if (typeof args.baseTime !== 'undefined') this.options.baseTime = options.baseTime
    if (typeof args.types !== 'undefined') this.options.types = options.types
  }

  /**
   * @param {Partial<TimelineApplicationArguments>} args 
   * @returns {TimelineApplicationOptions}
   */
  resolveOptions(args) {
    const unit = args.unit || args.unit === 0 ? args.unit : TimeUnit.SECOND
    const baseTime = this.getBaseTime(args.baseTime, unit)
    return {
      // Arguments
      isInit: typeof args.isInit === 'boolean' ? args.isInit : true,
      isShowCoordinates: typeof args.isShowCoordinates === 'boolean' ? args.isShowCoordinates : true,
      unit,
      canvasWidth: typeof args.width === 'number' ? args.width : this.app.view.width,
      canvasHeight: typeof args.height === 'number' ? args.height : this.app.view.height,
      baseTime,
      types: args.types || [],
      translateX: 0,
      translateY: 0,
      // Static
      fontSize: FontSize.SMALL,
      fontFamily: FontFamily.SANS_SERIF,
      lineSolidWidth: 1,
      textPaddingX: 4,
      textPaddingY: 4,
      colors: [0xFFB2C1, 0xA0D0F5, 0xFFE6AE, 0xABDFE0, 0xCCB2FF],

      // @ts-ignore Components
      getComponents: () => ({
        DateLine: this.dateLine,
        RulerLine: this.rulerLine,
        EventChart: this.eventChart,
      })
    }
  }

  getBaseTime(time, unit) {
    const date = new Date(time)
    if (String(date) === 'Invalid Date') {
      return Date.now()
    }
    const value = getUnitValue(unit)
    const minute = 1000 * 60
    const hour = 1000 * 60 * 60
    const day = 1000 * 60 * 60 * 24
    const month = 1000 * 60 * 60 * 24 * 30
    switch (true) {
      case value >= month:
        return dateToNumber(dateFormat(time, 'YYYY/MM'))
      case value >= day:
        return dateToNumber(dateFormat(time, 'YYYY/MM/DD'))
      case value >= hour:
        return dateToNumber(dateFormat(time, 'YYYY/MM/DD HH'))
      case value >= minute:
        return dateToNumber(dateFormat(time, 'YYYY/MM/DD HH:mm'))
      default:
        return new Date(unit).valueOf()
    }
  }

}