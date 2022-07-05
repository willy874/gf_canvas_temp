interface TimelineProps {
  width: number
  height: number
  startTime: number
  endTime: number
  x: number
  y: number
  list: EventModel[]
}

type TimingFunction = (x: number) => number

interface IDynamicProperties {
  status: number
  target: number
  origin: number
  duration: number
  time: number
  timingFunction: TimingFunction
  toTarget: (target: number, duration: number, timingFunction?: TimingFunction) => Promise<IDynamicProperties>
  updateDate: (t: number) => void
}

interface TimeLimeChartItemInfo extends GraphicsInfo {
  model: EventModel
}

interface IEventCollection<T> extends ICollection<T> {}

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
// 理想的 Model
interface ITimeLimeChartModel {
  id: number
  startTime: number
  endTime: number
  title: string
  eventTypeId: number
}
interface IEventTypeModel {
  id: number
  name: string
  collapse: boolean
  data: ITimeLimeChartModel[]
}
interface MatrixInfo {
  row: number
  column: number
  matrix: string[][]
}
