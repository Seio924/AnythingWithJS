import { Point } from "./point";

//시침 분침 생각
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
