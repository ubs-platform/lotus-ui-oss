import { Injectable } from '@angular/core';

export type ElementType = 'SCRIPT' | 'CSS';

export class IndexAutoLoadElement {
  public activeElement?: Element;
  constructor(
    public identify: string,
    public elementType: ElementType,
    public path: string
  ) {}
}

@Injectable()
export class IndexAutoLoader {
  private loads: IndexAutoLoadElement[] = [];

  public register(...iaes: IndexAutoLoadElement[]) {
    iaes.forEach((iae) => {
      if (!this.loads.find((_a) => _a.identify == iae.identify)) {
        this.loads.push(iae);
        this.applyChanges();
      }
    });
  }

  applyChanges() {
    this.loads.forEach((a) => {
      if (!a.activeElement) {
        if (a.elementType == 'CSS') {
          const el = document.createElement('link');
          el.rel = 'stylesheet';
          el.type = 'text/css';
          el.href = a.path;
          el.id = a.identify;
          document.head.appendChild(el);
          a.activeElement = el;
        } else if (a.elementType == 'SCRIPT') {
          const el = document.createElement('script');
          el.type = 'text/javascript';
          el.src = a.path;
          el.id = a.identify;
          document.body.appendChild(el);
          a.activeElement = el;
        }
      }
    });
  }
}
