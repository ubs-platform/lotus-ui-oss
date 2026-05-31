import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarPageActionHolderComponent } from './sidebar-page-action-holder.component';

describe('SidebarPageActionHolderComponent', () => {
  let component: SidebarPageActionHolderComponent;
  let fixture: ComponentFixture<SidebarPageActionHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarPageActionHolderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarPageActionHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
