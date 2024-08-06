import { Point } from "./point";

export class Clock {
  constructor() {
    this.pos = new Point();
  }

  resize(stageWidth, stageHeight) {
    this.pos.x = stageWidth / 2;
    this.pos.y = stageHeight / 2;
  }

  animate() {}
}
