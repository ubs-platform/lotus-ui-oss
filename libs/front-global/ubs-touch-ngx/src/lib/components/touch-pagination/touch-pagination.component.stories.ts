import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TouchPaginationComponent } from './touch-pagination.component';
import { CommonModule } from '@angular/common';
import { BlockNavigationDirective } from '../block-navigation.directive';

export default {
  title: 'TouchPaginationComponent',
  component: TouchPaginationComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
      declarations: [BlockNavigationDirective],
    }),
  ],
} as Meta<TouchPaginationComponent>;

const Template: Story<TouchPaginationComponent> = (
  args: TouchPaginationComponent
) => ({
  props: args,
  template: `
  <ubs-touch-pagination #pagination>
    <ng-template block-page="main">
    <h1>Welcome! Hoş Geldin! Willkomen!</h1>
    <button (click)="pagination.select('secondary')">Go secondary</button>
    </ng-template>

    <ng-template block-page="secondary">
    <h1>On another page!</h1>
    <button (click)="pagination.back()">Go back into primary</button>
    </ng-template>
  </ubs-touch-pagination>
  `,
});

export const Primary = Template.bind({});
Primary.args = {
  height: '80vh',
  width: '100%',
};
