import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reform } from '@lotus/front-global/minky/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import {
  ItemTaxControllerService,
} from '@lotus/postral-core-frontend/client';
import {
  ItemTaxForm
} from '@lotus/postral-core-frontend/forms';
import { ItemTaxDTO } from '@tk-postral/payment-common';

@Component({
  selector: 'lib-tax-info',
  standalone: false,
  templateUrl: './tax-info.component.html',
  styleUrls: ['./tax-info.component.scss'],
})
export class TaxInfoComponent {
  instruction = signal<FormEditInstruction | null>(null);
  id = signal<string | null>(null);
  /**
   *
   */
  constructor(
    private itemTaxService: ItemTaxControllerService,
    private activatedRoute: ActivatedRoute,
    private basicOverlay: BasicOverlayService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id.set(params['id']);
      if (params['id'] === 'new') {
        this.generateForm({} as ItemTaxDTO);
        return;
      }
      this.itemTaxService.get(this.id()).subscribe((data) => {
        this.generateForm(data);
      });
    });
  }

  private generateForm(data: ItemTaxDTO) {
    const form = new Reform(ItemTaxForm, data);

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
          return this.itemTaxService.update(data);
        }
        return this.itemTaxService.create(data);
      },
      afterSaveSuccess: (out, data) => {
        this.basicOverlay.alert(
          'Success',
          'Tax information updated successfully.',
          'success'
        );
        if (this.id() === "new") {
          this.router.navigate(["..", out.id], { relativeTo: this.activatedRoute, replaceUrl: true });
          return;
        }
        this.instruction.update((a) => {
          if (a) {
            //   // const form = new Reform(ItemForm);
            form.patchValue(out);
            //   a.form = form;
          }
          return a;
        });
      },
      afterSaveError: (error, data) => { },
    } as FormEditInstruction<ItemTaxForm, ItemTaxForm>);
  }
}
