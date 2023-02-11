export default class Direction {
  static Left = 1 << 0;
  static Right = 1 << 1;
  static Up = 1 << 2;
  static Down = 1 << 3;

  static LeftUp = this.Left | this.Up;
  static LeftDown = this.Left | this.Down;
  static RightUp = this.Right | this.Up;
  static RightDown = this.Right | this.Down;

  static fromString(value: string) {
    return (
      {
        left: Direction.Left,
        right: Direction.Right,
        up: Direction.Up,
        down: Direction.Down,

        "left-up": Direction.LeftUp,
        "left-down": Direction.LeftDown,
        "right-up": Direction.RightUp,
        "right-down": Direction.RightDown,
      }[value.toLowerCase()] || Direction.Left
    );
  }

  static hasLeft(direction: number) {
    return (direction & Direction.Left) > 0;
  }

  static hasRight(direction: number) {
    return (direction & Direction.Right) > 0;
  }

  static hasUp(direction: number) {
    return (direction & Direction.Up) > 0;
  }

  static hasDown(direction: number) {
    return (direction & Direction.Down) > 0;
  }

  static hasLeftOrRight(direction: number) {
    return Direction.hasLeft(direction) || Direction.hasRight(direction);
  }

  static hasUpOrDown(direction: number) {
    return Direction.hasUp(direction) || Direction.hasDown(direction);
  }

  static isDiagonal(direction: number) {
    return (
      Direction.hasLeftOrRight(direction) && Direction.hasUpOrDown(direction)
    );
  }
}
