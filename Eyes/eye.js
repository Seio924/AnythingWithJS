import { Point } from "./point.js";

export class Eye {
  constructor(mousepos, eyeWidth) {
    this.pos = new Point(mousepos.x, mousepos.y);
    this.uppos = new Point(mousepos.x, mousepos.y - this.radius);
    this.downpos = new Point(mousepos.x, mousepos.y + this.radius);
    this.pulpilPos = this.pos.clone();

    this.interval = null;
    this.twinkleInterval = null;

    this.img = new Image();
    this.img.src = "eye.png";
    this.img.onload = () => {
      this.loaded();
    };
    this.imgDisappear = new Image();
    this.imgDisappear.src = "disappear.png";
    this.imgWidth = 336;
    this.imgHeight = 336;

    this.eyeWidth = eyeWidth;
    this.eyeHeight = eyeWidth;
    this.radius = eyeWidth / 2;

    this.isLoaded = false;
    this.totalFrame = 7;
    this.curFrame = this.totalFrame - 1;
    this.blink = false;
    this.isHolding = false;
    this.holdStartTime = 0;
    this.holdingTime = 500 + Math.random() * 3000;

    this.fps = 54;
    this.fpsTime = 1000 / this.fps;

    this.disappear = false;
    this.totalFrame2 = 3;
    this.curFrame2 = 0;
    this.delay = 0;
  }

  resize(stageWidth, stageHeight) {}

  animate(ctx) {
    ctx.save();
    ctx.beginPath();

    ctx.fillStyle = `#353238`;
    if (!this.disappear) {
      ctx.drawImage(
        this.img,
        this.imgWidth * this.curFrame,
        0,
        this.imgWidth,
        this.imgHeight,
        this.pos.x - this.radius,
        this.pos.y - this.radius,
        this.eyeWidth,
        this.eyeHeight
      );
      if (this.curFrame != this.totalFrame - 1) {
        console.log("pulpil");
        ctx.arc(
          this.pulpilPos.x,
          this.pulpilPos.y,
          this.radius / 10,
          0,
          Math.PI * 2
        );
      }
    } else {
      ctx.drawImage(
        this.imgDisappear,
        356 * this.curFrame2,
        0,
        356,
        356,
        this.pos.x - this.radius,
        this.pos.y - this.radius,
        this.eyeWidth,
        this.eyeHeight
      );
    }

    ctx.fill();
    ctx.restore();
  }

  draw(ctx, t) {
    if (!this.time) {
      this.time = t;
    }
    const now = t - this.time;
    if (now > this.fpsTime) {
      this.time = t;

      if (!this.disappear) {
        if (this.curFrame === this.totalFrame - 1) {
          this.blink = true;
        } else if (this.curFrame === 0) {
          if (!this.isHolding) {
            this.isHolding = true;
            this.holdStartTime = t;
          } else if (t - this.holdStartTime > this.holdingTime) {
            this.isHolding = false;
            this.blink = false;
            this.holdingTime = 500 + Math.random() * 3000;
          }
        }

        if (this.isHolding) {
          this.curFrame = 0;
        } else {
          if (this.blink) {
            this.curFrame -= 1;
          } else {
            this.curFrame += 1;
          }
        }
      } else {
        this.delay += 1;
        if (this.delay % 2 == 0) {
          this.curFrame2 += 1;
        }
      }
    }

    this.animate(ctx);
  }

  loaded() {
    this.isLoaded = true;
  }

  disappeared() {
    console.log("curframe2" + this.curFrame2);
    if (this.curFrame2 >= 2) {
      return true;
    }
  }

  down(mousepos) {
    if (this.pos.collapse(mousepos, this.radius)) {
      console.log("collapse");
      this.disappear = true;
      return true;
    } else {
      console.log("not collapse");
      return false;
    }
  }

  move(mousePos) {
    let moveX = (mousePos.x - this.pulpilPos.x) / 15;
    let moveY = (mousePos.y - this.pulpilPos.y) / 15;

    if (moveX > 15) {
      moveX = 15;
    } else if (moveX < -15) {
      moveX = -15;
    }

    if (moveY > 15) {
      moveY = 15;
    } else if (moveY < -15) {
      moveY = -15;
    }

    this.pulpilPos.x = this.pos.x + moveX;
    this.pulpilPos.y = this.pos.y + moveY;

    console.log("move");
  }
}
