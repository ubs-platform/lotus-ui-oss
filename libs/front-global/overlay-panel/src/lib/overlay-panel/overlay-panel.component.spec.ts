import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslatorRepositoryService } from '@lotus/extra/ubs-translator-ngx';
import { of } from 'rxjs';
import { OverlayPanelComponent } from './overlay-panel.component';
import { PTooltipDirective } from './p-tooltip.directive';

@Component({
  imports: [PTooltipDirective],
  template: '<button [lib-tooltip]="tooltip">Target</button>',
})
class TooltipHostComponent {
  tooltip?: string = 'Tooltip text';
}

describe('OverlayPanelComponent', () => {
  let component: OverlayPanelComponent;
  let fixture: ComponentFixture<OverlayPanelComponent>;
  let anchor: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayPanelComponent);
    component = fixture.componentInstance;
    anchor = document.createElement('button');
    fixture.nativeElement.appendChild(anchor);
    fixture.detectChanges();
  });

  it('opens below the supplied button with fallback positions', () => {
    component.showDialog(anchor);
    fixture.detectChanges();

    expect(component.show()).toBe(true);
    expect(component.origin()).toBe(anchor);
    expect(component.positions()[0]).toMatchObject({ originY: 'bottom', overlayY: 'top' });
    expect(component.positions()[1]).toMatchObject({ originY: 'top', overlayY: 'bottom' });
    expect(fixture.debugElement.queryAllNodes(By.directive(CdkConnectedOverlay))).toHaveLength(1);
  });

  it('prioritizes the requested side and retains a fallback', () => {
    component.showDialog(anchor, 'RIGHT');

    expect(component.positions()[0]).toMatchObject({ originX: 'end', overlayX: 'start' });
    expect(component.positions()[1]).toMatchObject({ originX: 'start', overlayX: 'end' });
  });

  it('anchors to the clicked control rather than its child', () => {
    const icon = document.createElement('span');
    anchor.appendChild(icon);

    component.showDialog({ currentTarget: anchor, target: icon } as unknown as MouseEvent);

    expect(component.origin()).toBe(anchor);
  });

  it('closes when CDK reports an outside click', () => {
    component.showDialog(anchor);
    fixture.detectChanges();
    const overlay = fixture.debugElement.queryAllNodes(By.directive(CdkConnectedOverlay))[0].injector.get(CdkConnectedOverlay);

    overlay.overlayOutsideClick.emit(new MouseEvent('click'));

    expect(component.show()).toBe(false);
  });
});

describe('PTooltipDirective', () => {
  let fixture: ComponentFixture<TooltipHostComponent>;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
      providers: [{
        provide: TranslatorRepositoryService,
        useValue: { getStringListenChanges: ({ key }: { key: string }) => of(key) },
      }],
    }).compileComponents();
    fixture = TestBed.createComponent(TooltipHostComponent);
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  });

  it('opens on hover and closes when the pointer leaves', async () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    await fixture.whenStable();

    expect(document.querySelector('lib-tooltip-content')?.textContent).toContain('Tooltip text');

    button.dispatchEvent(new MouseEvent('mouseleave'));
    expect(document.querySelector('lib-tooltip-content')).toBeNull();
  });

  it('opens on keyboard focus and ignores empty values', async () => {
    button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await fixture.whenStable();
    expect(document.querySelector('lib-tooltip-content')).toBeTruthy();

    button.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.componentInstance.tooltip = undefined;
    fixture.detectChanges();
    button.dispatchEvent(new MouseEvent('mouseenter'));
    expect(document.querySelector('lib-tooltip-content')).toBeNull();
  });

  it('updates the text while the tooltip is open', async () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.componentInstance.tooltip = 'Updated tooltip';
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('lib-tooltip-content')?.textContent).toContain('Updated tooltip');
  });
});
