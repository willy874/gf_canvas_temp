import {
  TimeLine as createTimeline
} from '@base/app'

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

export const Primary = Template.bind({});
Primary.args = {
  width: 1000,
  height: 500,
  startTime: Date.now() - 1000 * 60 * 60 * 24 * 90,
  endTime: Date.now(),
  x: 20,
  y: 40,
  list: []
};