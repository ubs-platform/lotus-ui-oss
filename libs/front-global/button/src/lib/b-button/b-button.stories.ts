import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { BlockPartBaseButtonComponent } from '../block-part-base-button/block-part-base-button.component';
import { BlockPartBaseComponent } from '../block-part-base/block-part-base.component';
import { BButtonComponent } from './b-button.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'BButtonComponent',
  component: BButtonComponent,

  decorators: [
    moduleMetadata({
      imports: [CommonModule],
      declarations: [BlockPartBaseComponent, BlockPartBaseButtonComponent],
    }),
  ],
} as Meta<BButtonComponent>;

const Template: Story<BButtonComponent> = (args: BButtonComponent) => ({
  props: args,
  template: `
  <block-button [icon]="icon" (click)="clickEvent()">
      <div>
     {{content}}
    </div>
    </block-button>
  `,
});

export const Primary = Template.bind({});

Primary.args = {
  content: 'Content is here',
} as any;

export const Icon = Template.bind({});

Icon.args = {
  icon: 'pi pi-chevron-right',
  content: 'Content is here',
} as any;

export const WithPrimaryColor = Template.bind({});

WithPrimaryColor.args = {
  content: 'Content is here',
} as any;
