import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  viewChild,
  ViewChild,
  input
} from '@angular/core';
import { UconsoleService } from '@lotus/front-global/debug-tools';
import C2S, { SVGRenderingContext2D } from '@mithrandirii/canvas2svg';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ThemeManager } from '@lotus/front-global/theme-management';
import { UndoRedoHelper } from '@lotus/front-global/undo-redo-helper';
import { Placement } from '../placement';
import { EventManager } from '@angular/platform-browser';

@Component({
  selector: 'lotus-web-drawable-canvas',
  templateUrl: './drawable-canvas.component.html',
  styleUrls: ['./drawable-canvas.component.scss'],
  standalone: false,
})
export class DrawableCanvasComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  readonly height = input<number>(0);
  readonly safeTop = input('0px');
  @Output() requestExitDrawMode = new EventEmitter<void>();
  @Output() placementChange = new EventEmitter<Placement>();
  @Output() newPathInsert = new EventEmitter<{
    svgElement: SVGElement;
    size: number;
    canvasParentElement: HTMLElement;
  }>();
  @Output() click = new EventEmitter<TouchEvent | MouseEvent>();
  canvasWrap = viewChild<ElementRef<HTMLElement>>('canvas');
  colorSettingsOverlay = viewChild<OverlayPanel>('colorSettingsOverlay');
  readonly INITIAL_PEN_SIZE = 10;
  readonly INITIAL_PEN_HIGHLIGHTER = 20;
  readonly MARKER_COLOR = '#fff700';
  ctx!: SVGRenderingContext2D;
  ac?: string;
  bc?: string;
  canvasWidth!: number;
  canvasHeight!: number;
  currentColor: string = this.penColorByTheme();
  mouseMovement = false;
  isTouchScreen = 'ontouchstart' in window;
  size = this.INITIAL_PEN_SIZE;
  sizeTrap = 0;
  opacity = 100;
  drawMode: 'ERASER' | 'PEN' | 'SCROLL' = 'PEN';
  svgElement!: SVGSVGElement;
  removalMouseMove = false;
  drawStarted = false;
  touchType: any;
  anyMotion = false;
  undoRedoHelper = new UndoRedoHelper();
  placement!: Placement;
  targetTagname!: string;
  resizeObs?: ResizeObserver;

  constructor(
    private uConsole: UconsoleService,
    private themeMan: ThemeManager
  ) {}
  canvasReinitEvent = () => {
    this.reinit();
  };

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();

    // window.removeEventListener('resize', this.canvasReinitEvent);
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();

    window.addEventListener('resize', () =>
      this.setCanvasSizeAfterInitResize()
    );
  }

  ngOnInit(): void {
    this.setPlacement(
      (localStorage.getItem('drawing-bar-placement') as Placement) || 'bottom'
    );
  }

  // @HostListener('resize', ['$event'])
  // resize(e: Event) {
  //   this.reinit();
  // }

  reinit() {
    this.svgElement.remove();
    this.initializeCanvas();
  }

  initializeCanvas() {
    if (this.canvasWrap()!) {
      // this.ctx = this.canvas?.nativeElement.getContext('2d');
      this.calculateCanvasHeight();
      this.ctx = new C2S({
        width: this.canvasWidth,
        height: this.canvasHeight,
      }) as any;

      this.ctx.getSvg().addEventListener('', console.info);
      this.ctx!.lineJoin = 'round';
      this.ctx!.lineCap = 'round';
      this.svgElement = this.ctx.getSvg();
      this.svgElement.tabIndex = 0;

      // this.svgElement.addEventListener("resize", () => this.setCanvasSizeAfterInitResize())
      this.resizeObs = new ResizeObserver(() =>
        this.setCanvasSizeAfterInitResize()
      );
      this.resizeObs.observe(
        this.canvasWrap()!.nativeElement.parentElement
          ?.parentElement as HTMLElement
      );
      this.svgElement.addEventListener('mousedown', (e) => this.mouseStart(e));
      this.svgElement.addEventListener('mouseup', (e) => this.mouseUp(e));
      this.svgElement.addEventListener('mousemove', (e) => this.mouseMove(e));
      this.svgElement.addEventListener('touchstart', (e) => this.touchStart(e));
      this.svgElement.addEventListener('touchend', (e) => this.touchUp(e));
      // this.svgElement.addEventListener('touchmove', (e) =>
      //   this.touchMoveDraw(e)
      // );

      this.svgElement.addEventListener('touchmove', (e) =>
        this.touchMoveEraser(e)
      );
      this.canvasWrap()!.nativeElement.appendChild(this.svgElement);
    }
  }

  setPlacement(arg0: Placement) {
    this.placement = arg0;
    this.placementChange.emit(arg0);
    localStorage.setItem('drawing-bar-placement', this.placement);
  }

  svgElementMouseDown = (e: any) => {
    this.removalMouseMove = true;
  };
  svgElementMouseUp = (e: any) => {
    this.removalMouseMove = false;
  };

  keyDown($event: KeyboardEvent) {
    console.info($event);
    if ($event.ctrlKey) {
      if ($event.key.toLowerCase() == 'z') {
        this.undoRedoHelper.undo();
      } else if ($event.key.toLowerCase() == 'y') {
        this.undoRedoHelper.redo();
      }
    }
  }

  clearElementFunction = (e: any) => {
    if (this.drawMode == 'ERASER' && this.removalMouseMove) {
      this.clearSVGElement(e.target);
    }
  };

  sendExitRequest() {
    this.requestExitDrawMode.emit();
  }

  clear() {
    this.ctx?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.undoRedoHelper.reset();
  }

  setMarker() {
    this.drawMode = 'PEN';
    this.ctx!.lineCap = 'butt';
    this.size = this.INITIAL_PEN_SIZE;
    this.opacity = 75;
    this.currentColor = this.MARKER_COLOR;
  }

  setPen() {
    this.drawMode = 'PEN';
    this.ctx!.lineCap = 'round';
    this.size = this.INITIAL_PEN_SIZE;
    this.opacity = 100;
    this.currentColor = this.penColorByTheme();
  }

  private penColorByTheme(): string {
    return this.themeMan.theme == 'dark' ? '#ffffff' : '#000000';
  }

  setEraser() {
    this.drawMode = 'ERASER';
    this.ctx!.lineCap = 'round';
  }

  setCanvasSizeAfterInitResize() {
    this.calculateCanvasHeight();

    this.ctx.canvas.height = this.canvasHeight;
    this.ctx.canvas.width = this.canvasWidth;
  }

  calculateCanvasHeight() {
    const canvasPlacementProps =
      this.canvasWrap()!!.nativeElement.getBoundingClientRect();
    this.canvasWidth = innerWidth * 2;
    this.canvasHeight = Math.max(this.height() ?? 0, innerHeight) * 2;
    // this.canvasWidth = innerWidth * 2;
    // this.canvasHeight = innerHeight * 2;
  }

  mouseStart(e: MouseEvent) {
    this.colorSettingsOverlay()?.hide();
    this.anyMotion = false;
    this.uConsole.setValue('canvas draw', 'mouseStart');
    if (this.drawMode == 'PEN') {
      this.mouseMovement = true;

      e.preventDefault();
      const { x, y } = this.determineMouseDraw(e);
      this.ac = x + 'x' + y;

      this.drawStart(x, y);
    } else if (this.drawMode == 'ERASER') {
      this.mouseMovement = true;

      this.removeSvgThingFromIt(e);
    }
  }

  removeSvgThingFromIt(e: Event) {
    e.preventDefault();

    this.ctx.closePath();
    this.clearSVGElement(e.target as SVGGeometryElement);
  }

  clearSVGElement(target: SVGGeometryElement) {
    this.targetTagname = target.tagName;
    if (target.tagName == 'path') {
      this.undoForEraserInsert(target);
    }
  }

  mouseMove(e: MouseEvent) {
    if (this.ctx && this.mouseMovement) {
      this.anyMotion = true;
      this.uConsole.setValue('canvas draw', 'mouseMove with click');

      e.preventDefault();
      if (this.drawMode == 'PEN') {
        this.drawMove(e);
      } else if (this.drawMode == 'ERASER') {
        this.removeSvgThingFromIt(e);
      }
    }
  }

  touchStart(e: TouchEvent) {
    this.colorSettingsOverlay()?.hide();

    if (e.targetTouches.length == 1 && e.targetTouches[0].radiusX === 0) {
      this.touchType = e.touches[0].identifier;

      if (this.drawMode == 'PEN') {
        e.preventDefault();
        const { x, y } = this.determineTouch(e);
        this.ac = x + 'x' + y;
        this.drawStart(x, y);
      } else if (this.drawMode == 'ERASER') {
        this.clearSVGElement(e.currentTarget as SVGGeometryElement);
      }
    }
  }

  // touchMoveDraw(e: TouchEvent) {
  //   this.uConsole.setValue('canvas draw', 'touchMoveDraw');

  // }

  touchMoveEraser(e: TouchEvent) {
    this.uConsole.setValue('canvas draw', 'touchMoveEraser');

    if (this.drawMode == 'ERASER') {
      e.preventDefault();

      const paths = document
        .elementsFromPoint(e.touches[0].pageX, e.touches[0].pageY)
        .filter((a) => a.tagName == 'path');
      paths.forEach((a) => this.clearSVGElement(a as SVGGeometryElement));
    } else if (this.drawMode == 'PEN') {
      const condition = e.targetTouches.length == 1;
      // && e.targetTouches[0].radiusX === 0
      this.uConsole.setValue('pen condition', condition);

      this.uConsole.setValue('pen touch length', e.targetTouches.length);
      this.uConsole.setValue(
        'e.targetTouches[0].radiusX',
        e.targetTouches[0].radiusX
      );
      if (condition) {
        e.preventDefault();
        this.drawMove(e);
      }
    }
  }

  drawStart(x: any, y: any) {
    if (this.ctx && !this.drawStarted) {
      this.drawStarted = true;
      // this.ctx.fillRect(x, y, 1, 1);
      this.anyMotion = true;
      this.ctx.beginPath();

      this.ctx.fillStyle = this.getColorWithAlpha();
      this.ctx.moveTo(x, y);
    }
  }

  getColorWithAlpha(): string {
    const op = ((this.opacity / 100) * 255).toString(16).substring(0, 2);

    if (this.ctx) {
      this.ctx.globalAlpha = this.opacity / 100;
      this.ctx.globalCompositeOperation = 'lighter';
    }

    return this.currentColor + op;
  }

  mouseUp(e: MouseEvent) {
    this.mouseMovement = false;
    this.removalMouseMove = false;
    this.drawStarted = false;

    if (this.anyMotion == true) {
      this.touchStop();
    } else {
      this.click.emit(e);
    }

    this.anyMotion = false;
  }

  touchUp(e: TouchEvent) {
    this.mouseMovement = false;
    this.removalMouseMove = false;
    this.drawStarted = false;

    if (this.anyMotion == true) {
      this.touchStop();
    } else {
      this.click.emit(e);
    }
    this.anyMotion = false;
  }

  touchStop() {
    this.uConsole.setValue('canvas draw', 'mouseup / touchStop');

    if (this.ctx) {
      this.ctx.closePath();
      this.sizeTrap = 0;
    }
    const parent = this.ctx.getSvg().querySelector('g')!;
    const lastEl = parent.lastChild! as SVGElement;
    this.undoForPenInsert(lastEl);
    this.newPathInsert.emit({
      svgElement: lastEl,
      size: this.size,
      canvasParentElement: this.canvasWrap()!?.nativeElement!,
    });
  }

  private undoForPenInsert(lastEl: SVGElement) {
    const originalD = lastEl.getAttribute('d') || '';
    this.undoRedoHelper.pushOperationQueue(
      {
        apply: async () => {
          // parent.appendChild(lastEl!);
          lastEl.setAttribute('d', originalD);
        },
        revert: async () => {
          // lastEl?.remove();
          lastEl.setAttribute('d', '');
        },
      },
      true,
      false
    );
  }

  private undoForEraserInsert(target: SVGGeometryElement) {
    const parent = target.parentElement;
    const lastEl = target;
    const originalD = lastEl.getAttribute('d') || '';
    this.undoRedoHelper.pushOperationQueue(
      {
        apply: async () => {
          // parent.appendChild(lastEl!);
          lastEl.setAttribute('d', '');
        },
        revert: async () => {
          // lastEl?.remove();
          lastEl.setAttribute('d', originalD);
        },
      },
      true,
      true
    );
  }

  determineTouch(e: TouchEvent): { x: any; y: any } {
    const touch = e.targetTouches[0];

    const screenHeight = this.canvasWrap()!!.nativeElement.clientHeight,
      screenWidth = this.canvasWrap()!!.nativeElement.clientWidth;

    const rectx = this.canvasWrap()!?.nativeElement.getBoundingClientRect();
    const offsetX = touch.clientX - window.scrollX - rectx!.left;
    const offsetY = touch.clientY - window.scrollY - rectx!.top;
    this.bc = offsetX + ' ' + offsetY;
    // return {
    //   x: (offsetX * this.canvasWidth) / screenWidth,
    //   y: (offsetY * this.canvasHeight) / screenHeight,
    // };
    // console.debug(offsetX, offsetY);
    return {
      x: offsetX,
      y: offsetY,
    };
  }

  determineMouseDraw(e: MouseEvent): { x: any; y: any } {
    const screenHeight = this.canvasWrap()!!.nativeElement.clientHeight,
      screenWidth = this.canvasWrap()!!.nativeElement.clientWidth;

    const offsetX = e.offsetX;
    const offsetY = e.offsetY;
    this.bc = offsetX + ' ' + offsetY;

    return {
      x: offsetX,
      y: offsetY,
    };
  }

  private drawMove(e: TouchEvent | MouseEvent) {
    if (this.ctx) {
      const { x, y } =
        e instanceof MouseEvent
          ? this.determineMouseDraw(e)
          : this.determineTouch(e);

      const pressure = this.determinePressure(e);
      this.ac = x + 'x' + y;
      this.drawStart(x, y);
      this.ctx.lineTo(x, y);
      this.ctx.strokeStyle = this.getColorWithAlpha();

      this.ctx.lineWidth = pressure;
      this.ctx.stroke();
    }
  }
  determinePressure(e: TouchEvent | MouseEvent) {
    // const press = (e as TouchEvent).touches?.[0].force || 0;
    return this.size; // + this.size * press;
  }
}
