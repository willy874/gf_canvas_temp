
import {
  Text,
} from '@base/pixi';
import {
  dateFormat,
} from '@base/utils'

export default class TimeText extends Text {
  constructor(args) {
    const { props, date, format } = args
    super('', {
      fontFamily: props.fontFamily,
      fontSize: props.fontSize,
      fontWeight: '400',
      align: 'center',
      ...args
    })

    /** @type {import('./timeline-app').TimelineApplicationOptions} */
    this.props = props

    /** @type {number} */
    this.date = date
    /** @type {string} */
    this.format = format
    this.update()
  }

  setTime(date) {
    this.date = date
    this.update()
  }

  setFormat(format) {
    this.format = format
    this.update()
  }

  setPosition(x, y) {
    this.x = x - this.width / 2
    this.y = y + this.props.textPaddingY
  }

  update() {
    this.text = dateFormat(this.date, this.format)
  }
}