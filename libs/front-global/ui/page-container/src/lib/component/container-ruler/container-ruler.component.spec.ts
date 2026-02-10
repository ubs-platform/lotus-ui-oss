import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContainerRulerComponent } from './container-ruler.component';

describe('ContainerRulerComponent', () => {
  let component: ContainerRulerComponent;
  let fixture: ComponentFixture<ContainerRulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContainerRulerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerRulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
