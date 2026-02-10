import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { BlockPartBaseButtonComponent } from '../block-part-base-button/block-part-base-button.component';
import { BlockPartBaseComponent } from '../block-part-base/block-part-base.component';
import { BPaginationProgrammaticComponent } from './b-pagination-programmatic.component';
import { CommonModule } from '@angular/common';
import { BButtonComponent } from '../b-button/b-button.component';
import { ButtonModule } from 'primeng/button';
import { CustomItemDirective } from './custom-item-directive.directive';
import { BlockNavigationDirective } from 'libs/front-global/ubs-touch-ngx/src/lib/components/block-navigation.directive';
import { UbsTouchNgxModule } from '@lotus/front-global/ubs-touch-ngx';

export default {
  title: 'BPaginationProgrammaticComponent',
  component: BPaginationProgrammaticComponent,

  decorators: [
    moduleMetadata({
      imports: [CommonModule, ButtonModule, UbsTouchNgxModule],
      declarations: [
        BPaginationProgrammaticComponent,
        BlockPartBaseComponent,
        BlockPartBaseButtonComponent,
        BButtonComponent,
        BlockNavigationDirective,
        CustomItemDirective,
      ],
    }),
  ],
} as Meta<BPaginationProgrammaticComponent>;

const Template: Story<BPaginationProgrammaticComponent> = (
  args: BPaginationProgrammaticComponent
) => ({
  template: `
  <!-- The main component -->
  <b-pagination-programmatic [paginationItems]="paginationItems">
  <!-- Custom views can be used with templates. (and in items, you set templateContentName) -->
  <ng-template custom-item="user-btn">
    <lotus-web-block-part-base-button
      icon="pi-chevron-right"
      buttonClass="primary"
    >
      <div class="left">
        <img
          src="assets/kyle_facebook_profile.webp"
          style="height: 96px; width: 96px; border-radius: 100%"
        />
      </div>
      <div class="content">
        <div style="font-size: 20px">
          <b>Kyle Broflovski</b> <!-- fsck cartman, kyle is best-->
        </div>
        <div style="font-size: 14px">Account operations</div>
        <div style="font-size: 14px">Settings</div>
      </div>
    </lotus-web-block-part-base-button>
  </ng-template>
</b-pagination-programmatic>

  `,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  // can comment lines includes docs
  paginationItems: [
    {
      templateContentName: 'user-btn',
      action: () => alert("Don't click at me 🅵🅰🆃🅰🆂🆂"),
    },
    {
      text: 'Color theme',
      currentValue: 'light',
      valueChange(newValue) {
        alert('You changed theme to ' + newValue);
      },
      toggleValues: [
        {
          value: 'light',
          icon: 'pi pi-sun',
          title: 'Açık tema',
        },
        {
          value: 'dark',
          icon: 'pi pi-moon',
          title: 'Koyu tema',
        },
      ],
    },
    {
      text: 'Question books',
      icon: 'pi pi-chevron-right',
      childPageContents: [
        {
          icon: 'pi pi-chevron-right',
          text: 'Your Library',
          childPageContents: [
            {
              buttonClass: 'primary',
              icon: 'pi pi-chevron-right',
              text: 'Deeper',
              childPageContents: [
                {
                  text: 'More deeper',
                  icon: 'pi pi-chevron-right',
                  buttonClass: 'primary',
                  action() {
                    alert('Ok this is enough');
                  },
                },
                {
                  text: 'Back',
                  icon: 'pi pi-chevron-left',
                  fontClass: ['font-bold'],
                  action(pagination) {
                    pagination.back();
                  },
                },
              ],
            },
            {
              icon: 'pi pi-chevron-left',
              fontClass: ['font-bold'],
              text: 'Back',
              action(pagination) {
                pagination.back();
              },
            },
          ],
        },
        {
          text: 'Created',
          icon: 'pi pi-chevron-right',
        },
        {
          fontClass: ['font-bold'],
          text: 'Back',
          icon: 'pi pi-chevron-left',

          action(pagination) {
            pagination.back();
          },
        },
      ],
    },
  ],
};
