import {
  minky,
  minkyRoot,
  RequiredValidator,
} from '@lotus/front-global/minky/core';
import { ContentReportReason } from './content-report.models';

/**
 * Reasons are fed through the Reform parameter `reasons`
 * (see ContentReportService), so every entity type can have its own list.
 */
@minkyRoot()
export class FlagForm {
  @minky({
    inputType: 'radios',
    label: 'mona.comments.contentType',
    validators: [new RequiredValidator()],
    selectItems: (env) => {
      const reasons: ContentReportReason[] =
        env.parameters.get('reasons') ?? [];
      return [
        ...(env.parameters.get('search')
          ? [{ text: 'Seçilmedi', value: '' }]
          : []),
        ...reasons,
      ];
    },
  })
  contentType = '';

  @minky({ inputType: 'text', label: 'mona.comments.extraNotes' })
  extraNotes = '';
}
