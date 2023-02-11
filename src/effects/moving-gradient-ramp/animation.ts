import { SystemConstants } from "../../constants/SystemConstants";
import { SeamlessColorRamp, precise } from "../../utils/color-ramp/Seamless";
import Direction from "../../utils/Direction";
import { Rect } from "../../utils/Rect";

export class AnimatedColorRamp {
  private _shift = { x: 0, y: 0 };
  private _speed = 0;

  private _externalContext: CanvasRenderingContext2D;
  private _colorRamp: SeamlessColorRamp;

  constructor(options: {
    bounds: { width: number; height: number };
    context: CanvasRenderingContext2D;
  }) {
    this._externalContext = options.context;
    this._colorRamp = new SeamlessColorRamp({
      bounds: options.bounds,
      colors: [],
      direction: Direction.Left,
      scale: 1,
    });
  }

  tick(timeDeltaSeconds: number) {
    this._step(timeDeltaSeconds);
    this._draw();
  }

  private _step(timeDeltaSeconds: number) {
    const step = this._speed * timeDeltaSeconds;
    this.shift = {
      x: this.shift.x + step,
      y: this.shift.y + step,
    };
  }

  private get shift() {
    return this._shift;
  }

  private set shift(value) {
    const x = Direction.hasLeftOrRight(this._colorRamp.direction) ? value.x : 0;
    const y = Direction.hasUpOrDown(this._colorRamp.direction) ? value.y : 0;

    this._shift = {
      x: x % this._colorRamp.scaledWidth,
      y: y % this._colorRamp.scaledHeight,
    };
  }

  private _draw() {
    const position = this._getDrawStart();

    const canvasSize = {
      width: this._colorRamp.width,
      height: this._colorRamp.height,
    };

    const rampSize = {
      width: this._colorRamp.scaledWidth,
      height: this._colorRamp.scaledHeight,
    };

    for (let y = position.y; y < canvasSize.height; y += rampSize.height) {
      for (let x = position.x; x < canvasSize.width; x += rampSize.width) {
        let sourceRect = this._calculateSourceRect(x, y);
        let destinationRect = this._calculateDestinationRect(x, y);
        if (Rect.isEmpty(sourceRect) || Rect.isEmpty(destinationRect)) continue;

        this._colorRamp.draw({
          context: this._externalContext,
          sourceRect: sourceRect,
          destinationRect: destinationRect,
        });
      }
    }
  }

  private _calculateSourceRect(x: number, y: number) {
    const rampRect = new DOMRectReadOnly(
      0,
      0,
      this._colorRamp.scaledWidth,
      this._colorRamp.scaledHeight
    );
    const windowRect = new DOMRectReadOnly(
      -x,
      -y,
      this._colorRamp.width,
      this._colorRamp.height
    );
    const intersection = Rect.intersection(rampRect, windowRect);

    if (SystemConstants.contextHasGetImageDataFunction) return intersection;
    return rampRect;
  }

  private _calculateDestinationRect(x: number, y: number) {
    const windowRect = new DOMRectReadOnly(
      0,
      0,
      this._colorRamp.width,
      this._colorRamp.height
    );
    const rampRect = new DOMRectReadOnly(
      x,
      y,
      this._colorRamp.scaledWidth,
      this._colorRamp.scaledHeight
    );

    const intersection = Rect.intersection(windowRect, rampRect);

    if (SystemConstants.contextHasGetImageDataFunction) return intersection;
    return rampRect;
  }

  private _getDrawStart() {
    const start = { x: 0, y: 0 };

    switch (true) {
      case Direction.hasLeft(this._colorRamp.direction):
        start.x = -this.shift.x;
        break;
      case Direction.hasRight(this._colorRamp.direction):
        start.x = this.shift.x - this._colorRamp.scaledWidth;
        break;
    }

    switch (true) {
      case Direction.hasUp(this._colorRamp.direction):
        start.y = -this.shift.y;
        break;
      case Direction.hasDown(this._colorRamp.direction):
        start.y = this.shift.y - this._colorRamp.scaledHeight;
        break;
    }

    return start;
  }

  set colors(value: string[]) {
    this._colorRamp.colors = value;
  }

  set direction(value: string) {
    this._colorRamp.direction = Direction.fromString(value);
  }

  set scale(value: number) {
    value = Math.min(Math.max(value, 20), 500);
    this._colorRamp.scale = precise(value / 100);
  }

  set speed(value: number) {
    this._speed = Math.min(Math.max(value, 30), 300);
  }
}
