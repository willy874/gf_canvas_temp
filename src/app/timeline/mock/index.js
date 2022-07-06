function fetchToken() {
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
        resolve(localStorage.getItem('willyToken'))
      })
    } else {
      resolve(localStorage.getItem('willyToken'))
    }
  })
}


function handleEventData(args) {
  const [{
    data: typeList
  }, {
    data: attackList
  }, {
    data: maintenanceList
  }] = args
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

export function fetchEventData(bool) {
  if (!bool) {
    return Promise.resolve()
  }
  return fetchToken().then(token => {
    const request = {
      headers: new Headers({
        'Authorization': 'Bearer ' + token
      }),
    }
    return Promise.all([
      fetch('http://127.0.0.1:8082/api/v1/event_types', request).then((res) => res.json()),
      fetch('http://127.0.0.1:8082/api/v1/events', request).then((res) => res.json()),
      fetch('http://127.0.0.1:8082/api/v1/supplier-maintenance-events', request).then((res) => res.json()),
    ])
  }).then(handleEventData)
}