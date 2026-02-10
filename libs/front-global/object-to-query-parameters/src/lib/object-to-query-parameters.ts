// type Primitive = number | string | Number | String;
// type PrimitiveObject = {
//   [key: string]: Primitive;

import { isSignal } from '@angular/core';

// };
export function objectToQueryParameters(obj: any): string {
  var str = [];
  for (var key in obj)
    if (obj.hasOwnProperty(key)) {
      let fieldValue = obj[key];
      if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
        continue;
      }
      if (isSignal(fieldValue)) {
        fieldValue = fieldValue() as any;
      }

      if (fieldValue instanceof Date) {
        fieldValue = fieldValue.toISOString();
      } else if (fieldValue) {
        fieldValue = encodeURIComponent(fieldValue);
      }
      if (fieldValue || fieldValue == 0) {
        str.push(encodeURIComponent(key) + '=' + fieldValue);
      }
    }
  return str.join('&');
}
