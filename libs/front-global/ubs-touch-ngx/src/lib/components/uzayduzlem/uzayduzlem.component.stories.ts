import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { UzayduzlemComponent } from './uzayduzlem.component';

export default {
  title: 'UzayduzlemComponent',
  component: UzayduzlemComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<UzayduzlemComponent>;

const Template: Story<UzayduzlemComponent> = (args: UzayduzlemComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
