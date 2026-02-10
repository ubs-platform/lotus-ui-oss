import {
  Component,
  ContentChild,
  ContentChildren,
  OnInit,
  AfterViewInit,
  ViewChildren,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  QueryList,
  ViewChild,
  Inject,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  contentChildren,
  contentChild,
  viewChild,
  Signal,
  computed,
  input,
  Injector
} from '@angular/core';
import {
  InputLinkCarrier,
  LinkCarrier,
  PropertyMeta,
  Reform,
  RootPropertyMeta,
} from '@lotus/front-global/minky/core';
import { ButtonDirective } from 'primeng/button';
import { ButtonFieldLinkDirective } from '../button-field-link/button-field-link.directive';
import { InputFieldLinkDirective } from '../input-field-link/input-field-link.directive';
import { Observable } from 'rxjs';

import { GroupLabelFieldLinkDirective } from '../group-label-field-link/group-label-field-link.directive';

@Component({
  selector: 'minky-reform',
  templateUrl: './minky-reform.component.html',
  styleUrls: ['./minky-reform.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class MinkyReformComponent implements OnInit, AfterViewInit, OnChanges {
  readonly reform = input<Reform<any>>();
  @Output() afterCarrierInitialized = new EventEmitter<LinkCarrier[]>();
  customInputTemplates = contentChildren(InputFieldLinkDirective);
  customButtonTemplate = contentChild(ButtonFieldLinkDirective);
  customGroupLabelTemplate = contentChild(GroupLabelFieldLinkDirective);
  defaultInputTemplate = viewChild(InputFieldLinkDirective);
  defaultButtonTemplate = viewChild(ButtonFieldLinkDirective);
  defaultGroupLabelTemplate = viewChild(GroupLabelFieldLinkDirective);

  decideButtonTemplate = computed(
    () => this.customButtonTemplate() || this.defaultButtonTemplate()
  );

  decideGroupLabelTemplate = computed(
    () => this.customGroupLabelTemplate() || this.defaultGroupLabelTemplate()
  );

  viewInit = false;
  rootMeta?: RootPropertyMeta<any>;
  propertyMetas: PropertyMeta<any>[] = [];
  carriers: LinkCarrier[] = [];
  readonly gap = input(10);

  constructor(
    private changeDetector: ChangeDetectorRef,
    private injector: Injector
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reform']?.currentValue) {
      this.updateReformPaths();
      this.reform()?.valueBigUpdate.subscribe(() => {
        this.updateReformPaths();
      });
    }
  }

  ngAfterViewInit(): void {
    this.viewInit = true;
    this.updateReformPaths();
  }

  updateReformPaths() {
    this.carriers = this.reform()?.generateInputCarriers() || [];
    this.afterCarrierInitialized.emit(this.carriers);
    this.changeDetector.detectChanges();
  }

  getRelatedInputTemplate(carrier: InputLinkCarrier): InputFieldLinkDirective {
    const customs = this.customInputTemplates() || [];
    return (customs?.find((a) => a.path() == carrier.path) ||
      customs?.find((a) => a.overrideDefault()) ||
      this.defaultInputTemplate())!;
  }

  ngOnInit(): void {}
}
