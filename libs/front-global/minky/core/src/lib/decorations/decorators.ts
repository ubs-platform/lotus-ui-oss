import { getStructureRootMetaHolder, RootPropertyMeta } from '../main';
import { PropertyMeta } from '../main/property-meta';
import { getPropertyMetaHolder } from '../main/property-holder';

export function minky(meta: PropertyMeta) {
  if (meta == null) meta = {};
  return function (target: any, propertyKey: any) {
    if (meta.name == null) {
      meta.name = propertyKey;
    }
    getPropertyMetaHolder().putMeta(target, meta);
  };
}

export function minkyRoot(meta?: RootPropertyMeta) {
  return (ctor: Function) => {
    if (!meta) meta = {};
    if (!meta.name) meta.name = ctor.name;

    if (!meta.fallbackConstruction) meta.fallbackConstruction = () => ({}); // () => ctor.apply({});
    getStructureRootMetaHolder().putMeta(ctor, meta);
  };
}
