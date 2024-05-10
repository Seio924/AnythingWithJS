import { Point } from "./point.js";

const FOLLOW_SPEED = 0.1;
const ROTATE_SPEED = 0.12;
const MAX_ANGLE = 30;
const FPS = 1000 / 60;
const WIDTH = 260;
const HEIGHT = 260;

export class Rec {
  constructor() {
    this.pos = new Point();
    this.target = new Point();
    this.prevPos = new Point();
    this.downPos = new Point();
    this.startPos = new Point();
    this.mousePos = new Point();
    this.centerPos = new Point();
    this.origin = new Point();
    this.rotation = 0;
    this.sideValue = 0;
    this.isDown = false;
  }

  resize(stageWidth, stageHeight) {
    this.pos.x = Math.random() * (stageWidth - WIDTH);
    this.pos.y = Math.random() * (stageHeight - HEIGHT);
    this.target = this.pos.clone();
    this.prevPos = this.pos.clone();
  }

  /** 도형 지우고 다시 도형 그리기 */
  animate(ctx) {
    const move = this.target.clone().subtract(this.pos).reduce(FOLLOW_SPEED);
    this.pos.add(move);

    this.centerPos = this.pos.clone().add(this.mousePos);

    // //드로잉 상태 초기화 ( 그려진 도형, 경로 초기화 )
    // ctx.beginPath();

    // //도형 색상 설정
    // ctx.fillStyle = `#f4e55a`;

    // //지정된 위치와 크기로 사각형 그리기
    // ctx.fillRect(this.pos.x, this.pos.y, WIDTH, HEIGHT);

    this.swingDrag(ctx);

    this.prevPos = this.pos.clone();
  }

  swingDrag(ctx) {
    const dx = this.pos.x - this.prevPos.x;
    const speedX = Math.abs(dx) / FPS;
    const speed = Math.min(Math.max(speedX, 0), 1);

    let rotation = (MAX_ANGLE / 1) * speed;
    rotation = rotation * (dx > 0 ? 1 : -1) - this.sideValue;

    this.rotation += (rotation - this.rotation) * ROTATE_SPEED;

    const tmpPos = this.pos.clone().add(this.origin);
    ctx.save();
    ctx.translate(tmpPos.x, tmpPos.y);
    ctx.rotate((this.rotation * Math.PI) / 100);
    ctx.beginPath();
    ctx.fillStyle = `#f4e55a`;
    ctx.fillRect(-this.origin.x, -this.origin.y, WIDTH, HEIGHT);
    ctx.restore();
  }

  down(point) {
    if (point.collide(this.pos, WIDTH, HEIGHT)) {
      this.isDown = true;
      this.startPos = this.pos.clone();
      this.downPos = point.clone();
      this.mousePos = point.clone().subtract(this.pos);

      const xRatioValue = this.mousePos.x / WIDTH;
      this.origin.x = WIDTH * xRatioValue;
      this.origin.y = (HEIGHT * this.mousePos.y) / HEIGHT;

      this.sideValue = xRatioValue - 0.5;
      return this;
    } else {
      return null;
    }
  }

  move(point) {
    if (this.isDown) {
      this.target = this.startPos.clone().add(point).subtract(this.downPos);
    }
  }

  up() {
    this.isDown = false;
  }
}
