import { minky, minkyRoot } from '../../decorations/decorators';
import { RequiredValidator } from './validators/required';
import { Reform } from './reform';
import { CombinedEnvironment } from '../state-environment';

const initialChange = jest.fn(
  (_value: unknown, _oldValue: unknown, environment: CombinedEnvironment): undefined => {
    environment.state.setDisabled?.('target', true);
    environment.state.setHidden?.('target', true);
    environment.state.setData?.('target', { initialized: true });
    return undefined;
  }
);
const regularChange = jest.fn();
const normalizeInitialChange = jest.fn((value: string) => value.toUpperCase());

@minkyRoot({
  fallbackConstruction: () => ({ source: 'fallback' }),
})
class InitialChangeFields {
  @minky({ emitInitialValueChange: true, onValueChange: initialChange })
  source?: string | number | boolean | null;

  @minky({ onValueChange: regularChange })
  target?: string;

  @minky({ emitInitialValueChange: false, onValueChange: regularChange })
  quietSource?: string;

  @minky({ hide: true, emitInitialValueChange: true, onValueChange: initialChange })
  hiddenSource?: string;

  @minky({ emitInitialValueChange: true, onValueChange: normalizeInitialChange })
  normalized?: string;

  @minky({ inputType: 'file', emitInitialValueChange: true, onValueChange: initialChange })
  file?: string;
}

@minkyRoot()
class InitialChangeContainer {
  @minky({ inputType: 'sub-object', subObjectKey: InitialChangeFields })
  child?: InitialChangeFields;

  @minky({ inputType: 'array', subObjectKey: InitialChangeFields })
  items?: InitialChangeFields[];
}

