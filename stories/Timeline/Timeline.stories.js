import {
  TimeLine as createTimeline
} from '@base/app'
import dayjs from 'dayjs';

export default {
  title: 'Example/Timeline',
  argTypes: {
    width: {
      control: 'number'
    },
    height: {
      control: 'number'
    },
    startTime: {
      control: 'number'
    },
    endTime: {
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
}]

export const AutoTime = Template.bind({});
AutoTime.args = {
  width: 1000,
  height: 500,
  x: 20,
  y: 40,
  list
};


export const FixedTime = Template.bind({});
FixedTime.args = {
  width: 1000,
  height: 500,
  startTime: Date.now() - 1000 * 60 * 60 * 24 * 90,
  endTime: Date.now(),
  x: 20,
  y: 40,
  list
};