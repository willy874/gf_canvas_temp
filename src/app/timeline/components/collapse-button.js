import { Graphics } from '@base/pixi'
import { EventType } from '@base/enums'
import BaseContainer from '@base/components/base-container'

export default class CollapseButton extends BaseContainer {
  constructor(args) {
    super(args)

    const {
      props,
      setCollapse,
    } = args

    /** @type {TimelineApplicationOptions} */
    this.props =props

    this.size = 16
    this.padding = 4

    this.setCollapse = setCollapse

    this.allCollapse = new Graphics()
    this.allCollapse.interactive = true
    this.allCollapse.buttonMode = true
    this.allCollapse.on(EventType.CLICK, () => {
      setCollapse(!this.props.isAllCollapse)
    })
    this.list = []
  
    this.create()
  }

  init() {
    this.list = this.props.types.map(data => {
      const collapse = new Graphics()
      collapse.interactive = true
      collapse.buttonMode = true
      collapse.on(EventType.CLICK, () => {
        this.setCollapse(!data.collapse, data.name)
      })
      return collapse
    })
    this.removeChildren()
    this.addChild(this.allCollapse, ...this.list)
  }

  update(t) {
    const oneSpace = this.size + this.padding * 2
    
    this.allCollapse.x = this.props.canvasWidth - oneSpace
    this.allCollapse.y = this.props.canvasHeight - oneSpace

    this.list.forEach((collapse, sort) => {
      const index = this.list.length - sort
      collapse.x = this.props.canvasWidth - oneSpace
      collapse.y = this.props.canvasHeight - (index + 1) * oneSpace
    })
  }

  draw() {
    const allAlpha = this.props.isAllCollapse ? 0.7 : 0.3
    this.allCollapse
      .beginFill(0x000000, allAlpha)
      .lineStyle(1, 0x000000)
      .drawRect(0, 0, this.size, this.size)

    this.list.forEach((collapse, index) => {
      const model = this.props.types[index]
      const color = this.props.colors[index % this.props.colors.length]
      const alpha = model.collapse ? 0.7 : 0.3
      collapse
        .beginFill(color, alpha)
        .lineStyle(1, color)
        .drawRect(0, 0, this.size, this.size)
    })
  }
}
