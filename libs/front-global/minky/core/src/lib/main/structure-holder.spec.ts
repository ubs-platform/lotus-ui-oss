import { getPropertyMetaHolder, PropertyMetaHolder } from './property-holder';

interface Data {
  name: string;
  age: number;
}

let structureHolder: PropertyMetaHolder;
describe('Structure Holder', () => {
  beforeAll(async () => {
    structureHolder = getPropertyMetaHolder();
  });

  describe('Should register name field', () => {
    it('Should name property metadata are loaded', () => {
      const infName = 'DATA_INTERFACE',
        INTERFACE_PROP_NAME = 'name',
        INTERFACE_PROP_LABEL = 'Name',
        INTERFACE_PROP_DESCR = 'Description';
      structureHolder.putMeta(infName, {
        name: INTERFACE_PROP_NAME,
        label: INTERFACE_PROP_LABEL,
        description: INTERFACE_PROP_DESCR,
      });
      const metas = structureHolder.getMetas(infName);
      expect(metas[0]?.name).toEqual(INTERFACE_PROP_NAME);
      expect(metas[0]?.label).toEqual(INTERFACE_PROP_LABEL);
      expect(metas[0]?.description).toEqual(INTERFACE_PROP_DESCR);
    });
    it('Should age property metadata are loaded', () => {
      const infName = 'DATA_INTERFACE',
        INTERFACE_PROP_NAME = 'age',
        INTERFACE_PROP_LABEL = 'Age',
        INTERFACE_PROP_DESCR =
          'the length of time that a person has lived or a thing has existed.';
      structureHolder.putMeta(infName, {
        name: INTERFACE_PROP_NAME,
        label: INTERFACE_PROP_LABEL,
        description: INTERFACE_PROP_DESCR,
      });
      const metas = structureHolder.getMetas(infName);
      expect(metas[1]?.name).toEqual(INTERFACE_PROP_NAME);
      expect(metas[1]?.label).toEqual(INTERFACE_PROP_LABEL);
      expect(metas[1]?.description).toEqual(INTERFACE_PROP_DESCR);
    });
  });
});
