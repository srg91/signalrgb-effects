import { EffectConfiguration } from "../../utils/build/EffectConfiguration";

export default new EffectConfiguration({
  title: "Moving Gradient Ramp",
  properties: [
    { publisher: "https://github.com/srg91" },
    {
      description:
        "Animated moving gradient ramp, you can change direction, speed, scale and up to eight colors.",
    },

    {
      property: "direction",
      label: "Ramp Direction",
      type: "combobox",
      values: "Left,Right,Up,Down,Left-Up,Left-Down,Right-Up,Right-Down",
      default: "Left",
    },

    {
      property: "speed",
      label: "Ramp Speed (%)",
      type: "number",
      min: "30",
      max: "300",
      default: "100",
    },

    {
      property: "scale",
      label: "Ramp Scale (%)",
      type: "number",
      min: "20",
      max: "500",
      default: "100",
    },

    {
      property: "colorsCount",
      label: "Number of colors",
      type: "number",
      min: "2",
      max: "8",
      default: "8",
    },

    {
      property: "color1",
      label: "Color #1",
      type: "color",
      min: "0",
      max: "360",
      default: "#ff0000",
    },

    {
      property: "color2",
      label: "Color #2",
      type: "color",
      min: "0",
      max: "360",
      default: "#ff7500",
    },

    {
      property: "color3",
      label: "Color #3",
      type: "color",
      min: "0",
      max: "360",
      default: "#ffff00",
    },

    {
      property: "color4",
      label: "Color #4",
      type: "color",
      min: "0",
      max: "360",
      default: "#00ff00",
    },

    {
      property: "color5",
      label: "Color #5",
      type: "color",
      min: "0",
      max: "360",
      default: "#00ffff",
    },

    {
      property: "color6",
      label: "Color #6",
      type: "color",
      min: "0",
      max: "360",
      default: "#0000ff",
    },

    {
      property: "color7",
      label: "Color #7",
      type: "color",
      min: "0",
      max: "360",
      default: "#7500ff",
    },

    {
      property: "color8",
      label: "Color #8",
      type: "color",
      min: "0",
      max: "360",
      default: "#ff00ff",
    },
  ],
});
