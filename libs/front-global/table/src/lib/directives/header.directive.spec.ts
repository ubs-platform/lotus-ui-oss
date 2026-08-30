import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderDirective } from './header.drective';

@Component({
  template: `
    <ng-template #withContent header [content]="'test.header.title'">
      <span>With Content</span>
    </ng-template>
    <ng-template #withoutContent header>
      <span>Without Content</span>
    </ng-template>
  `,
  standalone: false,
})
class TestHostComponent {
  @ViewChild('withContent', { static: true, read: HeaderDirective })
  headerWithContent!: HeaderDirective;

  @ViewChild('withoutContent', { static: true, read: HeaderDirective })
  headerWithoutContent!: HeaderDirective;
}

describe('HeaderDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, HeaderDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should receive content input when provided', () => {
    expect(component.headerWithContent).toBeTruthy();
    expect(component.headerWithContent.content()).toBe('test.header.title');
  });

  it('should have undefined content when not provided', () => {
    expect(component.headerWithoutContent).toBeTruthy();
    expect(component.headerWithoutContent.content()).toBeUndefined();
  });
});