describe('Initial value change callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('waits for carrier generation and runs once with the prepared environment', () => {
    const form = new Reform<InitialChangeFields>(InitialChangeFields, {
      source: 'initial',
      target: 'existing',
    });
    const app = { ready: true };
    form.setApplicationEnvironment(app);
    form.getParameterMap().set('parameter', 'ready');
    const updates = jest.fn();
    form.valueUpdate.subscribe(updates);

    expect(initialChange).not.toHaveBeenCalled();
    const carriers = form.generateInputCarriers();
    const target = carriers.find((carrier) =>
      carrier.carrierType === 'INPUT' && carrier.path === 'target'
    );

    expect(initialChange).toHaveBeenCalledTimes(1);
    expect(initialChange).toHaveBeenCalledWith('initial', 'initial', expect.objectContaining({
      app,
      parameters: form.getParameterMap(),
      state: expect.objectContaining({ formValue: form.value }),
    }));
    expect(target).toMatchObject({
      disable: true,
      hidden: true,
      isTouched: false,
      data: { initialized: true },
    });
    expect(updates).toHaveBeenCalledWith(form.value);
    expect(regularChange).not.toHaveBeenCalled();

    form.generateInputCarriers();
    form.setValueByPath('source', 'programmatic');
    form.generateInputCarriers();
    expect(initialChange).toHaveBeenCalledTimes(1);

    const source = carriers.find((carrier) =>
      carrier.carrierType === 'INPUT' && carrier.path === 'source'
    );
    if (source?.carrierType !== 'INPUT') throw new Error('Source carrier missing');
    source.setValue('edited');
    expect(initialChange).toHaveBeenCalledTimes(2);
    expect(initialChange.mock.calls[1].slice(0, 2)).toEqual(['edited', 'programmatic']);
  });

  it('preserves callback overrides without replacing the saved initial value', () => {
    const form = new Reform<InitialChangeFields>(InitialChangeFields, {
      normalized: 'initial',
    });

    const carriers = form.generateInputCarriers();

    expect(form.value.normalized).toBe('INITIAL');
    expect(form.initialValue.normalized).toBe('initial');
    expect(carriers.find((carrier) =>
      carrier.carrierType === 'INPUT' && carrier.path === 'normalized'
    )).toMatchObject({ value: 'INITIAL' });
    expect(normalizeInitialChange).toHaveBeenCalledTimes(1);
  });

  it.each([false, 0, ''])('includes non-null falsy initial value %p', (source) => {
    const form = new Reform<InitialChangeFields>(InitialChangeFields, { source });
    form.generateInputCarriers();
    expect(initialChange.mock.calls[0].slice(0, 2)).toEqual([source, source]);
  });

  it.each([{}, { source: null }, { source: undefined }, { file: 'existing' }])(
    'skips missing, null, undefined and file values: %p',
    (value) => {
      const form = new Reform<InitialChangeFields>(InitialChangeFields, value);
      form.generateInputCarriers();
      form.generateInputCarriers();
      expect(initialChange).not.toHaveBeenCalled();
    }
  );

  it('includes nested objects and every existing array item', () => {
    const form = new Reform<InitialChangeContainer>(InitialChangeContainer, {
      child: { source: 'nested' },
      items: [{ source: 'first' }, { source: 'second' }],
    });
    form.generateInputCarriers();
    form.generateInputCarriers();
    expect(initialChange.mock.calls.map((call) => call[0])).toEqual([
      'nested', 'first', 'second',
    ]);
  });

  it('includes fallback-construction values', () => {
    const form = new Reform<InitialChangeFields>(InitialChangeFields);
    form.generateInputCarriers();
    expect(initialChange.mock.calls[0].slice(0, 2)).toEqual(['fallback', 'fallback']);
  });

  it('includes hidden fields but respects explicit opt-out', () => {
    const form = new Reform<InitialChangeFields>(InitialChangeFields, {
      hiddenSource: 'hidden',
      quietSource: 'quiet',
    });
    const carriers = form.generateInputCarriers();
    expect(initialChange.mock.calls[0].slice(0, 2)).toEqual(['hidden', 'hidden']);
    expect(regularChange).not.toHaveBeenCalled();
    expect(carriers.some((carrier) =>
      carrier.carrierType === 'INPUT' && carrier.path === 'hiddenSource'
    )).toBe(false);
  });

  it('does not overwrite state mutations when a callback returns undefined', () => {
    initialChange.mockImplementationOnce((_value, _oldValue, environment) => {
      environment.state.formValue.source = 'changed by callback';
      return undefined;
    });
    const form = new Reform<InitialChangeFields>(InitialChangeFields, { source: 'initial' });
    form.generateInputCarriers();
    expect(form.value.source).toBe('changed by callback');
    expect(form.initialValue.source).toBe('initial');
  });

  it('does not repeat callbacks if a valueUpdate subscriber regenerates carriers', () => {
    const form = new Reform<InitialChangeFields>(InitialChangeFields, { source: 'initial' });
    form.valueUpdate.subscribe(() => form.generateInputCarriers());
    form.generateInputCarriers();
    expect(initialChange).toHaveBeenCalledTimes(1);
  });

  it('reapplies initialization state after reset and resetToValue', () => {
    const form = new Reform<InitialChangeFields>(InitialChangeFields, { source: 'initial' });
    form.generateInputCarriers();
    form.reset();
    expect(form.getDataByPath('target')).toBeUndefined();
    form.generateInputCarriers();
    expect(form.getDataByPath('target')).toEqual({ initialized: true });
    expect(initialChange).toHaveBeenCalledTimes(2);

    form.resetToValue({ source: 'replacement' });
    form.generateInputCarriers();
    form.generateInputCarriers();
    expect(initialChange).toHaveBeenCalledTimes(3);
    expect(initialChange.mock.calls[2].slice(0, 2)).toEqual(['replacement', 'replacement']);
  });
});

@minkyRoot({
  fallbackConstruction: () => new Serie('', ''),
})
export class Serie {
  constructor(name: string, channel: string) {
    this.name = name;
    this.channel = channel;
  }
  @minky({
    label: 'Name',
    validators: [new RequiredValidator()],
  })
  name?: string;

  @minky({
    label: 'Channel',
    validators: [new RequiredValidator()],
  })
  channel?: string;
}

@minkyRoot({
  fallbackConstruction: () => new FictionalCharacter('', ''),
})
export class FictionalCharacter {
  constructor(name: string, surname: string, serie?: Serie) {
    this.name = name;
    this.surname = surname;
    this.serie = serie;
  }

  @minky({
    validators: [new RequiredValidator()],
  })
  name?: string;

  @minky({
    validators: [new RequiredValidator()],
  })
  surname?: string;

  @minky({
    inputType: 'text',
  })
  religion?: string;

  @minky({
    inputType: 'array',
    subObjectKey: FictionalCharacter,
  })
  friends?: FictionalCharacter[];

  @minky({
    inputType: 'sub-object',
    subObjectKey: Serie,
  })
  serie?: Serie | null;

  @minky({
    inputType: 'checkbox',
  })
  isMain?: boolean;

  @minky({
    inputType: 'number',
  })
  age?: number;
}

@minkyRoot({
  fallbackConstruction: () => new DynamicCharacter('', ''),
})
class DynamicCharacter {
  constructor(source: string, target: string) {
    this.source = source;
    this.target = target;
  }

