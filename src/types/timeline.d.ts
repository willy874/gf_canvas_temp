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

interface IEventCollection<T> extends ICollection<T> {
  getMinStartTime: () => number
  getMaxEndTime: () => number
}

interface IEventModel {
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
  has(key: PrimaryKeyType): boolean
  keys(): string[]
  all(): T[]
  clear(): void
  get(key: PrimaryKeyType): T
  set(key: PrimaryKeyType, value: any): void
  delete(key: PrimaryKeyType): void
  getList(sort: Array<PrimaryKeyType | T>): T[]
}
