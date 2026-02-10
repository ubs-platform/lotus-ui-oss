import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {LoadingIndicationService} from '@lotus/front-global/user-service-wraps';

export interface ITabPage {
  name: string;
  title: string;
  icon: string;
}

export class TabPage implements ITabPage {
  constructor(public name: string,
    public title: string,
    public icon: string)
  {

  }
}


@Component({
  selector: 'landwirtde1-farmer-admin-sidebar',
  templateUrl: './farmer-admin-sidebar.component.html',
  styleUrls: ['./farmer-admin-sidebar.component.scss']
})
export class FarmerAdminSidebarComponent implements OnInit {

  @Input() tabs: TabPage[] = [];
  @Input() selected?: TabPage;
  @Output() selectedChange: EventEmitter<TabPage>
  @Input() expandedMobileScreen = false;
  @Output() expandedMobileScreenChange: EventEmitter<boolean>
  @Output() backGo : EventEmitter<any>;
  @Input() goBackText = "Geri dön";
  @Input() goBackEventEnabled = false;
  loading: any;
  
  constructor(private loadingService : LoadingIndicationService) {
    this.selectedChange = new EventEmitter();
    this.expandedMobileScreenChange = new EventEmitter();
    this.backGo = new EventEmitter();
  }

  ngOnInit(): void
  {
    if (this.selected === null && this.tabs.length > 1) {
      this.select(this.tabs[0]);
    }
    // this.loadingService.loadingStatusChange.subscribe(
    //   loading => {
    //     this.loading = loading;
    //   }
    // )
  }

  select(tabPage: TabPage) : void {
    this.selected = tabPage;
    this.selectedChange.emit(tabPage);
    this.setMenu(false);
  }

  toggleMenu() : void {
    this.expandedMobileScreen = !this.expandedMobileScreen;
    this.expandedMobileScreenChange.emit(this.expandedMobileScreen);
  }

  setMenu(newstate : boolean) : void {
    this.expandedMobileScreen = newstate;
    this.expandedMobileScreenChange.emit(this.expandedMobileScreen);
  }
}
