import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { minky, minkyRoot, Reform, RequiredValidator } from '@lotus/front-global/minky/core';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { FormEditInstruction } from '@lotus/front-global/reform-data-edit';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
import { EntityOwnershipDTO, EntityOwnershipGroupCommonDTO, EOGUserEntityCapabilityDTO } from '@ubs-platform/users-common';

@minkyRoot()
export class PublisherTeamForm implements EntityOwnershipGroupCommonDTO {
  @minky({ disable: true })
  id?: string;
  @minky({ label: 'İsim', validators: [new RequiredValidator()] })
  name = "";
  @minky({ label: 'Açıklama', validators: [new RequiredValidator()] })
  description = "";
  initialUserEntityCapabilities: EOGUserEntityCapabilityDTO[] = [];
  // @minky({ label: 'Varlık Sahipliği Grubu', disable: true })
  // entityOwnershipGroupId = "";
  // @minky({ label: 'Güvenilir Takım mı?', disable: true })
  // isTrusted = false;
}

@Component({
  selector: 'lib-teams-edit',
  standalone: false,
  templateUrl: './teams-edit.component.html',
  styleUrl: './teams-edit.component.scss',
})
export class TeamsEditComponent implements OnInit {

  formEdit = signal<FormEditInstruction<EntityOwnershipGroupCommonDTO> | null>(null);
  /**
   *
   */
  constructor(private Router: Router, private route: ActivatedRoute, private service: PublisherTeamService,
    private basicOverlay: BasicOverlayService
  ) {

  }

  ngOnInit() {
    this.route.parent!.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.service.get(id).subscribe(team => {
          const formEdit = {
            title: 'Yayıncı Takımı Bilgileri',
            form: new Reform<EntityOwnershipGroupCommonDTO>(PublisherTeamForm, team),
            saveMethod: (data: EntityOwnershipGroupCommonDTO) => {
              return this.service.update(data)
            },
            afterSaveError: (error, data) => {
              this.basicOverlay.alert("Hata", "Kaydetme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.", "error");
            },
            afterSaveSuccess: (out, data) => {
              this.basicOverlay.alert("Başarılı", "Yayıncı takımı başarıyla güncellendi.", "success");
            },
            beforeSave: (form) => {
              return true;
            },
            onValidationError: (form) => {
              this.basicOverlay.alert("Hata", "Formda hatalar var. Lütfen düzeltip tekrar deneyiniz.", "error");
            },
          } as FormEditInstruction<EntityOwnershipGroupCommonDTO>;
          this.formEdit.set(formEdit)
        });
      }
    });
  }
}
