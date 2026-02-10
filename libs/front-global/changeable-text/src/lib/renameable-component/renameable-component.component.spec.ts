import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenameableComponentComponent } from './renameable-component.component';

describe('RenameableComponentComponent', () => {
  let component: RenameableComponentComponent;
  let fixture: ComponentFixture<RenameableComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenameableComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RenameableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
