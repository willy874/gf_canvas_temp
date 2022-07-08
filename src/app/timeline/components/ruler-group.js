import {
  Graphics,
} from '@base/pixi';
import {
  EventType
} from '@base/enums';
import BaseContainer from "@base/components/base-container";
import RulerItem from "./ruler-item";

export default class RulerGroup extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      DateLine
    } = args

    // === Props Attribute ===
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine

    // === Base Attribute ===
    /** 
     * Plus Button
     * @type {Graphics} 
     */
    this.plusButton = new Graphics()
    this.plusButton.interactive = true
    this.plusButton.buttonMode = true
    this.plusButton.on(EventType.MOUSEDOWN, (e) => this.onPlusMouseDown(e))
    this.plusButton.on(EventType.MOUSEUP, (e) => this.onPlusMouseUp(e))

    this.addChild(this.createRulerItem(), this.plusButton)
    this.create()
  }

  draw() {
    this.plusButtonSize = 16
    const plusIconSolid = 2
    const plusIconSize = this.plusButtonSize - plusIconSolid * 2
    const circleX = this.plusButtonSize
    const circleY = this.canvasHeight - this.plusButtonSize
    this.plusButton
      // 
      .beginFill(0xffffff, 0.1)
      .lineStyle(plusIconSolid, 0x424242)
      .drawCircle(circleX, circleY, plusIconSize)
      .moveTo(circleX - plusIconSize / 2, circleY)
      .lineTo(circleX + plusIconSize / 2, circleY)
      .moveTo(circleX, circleY - plusIconSize / 2)
      .lineTo(circleX, circleY + plusIconSize / 2)
  }

  onPlusMouseDown(event) {
    this.isPlusClick = true
  }

  onPlusMouseUp(event) {
    if (this.isPlusClick) {
      this.appendRulerLine()
    }
  }

  createRulerItem(args = {}) {
    return new RulerItem({
      ...this.getArguments(),
      DateLine: this.DateLine,
      appendRulerLine: this.appendRulerLine.bind(this),
      removeRulerLine: this.removeRulerLine.bind(this),
      toTopRulerLine: this.toTopRulerLine.bind(this),
      ...args
    })
  }

  appendRulerLine(args = {}) {
    this.addChild(this.createRulerItem(args))
  }

  removeRulerLine(target) {
    this.removeChild(target)
  }

  toTopRulerLine(target) {
    this.removeChild(target)
    this.addChild(target)
  }
}