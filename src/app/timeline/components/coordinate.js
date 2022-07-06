import {
  Graphics,
} from '@base/pixi';
import BaseContainer from "@base/components/base-container";

export class Coordinate extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      isInit,
      color,
      model,
      currentTime,
    } = args

    // === Props Attribute ===
    /** @type {boolean} */
    this.isInit = isInit
    /** @type {number} */
    this.color = color
    /** @type {ITimeLimeChartModel} */
    this.model = model
    /** @type {number} */
    this.currentTime = currentTime
    /** @type {boolean} */
    this.isStart = this.model.startTime === currentTime
    /** @type {boolean} */
    this.isEnd = this.model.endTime === currentTime
    /** @type {number} */
    this.alpha = 0

    // === Base Attribute ===
    /** @type {boolean} */
    this.interactive = true
    /** @type {boolean} */
    this.buttonMode = true

    // === Event ===
    this.on('click', (e) => this.onClick(e))

    this.graphics = new Graphics()
    this.addChild(this.graphics)
  }

  onClick(event) {

  }

  draw() {
    this.graphics.beginFill(0x6C6C6C);
    this.graphics.lineStyle(1, 0x6C6C6C);
    this.graphics.drawPolygon([0, 7, -4, -1, 4, -1])
    this.graphics.drawCircle(0, -5, 6)

    this.graphics.beginFill(this.color);
    this.graphics.lineStyle(1, this.color);
    this.graphics.drawCircle(0, -5, 3)
  }

}