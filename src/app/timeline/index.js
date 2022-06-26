import {
  Application,
} from '@base/pixi';
import DateLine from './components/dateline'

/**
 * @param {TimelineProps} props 
 * @returns {Required<TimelineProps>}
 */
function getTimelineProps(props) {
  return {
    width: props.width,
    height: props.height,
    startTime: props.startTime || Date.now() - 1000 * 60 * 60 * 24 * 90, // 三個月
    endTime: props.endTime || Date.now(),
    x: props.x || 20,
    y: props.y || 40,
    list: props.list || [],
  }
}

/**
 * @typedef {Object} TimeLine 
 * @property {Application} app
 * @property {DateLine} dateline
 */
/**
 * @param {TimelineProps} props 
 * @returns {TimeLine}
 */
export default function createTimeLine(props) {
  const {
    width,
    height,
    startTime,
    endTime,
    x,
    y,
    list
  } = getTimelineProps(props)

  const app = new Application({
    width,
    height,
    backgroundColor: 0x000000,
    backgroundAlpha: 0.02
  })

  console.log(list);

  const dateline = new DateLine({
    startTime,
    endTime,
    baseX: x,
    baseY: y,
    baseWidth: width,
    baseHeight: height
  })

  app.stage.addChild(dateline.container)

  dateline.create()

  let time = 0
  app.ticker.add(() => {
    requestAnimationFrame((_time) => {
      const t = _time - time
      time = _time
      // 所有要進行動畫的元素
      dateline.update(t)
    })
  })

  return {
    app,
    dateline
  }
}