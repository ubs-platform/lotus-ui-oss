import { Test } from '@nestjs/testing';
import { getPropertyMetaHolder, getStructureRootMetaHolder } from '../main';
import { minky, minkyRoot } from './decorators';

const SURNAME_DESCRIPTION = 'Surname Description';
const NAM_DESCRIPTION = 'Name Description';
const NAME_PROPERTY_LABEL = 'Name';
const SURNAME_PROPERTY_LABEL = 'Surname';

@minkyRoot({
  fallbackConstruction: () => new MinkyTester('Kyle', 'Broflovski'),
})
class MinkyTester {
  constructor(name: string, surname: string) {
    this.name = name;
    this.surname = surname;
  }

  @minky({
    label: NAME_PROPERTY_LABEL,
    description: NAM_DESCRIPTION,
  })
  name: string;

  @minky({
    label: SURNAME_PROPERTY_LABEL,
    description: SURNAME_DESCRIPTION,
  })
  surname: string;
}

describe('AppService', () => {
  let testVal;

  beforeAll(async () => {
    const tv = getStructureRootMetaHolder()
      .getMetas(MinkyTester)
      ?.fallbackConstruction?.() as MinkyTester;

    testVal = tv;
  });

  describe('getData', () => {
    it('Should parental metadata are loaded', () => {
      const metas = getStructureRootMetaHolder().getMetas(MinkyTester);
      expect(metas?.name).toEqual(MinkyTester.name);
    });

    it('Should property metadata are loaded', () => {
      const metas = getPropertyMetaHolder().getMetas(MinkyTester);
      expect(metas[0]?.label).toEqual(NAME_PROPERTY_LABEL);
      expect(metas[0]?.description).toEqual(NAM_DESCRIPTION);
      expect(metas[1]?.label).toEqual(SURNAME_PROPERTY_LABEL);
      expect(metas[1]?.description).toEqual(SURNAME_DESCRIPTION);
    });
  });
});
