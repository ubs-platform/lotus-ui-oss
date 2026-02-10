import { minky } from '../../decorations/decorators';
import { RequiredValidator } from './validators/required';
import { Reviewer } from './reviewer';
import { getPropertyMetaHolder, PropertyMetaHolder } from '../property-holder';
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

export class FictionalCharacter {
  constructor(
    name: string,
    surname: string,
    serie: Serie,
    friends: FictionalCharacter[] = []
  ) {
    this.name = name;
    this.surname = surname;
    this.serie = serie;
    this.friends = friends;
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
    inputType: 'sub-object',
    subObjectKey: Serie,
  })
  serie: Serie;

  @minky({
    inputType: 'array',
    arrayItemInputType: 'sub-object',
    subObjectKey: FictionalCharacter,
  })
  friends?: FictionalCharacter[];
}

let structureHolder: PropertyMetaHolder;

describe('Value Reviewer', () => {
  beforeAll(async () => {
    structureHolder = getPropertyMetaHolder();
  });

  describe('Name field should pass', () => {
    it('Should value pass', () => {
      const character = new FictionalCharacter(
        'Kyle',
        'Broflovski',
        new Serie('South Park', 'Comedy Central')
      );

      const validations = new Reviewer()
        .reviewObjectDetailed(character, FictionalCharacter)
        .filter((a) => !a.valid);
      expect(validations).toHaveLength(0);
    });
    it('A string field should fail', () => {
      const character = new FictionalCharacter(
        'Spy',
        '',
        new Serie('Team Fortress 2', 'Valve')
      );

      const validations = new Reviewer()
        .reviewObjectDetailed(character, FictionalCharacter)
        .filter((a) => !a.valid);
      expect(validations).toHaveLength(1);
      expect(validations[0].name).toEqual(RequiredValidator.name);
      expect(validations[0].path).toEqual('surname');
    });

    it('A string field in nested object should fail', () => {
      const character = new FictionalCharacter(
        'Polat',
        'Alemdar',
        new Serie('Valley of the Wolves', '')
      );

      const validations = new Reviewer()
        .reviewObjectDetailed(character, FictionalCharacter)
        .filter((a) => !a.valid);
      expect(validations).toHaveLength(1);
      expect(validations[0].name).toEqual(RequiredValidator.name);
      expect(validations[0].path).toEqual('serie.channel');
    });

    it('Should check in array fields', () => {
      const sp = new Serie('South Park', 'Comedy Central');

      const character = new FictionalCharacter('Kyle', 'Broflovski', sp, [
        new FictionalCharacter('Stan', '', sp),
        new FictionalCharacter('Kenny', '', sp),
      ]);

      const validations = new Reviewer()
        .reviewObjectDetailed(character, FictionalCharacter)
        .filter((a) => !a.valid);
      expect(validations).toHaveLength(2);
      expect(validations[0].name).toEqual(RequiredValidator.name);
      expect(validations[0].path).toEqual('friends.0.surname');
      expect(validations[1].name).toEqual(RequiredValidator.name);
      expect(validations[1].path).toEqual('friends.1.surname');
    });
  });
});
