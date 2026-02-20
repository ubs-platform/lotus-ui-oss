import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TouchTabComponent } from './touch-tab.component';
import { CommonModule } from '@angular/common';
import { BlockNavigationDirective } from '../block-navigation.directive';

export default {
  title: 'TouchTabComponent',
  component: TouchTabComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
      declarations: [BlockNavigationDirective],
    }),
  ],
} as Meta<TouchTabComponent>;

const Template: Story<TouchTabComponent> = (args: TouchTabComponent) => ({
  props: args,
  template: `
  <ubs-touch-tab #pagination>
    <ng-template block-page="main">
      <h1>1. sayfa</h1>
    </ng-template>

    <ng-template block-page="secondary">
      <h1>2. sayfa</h1>
    </ng-template>

    <ng-template block-page="third">
      <h1>3. sayfa</h1>
    </ng-template>
    <ng-template block-page="4">
      <h1>4. sayfa</h1>
    </ng-template>
    <ng-template block-page="5">
      <h1>5. sayfa</h1>
    </ng-template>
  </ubs-touch-tab>
  `,
});

export const Primary = Template.bind({});
Primary.args = {};
