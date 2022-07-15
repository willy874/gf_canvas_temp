import TimelineApplication from './components/timeline-app'

/**
 * @returns {TimelineApplication}
 */
export default function createTimeLine(options) {
  console.time()
  const canvas = new TimelineApplication(options)
  console.timeEnd()
  return canvas
}