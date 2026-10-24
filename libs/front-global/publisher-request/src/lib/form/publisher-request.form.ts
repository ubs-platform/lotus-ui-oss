import { IUserMessageDto } from '@ubs-platform/feedback-common';
import { RequiredValidator, minky, minkyRoot } from '@lotus/front-global/minky/core';
import { map } from 'rxjs/operators';
import { Injector } from 'node_modules/@angular/core/types/_chrome_dev_tools_performance-chunk';
import { PublisherTeamService } from '@lotus/front-global/publisher-teams/client';
@minkyRoot({
  fallbackConstruction: () => new PublisherRequestForm(),
})
export class PublisherRequestForm {
  @minky({
    hide: true,
  })
  type?: string;

  @minky({
    label: 'Yayıncı Takımı',
    inputType: "select",
    validators: [new RequiredValidator()],
    widthRatio: '50%',
    selectItems(appEnv) {
      const publisherTeamService = (appEnv.app?.['injector'] as Injector).get(
        PublisherTeamService
      );
      return publisherTeamService.getAll().pipe(map(teams => teams.map(team => ({ text: team.name, value: team.id }))));
    },
  })
  publisherTeam?: string;

  @minky({
    label: 'name',
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  firstName?: string;

  @minky({
    label: 'surname',
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  lastName?: string;

  @minky({
    label: 'email',
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  email?: string;

  @minky({
    validators: [new RequiredValidator()],
    name: 'phoneNr',
    widthRatio: '50%',
  })
  phoneNumber?: string;

  @minky({
    label: 'Kendiniz hakkında bilgi verin.',
    validators: [new RequiredValidator()],
  })
  message?: string;

  @minky({ inputType: 'file', label: 'CV', validators: [] })
  cv?: File;

  @minky({
    inputType: 'file',
    label: 'Diploma ya da E-Devlet YÖK belgesi',
    validators: [],
  })
  degree?: File;
}
