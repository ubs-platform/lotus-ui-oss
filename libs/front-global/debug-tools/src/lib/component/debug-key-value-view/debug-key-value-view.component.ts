import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyValueArray, UconsoleService } from '../../service/uconsole.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'lotus-web-debug-key-value-view',
    templateUrl: './debug-key-value-view.component.html',
    styleUrls: ['./debug-key-value-view.component.scss'],
    standalone: false
})
export class DebugKeyValueViewComponent implements OnInit {
  values?: Observable<KeyValueArray>;
  constructor(public uconsole: UconsoleService) {}
  ngOnInit(): void {
    this.values = this.uconsole.mapValueListener();
  }
}
