import { MetaKey } from './meta-key';

export class MetaKeyRegularizer {
  static regularizeTarget(target_: MetaKey) {
    let regularized;
    if (typeof target_ == 'function')
      regularized = (target_ as any)['_reform_root_tag'];
    else if (typeof target_ == 'object')
      regularized = ((target_ as Object).constructor as any)[
        '_reform_root_tag'
      ];
    else regularized = target_.toString();

    return regularized;
  }
}