  @minky({
    validators: [new RequiredValidator()],
    onValueChange: (_newValue, _oldValue, environment) => {
      environment.state.setDisabled?.('target', true);
      environment.state.setHidden?.('source', true);
      environment.state.setData?.('target', { hasSubdivisions: true });
    },
  })
  source: string;

  @minky({ validators: [new RequiredValidator()] })
  target: string;
}

let reform: Reform<FictionalCharacter>;
const KYLE_SURNAME = 'Broflovski';
const KYLE_NAME = 'Kyle';
const SP_NAME = 'South Park';
const CHANNEL = 'Comedy Central';

describe('Reform Instance', () => {
  beforeAll(async () => {
    reform = new Reform(FictionalCharacter, {});
  });

  describe('Reform Getters value', () => {
    it('Should value can be constructed', () => {
      expect(reform.value).not.toBeNull();
    });
    it('Name and Surname field should set', () => {
      reform.setValueByPath('name', KYLE_NAME);
      reform.setValueByPath('surname', KYLE_SURNAME);
      expect(reform.getValueByPath('name')).toEqual(KYLE_NAME);
      expect(reform.getValueByPath('surname')).toEqual(KYLE_SURNAME);
      expect(reform.value.name).toEqual(KYLE_NAME);
      expect(reform.value.surname).toEqual(KYLE_SURNAME);
    });

    it('All fields under Serie should set', () => {
      reform.setValueByPath('serie.name', SP_NAME);
      reform.setValueByPath('serie.channel', CHANNEL);
      expect(reform.getValueByPath('serie.name')).toEqual(SP_NAME);
      expect(reform.getValueByPath('serie.channel')).toEqual(CHANNEL);
      expect(reform.value.serie?.name).toEqual(SP_NAME);
      expect(reform.value.serie?.channel).toEqual(CHANNEL);
    });

    it('First friend character in array should set', () => {
      const STAN_NAME = 'Stan',
        STAN_SURNAME = 'Marsh';
      reform.setValueByPath('friends.0.name', STAN_NAME);
      reform.setValueByPath('friends.0.surname', STAN_SURNAME);
      expect(reform.getValueByPath('friends.0.name')).toEqual(STAN_NAME);
      expect(reform.getValueByPath('friends.0.surname')).toEqual(STAN_SURNAME);
      expect(reform.value.friends?.[0].name).toEqual(STAN_NAME);
      expect(reform.value.friends?.[0].surname).toEqual(STAN_SURNAME);
    });
    it('Second friend character in array should set', () => {
      const KENNY_NAME = 'Kenny',
        KENNY_SURNAME = 'McCormick';
      reform.setValueByPath('friends.1.name', KENNY_NAME);
      reform.setValueByPath('friends.1.surname', KENNY_SURNAME);
      expect(reform.getValueByPath('friends.1.name')).toEqual(KENNY_NAME);
      expect(reform.getValueByPath('friends.1.surname')).toEqual(KENNY_SURNAME);
      expect(reform.value.friends?.[1].name).toEqual(KENNY_NAME);
      expect(reform.value.friends?.[1].surname).toEqual(KENNY_SURNAME);
    });
    // TODO: array
  });

  describe('Check are field opposites created', () => {
    it('boolean', () => {
      expect(reform.getValueByPath('isMain')).toBeFalsy();
    });
    it('integer', () => {
      expect(reform.getValueByPath('age')).toEqual(0);
    });
    it('string', () => {
      expect(reform.getValueByPath('religion')).toEqual('');
    });
  });

  describe('Dynamic carrier state', () => {
    it('updates disabled and hidden state through the carrier bridge', () => {
      const dynamicReform = new Reform(DynamicCharacter, {
        source: '',
        target: '',
      });
      const sourceCarrier = dynamicReform.generateInputCarriers()[0] as any;

      sourceCarrier.setValue('updated');

      const carriers = dynamicReform.generateInputCarriers() as any[];
      expect(carriers.find((carrier) => carrier.path === 'source').hidden).toBe(true);
      expect(carriers.find((carrier) => carrier.path === 'target').disable).toBe(true);
    });

    it('skips hidden and disabled fields during validation', () => {
      const dynamicReform = new Reform(DynamicCharacter, {
        source: '',
        target: '',
      });
      const sourceCarrier = dynamicReform.generateInputCarriers()[0] as any;

      sourceCarrier.setValue('updated');

      expect(dynamicReform.validationErrorByPath({
        path: 'source',
        meta: dynamicReform.getPropertyMeta('source'),
      })).toEqual([]);
      expect(dynamicReform.validationErrorByPath({
        path: 'target',
        meta: dynamicReform.getPropertyMeta('target'),
      })).toEqual([]);
      expect(dynamicReform.allValidationErrors()).toEqual([]);
    });

    it('stores and clears arbitrary per-path data set through the state environment', () => {
      const dynamicReform = new Reform(DynamicCharacter, {
        source: '',
        target: '',
      });
      const sourceCarrier = dynamicReform.generateInputCarriers()[0] as any;

      sourceCarrier.setValue('updated');

      const carriers = dynamicReform.generateInputCarriers() as any[];
      expect(carriers.find((carrier) => carrier.path === 'target').data).toEqual({ hasSubdivisions: true });

      dynamicReform.reset();
      const resetCarriers = dynamicReform.generateInputCarriers() as any[];
      expect(resetCarriers.find((carrier) => carrier.path === 'target').data).toBeUndefined();
    });
  });
});

