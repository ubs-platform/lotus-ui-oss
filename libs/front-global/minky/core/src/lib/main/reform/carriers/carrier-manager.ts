import {
  getPropertyMetaHolder,
  PropertyMetaHolder,
} from '../../property-holder';
import { PropertyMeta } from '../../property-meta';
import { ReformUtils } from '../utils';
import { ICarrierBridge } from './carrier-bridge';
import {
  ActionLinkCarrier,
  GroupedLinkCarrier,
  InputLinkCarrier,
  LinkCarrier,
} from './input-link-carrier';

export class CarrierManager<T extends any> {
  constructor(private bridge: ICarrierBridge) {}

  generateInputCarriers(
    propertyMetas = this.bridge.currentPropertyMetas(),
    prefix = ''
  ): Array<LinkCarrier> {
    let carriers: Array<LinkCarrier> = [];
    for (let index = 0; index < propertyMetas.length; index++) {
      const propertyMeta = propertyMetas[index];
      if (!propertyMeta.hide) {
        const name = this.buildPath(prefix, propertyMeta.name);

        if (propertyMeta.inputType == 'array') {
          this.generateArrayCarriers(name, propertyMeta, carriers);
        } else if (propertyMeta.subObjectKey) {
          // this.includeSectionTitle(carriers, propertyMeta, name);
          this.generateSubObjectCarrier(propertyMeta, carriers, name);
        } else if (propertyMeta.name) {
          const baseObject = this.generateSingularCarrier(prefix, propertyMeta);
          carriers.push(baseObject);
        }
      }
    }
    return carriers;
  }

  buildPath(...arg0: Array<string | number | null | undefined>) {
    return ReformUtils.buildPath(...arg0);
  }

  private generateSubObjectCarrier(
    propertyMeta: PropertyMeta<T>,
    carriers: Array<LinkCarrier>,
    arrayPrefix: string
  ) {
    const metas = getPropertyMetaHolder().getMetas(propertyMeta.subObjectKey);
    carriers.push(...this.generateInputCarriers(metas, arrayPrefix));
  }

  private generateSingularCarrier(prefix: string, propertyMeta: PropertyMeta) {
    const path = this.buildPath(prefix, propertyMeta.name);
    const carrierLink = {
      carrierType: 'INPUT',
      disable: propertyMeta.disable || false,
      value: this.bridge.getValueByPath(path),
      inputType: propertyMeta.inputType,
      widthRatio: propertyMeta.widthRatio || '100%',
      path,
      validationErrors: this.bridge.validationErrorByPath({
        path,
        meta: propertyMeta,
      }),
      isTouched: this.bridge.touchMap().getPathStatus(path),
      validators: propertyMeta.validators?.map((a) => a.labelKey) || [],
      title: propertyMeta.label || propertyMeta.name,
      depth: ReformUtils.getDepthOfPath(path),
      feeder: this.bridge.getFeeder(path),
    } as InputLinkCarrier;

    carrierLink.setTouched = (b: boolean) => {
      this.bridge.touchMap().togglePath(b, path);
      carrierLink.isTouched = this.bridge.touchMap().getPathStatus(path);
    };

    carrierLink.setValue = (value) => {
      if (propertyMeta.inputType == 'file') {
        const valueAsFileList = value as FileList;
        const fakeFileList = [];
        for (let index = 0; index < valueAsFileList.length; index++) {
          const file = valueAsFileList[index];
          fakeFileList.push(file);
        }
        this.bridge.setFileByPath(path, fakeFileList);
        carrierLink.value = value;
        // carrierLink.validationErrors = this.bridge.validationErrorByPath({
        //   path,
        //   meta: propertyMeta,
        // });
      } else {
        this.bridge.setValueByPath(path, value);
        carrierLink.value = this.bridge.getValueByPath(path);
        carrierLink.validationErrors = this.bridge.validationErrorByPath({
          path,
          meta: propertyMeta,
        });
      }
    };
    return carrierLink;
  }

  private generateArrayCarriers(
    name: string,
    propertyMeta: PropertyMeta<T>,
    carriers: Array<LinkCarrier>
  ) {
    if (!propertyMeta.hide) {
      const groupItems = [] as LinkCarrier[];
      const length = (this.bridge.getValueByPath(name) as [])?.length || 0;
      for (let index = 0; index < length; index++) {
        const arrayPrefix = this.buildPath(name, index);

        if (
          propertyMeta.arrayItemInputType == 'sub-object' ||
          propertyMeta.subObjectKey
        ) {
          this.generateSubObjectCarrier(propertyMeta, groupItems, arrayPrefix);
        } else {
          const baseObject = this.generateSingularCarrier(arrayPrefix, {
            name: undefined,
            inputType: propertyMeta.arrayItemInputType,
          });
          groupItems.push(baseObject);
        }
        groupItems.push({
          carrierType: 'ACTION',
          // inputType: 'action',
          title: 'remove',
          depth: this.calculateDepth(name),
          action: () => {
            (this.bridge.getValueByPath(name) as [])?.splice(index, 1);
            this.bridge.emitBigUpdate(this.bridge.value());
          },
        });
      }

      this.addNewActionArray(name, propertyMeta, groupItems);
      const grp = {
        carrierType: 'GROUP',
        title: propertyMeta.name,
        items: groupItems,
        depth: this.calculateDepth(name),
        widthRatio: propertyMeta.widthRatio,
        propertyMeta,
      } as GroupedLinkCarrier;
      carriers.push(grp);
    }
  }

  private calculateDepth(name: string): number {
    return ReformUtils.getDepthOfPath(name) + 1;
  }

  private addNewActionArray(
    name: string,
    propertMeta: PropertyMeta,
    carriers: Array<LinkCarrier>
  ) {
    carriers.push({
      carrierType: 'ACTION',
      title: 'insert',
      depth: ReformUtils.getDepthOfPath(name) + 1,

      action: () => {
        const parentValue = this.bridge.getValueByPath(name) as [];
        const arrayLength = parentValue.length;
        const latestPath = this.buildPath(name, arrayLength);
        if (
          propertMeta.arrayItemInputType == 'sub-object' &&
          propertMeta.subObjectKey
        ) {
          this.bridge.setValueByPath(latestPath, {});
        } else {
          this.bridge.setValueByPath(latestPath, '');
        }
        this.bridge.emitBigUpdate(this.bridge.value());
      },
    });
  }
}
