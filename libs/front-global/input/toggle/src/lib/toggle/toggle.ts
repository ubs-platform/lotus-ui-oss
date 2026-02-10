import { CommonModule } from '@angular/common';
import { Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
@Component({
  selector: 'toggle',
  imports: [ FormsModule, UbsTranslatorNgxModule, CommonModule ],
  templateUrl: './toggle.html',
  styleUrls: ['./toggle.scss'],
})
export class ToggleComponent {
  iconClass = input('');
  label = input('');
  name = input('');
  checkOnClickText = input<boolean>(true);
  checkOnClickInput = input<boolean>(true);
  // onClickCheckPolicy = input<"ICON" | "FULL" | "NONE">("FULL")
  checkboxStyle = input<boolean>(false);

  textboxClass = input('border ');
  // growRight = input(false);
  // growLeft = input(false);
  // disabled = input(false);
  cover = input(false);
  contentClass = input('');
  value = model<boolean | null | undefined>(false);
  hasValue = computed(() => {
    return this.value();
  });

  toggleValue() {
    this.value.update((a) => !a);
  }
}
