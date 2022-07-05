import {
  Application,
  Graphics
} from '@base/pixi';
import {
  FontSize
} from '@base/enums'

import DateLine from './dateline'
import EventChart from './event-chart'
import BaseContainer from './base-container'

// * @property {number} startTime
// * @property {number} endTime
/**
 * @typedef {Object} TimelineApplicationOptions
 * @property {number | string} unit
 * @property {number} width
 * @property {number} height
 * @property {number} x
 * @property {number} y
 * @property {ITimeLimeChartModel[]} types
 */

export default class TimelineApplication {
  constructor(args = {}) {
    /** @type {TimelineApplicationOptions} */
    this.options = {
      unit: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      types: []
    }
    this.setOptions(args)
    this.graphics = new Graphics()
    this.isMouseDown = false

    this.app = new Application({
      width: this.options.width,
      height: this.options.height,
      backgroundColor: 0x000000,
      backgroundAlpha: 0.02
    })

    this.dateLine = this.createDateLine()
    this.eventChart = this.createEventChart()

    const RootContainer = new BaseContainer({ app: this.app })
    RootContainer.addChild(this.dateLine, this.eventChart, this.graphics)
    this.app.stage.addChild(RootContainer)
    this.useTickerEvent((t) => {
      RootContainer.tickerRender(t)
    })

    let translateX = 0
    let translateY = 0
    const canvas = this.app.view
    canvas.addEventListener('mousedown', (e) => {
      // console.log('mousedown',e);
      translateX = e.clientX
      translateY = e.clientY
      this.isMouseDown = true
    })
    canvas.addEventListener('mousemove', (e) => {
      if (this.isMouseDown) {
        const moveX = e.clientX - translateX
        const moveY = e.clientY - translateY
        translateX = e.clientX
        translateY = e.clientY
        this.eventChart.setTransform(this.eventChart.x + moveX, this.eventChart.y + moveY)
      }
    })
    canvas.addEventListener('mouseout', (e) => {
      // console.log('mouseout',e);
      this.isMouseDown = false
    })
    canvas.addEventListener('mouseup', (e) => {
      // console.log('mouseup',e);
      this.isMouseDown = false
    })

    // this.graphics.lineStyle(1, 0xff0000)
    // const textX = this.options.x + dateLine.baseStartX
    // const textY = dateLine.y + dateLine.lineBaseY
    // this.graphics.moveTo(textX, textY)
    // this.graphics.lineTo(textX + (dateLine.baseEndX - dateLine.baseStartX), textY)
    // this.fetchToken()
  }

  createDateLine() {
    return new DateLine({
      app: this.app,
      unit: this.options.unit,
      translateX: 0,
      translateY: 0,
      x: this.options.x,
      y: this.options.y,
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      fontSize: FontSize.SMALL,
      lineSolidWidth: 1,
      textPaddingX: 2,
      textPaddingY: 2,
    })
  }

  createEventChart() {
    return new EventChart({
      app: this.app,
      startTime: this.dateLine.startTime,
      endTime: this.dateLine.endTime,
      effectWidth: this.dateLine.baseEndX - this.dateLine.baseStartX,
      x: this.options.x + this.dateLine.baseStartX,
      y: this.dateLine.y + this.dateLine.lineBaseY,
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      types: this.options.types,
      colors: [0xFFB2C1, 0xA0D0F5, 0xFFE6AE, 0xABDFE0, 0xCCB2FF],
    })
  }

  setOptions(args) {
    this.options.unit = args.unit
    this.options.width = args.width
    this.options.height = args.height
    this.options.x = args.x
    this.options.y = args.y
    this.options.types = args.types
  }

  useTickerEvent(callback) {
    let time = 0
    this.app.ticker.add(() => {
      requestAnimationFrame((_time) => {
        const t = _time - time
        time = _time
        callback(t)
      })
    })
  }


  fetchToken() {
    const token = localStorage.getItem('willyToken')
    if (token) {
      fetch('http://127.0.0.1:8082/api/v1/oauth').then((res) => res.json()).then(({data}) => {
        return fetch('http://127.0.0.1:8082/oauth/token', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            client_id: data.id,
            client_secret: data.secret,
            grant_type: "password",
            password: "1qaz@WSX",
            scope: "*",
            username: "willy.hsiao@greatforti.com",
          }),
        })
      }).then((res) => res.json()).then((data) => {
        localStorage.setItem('willyToken', data.access_token)
        this.fetchData(token, (...args) => this.handleData(...args))
      }) 
    } else {
      this.fetchData(token, (...args) => this.handleData(...args))
    }
  }

  fetchData(token, callback) {
    const options = {
      headers: new Headers({ 'Authorization': 'Bearer ' + token }),
    }
    Promise.all([
      fetch('http://127.0.0.1:8082/api/v1/event_types', options).then((res) => res.json()),
      fetch('http://127.0.0.1:8082/api/v1/events', options).then((res) => res.json()),
      fetch('http://127.0.0.1:8082/api/v1/supplier-maintenance-events', options).then((res) => res.json()),
    ]).then(data => {
      const [{ data: typeList }, { data: attackList }, { data: maintenanceList }] = data
      callback(typeList, attackList, maintenanceList)
    });
  }

  handleData(typeList, attackList, maintenanceList) {
    const typesData = typeList.map(type => {
      if (type.id === 1) {
        return {
          ...type,
          collapse: false,
          data: attackList.map(attack => {
            const event = JSON.parse(attack.event)
            return {
              ...attack,
              ...event,
              title: attack.event_id,
              startTime: new Date(event.attackStartTime).valueOf(),
              endTime: new Date(event.attackStartTime).valueOf() + 1000 * 60 * 60,
            }
          })
        }
      }
      if (type.id === 3) {
        return {
          ...type,
          data: maintenanceList.map(maintenance => {
            return {
              ...maintenance,
              title: maintenance.event_id,
              startTime: new Date(maintenance.scheduled_start_time).valueOf(),
              endTime: new Date(maintenance.scheduled_end_time).valueOf()
            }
          })
        }
      }
      return {
        ...type,
        data: []
      }
    }).filter(m => m.data.length)
    this.eventChart.setAttribute('types', typesData)
  }
}