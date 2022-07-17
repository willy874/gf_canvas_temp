/** @typedef {import('@base/enums').TimeUnit} TimeUnit */
import BaseContainer from '@base/components/base-container'
import ChartGroup from './chart-group'
import {
  Graphics,
  Text
} from '@base/pixi';
import {
  Collection,
  GlobalEvent
} from '@base/utils';
import {
  uniq
} from '@base/utils/lodash';
import {
  EventType
} from '@base/enums';

export default class EventChart extends BaseContainer {
  constructor(args) {
    super(args)
    const {
      props,
    } = args;

    /** @type {TimelineApplicationOptions} */
    this.props = props

    // === Components ===
    const {
      DateLine,
      RulerLine,
    } = this.props.getComponents()
    /** @type {import('./dateline').default} */
    this.DateLine = DateLine;
    /** @type {import('./ruler-group').default} */
    this.RulerLine = RulerLine;

    // === Base Attribute ===
    /** @type {number} */
    this.translateY = 0;
    /** @type {ICollection<ITimeLimeChartModel>} */
    this.collection = new Collection()
    /** @type {number} */
    this.tipX = 0
    /** @type {number} */
    this.tipY = 0
    /** @type {number} */
    this.tipMaxTextLength = 15
    /** @type {boolean} */
    this.isShowTip = false
    /** @type {ITimeLimeChartModel[]} */
    this.target = null
    /** @type {Text} */
    this.tipText = new Text('', {
      fontWeight: '400',
      fontSize: this.props.fontSize,
      fontFamily: this.props.fontFamily
    })

    GlobalEvent.on(EventType.SCALEMOVE, (e) => this.onScalemove(e))

    /** @type {Graphics} */
    this.graphics = new Graphics()
    /** @type {Graphics} */
    this.tipGraphics = new Graphics()
    this.create()
  }

  init() {
    this.props.types.forEach(model => {
      model.data.forEach(m => this.collection.set(m.id, m))
    })
    const children = this.props.isAllCollapse ? [this.getCharGroup(this.collection, -1)] : this.getCharGroupList()
    children.forEach(container => {
      container.markGraphics.interactive = true
      container.markGraphics.buttonMode = true
      container.markGraphics.on(EventType.MOUSEOVER, (e) => {
        this.target = []
      })
      container.markGraphics.on(EventType.MOUSEOUT, (e) => {
        this.target = null
      })
      container.markGraphics.on(EventType.POINTERMOVE, (e) => this.onMarkMouseMove(e, container))
      container.markGraphics.on(EventType.CLICK, (e) => this.onMarkClick(e, container))
    })
    this.refreshChildren(...children, this.tipGraphics, this.tipText)
  }

  /**
   * @param {PointerEvent|MouseEvent} event 
   */
  onScalemove(event) {
    const top = this.translateY + event.movementY
    if (top <= this.DateLine.paddingBottom / 2) {
      this.translateY = top
    }
    this.callChartGroup((container) => {
      if (container instanceof ChartGroup) {
        container.matrix.update({
          pixelTime: this.DateLine.getPixelTime(),
          startTime: this.DateLine.getViewStartTime(),
          endTime: this.DateLine.getViewEndTime(),
        })
        container.matrix.matrixUpdate()
      }
    })
  }

  /**
   * @param {InteractionEvent} event 
   * @param {ChartGroup} container 
   */
  targetUpdate(event, container) {
    const originalEvent = event.data.originalEvent
    if (originalEvent instanceof MouseEvent || originalEvent instanceof PointerEvent) {
      this.tipX = event.data.global.x
      this.tipY = event.data.global.y
      if (this.target) {
        const marks = container.markList.filter(m => m.isCollision(this.tipX, this.tipY))
        if (marks.length) {
          this.target = marks.map(p => p.getModelList()).flat()
        }
      }
    }
  }

  /**
   * @param {InteractionEvent} event 
   * @param {ChartGroup} container 
   */
  onMarkMouseMove(event, container) {
    this.targetUpdate(event, container)
  }

  /**
   * @param {InteractionEvent} event 
   * @param {ChartGroup} container 
   */
  onMarkClick(event, container) {
    this.targetUpdate(event, container)
    this.props.onClickMark({
      event,
      models: this.target
    })
  }

  /**
   * @param {(item: ChartGroup, index: number) => any} callback 
   */
  callChartGroup(callback) {
    return this.children.map((item, index) => {
      if (item instanceof ChartGroup) {
        return callback(item, index)
      }
      return null
    })
  }

  getCharGroup(collection, index) {
    return new ChartGroup({
      ...this.getArguments(),
      sort: index,
      DateLine: this.DateLine,
      RulerLine: this.RulerLine,
      collection,
      graphics: this.graphics,
      isMergeGroup: index === -1
    })
  }

  /**
   * @returns {ChartGroup[]}
   */
  getCharGroupList() {
    return this.props.types.filter(m => m.data.length).map((model, index) => {
      const collection = new Collection()
      model.data.filter(m => model.id === m.eventTypeId).forEach(item => {
        collection.set(item.id, item)
      })
      return this.getCharGroup(collection, index)
    })
  }

  drawTip() {
    const tipAlpha = Number(this.target && this.target.length ? 1 : 0)
    const offsetX = 12
    const offsetY = 12
    const paddingX = 8
    const paddingY = 8
    this.tipText.alpha = tipAlpha
    if (tipAlpha) {
      const text = uniq(this.target.map(p => p.title)).join(',')
      // TODO 資料過多的呈現方式
      if (text.length >= this.tipMaxTextLength) {
        this.tipText.text = text.substring(0, this.tipMaxTextLength - 3) + '...'
      } else {
        this.tipText.text = text
      }
    }
    const width = this.tipText.width + paddingX * 2
    const height = this.tipText.height + paddingY * 2
    if (tipAlpha) {
      if (this.tipX + width + offsetX * 2 >= this.props.canvasWidth) {
        this.tipText.x = this.tipX - this.x - width - offsetX + paddingX
        this.tipGraphics.x = this.tipX - this.x - width - offsetX
      } else {
        this.tipText.x = this.tipX - this.x + offsetX + paddingX
        this.tipGraphics.x = this.tipX - this.x + offsetX
      }
      if (this.tipY + height + offsetY * 2 >= this.props.canvasHeight) {
        this.tipText.y = this.tipY - this.y - height - offsetY + paddingY
        this.tipGraphics.y = this.tipY - this.y - height - offsetY
      } else {
        this.tipText.y = this.tipY - this.y + offsetY + paddingY
        this.tipGraphics.y = this.tipY - this.y + offsetY
      }
    }
    this.tipGraphics
      .beginFill(0xEEEEEE, tipAlpha)
      .lineStyle(1, 0xBDBDBD, tipAlpha)
      .drawRoundedRect(0, 0, width, height, 8)
  }

  draw() {
    this.drawTip()
  }

  update(t) {
    // 計算自己的碰撞座標
    this.x = this.props.translateX
    this.y = this.DateLine.getClientHeight()
    // 計算群組高度給予碰撞
    let groupY = this.translateY
    this.callChartGroup((container) => {
      if (container instanceof ChartGroup) {
        container.y = groupY
        groupY += container.getCharGroupHeight()
      }
    })
  }

  setCollapse(bool, type) {
    if (!this.props.isAllCollapse) {
      this.callChartGroup((container) => {
        if (container.model.id === type || container.model.name === type) {
          container.setCollapse(bool)
        }
      })
    }
  }
}