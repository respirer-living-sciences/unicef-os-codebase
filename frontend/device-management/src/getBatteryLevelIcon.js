import batteryFullImg from "./images/battery-levels/icons8-battery-48-full.png";
import batteryAlmostFullImg from "./images/battery-levels/icons8-battery-48-almost-full.png";
import batteryHalfImg from "./images/battery-levels/icons8-battery-level-48-half.png";
import batteryNearlyEmptyImg from "./images/battery-levels/icons8-nearly-empty-battery-48.png";

const getBatteryLevelIcon = (value) => {
  const levelRanges = [
    { range: [0, 25], batteryIcon: batteryNearlyEmptyImg },
    { range: [25.01, 75], batteryIcon: batteryHalfImg },
    { range: [75.01, 98], batteryIcon: batteryAlmostFullImg },
    { range: [98.01, 100], batteryIcon: batteryFullImg },
  ];

  for (const range of levelRanges) {
    const [min, max] = range.range;
    if (value >= min && value <= max) {
      return range.batteryIcon;
    }
  }
};

export default getBatteryLevelIcon;
