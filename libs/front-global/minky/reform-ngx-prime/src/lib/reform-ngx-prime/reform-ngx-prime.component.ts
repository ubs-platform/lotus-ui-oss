import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  contentChild,
  contentChildren,
  EventEmitter,
  Injector,
  input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
  viewChild,
  computed,
} from '@angular/core';
import {
  FeederItem,
  InputLinkCarrier,
  LinkCarrier,
  Reform,
} from '@lotus/front-global/minky/core';
import { InputFieldLinkDirective } from '../input-field-link/input-field-link.directive';
import { ButtonFieldLinkDirective } from '../button-field-link/button-field-link.directive';
import { GroupLabelFieldLinkDirective } from '../group-label-field-link/group-label-field-link.directive';
import { lastValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'minky-reform-prime',
  templateUrl: './reform-ngx-prime.component.html',
  styleUrls: ['./reform-ngx-prime.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ReformNgxPrimeComponent implements OnInit, AfterViewInit, OnChanges {
  readonly reform = input<Reform<any>>();
  readonly gap = input(10);

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

  showPasswordMap: { [key: string]: boolean | null | undefined } = {};
  feeds: { [key: string]: Promise<FeederItem[]> } = {};
  selectCarriers: InputLinkCarrier[] = [];

  viewInit = false;
  carriers: LinkCarrier[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private injector: Injector
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reform']?.currentValue) {
      this.reform()!.setApplicationEnvironment({ injector: this.injector });
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
    this.processSelectFeeders(this.carriers);
    this.changeDetector.detectChanges();
  }

  getRelatedInputTemplate(carrier: InputLinkCarrier): InputFieldLinkDirective {
    const customs = this.customInputTemplates() || [];
    return (
      customs.find((a) => a.path() == carrier.path) ||
      customs.find((a) => a.overrideDefault()) ||
      this.defaultInputTemplate()
    )!;
  }

  private processSelectFeeders(carriers: LinkCarrier[]) {
    const queue: LinkCarrier[] = [...carriers];
    const inputCarriers: InputLinkCarrier[] = [];
    while (queue.length > 0) {
      const carrier = queue.shift()!;
      if (carrier.carrierType === 'INPUT' && carrier.feeder) {
        inputCarriers.push(carrier);
      } else if (carrier.carrierType === 'GROUP' && carrier.items) {
        queue.push(...carrier.items);
      }
    }
    this.selectCarriers = inputCarriers;
    this.feedAllSelects();
  }

  feedAllSelects() {
    this.selectCarriers.forEach((a) => this.feedSelectInputs(a));
  }

  async feedSelectInputs(carrier: InputLinkCarrier) {
    if (carrier.feeder) {
      if (await this.feeds[carrier.path]) {
        return;
      }
      const result = carrier.feeder();
      if (result instanceof Promise) {
        this.feeds[carrier.path] = result;
      } else if (result instanceof Observable) {
        this.feeds[carrier.path] = lastValueFrom(result);
      } else {
        this.feeds[carrier.path] = Promise.resolve(result);
      }
    }
  }

  toggleArrayValue(carrier: InputLinkCarrier, value: any, checked: boolean) {
    const current: any[] = carrier.value ?? [];
    carrier.setValue(
      checked ? [...current, value] : current.filter((v) => v !== value)
    );
  }

  ngOnInit(): void { }
}
