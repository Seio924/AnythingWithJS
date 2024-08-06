export class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  collapse(pos, radius) {
    if (
      pos.x >= this.x - radius &&
      pos.x <= this.x + radius &&
      pos.y >= this.y - radius &&
      pos.y <= this.y + radius
    ) {
      return true;
    } else {
      return false;
    }
  }

  clone() {
    return new Point(this.x, this.y);
  }
}
