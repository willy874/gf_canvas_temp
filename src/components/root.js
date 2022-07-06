import {
  EventType
} from '@base/enums'
import {
  EventEmitter2 as EventEmitter
} from 'eventemitter2';
import {
  MoveEvent
} from '@base/class'
import BaseContainer from "./base-container"

export default class RootContainer extends BaseContainer {
  constructor(args) {
    super(args)
    /** @type {EventEmitter} */
    this.event = new EventEmitter()

    this.useTickerEvent((t) => {
      this.tickerRender(t)
    })
    const canvas = this.getApplication().view
    canvas.addEventListener(EventType.MOUSEDOWN, (e) => this.onMousedown(e))
    canvas.addEventListener(EventType.MOUSEMOVE, (e) => this.onMousemove(e))
    canvas.addEventListener(EventType.MOUSEOUT, (e) => this.onMouseout(e))
    canvas.addEventListener(EventType.MOUSEUP, (e) => this.onMouseup(e))
    canvas.addEventListener(EventType.WEBGLCONTEXTLOST, (e) => e.preventDefault());
    canvas.addEventListener(EventType.WEBGLCONTEXTRESTORED, (e) => this.initWebGL(e));
  }

  useTickerEvent(callback) {
    let time = 0
    this.getApplication().ticker.add(() => {
      requestAnimationFrame((_time) => {
        const t = _time - time
        time = _time
        callback(t)
      })
    })
  }

  initWebGL(e) {
    window.location.reload()
  }

  onMousedown(event) {
    this.translateX = event.clientX
    this.translateY = event.clientY
    this.isMouseDown = true
    this.event.emit(EventType.MOUSEDOWN, event)
  }

  onMousemove(event) {
    if (this.isMouseDown) {
      const moveX = event.clientX - this.translateX
      const moveY = event.clientY - this.translateY
      this.translateX = event.clientX
      this.translateY = event.clientY
      this.onDragmove(new MoveEvent(event, {
        moveX,
        moveY
      }))
      this.event.emit(EventType.DRAGMOVE, event)
    }
  }

  onDragmove(event) {
    this.event.emit(EventType.DRAGMOVE, event)
  }

  onMouseout(event) {
    this.isMouseDown = false
    this.event.emit(EventType.MOUSEOUT, event)
  }

  onMouseup(event) {
    this.isMouseDown = false
    this.event.emit(EventType.MOUSEUP, event)
  }
}