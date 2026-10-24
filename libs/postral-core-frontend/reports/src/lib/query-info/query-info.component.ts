import { Component, signal } from '@angular/core';
import {
  ReportQueryControllerService,
} from '@lotus/postral-core-frontend/client';
import { ActivatedRoute, Router } from '@angular/router';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { Reform } from '@lotus/front-global/minky/core';
import {
  ReportQueryForm,
  currencyOptions,
  reportDateGroupingOptions,
} from '@lotus/postral-core-frontend/forms';
import { ReportQueryDTO } from '@tk-postral/payment-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
@Component({
  selector: 'lib-query-info',
  standalone: false,
  templateUrl: './query-info.component.html',
  styleUrls: ['./query-info.component.scss'],
})
export class QueryInfoComponent {
  readonly instruction = signal<FormEditInstruction | null>(null);
  readonly id = signal<string | null>(null);
  readonly isNew = signal(false);
  /**
   *
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private basicOverlay: BasicOverlayService,
    private reportQueryService: ReportQueryControllerService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.id.set(id);
      this.isNew.set(id === "create" || id === "new");
      if (this.isNew()) {
        const defaults = new ReportQueryForm();
        const params = this.activatedRoute.snapshot.queryParamMap;
        defaults.ownerAccountId = params.get('ownerAccountId') || undefined;
        const currency = params.get('currency');
        if (currencyOptions.some(option => option.value === currency)) {
          defaults.currency = currency ?? undefined;
        }
        const grouping = reportDateGroupingOptions.find(option => option.value === params.get('dateGrouping'));
        if (grouping) defaults.dateGrouping = grouping.value;
        this.initializeForm(defaults);
        return;
      }
      this.reportQueryService.get(params['id']).subscribe((data) => {
        this.initializeForm(data);
      });
    });
  }

  private initializeForm(data: ReportQueryDTO) {
    const form = new Reform(ReportQueryForm, data);
    this.instruction.set({
      form: form,
      onValidationError: (form: Reform) => {
        this.basicOverlay.alert(
          'Validation Error',
          'Please check the form for errors and try again.',
          'error'
        );
      },
      beforeSave: (form: Reform) => true,
      saveMethod: (data) => {
        if (data.id) {
          return this.reportQueryService.update(data);
        }
        return this.reportQueryService.create(data);
      },
      afterSaveSuccess: (out, data) => {
        this.basicOverlay.alert(
          'Success',
          'Account information updated successfully.',
          'success'
        );
        if (this.isNew()) {
          this.router.navigate(['..', out.id], { relativeTo: this.activatedRoute });
          return;
        }
        this.instruction.update((a) => {
          
          if (a) {
            //   // const form = new Reform(AccountForm);
            form.patchValue(out);
            //   a.form = form;
          }
          return a;
        });
      },
      afterSaveError: (error, data) => { },
    } as FormEditInstruction<ReportQueryDTO, ReportQueryDTO>);
  }
}
