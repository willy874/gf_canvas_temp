import {
  createTimeline
} from './Timeline';

export default {
  title: 'Example/Timeline',
  argTypes: {
    width: {
      control: 'text'
    },
    height: {
      control: 'text'
    },
  },
};

const Template = (props) => {
  return createTimeline(props);
};

export const Primary = Template.bind({});
Primary.args = {
  width: '100%',
  height: '500px',
};