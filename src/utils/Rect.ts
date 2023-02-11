export class Rect {
  static new(rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): RectType {
    return new DOMRectReadOnly(rect.x, rect.y, rect.width, rect.height);
  }

  static intersection(l: RectType, r: RectType): RectType {
    const left = Math.max(l.left, r.left);
    const right = Math.min(l.right, r.right);
    const top = Math.max(l.top, r.top);
    const bottom = Math.min(l.bottom, r.bottom);

    return Rect.new({
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    });
  }

  static isEmpty(r: RectType) {
    return r.width === 0 || r.height === 0;
  }
}

export type RectType = DOMRectReadOnly;
