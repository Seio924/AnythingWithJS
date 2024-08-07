import { Point } from "./point.js";
import { Rec } from "./rec.js";

class App {
  constructor() {
    //canvas 생성
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    /** 마우스 위치 저장 */
    this.mousePos = new Point();

    /** 현재 선택된 항목 저장 */
    this.curItem = null;

    /** 생성된 사각형이 저장되는 배열 */
    this.items = [];

    /** 총 사각형 개수 */
    this.total = 5;

    for (let i = 0; i < this.total; i++) {
      this.items[i] = new Rec();
    }

    //창 크기가 조정될 때 마다 캔버스를 다시 드로잉
    window.addEventListener("resize", this.resize.bind(this), false);

    //애플리케이션이 처음 로드될 때 resize (초기화)
    this.resize();

    //다음 프레임을 그리기 전에 호출할 함수(animate()) 등록
    window.requestAnimationFrame(this.animate.bind(this));

    document.addEventListener("pointerdown", this.onDown.bind(this), false);
    document.addEventListener("pointermove", this.onMove.bind(this), false);
    document.addEventListener("pointerup", this.onUp.bind(this), false);
  }

  /**캔버스 크기를 브라우저 창의 크기에 맞게 조정 */
  resize() {
    //브라우저 창 너비, 높이
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    //캔버스 너비, 높이 조절 = 현재 창의 너비와 높이 * 픽셀 비율
    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;

    //캔버스의 그리기 컨텍스트를 픽셀 비율에 맞게 조정
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    //그림자 효과 설정
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 6;
    this.ctx.shadowColor = `rgba(0, 0, 0, 0.1)`;

    this.ctx.lineWidth = 2;

    //모든 사각형의 크기 조절
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].resize(this.stageWidth, this.stageHeight);
    }
  }

  /**캔버스를 지우고 다시 사각형 그리기 */
  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].animate(this.ctx);
    }

    if (this.curItem) {
      this.ctx.fillStyle = `#ff4338`;
      this.ctx.strokeStyle = `#ff4338`;

      //드로잉 상태 초기화 ( 그려진 도형, 경로 초기화 )
      this.ctx.beginPath();
      this.ctx.arc(this.mousePos.x, this.mousePos.y, 8, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(
        this.curItem.centerPos.x,
        this.curItem.centerPos.y,
        8,
        0,
        Math.PI * 2
      );
      this.ctx.fill();

      this.ctx.beginPath();

      //선의 시작점 지정
      this.ctx.moveTo(this.mousePos.x, this.mousePos.y);
      //선의 끝점 지정
      this.ctx.lineTo(this.curItem.centerPos.x, this.curItem.centerPos.y);
      this.ctx.stroke();
    }
  }

  /**마우스 눌렀을 때 실행 */
  onDown(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i].down(this.mousePos.clone());
      if (item) {
        this.curItem = item;
        const index = this.items.indexOf(item);
        this.items.push(this.items.splice(index, 1)[0]);
        break;
      }
    }
  }

  onMove(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].move(this.mousePos.clone());
    }
  }

  onUp(e) {
    this.curItem = null;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].up();
    }
  }
}

window.onload = () => {
  new App();
};
