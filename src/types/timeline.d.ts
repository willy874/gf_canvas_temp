interface TimelineProps {
  width: number
  height: number
  startTime: number
  endTime: number
  x: number
  y: number
  list: EventModel[]
}

interface GraphicsInfo {
  current: import('pixi.js').Graphics
  status: number
  target: number
  origin: number
  duration: number
  time: number
  timingFunction: (x: number) => number
}

interface TimeLimeChartItemInfo extends GraphicsInfo {
  model: EventModel
}

interface EventModel {
  id: number
  startTime: number
  endTime: number
  title: string
  type: string
}

type PrimaryKeyType = string | number

class ICollection<T> {
  current: Record<PrimaryKeyType, T>
  primaryKey: PrimaryKeyType
  all(): T[]
  clear(): void
  get(key: string): T
  set(key: string, value: any): void
  delete(key: string): void
  getList(sort: Array<number | string | T>): T[]
}
