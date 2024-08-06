import { Point } from "./point.js";
import { Eye } from "./eye.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.mousepos = new Point();

    this.item = [];
    this.totalSticky = 0;

    this.createSound = new Audio("create_sound.mp3");
    this.disappearSound = new Audio("disappear_sound.mp3");

    window.addEventListener("resize", this.resize.bind(this), false);

    this.resize();

    window.requestAnimationFrame(this.animate.bind(this));

    document.addEventListener("pointerdown", this.onDown.bind(this), false);
    document.addEventListener("pointermove", this.onMove.bind(this), false);
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;

    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    // this.ctx.shadowOffsetX = 0;
    // this.ctx.shadowOffsetY = 3;
    // this.ctx.shadowBlur = 6;
    // this.ctx.shadowColor = `rgba(0, 0, 0, 0.1)`;

    console.log("resize");

    for (let i = 0; i < this.totalSticky; i++) {
      this.item[i].resize(this.stageWidth, this.stageHeight);
    }
  }

  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));

    //console.log(this.item.length);
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    for (let i = 0; i < this.totalSticky; i++) {
      this.item[i].draw(this.ctx, t);

      if (this.item[i].disappeared()) {
        this.playSound(this.disappearSound);
        console.log("dis");
        this.item.splice(i, 1);
        this.totalSticky -= 1;
      }
    }
  }

  onDown(e) {
    let isSelect = false;
    let isCollapse = false;

    this.mousepos.x = e.clientX;
    this.mousepos.y = e.clientY;

    const curMousepos = this.mousepos.clone();

    for (let i = this.totalSticky - 1; i >= 0; i--) {
      const selectItem = this.item[i].down(curMousepos);
      if (selectItem) {
        isSelect = true;
        console.log(this.item.length);
        break;
      }
    }
    if (!isSelect) {
      let eyeWidth = 0;
      let distance = this.stageWidth;
      let radius = 0;

      for (let i = 0; i < this.totalSticky; i++) {
        const temp = this.distance(this.item[i].pos, curMousepos);
        distance = Math.min(temp, distance);
        if (distance == temp) {
          radius = this.item[i].radius;
        }
      }
      if (distance - radius < 100) {
        isCollapse = true;
      } else {
        if (this.totalSticky == 0) {
          eyeWidth = 100 + Math.random() * 68;
        } else {
          const limit = distance - radius > 168 ? 168 : distance - radius;
          eyeWidth = 100 + Math.random() * (limit - 100);
        }
      }

      if (!isCollapse) {
        this.playSound(this.createSound);
        this.totalSticky += 1;
        this.item.push(new Eye(curMousepos, eyeWidth));
        console.log("create");
      } else {
        console.log("collapse2");
      }
    }
  }

  distance(pos1, pos2) {
    const re = Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
    );
    return re;
  }

  playSound(sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }

  onMove(e) {
    this.mousepos.x = e.clientX;
    this.mousepos.y = e.clientY;

    for (let i = 0; i < this.totalSticky; i++) {
      this.item[i].move(this.mousepos.clone());
    }
  }
}

window.onload = () => {
  new App();
};
