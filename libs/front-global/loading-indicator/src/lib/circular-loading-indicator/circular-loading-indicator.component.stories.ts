import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CircularLoadingIndicatorComponent } from './circular-loading-indicator.component';

export default {
  title: 'CircularLoadingIndicatorComponent',
  component: CircularLoadingIndicatorComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<CircularLoadingIndicatorComponent>;

const Template: Story<CircularLoadingIndicatorComponent> = (
  args: CircularLoadingIndicatorComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
