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
    // console.log('onMouseout', event, event.data.global, event.target);
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
      if (this.isScaleDrag) {
        this.onScalemove(originalEvent)
      }
      if (this.isRulerDrag) {
        this.onRulermove(originalEvent)
      }
    }
    if (originalEvent instanceof TouchEvent) {
      // 觸控處理
    }
  }

  /**
   * @param {PointerEvent | MouseEvent} event 
   */
  onScalemove(event) {
    GlobalEvent.emit(EventType.SCALEMOVE, event)
  }

  /**
   * @param {PointerEvent | MouseEvent} event 
   */
  onRulermove(event) {
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
    // console.log('onMouseup');
    this.onDragEnd(event)
  }

  /**
   * @param {InteractionEvent| Event} event 
   */
  onDragStart(event) {
    // 切換 cursor
    this.getApplication().view.style.cursor = 'all-scroll'
    const cursorStyles = this.getApplication().renderer.plugins.interaction.cursorStyles
    cursorStyles.default = 'all-scroll'
    cursorStyles.pointer = 'all-scroll'
  }

  /**
   * @param {InteractionEvent| Event} event 
   */
  onDragEnd(event) {
    this.isScaleDrag = false
    this.isRulerDrag = false
    this.target = null
    this.dragTriggedCount = 0
    // 切換 cursor
    this.getApplication().view.style.cursor = 'default'
    const cursorStyles = this.getApplication().renderer.plugins.interaction.cursorStyles
    cursorStyles.default = 'default'
    cursorStyles.pointer = 'pointer'
  }
}