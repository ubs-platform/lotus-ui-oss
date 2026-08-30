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
import { IconComponent } from "@lotus/front-global/icon";

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
  imports: [CommonModule, UbsTranslatorNgxModule, IconComponent],
})
export class CustomSelectComponent implements ControlValueAccessor {

  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);

  @ViewChild('trigger') triggerEl!: ElementRef<HTMLElement>;
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<any>;
  @ViewChild('searchInput') searchInputEl?: ElementRef<HTMLInputElement>;

  // Model inputs/outputs (public API)
  searchable = input<boolean>(true);
  searchPlaceholder = input<string>('type-to-search');
  searchText = signal<string>('');
  // Custom aratma sonra.. .onSearchInput = output<void>();
  options = model<Array<Option>>([]);
  optionsFilteredBySearch = computed(() => {
    const search = this.searchText().toLowerCase();
    if (!search) {
      return this.options();
    }
    return this.options().filter((option) =>
      option.text.toLowerCase().includes(search)
    );
  });
  optionValuesTemplate = input<TemplateRef<any> | null>(null);
  optionValuesLabelPath = input<string>('text');
  activeIndex = signal<number>(-1);
  visibleOptions = computed<Array<Option>>(() => {
    return this.optionsFilteredBySearch().filter(
      (option) => !this.isSelected(option.value) || !this.hideSelectedItem()
    );
  });
  selectedModel = model<any>(null);
  placeholder = input<string>('general.select.verb');
  hideSelectedItem = signal<boolean>(false);
  enabled = model<boolean>(true);
  error = model<boolean>(false);
  minWidth = input<string>('auto');
  selectedChange = output<any>();

  // Internal state signals
  optionsShow = signal<boolean>(false);

  private overlayRef: OverlayRef | null = null;

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

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.closeDropdown();
    });
  }

  onSearchInput(event: any): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.activeIndex.set(this.visibleOptions().length ? 0 : -1);
  }

  onListKeyDown(event: KeyboardEvent): void {
    const options = this.visibleOptions();
    // keep DOM focus on the highlighted item once navigation moved there via Tab
    const focusFollowsItem = (event.target as HTMLElement)?.classList.contains('item');
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (options.length) {
          this.activeIndex.set((this.activeIndex() + 1) % options.length);
          this.scrollActiveIntoView(focusFollowsItem);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (options.length) {
          this.activeIndex.set(
            (this.activeIndex() - 1 + options.length) % options.length
          );
          this.scrollActiveIntoView(focusFollowsItem);
        }
        break;
      case 'Enter': {
        event.preventDefault();
        const active = options[this.activeIndex()];
        if (active) {
          this.selectVal(active);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        this.triggerEl.nativeElement.focus();
        break;
      case 'Tab':
        if (!focusFollowsItem && options.length) {
          event.preventDefault();
          if (this.activeIndex() < 0) {
            this.activeIndex.set(0);
          }
          this.scrollActiveIntoView(true);
        }
        break;
    }
  }

  setActiveIndex(index: number): void {
    this.activeIndex.set(index);
  }

  private scrollActiveIntoView(focusItem = false): void {
    if (!this.overlayRef) {
      return;
    }
    setTimeout(() => {
      const items = this.overlayRef?.overlayElement.querySelectorAll<HTMLElement>('.item');
      const activeEl = items?.[this.activeIndex()];
      activeEl?.scrollIntoView({ block: 'nearest' });
      if (focusItem) {
        activeEl?.focus();
      }
    });
  }

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

    const preselectedIndex = this.visibleOptions().findIndex(
      (option) => option.value === this.selectedModel()
    );
    this.activeIndex.set(preselectedIndex);

    setTimeout(() => {
      this.searchInputEl?.nativeElement.focus();
      this.scrollActiveIntoView();
    });
  }

  private closeDropdown(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.optionsShow.set(false);
    this.activeIndex.set(-1);
    this.searchText.set('');
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
