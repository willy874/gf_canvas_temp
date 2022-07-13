import {
  EventType
} from '@base/enums'
import {
  Graphics
} from '@base/pixi';
import {
  GlobalEvent
} from '@base/utils'
import BaseContainer from "./base-container"

// class CanvasMoveEvent extends CustomEvent {
//   /**
//    * @param {InteractionEvent} event 
//    */
//   constructor(event) {
//     super(EventType.CANVASMOVE, { detail: event })
//   }
// }

export default class RootContainer extends BaseContainer {
  /**
   * @type {import('./base-container').BaseContainerConstructor}
   */
  constructor(args) {
    super(args)

    this.useTickerEvent((t) => {
      this.tickerRender(t)
    })
    const {
      props,
      app
    } = args

    // === Base Attribute ===
    /** @type {any} */
    this.props = props
    /** @type {Application} */
    this.app = app
    /** @type {boolean} */
    this.isStopPropagation = false
    /** @type {boolean} */
    this.isScaleDrag = false
    /** @type {boolean} */
    this.isRulerDrag = false
    /** @type {number} */
    this.dragTriggedCount = 0
    /** @type {any} */
    this.target = null
    /** @type {boolean} */
    this.interactive = true

    this.on(EventType.POINTERMOVE, (e) => this.onPointmove(e))
    this.on(EventType.MOUSEDOWN, (e) => this.onMousedown(e))
    this.on(EventType.MOUSEOUT, (e) => this.onMouseout(e))
    this.on(EventType.MOUSEUP, (e) => this.onMouseup(e))
    this.on(EventType.MOUSEOVER, (e) => this.onMouseover(e))

    this.getApplication().renderer.plugins.interaction.cursorStyles['all-scroll'] = 'all-scroll'

    this.graphics = new Graphics()
    this.addChild(this.graphics)
  }

  draw() {
    this.graphics.beginFill(0xffffff, 0.1).drawRect(0, 0, this.props.canvasWidth, this.props.canvasHeight)
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

  /**
   * @param {InteractionEvent} event 
   */
  onMousedown(event) {
    this.onDragStart(event)
    this.isScaleDrag = true
  }

  /**
   * @param {InteractionEvent} event 
   */
  onPointmove(event) {
    this.dragTriggedCount++
    const originalEvent = event.data.originalEvent
    if (originalEvent instanceof PointerEvent || originalEvent instanceof MouseEvent) {
      switch (true) {
        case this.isScaleDrag:
          this.onScalemove(originalEvent)
          break;
        case this.isRulerDrag:
          this.onRulermove(originalEvent)
          break;
        default: 
          this.onCanvasMove(event)
      }
    }
  }
  
  /**
   * @param {InteractionEvent} event 
   */
  onCanvasMove(event) {
    GlobalEvent.emit(EventType.CANVASMOVE, event)
  }

  /**
   * @param {PointerEvent | MouseEvent} event 
   */
  onScalemove(event) {
    if (this.dragTriggedCount >= 5) {
      this.setCursor('all-scroll')
    }
    GlobalEvent.emit(EventType.SCALEMOVE, event)
  }

  /**
   * @param {PointerEvent | MouseEvent} event 
   */
  onRulermove(event) {
    if (this.dragTriggedCount >= 5) {
      this.setCursor('all-scroll')
    }
    GlobalEvent.emit(EventType.RULERMOVE, event)
  }

  /**
   * @param {InteractionEvent} event 
   */
  onMouseout(event) {
    this.onDragEnd(event)
  }

  /**
   * @param {InteractionEvent} event 
   */
  onMouseover(event) {}

  /**
   * @param {InteractionEvent} event 
   */
  onMouseup(event) {
    this.onDragEnd(event)
  }

  /**
   * @param {InteractionEvent| Event} event 
   */
  onDragStart(event) {
  }

  /**
   * @param {InteractionEvent| Event} event 
   */
  onDragEnd(event) {
    this.isScaleDrag = false
    this.isRulerDrag = false
    this.target = null
    this.dragTriggedCount = 0
    this.setCursor()
  }

  setCursor(type = 'default') {
    this.getApplication().renderer.plugins.interaction.cursor = type
  }
}