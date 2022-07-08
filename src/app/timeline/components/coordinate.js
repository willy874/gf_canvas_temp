import {
  Graphics,
} from '@base/pixi';
import {
  EventType
} from '@base/enums'
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
    this.on(EventType.CLICK, (e) => this.onClick(e))
    this.on(EventType.DBLCLICK, (e) => this.onDoubleClick(e))
    this.on(EventType.MOUSEDOWN, (e) => this.onMousedown(e))
    this.on(EventType.MOUSEUP, (e) => this.onMouseup(e))

    this.graphics = new Graphics()
    this.addChild(this.graphics)
  }

  onClick(event) {
    event.stopPropagation()
    // console.log('Coordinate : onClick', event);
  }

  onDoubleClick(event) {
    event.stopPropagation()
    // console.log('Coordinate : onDoubleClick', event);
  }

  onMousedown(event) {
    event.stopPropagation()
    // console.log('Coordinate : onMousedown', event);
  }

  onMouseup(event) {
    event.stopPropagation()
    // console.log('Coordinate : onMouseup', event);
  }

  draw() {
    this.graphics
      // 
      .beginFill(0x6C6C6C)
      .lineStyle(1, 0x6C6C6C)
      .drawPolygon([0, 7, -4, -1, 4, -1])
      .drawCircle(0, -5, 6)
      .beginFill(this.color)
      .lineStyle(1, this.color)
      .drawCircle(0, -5, 3)
  }

}