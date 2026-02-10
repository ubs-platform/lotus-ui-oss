import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
export type KeyValueArray = {
  key: string;
  value: string;
}[];
@Injectable()
export class UconsoleService {
  private valueMap: Map<string, any> = new Map();
  private valueMapSubject = new Subject<KeyValueArray>();

  constructor(private dialogService: DialogService) {
    this.valueMapSubject.next([]);
  }

  public setValue(key: string, value: any) {
    if (value === undefined) {
      this.valueMap.delete(key);
    } else {
      this.valueMap.set(key, value);
    }
    this.valueMapSubject.next(this.mapValueEntries());
  }

  public mapValueListener() {
    return this.valueMapSubject.pipe();
  }

  public mapValueEntries() {
    const mapItems: KeyValueArray = [];
    this.valueMap.forEach((value, key) => {
      mapItems.push({ key, value });
    });
    return mapItems;
  }
}
