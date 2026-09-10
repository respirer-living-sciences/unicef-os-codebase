import React from "react";
import ControllerComponent from "./components/ControllerComponent";

export default function CalendarHeatmap({ username, dropDownParamsList }) {
  return (
    <div>
      <ControllerComponent
        username={username}
        dropDownParamsList={dropDownParamsList}
      />
    </div>
  );
}
