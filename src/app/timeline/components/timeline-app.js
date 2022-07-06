import {
  Application,
  Graphics
} from '@base/pixi';
import {
  FontSize,
} from '@base/enums'
import DateLine from './dateline'
import EventChart from './event-chart'
import RootContainer from '@base/components/root'


function fetchToken(bool) {
  if (!bool) {
    return Promise.reject(new Error('fetchToken is not network.'))
  }
  return new Promise((resolve) => {
    const token = localStorage.getItem('willyToken')
    if (token) {
      fetch('http://127.0.0.1:8082/api/v1/oauth').then((res) => res.json()).then(({
        data
      }) => {
        return fetch('http://127.0.0.1:8082/oauth/token', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
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
        fetchData(token, (...args) => handleData(...args), resolve)
      })
    } else {
      fetchData(token, (...args) => handleData(...args, resolve))
    }
  })
}


function fetchData(token, callback, resolve) {
  const options = {
    headers: new Headers({
      'Authorization': 'Bearer ' + token
    }),
  }
  Promise.all([
    fetch('http://127.0.0.1:8082/api/v1/event_types', options).then((res) => res.json()),
    fetch('http://127.0.0.1:8082/api/v1/events', options).then((res) => res.json()),
    fetch('http://127.0.0.1:8082/api/v1/supplier-maintenance-events', options).then((res) => res.json()),
  ]).then(data => {
    const [{
      data: typeList
    }, {
      data: attackList
    }, {
      data: maintenanceList
    }] = data
    resolve(callback(typeList, attackList, maintenanceList))
  });
}


function handleData(typeList, attackList, maintenanceList) {
  return typeList.map(type => {
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
}

/**
 * @typedef {Object} TimelineApplicationOptions
 * @property {number | string} unit
 * @property {number} width
 * @property {number} height
 * @property {ITimeLimeChartModel[]} types
 */

export default class TimelineApplication {
  constructor(args = {}) {
    /** @type {TimelineApplicationOptions} */
    this.options = this.resolveOptions(args)
    /** @type {Graphics} */
    this.graphics = new Graphics()
    /** @type {boolean} */
    this.isMouseDown = false
    /** @type {number} */
    this.translateX = 0
    /** @type {number} */
    this.translateY = 0

    this.app = new Application({
      width: this.options.width,
      height: this.options.height,
      backgroundColor: 0x000000,
      backgroundAlpha: 0.02
    })
    /** @type {RootContainer} */
    this.root = new RootContainer({
      app: this.app,
    })
    /** @type {DateLine} */
    this.dateLine = this.createDateLine()
    /** @type {EventChart} */
    this.eventChart = this.createEventChart()

    this.root.addChild(this.dateLine, this.eventChart, this.graphics)
    this.app.stage.addChild(this.root)


    fetchToken().then(data => this.eventChart.setAttribute('types', data))
  }

  createDateLine() {
    if (!this.app) {
      throw new Error('Application is not defined.')
    }
    if (!this.options) {
      throw new Error('Options is not defined.')
    }
    if (!this.root) {
      throw new Error('RootContainer is not defined.')
    }
    return new DateLine({
      app: this.app,
      unit: this.options.unit,
      translateX: 0,
      translateY: 0,
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      event: this.root.event,
      fontSize: FontSize.SMALL,
      lineSolidWidth: 1,
      textPaddingX: 4,
      textPaddingY: 4,
    })
  }

  createEventChart() {
    if (!this.app) {
      throw new Error('Application is not defined.')
    }
    if (!this.options) {
      throw new Error('Options is not defined.')
    }
    if (!this.dateLine) {
      throw new Error('DateLine is not defined.')
    }
    if (!this.root) {
      throw new Error('RootContainer is not defined.')
    }
    return new EventChart({
      app: this.app,
      startTime: this.dateLine.startTime,
      endTime: this.dateLine.endTime,
      effectWidth: this.dateLine.baseEndX - this.dateLine.baseStartX,
      x: this.dateLine.baseStartX,
      y: this.dateLine.y + this.dateLine.lineBaseY,
      canvasWidth: this.options.width,
      canvasHeight: this.options.height,
      types: this.options.types,
      event: this.root.event,
      colors: [0xFFB2C1, 0xA0D0F5, 0xFFE6AE, 0xABDFE0, 0xCCB2FF],
    })
  }

  /**
   * @param {Partial<TimelineApplicationOptions>} args
   */
  setOptions(args) {
    const options = this.resolveOptions(args)
    this.options.unit = options.unit
    this.options.width = options.width
    this.options.height = options.height
    this.options.types = options.types
  }

  /**
   * @param {Partial<TimelineApplicationOptions>} args 
   * @returns {TimelineApplicationOptions}
   */
  resolveOptions(args) {
    return {
      unit: args.unit,
      width: args.width,
      height: args.height,
      types: args.types
    }
  }

}