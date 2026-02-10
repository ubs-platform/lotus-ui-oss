import {
  AfterViewInit,
  Component,
  ContentChild,
  contentChildren,
  ContentChildren,
  Inject,
  OnInit,
  QueryList,
  viewChild,
  ViewChild,
  ViewEncapsulation,
  input,
  Injector,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FeederItem,
  InputLinkCarrier,
  LinkCarrier,
  Reform,
} from '@lotus/front-global/minky/core';

import { InputFieldLinkDirective } from 'libs/front-global/minky/reform-ngx/src/lib/input-field-link/input-field-link.directive';
import { MinkyReformComponent } from 'libs/front-global/minky/reform-ngx/src/lib/minky-reform/minky-reform.component';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { DropdownFilterEvent } from 'primeng/dropdown';
import { lastValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'minky-reform-prime',
  templateUrl: './reform-ngx-prime.component.html',
  styleUrls: ['./reform-ngx-prime.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ReformNgxPrimeComponent implements OnInit, OnChanges {
  readonly reform = input<Reform<any>>();
  showPasswordMap: { [key: string]: boolean | null | undefined } = {};
  customInputTemplates = contentChildren(InputFieldLinkDirective);

  feeds: { [key: string]: Promise<FeederItem[]> } = {};
  selectCarriers: InputLinkCarrier[] = [];
  feedsAutoComplete: { [key: string]: { text: string; value: any }[] } = {};

  constructor(
    // @Inject(TITLE_TRANSFORM)
    // public labelTransformation: TitleTransform
    private injector: Injector
  ) { }

  ngOnChanges(ch: SimpleChanges): void {
    if (ch['reform'] && this.reform()) {
      this.reform()!.setApplicationEnvironment({
        injector: this.injector,
      });
    }
  }

  selectRegisterFeeders($event: LinkCarrier[]) {
    const allCariersCirculated: LinkCarrier[] = [...$event],
      inputCarriers: InputLinkCarrier[] = [];
    while (allCariersCirculated.length > 0) {
      const carrier = allCariersCirculated.shift()!;
      if (carrier.carrierType == 'INPUT' && carrier.feeder) {
        inputCarriers.push(carrier);
      } else if (carrier.carrierType == 'GROUP' && carrier.items) {
        allCariersCirculated.push(...carrier.items);
      }
    }

    this.selectCarriers = inputCarriers;
    this.feedAllSelects();
  }

  autoCompleteForTextInput(path: string, $event: AutoCompleteCompleteEvent) {
    // this.feedsAutoComplete[path] = this.feeds[path].filter(
    //   (a) => a.value?.includes?.($event.query) || a.text.includes($event.query)
    // );
    // $event.
  }
  feedAllSelects(excludedPath?: string) {
    this.selectCarriers.forEach((a) => {
      if (a.carrierType == 'INPUT') {
        this.feedSelectInputs(a);
        // document.addEventListener('resize', () => {
        //   this.feedSelectInputs(a);
        // });
      }
    });
  }

  findCustoms() {
    return this.customInputTemplates().filter((a) => !a.overrideDefault());
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

  ngOnInit(): void { }
}
