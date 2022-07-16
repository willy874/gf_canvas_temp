interface TimelineApplicationArguments {
  isInit: boolean;
  isCollapse: boolean;
  isShowMark: boolean;
  unit: string | number;
  baseTime: number | string | Date;
  types: IEventTypeModel[];
  width: number;
  height: number;
  onClickMark: (...args: any[]) => void;
}

interface TimelineComponents {
  [name: string]: any;
}


type ArgumentsExcludeKey = 'width' | 'height' | 'baseTime' | 'isCollapse'

interface TimelineApplicationOptions extends Omit<TimelineApplicationArguments, ArgumentsExcludeKey> {
  baseTime: number;
  isAllCollapse: boolean;
  canvasWidth: number;
  canvasHeight: number;
  translateX: number;
  translateY: number;
  fontSize: number;
  fontFamily: string;
  lineSolidWidth: number;
  textPaddingX: number;
  textPaddingY: number;
  colors: number[];
  getComponents: () => TimelineComponents;
}

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

interface IEventModel {
  id: number
  startTime: number
  endTime: number
  title: string
  type: string
}


// 理想的 Model
interface ITimeLimeChartModel {
  id: number | string
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