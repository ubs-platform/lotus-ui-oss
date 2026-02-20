import {
  AfterViewInit,
  Component,
  ElementRef,
  computed,
  effect,
  OnDestroy,
  OnInit,
  output,
  viewChild,
  signal,
  input,
  model,
} from '@angular/core';
import { UconsoleService } from '@lotus/front-global/debug-tools';
import C2S, { SVGRenderingContext2D } from '@mithrandirii/canvas2svg';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ThemeManager } from '@lotus/front-global/theme-management';
import { UndoRedoHelper } from '@lotus/front-global/undo-redo-helper';
import { Placement } from '../placement';
import { EventManager } from '@angular/platform-browser';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { set } from 'mongoose';

@Component({
  selector: 'lotus-web-drawable-canvas',
  templateUrl: './drawable-canvas.component.html',
  styleUrls: ['./drawable-canvas.component.scss'],
  standalone: false,
})
export class DrawableCanvasComponent
  implements OnInit, AfterViewInit, OnDestroy {
  readonly height = input<number>(0);
  readonly safeTop = input('0px');
  readonly requestExitDrawMode = output<void>();
  readonly placementChange = output<Placement>();
  readonly newPathInsert = output<{
    svgElements: SVGElement[];
    size: number;
    canvasParentElement: HTMLElement;
    coordinates: { x: number; y: number; width: number; height: number };
  }>();
  readonly pathRemoval = output<{
    svgElements: SVGElement[];
    size: number;
    canvasParentElement: HTMLElement;
  }>();
  readonly click = output<TouchEvent | MouseEvent>();
  readonly canvasWrap = viewChild<ElementRef<HTMLElement>>('canvas');
  readonly colorSettingsOverlay = viewChild<OverlayPanel>(
    'colorSettingsOverlay'
  );
  readonly overlaySettingsOverlay = viewChild<OverlayPanel>(
    'overlaySettingsOverlay'
  );
  readonly colorPickerInput =
    viewChild<ElementRef<HTMLInputElement>>('colorPickerInput');
  readonly INITIAL_PEN_SIZE = 10;
  readonly INITIAL_PEN_HIGHLIGHTER = 20;
  readonly MARKER_COLOR = '#fff700';

  // Signals
  currentColor = model<string>('#000000');
  size = model<number>(this.INITIAL_PEN_SIZE);
  opacity = model<number>(100);
  drawMode = signal<'ERASER' | 'PEN' | 'SCROLL'>('PEN');
  isPenOnly = model<boolean>(localStorage.getItem('pen-only-mode') === 'true');
  placement = signal<Placement>('bottom');
  multiTouch = signal<boolean>(false);
  // son 3 renk, default olarak siyah (dark tema ise beyaz), mavi, kırmızı ve sarı gelecek
  recentColors = signal<string[]>([
    this.penColorByTheme(),
    '#0000FF',
    '#FF0000',
    '#FFFF00',
  ]);
  // Non-reactive properties
  ctx!: SVGRenderingContext2D;
  ac?: string;
  bc?: string;
  canvasWidth!: number;
  canvasHeight!: number;
  // mouseMovement = false;
  isTouchScreen = 'ontouchstart' in window;
  svgElement!: SVGSVGElement;
  drawStarted = false;
  anyMotion = false;
  undoRedoHelper = new UndoRedoHelper();
  resizeObs?: ResizeObserver;
  private resizeListener?: () => void;
  mouseIsDown = signal<boolean>(false);

  // Computed
  cursorStyle = computed(() =>
    this.drawMode() === 'ERASER' ? 'not-allowed' : 'crosshair'
  );
  isPenWithMarker = computed(
    () => this.drawMode() === 'PEN' && this.currentColor() === this.MARKER_COLOR
  );
  isPenWithoutMarker = computed(
    () => this.drawMode() === 'PEN' && this.currentColor() !== this.MARKER_COLOR
  );
  touchType = 0;
  targetTagname = '';
  penPressureBefor = 0;
  positionBefore?: { x: number; y: number };
  colorChangeTimeout: any;

  constructor(
    private uConsole: UconsoleService,
    private themeMan: ThemeManager,
    private basicOverlay: BasicOverlayService
  ) {
    // Initialize currentColor based on theme
    this.currentColor.set(this.penColorByTheme());
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.resizeListener = () => this.setCanvasSizeAfterInitResize();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnInit(): void {
    const savedPlacement =
      (localStorage.getItem('drawing-bar-placement') as Placement) || 'bottom';
    this.placement.set(savedPlacement);
  }

  insertRecentColor(color: string) {
    if (this.recentColors().includes(color)) {
      return;
    }
    this.recentColors.update((colors) => {
      colors.unshift(color);
      return colors.slice(0, 5);
    });
  }

  setColorDirectly(color: string) {  
    if (this.drawMode() !== "ERASER" && this.currentColor() === color) {
      this.openColorPicker();
      return;
    }
    this.currentColor.set(color);
    if (this.drawMode() === "ERASER") {
      this.setPenRaw();
    }
  }

  setColor($event: Event) {
    const input = $event.target as HTMLInputElement;
    this.currentColor.set(input.value);
    if (this.drawMode() === "ERASER") {
      this.setPenRaw();
    }
    // this.insertRecentColor(input.value);
  }

  reinit() {
    this.svgElement.remove();
    this.initializeCanvas();
  }

  initializeCanvas() {
    const canvasWrapRef = this.canvasWrap()!;
    if (!canvasWrapRef) {
      return;
    }

    this.calculateCanvasHeight();
    this.ctx = new C2S({
      width: this.canvasWidth,
      height: this.canvasHeight,
    }) as any;

    this.ctx.lineJoin = 'bevel';
    this.ctx.lineCap = 'round';
    this.svgElement = this.ctx.getSvg();
    this.svgElement.tabIndex = 0;

    this.resizeObs = new ResizeObserver(() =>
      this.setCanvasSizeAfterInitResize()
    );
    const parentEl = canvasWrapRef.nativeElement.parentElement?.parentElement;
    if (parentEl) {
      this.resizeObs.observe(parentEl);
    }

    // PointerEvent API kullanarak kalem desteği ekle (modern cihazlar için)
    if ('onpointerdown' in window) {
      this.svgElement.addEventListener('pointerdown', (e) =>
        this.pointerStart(e as PointerEvent)
      );
      this.svgElement.addEventListener('pointerup', (e) =>
        this.pointerUp(e as PointerEvent)
      );
      this.svgElement.addEventListener('pointermove', (e) =>
        this.pointerMove(e as PointerEvent)
      );
    }
    // else {
    // Zaten eski tarayıcılar muhakkak bir şekilde güncellenecektir, bu yüzden sadece mouse eventleri şimdilik bıraktım
    // this.svgElement.addEventListener('mousedown', (e) => this.mouseIsDown.set(true));
    // this.svgElement.addEventListener('mouseup', (e) => this.mouseIsDown.set(false));
    // this.svgElement.addEventListener('mousemove', (e) => this.mouseMove(e));
    // }

    this.svgElement.addEventListener('touchstart', (e) => {
      this.multiTouch.set(e.touches.length > 1);
      if (this.drawStarted || !this.isPenOnly()) {
        e.preventDefault();
      }
    });
    this.svgElement.addEventListener('touchend', (e) => {
      this.multiTouch.set(e.touches.length > 1);
      if (this.drawStarted || !this.isPenOnly()) {
        e.preventDefault();
      }
    });
    this.svgElement.addEventListener('touchmove', (e) => {
      this.multiTouch.set(e.touches.length > 1);
      if (this.drawStarted || !this.isPenOnly()) {
        e.preventDefault();
      }
    });

    canvasWrapRef.nativeElement.appendChild(this.svgElement);
  }

  setPlacement(newPlacement: Placement) {
    this.placement.set(newPlacement);
    this.placementChange.emit(newPlacement);
    localStorage.setItem('drawing-bar-placement', newPlacement);
    this.overlaySettingsOverlay()?.hide();
  }

  svgElementMouseDown = (e: MouseEvent) => {
    // Handler reserved for future use
  };
  svgElementMouseUp = (e: MouseEvent) => {
    // Handler reserved for future use
  };

  keyDown($event: KeyboardEvent) {
    if ($event.ctrlKey) {
      if ($event.key.toLowerCase() === 'z') {
        this.undoRedoHelper.undo();
      } else if ($event.key.toLowerCase() === 'y') {
        this.undoRedoHelper.redo();
      }
    }
  }

  // clearElementFunction = (e: MouseEvent) => {
  //   if (this.drawMode() === 'ERASER' && this.drawStarted) {
  //     this.clearSVGElement(e.target as SVGGeometryElement);
  //   }
  // };

  sendExitRequest() {
    this.requestExitDrawMode.emit();
  }

  clear() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    this.undoRedoHelper.reset();
  }

  setMarker() {
    this.drawMode.set('PEN');
    this.ctx!.lineCap = 'butt';
    this.size.set(this.INITIAL_PEN_SIZE);
    this.opacity.set(75);
    this.currentColor.set(this.MARKER_COLOR);
  }

  setPenRaw() {
    this.drawMode.set('PEN');
    this.ctx!.lineCap = 'round';
  }

  setPen() {
    this.setPenRaw()
    this.size.set(this.INITIAL_PEN_SIZE);
    this.opacity.set(100);
    this.currentColor.set(this.penColorByTheme());
  }

  private penColorByTheme(): string {
    return this.themeMan.theme == 'dark' ? '#ffffff' : '#000000';
  }

  setEraser() {
    this.drawMode.set('ERASER');
    this.ctx!.lineCap = 'round';
  }

  setScroll() {
    this.drawMode.set('SCROLL');
  }

  setCanvasSizeAfterInitResize() {
    this.calculateCanvasHeight();
    if (this.ctx && this.ctx.canvas) {
      this.ctx.canvas.height = this.canvasHeight;
      this.ctx.canvas.width = this.canvasWidth;
    }
  }

  calculateCanvasHeight() {
    this.canvasWrap()!.nativeElement.getBoundingClientRect();
    this.canvasWidth = window.innerWidth * 2;
    this.canvasHeight = Math.max(this.height() ?? 0, window.innerHeight) * 2;
  }

  removeSvgThingFromIt(event: PointerEvent, x: number, y: number) {
    event.preventDefault();
    this.ctx?.closePath();
    // const groupId = ((e.target as SVGElement).getAttribute('pathGroupId'));
    const svgElementsUnderPoint = document
      .elementsFromPoint(x, y)
      .find(
        (el) =>
          el instanceof SVGElement && el.getAttribute('pathGroupId') != null
      ) as SVGElement | undefined;
    const groupId = svgElementsUnderPoint?.getAttribute('pathGroupId');
    const parent = svgElementsUnderPoint?.parentElement;
    if (!parent) {
      return;
    }
    const elements = parent.querySelectorAll(`[pathGroupId="${groupId}"]`);

    if (elements.length > 0) {
      let elementsArray: SVGElement[] = [];
      elements.forEach((el) => {
        elementsArray.push(el as SVGElement);
      });
      this.undoForEraserInsert(elementsArray);
    }
  }

  // clearSVGElement(target: SVGGeometryElement) {
  //   this.targetTagname = target.tagName;
  //   if (target.tagName === 'path') {
  //     this.undoForEraserInsert(target);
  //   }
  // }

  drawStart(x: any, y: any) {
    if (this.ctx && !this.drawStarted) {
      this.drawStarted = true;
      // this.ctx.fillRect(x, y, 1, 1);
      this.anyMotion = true;
      this.ctx.beginPath();

      this.ctx.fillStyle = this.getColorWithAlpha();
      this.ctx.moveTo(x, y);
      this.insertRecentColor(this.currentColor());
    }
  }

  getColorWithAlpha(): string {
    const op = ((this.opacity() / 100) * 255).toString(16).padStart(2, '0');

    if (this.ctx) {
      this.ctx.globalAlpha = this.opacity() / 100;
      this.ctx.globalCompositeOperation = 'lighter';
    }

    return this.currentColor();
  }

  touchStop() {
    this.uConsole.setValue('canvas draw', 'mouseup / touchStop');
    this.positionBefore = undefined;
    if (this.ctx) {
      this.ctx.closePath();
    }
    // Yeni eklenen path elementini al ve undo için gerekli bilgileri hazırla. Yeni eklenenleri ayırmak için attribute içine bir prop ekleyeceğiz. Yeni eklenenlerde bu prop olacak.

    const parent = this.ctx?.getSvg().querySelector('g');
    if (!parent) {
      return;
    }
    const elements: SVGElement[] = [];
    const pathGroupId = new Date().toISOString();
    for (let index = 0; index < parent.children.length; index++) {
      const element = parent.children[index];
      if (
        element instanceof SVGElement &&
        element.tagName == 'path' &&
        element.getAttribute('pathGroupId') == null
      ) {
        element.setAttribute('pathGroupId', pathGroupId);
        elements.push(element as SVGElement);
      }
    }
    const elementsCoordinates = this.calculateSvgPathSizeAndPosition(elements as SVGPathElement[]);
    // Çizilen pathler tek bir grup altında toplanacak. Silme işlemi de bu grup üzerinden yapılacak. Böylece çoklu çizim desteği sağlanmış olacak.
    if (elements.length > 0) {
      this.undoForPenInsert(elements);
      this.newPathInsert.emit({
        // şimdilik son eklenen elementi alıyoruz. Çoklu çizim desteği için bunu array olarak göndermek gerekebilir.
        svgElements: elements,
        size: this.size(),
        canvasParentElement: this.canvasWrap()!.nativeElement,
        coordinates: elementsCoordinates
      });
    }
  }

  private undoForPenInsert(elements: SVGElement[]) {
    const originalD = elements.map((el) => el.getAttribute('d') || '');
    this.undoRedoHelper.pushOperationQueue(
      {
        apply: async () => {
          elements.forEach((el, index) =>
            el.setAttribute('d', originalD[index])
          );
        },
        revert: async () => {
          elements.forEach((el) => el.setAttribute('d', ''));
        },
      },
      true,
      false
    );
  }

  private undoForEraserInsert(elements: SVGElement[]) {
    const originalD = elements.map((el) => el.getAttribute('d') || '');
    this.undoRedoHelper.pushOperationQueue(
      {
        apply: async () => {
          elements.forEach((el) => el.setAttribute('d', ''));
          this.pathRemoval.emit({
            svgElements: elements,
            size: this.size(),
            canvasParentElement: this.canvasWrap()!.nativeElement,
          });
        },
        revert: async () => {
          elements.forEach((el, index) =>
            el.setAttribute('d', originalD[index])
          );
        },
      },
      true,
      true
    );
  }

  determineTouch(e: TouchEvent): { x: number; y: number } {
    const touch = e.targetTouches[0];
    const rectx = this.canvasWrap()!.nativeElement.getBoundingClientRect();
    const offsetX = touch.clientX - window.scrollX - rectx.left;
    const offsetY = touch.clientY - window.scrollY - rectx.top;
    this.bc = offsetX + ' ' + offsetY;

    return {
      x: offsetX,
      y: offsetY,
    };
  }

  determineMouseDraw(e: MouseEvent): { x: number; y: number } {
    const rectx = this.canvasWrap()!.nativeElement.getBoundingClientRect();
    const offsetX = e.clientX - window.scrollX - rectx.left;
    const offsetY = e.clientY - window.scrollY - rectx.top;
    this.bc = offsetX + ' ' + offsetY;
    this.basicOverlay.alert(
      this.bc ? `Coordinates: ${this.bc}` : 'Could not determine coordinates',
      '',
      'neutral'
    );
    return {
      x: offsetX,
      y: offsetY,
    };
  }

  // PointerEvents için yeni metodlar - Samsung S Pen desteği
  pointerStart(e: PointerEvent) {
    this.colorSettingsOverlay()?.hide();
    this.anyMotion = false;
    this.uConsole.setValue(
      'canvas draw',
      `pointerStart - Type: ${e.pointerType}`
    );
    // Sadece kalem modunda sadece pen tipine izin ver
    if (this.isPenOnly() && e.pointerType !== 'pen') {
      return;
    }

    if (this.drawMode() === 'PEN') {
      e.preventDefault();

      const { x, y } = this.determinePointer(e);
      this.ac = x + 'x' + y;
      this.drawStart(x, y);
    } else if (this.drawMode() === 'ERASER') {
      this.drawStarted = true;
      this.removeSvgThingFromIt(e, e.clientX, e.clientY);
    }
  }

  pointerMove(e: PointerEvent) {
    if (
      !this.drawStarted ||
      (this.isPenOnly() && e.pointerType !== 'pen') ||
      !this.ctx
    ) {
      return;
    }

    this.anyMotion = true;
    this.uConsole.setValue(
      'canvas draw',
      `pointerMove - Type: ${e.pointerType}`
    );
    e.preventDefault();

    if (this.drawMode() === 'PEN') {
      this.drawMovePointer(e);
      return;
    }
    if (this.drawMode() === 'ERASER') {
      this.removeSvgThingFromIt(e, e.clientX, e.clientY);
      return;
    }
  }

  pointerUp(e: PointerEvent) {
    this.drawStarted = false;

    if (this.anyMotion) {
      this.touchStop();
    } else {
      this.click.emit(e as any);
    }
    this.anyMotion = false;
  }

  determinePointer(e: PointerEvent): { x: number; y: number } {
    const rectx = this.canvasWrap()!.nativeElement.getBoundingClientRect();
    const offsetX = e.clientX - window.scrollX - rectx.left;
    const offsetY = e.clientY - window.scrollY - rectx.top;
    this.bc = offsetX + ' ' + offsetY;

    return {
      x: offsetX,
      y: offsetY,
    };
  }

  private drawMovePointer(e: PointerEvent) {
    if (this.ctx && this.drawStarted) {
      const { x, y } = this.determinePointer(e);
      const pressure = Math.max(
        e.pressure > 0 ? this.size() * e.pressure : this.size(),
        this.size() / 5
      );

      this.ac = x + 'x' + y;
      this.ctx.lineWidth = pressure;
      // Basınç değişimini algıla ve yeni bir path başlat. Bu nedenle pathler kesikli kesikli görünmeyecek, tek bir path olarak görünecek. Ayrıca bu sayede undo işlemi de tek bir path üzerinden yapılabilecek.
      if (
        this.penPressureBefor &&
        this.positionBefore &&
        Math.abs(pressure - this.penPressureBefor) != 0
      ) {
        this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.moveTo(this.positionBefore.x, this.positionBefore.y);
      }
      this.ctx.lineWidth = pressure;
      this.ctx.lineTo(x, y);
      this.ctx.strokeStyle = this.getColorWithAlpha();
      this.ctx.stroke();
      this.penPressureBefor = pressure;
      this.positionBefore = { x, y };
    }
  }

  togglePenOnlyMode() {
    this.setPenOnlyMode(!this.isPenOnly());
  }

  setPenOnlyMode(value: boolean) {
    this.isPenOnly.set(value);
    localStorage.setItem('pen-only-mode', this.isPenOnly() ? 'true' : 'false');
    console.info('Pen-Only Mode:', this.isPenOnly() ? 'ENABLED' : 'DISABLED');
  }

  openColorPicker() {
    this.colorPickerInput()?.nativeElement.click();
  }

  toggleColorSettings(event: Event) {
    this.colorSettingsOverlay()?.toggle(event);
  }

  toggleOverlaySettings(event: Event) {
    this.overlaySettingsOverlay()?.toggle(event);
  }

  calculateSvgPathSizeAndPosition(path: SVGPathElement[]): { x: number; y: number; width: number; height: number } {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    path.forEach((p, index) => {

      const rect = p.getBoundingClientRect();
      minX = Math.min(minX, rect.left);
      minY = Math.min(minY, rect.top);
      maxX = Math.max(maxX, rect.right);
      maxY = Math.max(maxY, rect.bottom);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
}
