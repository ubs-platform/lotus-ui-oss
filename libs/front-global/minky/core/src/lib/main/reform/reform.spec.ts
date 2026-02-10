import { minky, minkyRoot } from '../../decorations/decorators';
import { RequiredValidator } from './validators/required';
import { Reviewer } from './reviewer';
import { getPropertyMetaHolder, PropertyMetaHolder } from '../property-holder';
import { Reform } from './reform';

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

let reform: Reform<FictionalCharacter>;
const KYLE_SURNAME = 'Broflovski';
const KYLE_NAME = 'Kyle';
const SP_NAME = 'South Park';
const CHANNEL = 'Comedy Central';

describe('Reform Instance', () => {
  beforeAll(async () => {
    reform = new Reform('FictionalCharacter');
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
});
