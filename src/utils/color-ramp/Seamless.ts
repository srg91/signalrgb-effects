import { LinearColorRamp } from "./Linear";
import Direction from "../Direction";
import { Rect } from "../Rect";

export const PRECISION = 1000;

export function precise(value: number) {
  return Math.floor(value * PRECISION) / PRECISION;
}

export class SeamlessColorRamp {
  protected readonly _canvas: HTMLCanvasElement;
  protected readonly _context: CanvasRenderingContext2D;

  protected _width = 0;
  protected _height = 0;

  protected _colors: readonly string[] = [];
  protected _colorsCache = "";

  protected _direction = Direction.Left;
  protected _scale = 1;

  protected _require = {
    redraw: true,
    resize: true,
  };

  constructor(options: {
    bounds: { width: number; height: number };
    colors: string[];
    direction: number;
    scale: number;
  }) {
    this._canvas = document.createElement("canvas");
    this._context = this._canvas.getContext("2d") as CanvasRenderingContext2D;
    this.resize(options.bounds);

    this.colors = options.colors;
    this.direction = options.direction;
    this.scale = options.scale;
  }

  resize(bounds: { width: number; height: number }) {
    this.width = bounds.width;
    this.height = bounds.height;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    if (this.width === value) return;

    this._width = value;
    this._require = { redraw: true, resize: true };
  }

  get height() {
    return this._height;
  }

  set height(value) {
    if (this.height === value) return;

    this._height = value;
    this._require = { redraw: true, resize: true };
  }

  get colors() {
    return this._colors;
  }

  set colors(value) {
    let cache = value.join("");
    if (this._colorsCache === cache) return;

    this._colors = [...value];
    this._colorsCache = cache;

    this._require.redraw = true;
  }

  get direction() {
    return this._direction;
  }

  set direction(value) {
    if (this.direction === value) return;

    this._direction = value;
    this._require = { redraw: true, resize: true };
  }

  get scale() {
    return this._scale;
  }

  set scale(value) {
    value = precise(value);
    if (this.scale === value) return;

    this._scale = Math.max(value, 1 / PRECISION);
    this._require = { resize: true, redraw: true };
  }

  draw(options: {
    context: CanvasRenderingContext2D;
    sourceRect: DOMRectReadOnly;
    destinationRect: DOMRectReadOnly;
  }) {
    this._require.resize && this._resizeCanvas();
    this._require.redraw && this._redrawCanvas();

    const [context, sourceRect, destinationRect] = [
      options.context,
      options.sourceRect,
      options.destinationRect,
    ];

    context.drawImage(
      this._canvas,
      sourceRect.x,
      sourceRect.y,
      sourceRect.width,
      sourceRect.height,
      destinationRect.x,
      destinationRect.y,
      destinationRect.width,
      destinationRect.height
    );
  }

  protected _resizeCanvas() {
    this._require.resize = false;

    const width = precise(this.width * this._xScale);
    let height = precise(this.height * this._yScale);

    const shouldBeSquare = Direction.isDiagonal(this.direction);
    if (shouldBeSquare) height = width;

    if (width === this._canvas.width && height === this._canvas.height) return;

    this._canvas.width = width;
    this._canvas.height = height;

    this._require.redraw = true;
  }

  get scaledWidth() {
    this._require.resize && this._resizeCanvas();
    return this._canvas.width;
  }

  protected get _xScale() {
    if (Direction.hasLeftOrRight(this.direction)) return this._scale;
    return 1;
  }

  get scaledHeight() {
    this._require.resize && this._resizeCanvas();
    return this._canvas.height;
  }

  protected get _yScale() {
    if (Direction.hasUpOrDown(this.direction)) return this._scale;
    return 1;
  }

  protected _redrawCanvas() {
    this._require.redraw = false;

    const colorsCount = this.colors.length;
    if (colorsCount === 0) return;

    const coordinates = this._formatGradientCoordinates();
    const gradient = new LinearColorRamp(coordinates);

    // If we have diagonal ramp - we should draw colors twice.
    const shouldBeSeamless = Direction.isDiagonal(this.direction);
    const drawColorCount = shouldBeSeamless ? colorsCount * 2 : colorsCount;

    const step = 1 / drawColorCount;
    for (let i = 0; i < drawColorCount; i++) {
      gradient.addColorStop({
        offset: precise(i * step),
        color: this._colors[i % colorsCount],
      });
    }
    gradient.addColorStop({
      offset: 1,
      color: this._colors[0],
    });

    gradient.draw({
      context: this._context,
      rect: Rect.new({
        x: 0,
        y: 0,
        width: this._canvas.width,
        height: this._canvas.height,
      }),
    });
  }

  protected _formatGradientCoordinates() {
    // const coordinates = { x0: 0, y0: 0, x1: 0, y1: 0 };
    let [scaledWidth, scaledHeight] = [this.scaledWidth, this.scaledHeight];

    const coordinates = {
      x0: scaledWidth / 2,
      y0: scaledHeight / 2,
      x1: scaledWidth / 2,
      y1: scaledHeight / 2,
    };

    switch (true) {
      case Direction.hasLeft(this.direction):
        coordinates.x0 = 0;
        coordinates.x1 = scaledWidth;
        break;
      case Direction.hasRight(this.direction):
        coordinates.x0 = scaledWidth;
        coordinates.x1 = 0;
        break;
    }

    switch (true) {
      case Direction.hasUp(this.direction):
        coordinates.y0 = 0;
        coordinates.y1 = scaledHeight;
        break;
      case Direction.hasDown(this.direction):
        coordinates.y0 = scaledHeight;
        coordinates.y1 = 0;
        break;
    }

    return coordinates;
  }
}
