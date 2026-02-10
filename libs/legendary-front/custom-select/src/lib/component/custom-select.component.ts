import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';

export type Option = {
  textPrefix?: string;
  text: string;
  value: any;
  textShortened?: string;
};

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
  selector: 'lib-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  imports: [CommonModule, UbsTranslatorNgxModule],
})
export class CustomSelectComponent implements ControlValueAccessor {
  // Model inputs/outputs (public API)
  options = model<Array<Option>>([]);
  optionValuesTemplate = input<TemplateRef<any> | null>(null);
  optionValuesLabelPath = input<string>('text');
  selectedModel = model<any>(null);
  placeholder = input<string>('Seçiniz');
  hideSelectedItem = signal<boolean>(false);
  enabled = model<boolean>(true);
  error = model<boolean>(false);
  minWidth = input<string>('auto');
  selectedChange = output<any>();

  // Internal state signals
  mouseEntered = signal<boolean>(false);
  optionsShow = signal<boolean>(false);
  optionsMapped = computed<Map<any, Option>>(() => {
    return new Map(this.options().map((o) => [o.value, o]));
  });

  // Computed values for performance
  selected = computed<Option | undefined>(() => {
    return this.optionsMapped().get(this.selectedModel());
  });

  displayText = computed<string>(() => {
    return this.selected() ? '' : this.placeholder();
  });

  containerClasses = computed(() => ({
    expanded: this.optionsShow(),
    disabled: !this.enabled()
  }));

  headClasses = computed(() => ({
    error: this.error()
  }));

  // ControlValueAccessor implementation
  private onChange: ((value: any) => void) | null = null;
  private onTouched: (() => void) | null = null;

  writeValue(value: any): void {
    this.selectedModel.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.enabled.set(!isDisabled);
  }

  // Public methods
  isSelected(val: string): boolean {
    return this.selected()?.value === val;
  }

  toggleOptionsShow(): void {
    if (this.enabled()) {
      this.optionsShow.update(show => !show);
    }
  }

  selectVal(option: Option): void {
    const newValue = option.value;
    
    // Update internal state
    this.selectedModel.set(newValue);
    
    // Emit to output
    this.selectedChange.emit(newValue);
    
    // Call form control callbacks
    this.onChange?.(newValue);
    
    // Close dropdown
    this.optionsShow.set(false);
  }

  handleWindowClick(): void {
    if (!this.mouseEntered()) {
      this.optionsShow.set(false);
    }
  }

  handleElementClick(): void {
    this.onTouched?.();
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByValue(index: number, option: Option): any {
    return option.value;
  }
}
