import { MetaKey } from '../meta-key';
import { PropertyMeta } from '../property-meta';
import { getPropertyMetaHolder } from '../property-holder';
import { IValidatorResult } from './validator';
export type IValidatorResultWithPath = IValidatorResult & { path: string };
export class Reviewer {
  reviewObjectDetailed(
    object: any,
    key: MetaKey,
    prefix = ''
  ): IValidatorResultWithPath[] {
    const metas = getPropertyMetaHolder().getMetas(key);
    let validationsTotal: IValidatorResultWithPath[] = [];
    for (let metaIndex = 0; metaIndex < metas.length; metaIndex++) {
      const meta = metas[metaIndex];
      const propertyKey = meta.name;
      if (propertyKey != null) {
        const propertyValue = object?.[propertyKey];
        if (meta.inputType == 'sub-object' && meta.subObjectKey) {
          validationsTotal = this.extractValidationsFromObject(
            propertyValue,
            meta,
            propertyKey,
            validationsTotal
          );
        } else if (
          meta.inputType == 'array' &&
          meta.arrayItemInputType == 'sub-object' &&
          meta.subObjectKey &&
          propertyValue instanceof Array
        ) {
          propertyValue.forEach((value, index) => {
            validationsTotal = this.extractValidationsFromObject(
              value,
              meta,
              `${propertyKey}.${index}`,
              validationsTotal
            );
          });
        } else {
          let propertyKeyWithPrefix = propertyKey;
          if (prefix) {
            propertyKeyWithPrefix = `${prefix}.${propertyKey}`;
          }
          validationsTotal = this.fillValiadtion(
            meta,
            propertyValue,
            propertyKeyWithPrefix,
            validationsTotal
          );
        }
      } else {
        throw 'MINKY: property name of the meta is required';
      }
    }
    return validationsTotal;
  }

  private extractValidationsFromObject(
    propertyValue: any,
    meta: PropertyMeta<any>,
    propertyKey: string,
    validationsTotal: IValidatorResultWithPath[]
  ) {
    const validators = this.reviewObjectDetailed(
      propertyValue,
      meta.subObjectKey,
      propertyKey
    );
    validationsTotal.push(...validators);
    return validationsTotal;
  }

  private fillValiadtion(
    meta: PropertyMeta<any>,
    propertyValue: any,
    propertyKey: string,
    validationsTotal: IValidatorResultWithPath[]
  ): IValidatorResultWithPath[] {
    if (meta.validators) {
      const validations = meta.validators.map((validator) => ({
        ...validator.validate(propertyValue),
        path: propertyKey,
      }));
      validationsTotal.push(...validations);
    }
    return validationsTotal;
  }
}
