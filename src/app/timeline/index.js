import {
  Application,
} from '@base/pixi';
import {
  EventCollection
} from './data'
import {
  FontSize,
} from '@base/enums'
import DateLine from './components/dateline'
import EventChart from './components/event-chart'


/**
 * @typedef {Object} TimeLine 
 * @property {Application} app
 * @property {DateLine} dateLine
 * @property {EventChart} eventChart
 * @property {EventCollection} collection
 */
/**
 * @param {TimelineProps} options 
 * @returns {TimeLine}
 */
export default function createTimeLine(options) {
  // BaseProps
  const collection = new EventCollection(options.list)
  const width = options.width
  const height = options.height
  const baseX = options.x
  const baseY = options.y
  const startTime = options.startTime || collection.getMinStartTime()
  const endTime = options.startTime || collection.getMaxEndTime()

  const dataLineProps = {
    fontSize: FontSize.SMALL,
    lineSolidWidth: 1,
    paddingBottom: 20,
    textHorizontalSpacing: 24,
    textVerticalSpacing: 2
  }
  const dataLineHeight = dataLineProps.fontSize + dataLineProps.lineSolidWidth + dataLineProps.textVerticalSpacing + dataLineProps.paddingBottom

  // Instance
  const app = new Application({
    width,
    height,
    backgroundColor: 0x000000,
    backgroundAlpha: 0.02
  })

  const dateLine = new DateLine({
    startTime,
    endTime,
    baseX,
    baseY,
    baseWidth: width,
    baseHeight: height,
    ...dataLineProps
  })

  const eventChart = new EventChart({
    baseX,
    baseY: baseY + dataLineHeight,
    baseWidth: width,
    baseHeight: height,
  })

  // Add Stage
  app.stage.addChild(dateLine.container)
  app.stage.addChild(eventChart.container)

  // Create Stage
  dateLine.create()
  eventChart.create()

  // Add Ticker
  let time = 0
  app.ticker.add(() => {
    requestAnimationFrame((_time) => {
      const t = _time - time
      time = _time
      // 所有要進行動畫的元素
      dateLine.update(t)
      eventChart.update(t)
    })
  })

  return {
    app,
    dateLine,
    eventChart,
    collection
  }
}