type CauseCodes = {
  key: number;
  label: string;
}[];

export const causeCodes: CauseCodes = [
  { key: 1, label: "Traffic" },
  { key: 2, label: "Accident" },
  { key: 3, label: "Roadwork" },
  { key: 6, label: "Adverse weather condition (slippery road)" },
  { key: 9, label: "Surface Condition" },
  { key: 10, label: "Obstacle On Road" },
  { key: 11, label: "Animal On Road" },
  { key: 12, label: "Human presence on the road" },
  { key: 14, label: "Wrong way driving" },
  { key: 15, label: "Rescue and recovery work" },
  { key: 17, label: "Extreme weather condition" },
  { key: 18, label: "Low visibility" },
  { key: 19, label: "Adverse weather condition -Precipitation" },
  { key: 26, label: "Slow vehicle" },
  { key: 27, label: "Dangerous end of queue" },
  { key: 91, label: "Vehicle breakdown" },
  { key: 92, label: "Post crash" },
  { key: 93, label: "Human problem" },
  { key: 94, label: "Stationary vehicle" },
  { key: 95, label: "Emergency vehicle approaching" },
  { key: 96, label: "Dangerous curve" },
  { key: 97, label: "Collision risk" },
  { key: 98, label: "Signal violation" },
  { key: 99, label: "Dangerous situation" },
];
