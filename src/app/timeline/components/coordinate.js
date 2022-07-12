
import { getEndPointByTrigonometric } from '@base/utils'

export default class Coordinate {
  constructor(args) {
    const { graphics, color, eventId, top, left } = args

    /** @type {number} */
    this.top = top
    /** @type {number} */
    this.left = left
    /** @type {number} */
    this.color = color
    /** @type {number} */
    this.circleSize = 6
    /** @type {string|number} */
    this.eventId = eventId
    /** @type {Graphics} */
    this.graphics = graphics
    /** @type {number[]} */
    this.collision = [0, 0, 0, 0]
  }

  isCollision(x, y) {
    return this.circleSize + 2 >= Math.sqrt((this.left - x) ** 2 + (this.top - y + this.circleSize) ** 2)
  }

  drawCoordinateItem() {
    const x = this.left
    const y = this.top
    const color = this.color
    const point1 = getEndPointByTrigonometric(x, y, 115, -11)
    const point2 = getEndPointByTrigonometric(x, y, 65, -11)
    const point3 = getEndPointByTrigonometric(x, y, 90, -13)
    this.graphics
      .beginFill(0x6c6c6c)
      .lineStyle(1, 0x6c6c6c)
      .drawPolygon([...[x, y], ...point1, ...point2])
      .drawCircle(...point3, this.circleSize)
      .beginFill(color)
      .lineStyle(1, color)
      .drawCircle(...point3, this.circleSize / 2)
    return this
  }
}