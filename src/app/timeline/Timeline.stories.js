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
    width: {
      control: 'number'
    },
    height: {
      control: 'number'
    },
    unit: {
      options: [TimeUnit.HALF_HOUR, TimeUnit.HOUR, TimeUnit.HOUR12, TimeUnit.DAY, TimeUnit.DAY3, TimeUnit.WEEK, TimeUnit.HALF_MONTH, TimeUnit.MONTH, TimeUnit.QUARTER],
      control: {
        type: 'select'
      }
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

const list = [{
  id: 1,
  startTime: dayjs('2022/06/5').valueOf(),
  endTime: dayjs('2022/06/30').valueOf(),
  title: '這是攻擊1',
  type: 'Attack'
}, {
  id: 2,
  startTime: dayjs('2022/05/10').valueOf(),
  endTime: dayjs('2022/05/20').valueOf(),
  title: '這是攻擊2',
  type: 'Attack'
}, {
  id: 3,
  startTime: dayjs('2022/04/01').valueOf(),
  endTime: dayjs('2022/04/25').valueOf(),
  title: '這是攻擊3',
  type: 'Attack'
}, {
  id: 4,
  startTime: dayjs('2022/04/21').valueOf(),
  endTime: dayjs('2022/05/30').valueOf(),
  title: '這是攻擊4',
  type: 'Attack'
}, {
  id: 5,
  startTime: dayjs('2022/04/05').valueOf(),
  endTime: dayjs('2022/05/5').valueOf(),
  title: '這是攻擊5',
  type: 'Activity'
}, {
  id: 6,
  startTime: dayjs('2022/05/05').valueOf(),
  endTime: dayjs('2022/05/25').valueOf(),
  title: '這是攻擊6',
  type: 'Maintenance'
}, {
  id: 7,
  startTime: dayjs('2022/03/20').valueOf(),
  endTime: dayjs('2022/04/10').valueOf(),
  title: '這是部署1',
  type: 'Deployment'
}, {
  id: 8,
  startTime: dayjs('2022/6/20').valueOf(),
  endTime: dayjs('2022/07/10').valueOf(),
  title: '這是部署2',
  type: 'Deployment'
}]

export const AutoTime = Template.bind({});
AutoTime.args = {
  width: 1000,
  height: 500,
  x: 20,
  y: 20,
  unit: TimeUnit.WEEK,
  list
};