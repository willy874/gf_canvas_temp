import {
  TimeLine as createTimeline
} from '@base/app'
import {
  TimeUnit
} from '@base/enums'
import dayjs from 'dayjs';

export default {
  title: 'Library/Timeline',
  argTypes: {
    unit: {
      options: [TimeUnit.HALF_HOUR, TimeUnit.HOUR, TimeUnit.HOUR12, TimeUnit.DAY, TimeUnit.DAY3, TimeUnit.WEEK, TimeUnit.HALF_MONTH, TimeUnit.MONTH, TimeUnit.QUARTER],
      control: {
        type: 'select'
      }
    },
    baseTime: {
      control: 'date'
    },
    width: {
      control: 'number'
    },
    height: {
      control: 'number'
    },
    isShowCoordinates: {
      control: 'boolean'
    },
  },
};

/**
 * @param {TimelineProps} props 
 * @returns {Element}
 */
const Template = (props) => {
  const timeline = createTimeline(props)
  return timeline.app.view;
};

/** @type {ITimeLimeChartModel[]} */
const list = [{
  id: 1,
  startTime: dayjs('2022/06/05').valueOf(),
  endTime: dayjs('2022/06/30').valueOf(),
  title: '這是攻擊1',
  eventTypeId: 1
}, {
  id: 2,
  startTime: dayjs('2022/05/10').valueOf(),
  endTime: dayjs('2022/05/20').valueOf(),
  title: '這是攻擊2',
  eventTypeId: 1
}, {
  id: 3,
  startTime: dayjs('2022/04/01').valueOf(),
  endTime: dayjs('2022/04/25').valueOf(),
  title: '這是攻擊3',
  eventTypeId: 1
}, {
  id: 4,
  startTime: dayjs('2022/04/21').valueOf(),
  endTime: dayjs('2022/05/30').valueOf(),
  title: '這是攻擊4',
  eventTypeId: 1
}, {
  id: 5,
  startTime: dayjs('2022/04/05').valueOf(),
  endTime: dayjs('2022/05/5').valueOf(),
  title: '這是攻擊5',
  eventTypeId: 2
}, {
  id: 6,
  startTime: dayjs('2022/05/05').valueOf(),
  endTime: dayjs('2022/05/25').valueOf(),
  title: '這是攻擊6',
  eventTypeId: 3
}, {
  id: 7,
  startTime: dayjs('2022/03/20').valueOf(),
  endTime: dayjs('2022/04/10').valueOf(),
  title: '這是部署1',
  eventTypeId: 4
}, {
  id: 8,
  startTime: dayjs('2022/6/20').valueOf(),
  endTime: dayjs('2022/07/10').valueOf(),
  title: '這是部署2',
  eventTypeId: 4
  // }, {
  //   id: 9,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 10,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 11,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 12,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 13,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 14,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 15,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 16,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 17,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 18,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 19,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 20,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 21,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 22,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 23,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 24,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 25,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 26,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 27,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 28,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 29,
  //   startTime: dayjs('2022/6/25').valueOf(),
  //   endTime: dayjs('2022/07/05').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
  // }, {
  //   id: 30,
  //   startTime: dayjs('2022/6/25 12:00:00').valueOf(),
  //   endTime: dayjs('2022/06/25 13:00:00').valueOf(),
  //   title: '測試重疊',
  //   eventTypeId: 4
}]

/** @type {IEventTypeModel[]} */
const typeList = [{
    id: 1,
    name: 'Attack',
    collapse: false,
    data: []
  },
  {
    id: 2,
    name: 'Activity',
    collapse: false,
    data: []
  },
  {
    id: 3,
    name: 'Maintenance',
    collapse: false,
    data: []
  },
  {
    id: 4,
    name: 'Deployment',
    collapse: false,
    data: []
  }
]

const types = typeList.map(data => ({
  ...data,
  data: list.filter(p => p.eventTypeId === data.id)
}))

export const AutoTime = Template.bind({});
AutoTime.args = {
  unit: TimeUnit.WEEK,
  baseTime: Date.now(),
  isShowCoordinates: true,
  width: 1000,
  height: 500,
  types
};