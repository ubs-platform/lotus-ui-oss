import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalVariableEditorComponent } from './global-variable-editor.component';

describe('GlobalVariableEditorComponent', () => {
  let component: GlobalVariableEditorComponent;
  let fixture: ComponentFixture<GlobalVariableEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalVariableEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalVariableEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