const nonEmptyWarning = {
  labelKey: 'NonEmptyWarning',
  validate: (value: unknown) => ({ valid: value !== '', name: 'warning.empty' }),
};
const shortInfo = {
  labelKey: 'ShortInfo',
  validate: (value: unknown) => ({ valid: String(value ?? '').length > 3, name: 'info.short' }),
};

@minkyRoot({ fallbackConstruction: () => ({ code: '', note: '' }) })
class MessageFields {
  @minky({
    warningValidators: [nonEmptyWarning],
    infoValidators: [shortInfo],
    onValueChange: (value: string, _old, environment) => {
      environment.state.setWarning?.('note', value === 'warn' ? 'warning.fromCallback' : undefined);
      return undefined;
    },
  })
  code?: string;

  @minky({ warningValidators: [nonEmptyWarning] })
  note?: string;
}

describe('Reform warning and info messages', () => {
  const inputCarrier = (form: Reform<MessageFields>, path: string) =>
    (form.generateInputCarriers() as any[]).find((carrier) => carrier.path === path);

  it('uses warning and info validators without blocking validation', () => {
    const form = new Reform<MessageFields>(MessageFields);
    const carrier = inputCarrier(form, 'code');

    expect(carrier.warnings.map((m: any) => m.name)).toEqual(['warning.empty']);
    expect(carrier.infos.map((m: any) => m.name)).toEqual(['info.short']);
    expect(form.hasErrors()).toBe(false);
    expect(form.allMessages('warning')).toHaveLength(2);

    carrier.setValue('long value');
    expect(carrier.warnings).toEqual([]);
    expect(carrier.infos).toEqual([]);
  });

  it('prefers messages set on the reform over validator messages', () => {
    const form = new Reform<MessageFields>(MessageFields);
    const changes: unknown[] = [];
    form.fieldPropertyChanged.subscribe((change) => changes.push(change));

    form.setWarningByPath('code', 'warning.manual');
    form.setInfoByPath('code', 'info.manual');

    const carrier = inputCarrier(form, 'code');
    expect(carrier.warnings.map((m: any) => m.name)).toEqual(['warning.manual']);
    expect(carrier.infos.map((m: any) => m.name)).toEqual(['info.manual']);
    expect(changes).toEqual([
      { path: 'code', warning: 'warning.manual' },
      { path: 'code', info: 'info.manual' },
    ]);

    form.setWarningByPath('code', undefined);
    expect(inputCarrier(form, 'code').warnings.map((m: any) => m.name)).toEqual(['warning.empty']);
  });

  it('allows callbacks to set messages and clears them on reset', () => {
    const form = new Reform<MessageFields>(MessageFields, { code: '', note: 'filled' });
    inputCarrier(form, 'code').setValue('warn');

    expect(inputCarrier(form, 'note').warnings.map((m: any) => m.name)).toEqual(['warning.fromCallback']);

    form.reset();
    expect(form.getMessageByPath('note', 'warning')).toBeUndefined();
    expect(inputCarrier(form, 'note').warnings).toEqual([]);
  });

  it('keeps reform messages but skips validator messages for disabled paths', () => {
    const form = new Reform<MessageFields>(MessageFields);
    form.setDisableByPath('note', true);
    expect(inputCarrier(form, 'note').warnings).toEqual([]);

    form.setWarningByPath('note', 'warning.disabledReason');
    expect(inputCarrier(form, 'note').warnings.map((m: any) => m.name)).toEqual(['warning.disabledReason']);
  });
});
