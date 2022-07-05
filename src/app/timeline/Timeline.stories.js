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
    width: {
      control: 'number'
    },
    height: {
      control: 'number'
    },
    x: {
      control: 'number'
    },
    y: {
      control: 'number'
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
  width: 1000,
  height: 500,
  x: 20,
  y: 20,
  types
};