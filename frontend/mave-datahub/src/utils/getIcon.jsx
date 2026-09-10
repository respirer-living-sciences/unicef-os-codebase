import React from "react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { faBatteryFull } from "@fortawesome/free-solid-svg-icons";
import { faBatteryThreeQuarters } from "@fortawesome/free-solid-svg-icons";
import { faBatteryHalf } from "@fortawesome/free-solid-svg-icons";
import { faBatteryQuarter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function getIcon(property, value) {
  const getBatteryLevelIcon = (value) => {
    const levelRanges = [
      {
        range: [0, 30],
        batteryIcon: (
          <FontAwesomeIcon
            icon={faBatteryQuarter}
            rotation={270}
            style={{ color: "#E02E2E" }}
          />
        ),
      },
      {
        range: [30.01, 65],
        batteryIcon: (
          <FontAwesomeIcon
            icon={faBatteryHalf}
            rotation={270}
            style={{ color: "#F6C324" }}
          />
        ),
      },
      {
        range: [65.01, 98],
        batteryIcon: (
          <FontAwesomeIcon
            icon={faBatteryThreeQuarters}
            rotation={270}
            style={{ color: "#60e04d" }}
          />
        ),
      },
      {
        range: [98.01, 100],
        batteryIcon: (
          <FontAwesomeIcon
            icon={faBatteryFull}
            rotation={270}
            style={{ color: "#60e04d" }}
          />
        ),
      },
    ];

    for (const range of levelRanges) {
      const [min, max] = range.range;
      if (value >= min && value <= max) {
        return range.batteryIcon;
      }
    }
  };

  if (property === "status" && value) {
    if (value === "ONLINE") {
      return <FontAwesomeIcon icon={faCircle} style={{ color: "#60e04d" }} />;
    } else {
      return <FontAwesomeIcon icon={faCircle} style={{ color: "#E02E2E" }} />;
    }
  } else if (property === "battery" && value) {
    return getBatteryLevelIcon(value);
  } else {
    return null;
  }
}
