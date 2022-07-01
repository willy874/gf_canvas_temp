import TimelineApplication from './components/timeline-app'

/**
 * @returns {TimelineApplication}
 */
export default function createTimeLine(options) {
  return new TimelineApplication(options)
}