import { MetaKey } from './meta-key';

export class MetaKeyRegularizer {
  static regularizeTarget(target_: MetaKey) {
    if (typeof target_ == 'string' || target_ instanceof String) {
      return target_.toString();
    } else if (typeof target_ == 'function') {
      return (target_ as any)['_reform_root_tag'];
    } else if (typeof target_ == 'object') {
      return ((target_ as Object).constructor as any)['_reform_root_tag'];
    } else {
      return target_.toString();
    }
  }
}
