import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

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
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, UbsTranslatorNgxModule],
})
export class CustomSelectComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);

  @ViewChild('trigger') triggerEl!: ElementRef<HTMLElement>;
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<any>;

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
  optionsShow = signal<boolean>(false);

  private overlayRef: OverlayRef | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.closeDropdown();
    });
  }
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
      if (this.optionsShow()) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    }
  }

  private openDropdown(): void {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.triggerEl)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ])
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: this.triggerEl.nativeElement.offsetWidth,
    });

    this.overlayRef.outsidePointerEvents().subscribe((event) => {
      if (!this.elementRef.nativeElement.contains(event.target as Node)) {
        this.closeDropdown();
      }
    });

    const portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);
    this.optionsShow.set(true);
  }

  private closeDropdown(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.optionsShow.set(false);
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
    this.closeDropdown();
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
