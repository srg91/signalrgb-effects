import { Colord, colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";

extend([mixPlugin]);

export class LinearColorRamp {
  protected _rampLine;
  protected _colorStops: {
    offset: number;
    color: Colord;
  }[] = [];

  protected _canvas: HTMLCanvasElement;
  protected _context: CanvasRenderingContext2D;

  protected _require = {
    redraw: true,
    resize: true,
    sort: false,
  };

  _n: string;

  constructor(
    line: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    },
    n?: string
  ) {
    this._rampLine = Object.assign({}, line);

    this._canvas = document.createElement("canvas");
    this._context = this._canvas.getContext("2d") as CanvasRenderingContext2D;

    this._n = n || "linear";
  }

  addColorStop(stop: { offset: number; color: string }): boolean {
    if (stop.offset < 0 || stop.offset > 1) return false;

    this._colorStops.push({
      offset: stop.offset,
      color: colord(stop.color),
    });

    this._require.sort = true;
    return true;
  }

  draw(options: { context: CanvasRenderingContext2D; rect: DOMRectReadOnly }) {
    this._redrawAndResizeInnerCanvas();
    this._draw(options);
  }

  protected _redrawAndResizeInnerCanvas() {
    this._require.sort && this._sortColorStops();
    this._require.resize && this._resizeCanvas();
    this._require.redraw && this._redrawCanvas();
  }

  protected _resizeCanvas() {
    this._require.resize = false;

    this._canvas.width = this._length;
    this._canvas.height = 1;

    this._require.redraw = true;
  }

  protected get _length(): number {
    return this._lineLength(this._rampLine);
  }

  protected _lineLength(line: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  }) {
    const dx = line.x1 - line.x0;
    const dy = line.y1 - line.y0;
    const length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    return Math.round(length);
  }

  protected _redrawCanvas() {
    this._require.redraw = false;

    for (let i = 0; i < this._colorStops.length; i++) {
      this._drawColorStop(this._colorStops[i], i);
    }
  }

  protected _drawColorStop(
    colorStop: { offset: number; color: Colord },
    index: number
  ) {
    if (index === 0 && colorStop.offset > 0) {
      this._drawRamp({
        left: { offset: 0, color: colorStop.color },
        right: colorStop,
      });
    }

    const nextColorStop = this._colorStops[index + 1] || colorStop;

    this._drawRamp({
      left: colorStop,
      right: nextColorStop,
    });
  }

  protected _drawRamp(options: {
    left: { offset: number; color: Colord };
    right: { offset: number; color: Colord };
  }) {
    const size = this._canvas.width;

    const start = Math.round(options.left.offset * size);
    const end = Math.round(options.right.offset * size);

    for (let x = start; x < end; x++) {
      const ratio = (x - start) / (end - start);
      const color = this._mixColors({
        colors: {
          left: options.left.color,
          right: options.right.color,
        },
        ratio: ratio,
      });

      this._drawLine({
        line: { x0: x, y0: 0, x1: x, y1: size },
        color: color.toRgbString(),
      });
    }
  }

  protected _mixColors({
    colors,
    ratio,
  }: {
    colors: { left: Colord; right: Colord };
    ratio: number;
  }): Colord {
    ratio = this._easeInOutSine(ratio);
    return colors.left.mix(colors.right, ratio);
  }

  // https://easings.net/
  protected _easeInOutSine(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }

  protected _drawLine({
    line,
    color,
  }: {
    line: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
    color: string;
  }) {
    this._context.lineWidth = 2;
    this._context.strokeStyle = color;

    this._context.beginPath();
    this._context.moveTo(line.x0, line.y0);
    this._context.lineTo(line.x1, line.y1);
    this._context.stroke();
  }

  protected _sortColorStops() {
    this._require.sort = false;
    this._colorStops.sort((l, r) => l.offset - r.offset);
  }

  protected _draw(options: {
    context: CanvasRenderingContext2D;
    rect: DOMRectReadOnly;
  }) {
    const [context, rect] = [options.context, options.rect];

    const d = this._lineLength({
      x0: rect.left,
      y0: rect.top,
      x1: rect.right,
      y1: rect.bottom,
    });

    options.context.translate(this._rampLine.x0, this._rampLine.y0);
    options.context.rotate(this._angle);

    options.context.translate(0, -d / 2);
    options.context.scale(1, d);

    context.drawImage(
      this._canvas,
      0,
      0,
      this._canvas.width,
      this._canvas.height
    );
    context.setTransform(1, 0, 0, 1, 0, 0);
  }

  protected get _angle() {
    const l = this._rampLine;

    // https://math.stackexchange.com/a/879474
    const dx = l.x1 - l.x0;
    const dy = l.y1 - l.y0;
    return Math.atan2(dy, dx);
  }
}
