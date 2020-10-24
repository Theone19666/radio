<template>
  <v-flex>
    <canvas id="figure" :width="width" :height="height" ref="figure"></canvas>
    <div class="about">
      Красным отмечены радиоприёмники, чёрными-точки, в которых был замечен
      радиопередачтик
    </div>
  </v-flex>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Point } from "../../interfaces";
@Component
export default class Figure extends Vue {
  width = 500;
  height = 500;

  displayMessage = false;

  canvas: CanvasRenderingContext2D | null = null;

  data = "";

  $eventBus!: Vue;

  drawPoint(x: string | number, y: string | number, pointColor = "black") {
    if (isNaN(x) || isNaN(y) || !this.canvas) return;
    const numberX = Number(x);
    const numberY = Number(y);
    this.canvas.beginPath();
    this.canvas.moveTo(numberX, numberY);
    this.canvas.arc(numberX, numberY, 3, 0, Math.PI * 2, false);
    this.canvas.closePath();
    this.canvas.strokeStyle = pointColor;
    this.canvas.fillStyle = pointColor;
    this.canvas.fill();
    this.canvas.stroke();
  }

  addRadioPoints(pointsList: string[]) {
    pointsList.forEach((item: string, index: number) => {
      if (index % 2 !== 0) {
        const x = Number(pointsList[index - 1]) * 20 + 30;
        const y = 460 - Number(item) * 20;
        this.drawPoint(x, y, "red");
      }
    });
  }

  getIntersectionPoint(
    firstPoint: Point,
    secondPoint: Point,
    thirdPoint: Point,
    firstRadius = 0,
    secondRadius = 0
    //  thirdRadius = 0
  ) {
    let dx = Number(secondPoint.x) - Number(firstPoint.x);
    let dy = Number(secondPoint.y) - Number(firstPoint.y);
    const d = Math.sqrt(dy * dy + dx * dx);
    const a =
      (firstRadius * firstRadius - secondRadius * secondRadius + d * d) /
      (2.0 * d);
    const point2X = Number(firstPoint.x) + (dx * a) / d;
    const point2Y = Number(firstPoint.x) + (dy * a) / d;
    const h = Math.sqrt(firstRadius * firstRadius - a * a);
    const rx = -dy * (h / d);
    const ry = dx * (h / d);
    const intersectionPoint1X = point2X + rx;
    const intersectionpoint2X = point2X - rx;
    const intersectionPoint1Y = point2Y + ry;
    const intersectionpoint2Y = point2Y - ry;
    dx = intersectionPoint1X - Number(thirdPoint.x);
    dy = intersectionPoint1Y - Number(thirdPoint.y);
    const d1 = Math.sqrt(dy * dy + dx * dx);

    dx = intersectionpoint2X - Number(thirdPoint.x);
    dy = intersectionpoint2Y - Number(thirdPoint.y);
    const d2 = Math.sqrt(dy * dy + dx * dx);

    if (d1 <= d2) {
      return { x: intersectionPoint1X, y: intersectionPoint1Y };
    } else {
      return { x: intersectionpoint2X, y: intersectionpoint2Y };
    }
  }

  addTransmitterPoints(
    pointsDistances: string[] = [],
    radioPointsList: string[]
  ) {
    const firstPoint = {
      x: Number(radioPointsList[0]),
      y: Number(radioPointsList[1])
    };
    const secondPoint = {
      x: Number(radioPointsList[2]),
      y: Number(radioPointsList[3])
    };
    const thirdPoint = {
      x: Number(radioPointsList[4]),
      y: Number(radioPointsList[5])
    };
    const intersectionPoints: Point[] = [];
    pointsDistances.forEach((item: string, index: number) => {
      const pointsDistancesList = item.split(",");
      const intersectionPoint = this.getIntersectionPoint(
        firstPoint,
        secondPoint,
        thirdPoint,
        Number(pointsDistancesList[0]),
        Number(pointsDistancesList[1])
        //  Number(pointsDistancesList[2])
      );
      intersectionPoints.push(intersectionPoint);
      const x = Number(intersectionPoint.x) * 20 + 30;
      const y = 460 - Number(intersectionPoint.y) * 20;
      if (index > 0 && this.canvas) {
        this.canvas.beginPath();
        const previousPoint = intersectionPoints[index - 1];
        const previousX = Number(previousPoint.x) * 20 + 30;
        const previousY = 460 - Number(previousPoint.y) * 20;
        console.log(previousPoint);
        this.canvas.moveTo(previousX, previousY);
        this.canvas.lineTo(x, y);
        this.canvas.strokeStyle = "black";
        this.canvas.stroke();
      }
      this.drawPoint(x, y);
    });
    this.$eventBus.$emit("get-points", intersectionPoints);
  }

  addPoints() {
    if (!this.data.trim()) {
      this.$eventBus.$emit(
        "show-error-message",
        "Пожалуйста, выберите файл с корректными данными"
      );
      return;
    }
    const pointsAndDistances = this.data.split("\n");
    const threePointsCoordinates = pointsAndDistances[0];
    const distances = pointsAndDistances.slice(1);
    const pointsList = threePointsCoordinates.split(",");
    this.addRadioPoints(pointsList);
    this.addTransmitterPoints(distances, pointsList);
  }

  created() {
    this.$eventBus.$on("data-received", (data: string) => {
      this.data = data;
    });
    this.$eventBus.$on("draw-points", () => {
      this.addPoints();
    });
  }

  beforeDestroy() {
    this.$eventBus.$off("data-received");
    this.$eventBus.$off("draw-points");
  }

  drawAxes() {
    // рисуем осевые линии
    if (!this.canvas) return;
    this.canvas.fillStyle = "black";
    this.canvas.lineWidth = 2.0;
    this.canvas.beginPath();
    this.canvas.moveTo(30, 10);
    this.canvas.lineTo(30, 460);
    this.canvas.lineTo(490, 460);
    this.canvas.stroke();
    // рисуем текст и вертикальные линии
    this.canvas.fillStyle = "black";
    for (let i = 0; i < 6; i++) {
      // this.canvas.fillText((5 - i) * 20 + "", 4, i * 80 + 60);
      this.canvas.fillText((5 - i) * 4 + "", 4, i * 80 + 60);
      this.canvas.beginPath();
      this.canvas.moveTo(25, i * 80 + 60);
      this.canvas.lineTo(30, i * 80 + 60);
      this.canvas.stroke();
    }
    // рисуме горизонтальные линии
    for (let i = 0; i < 6; i++) {
      // this.canvas.fillText(i * 20 + "", i * 80 + 25, 475);
      this.canvas.fillText(i * 4 + "", i * 80 + 25, 475);
      this.canvas.beginPath();
      this.canvas.moveTo(i * 80 + 30, 460);
      this.canvas.lineTo(i * 80 + 30, 450);
      this.canvas.stroke();
    }
    this.canvas.closePath();
  }

  mounted() {
    const canvas = this.$refs.figure;
    this.canvas = canvas?.getContext("2d");
    this.drawAxes();
  }
}
</script>
<style lang="scss" scoped>
.about {
  max-width: 500px;
}
</style>
