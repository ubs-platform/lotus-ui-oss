import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerAdminSidebarComponent } from './farmer-admin-sidebar.component';

describe('FarmerAdminSidebarComponent', () => {
  let component: FarmerAdminSidebarComponent;
  let fixture: ComponentFixture<FarmerAdminSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerAdminSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerAdminSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
