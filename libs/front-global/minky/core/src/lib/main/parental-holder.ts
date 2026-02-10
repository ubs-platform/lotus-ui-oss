import { MetaKey } from './meta-key';
import { MetaKeyRegularizer } from './meta-key-regularizer';
import { RootPropertyMeta } from './root-property-meta';
import { tagTheKlassIfNot } from './util/utils';

export class StructureRootMetaHolder {
  private globalMap = new Map<MetaKey, RootPropertyMeta>();

  public putMeta(target_: MetaKey, propertyMeta: RootPropertyMeta) {
    tagTheKlassIfNot(target_);

    const target = MetaKeyRegularizer.regularizeTarget(target_);
    const existings = this.globalMap.get(target);
    // console.info(target_);
    this.globalMap.set(target, propertyMeta);
  }

  public getMetas(target_: MetaKey): RootPropertyMeta | undefined {
    const target = MetaKeyRegularizer.regularizeTarget(target_);

    const existings = this.globalMap.get(target);
    if (existings) return existings;
    return undefined;
  }
}

const structureRootMetaHolder = new StructureRootMetaHolder();
export const getStructureRootMetaHolder = () => {
  return structureRootMetaHolder;
};
