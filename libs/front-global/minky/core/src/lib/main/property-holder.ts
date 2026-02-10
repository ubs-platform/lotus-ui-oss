import { MetaKey } from './meta-key';
import { MetaKeyRegularizer } from './meta-key-regularizer';
import { PropertyMeta } from './property-meta';
import { tagTheKlassIfNot } from './util/utils';

export class PropertyMetaHolder {
  private globalMap = new Map<MetaKey, PropertyMeta[]>();

  public putMeta(target_: MetaKey, propertyMeta: PropertyMeta) {
    tagTheKlassIfNot(target_);
    const target = MetaKeyRegularizer.regularizeTarget(target_);
    const existings = this.globalMap.get(target);
    if (existings) {
      existings.push(propertyMeta);
      this.globalMap.set(target, existings);
    } else {
      this.globalMap.set(target, [propertyMeta]);
    }
  }

  public getMetas(target_: MetaKey) {
    tagTheKlassIfNot(target_);

    const target = MetaKeyRegularizer.regularizeTarget(target_);

    const existings = this.globalMap.get(target);
    return existings || [];
  }
}

const propertyMetaHolder = new PropertyMetaHolder();
export const getPropertyMetaHolder = () => {
  return propertyMetaHolder;
};
