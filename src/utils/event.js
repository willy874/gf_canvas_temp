const eventMap = new Map();


export class GlobalEvent {
  static on(type, callback) {
    const id = Symbol(type)
    const listener = (event) => {
      callback(event.detail)
    }
    eventMap.set(id, )
    window.addEventListener(type, listener)
    return id
  }

  static off(type, callback) {
    if (typeof type === 'symbol') {
      const listener = eventMap.get(type)
      window.removeEventListener(type.description, listener)
    } else {
      window.removeEventListener(type, callback)
    }
  }

  static emit(type, detail) {
    if (type instanceof CustomEvent) {
      if (detail) {
        window.dispatchEvent(new CustomEvent(type.type, {
          detail
        }))
      } else {
        window.dispatchEvent(type)
      }
    } else if (type instanceof Event) {
      window.dispatchEvent(new CustomEvent(type.type, {
        detail: type
      }))
    } else {
      window.dispatchEvent(new CustomEvent(type, {
        detail
      }))
    }
  }
}