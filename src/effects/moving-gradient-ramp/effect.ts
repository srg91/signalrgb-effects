import { AnimatedColorRamp } from "./animation";

function renderTick(timestamp: number) {
  const timeDeltaMilliseconds = timestamp - (lastTimestamp || timestamp);
  lastTimestamp = timestamp;

  const colors = [
    color1,
    color2,
    color3,
    color4,
    color5,
    color6,
    color7,
    color8,
  ].slice(0, Math.min(Math.max(colorsCount, 2), 8));
  animation.colors = colors;

  animation.speed = speed;
  animation.scale = scale;
  animation.direction = direction;

  const timeDeltaSeconds = timeDeltaMilliseconds / 1000;
  animation.tick(timeDeltaSeconds);

  window.requestAnimationFrame(renderTick);
}

declare const [
  color1,
  color2,
  color3,
  color4,
  color5,
  color6,
  color7,
  color8,
]: string;
declare const colorsCount: number;
declare const speed: number;
declare const scale: number;
declare const direction: string;

const canvas = document.getElementById("exCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const animation = new AnimatedColorRamp({
  bounds: {
    width: canvas.width,
    height: canvas.height,
  },
  context: context,
});

var lastTimestamp: number;

if (canvas && context) window.requestAnimationFrame(renderTick);
