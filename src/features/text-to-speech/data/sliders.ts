interface Slider {
  id: "exaggeration" | "temperature" | "cfgWeight";
  label: string;
  leftLabel: string;
  rightLabel: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

// These three are Chatterbox's actual generate() knobs (see lesson 0006).
export const sliders: Slider[] = [
  {
    id: "exaggeration",
    label: "Expressiveness",
    leftLabel: "Flat",
    rightLabel: "Dramatic",
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.5,
  },
  {
    id: "temperature",
    label: "Creativity",
    leftLabel: "Consistent",
    rightLabel: "Varied",
    min: 0.05,
    max: 1,
    step: 0.05,
    defaultValue: 0.8,
  },
  {
    id: "cfgWeight",
    label: "Guidance",
    leftLabel: "Loose",
    rightLabel: "Tight",
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.5,
  },
];
