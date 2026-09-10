// "use client";
import React, { Fragment, useEffect, useState } from "react";
import { Skeleton, useTheme } from "@mui/material";

const PollutantCard = ({
  text,
  isSelected,
  onClick,
}) => {
  const theme = useTheme();

  const cardStyle = {
    display: "flex",
    flexWrap: "nowrap",
    gap: "0.5rem",
    cursor: "pointer",
    justifyContent: "center",
    textAlign: "center",
    width: "auto",
    height: "100%",
    padding: "8px 20px",
    backgroundColor: isSelected
      ? theme.palette.primary.main
      : "transparent",
    boxShadow: isSelected ? "0px 2px 4px rgba(0, 0, 0, 0.1)" : "none",
    borderRadius: "100px",
    alignItems: "center",
    transition: "all 0.3s ease",
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      <div>
        <h2
          style={{
            fontSize: "14px",
            fontWeight: "500",
            margin: 0,
            color: isSelected ? theme.palette.common.white : theme.palette.text.primary,
          }}
        >
          {text.split(" ")[0]} {text.split(" ")[1]}
        </h2>
      </div>
    </div>
  );
};

const ValueCardsGrid = ({
  initialSelectedMetric,
  interval,
  dailyAveragesList,
  handleSelectGraphicMetric,
  isLoading,
}) => {
  const theme = useTheme();
  const pollutant = "PM2.5 (µg/m³)";
  const [selectedText, setSelectedText] = useState(initialSelectedMetric);

  const handlePollutantCardClick = (text) => {
    handleSelectGraphicMetric(text);
    setSelectedText(text);
  };

  useEffect(() => {
    handleSelectGraphicMetric(initialSelectedMetric);
    setSelectedText(initialSelectedMetric);
  }, [dailyAveragesList, interval]);

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "4px",
        }}
      />
      <div
        style={{
          backgroundColor: theme.palette.action.hover,
          padding: "4px",
          borderRadius: "100px",
          display: "flex",
          width: "max-content",
          maxWidth: "100%",
          overflowX: "auto",
          gap: "0px",
        }}
      >
        {!isLoading
          ? dailyAveragesList.map(({ text }) => (
            <PollutantCard
              key={text}
              onClick={() => handlePollutantCardClick(text)}
              text={text}
              isSelected={selectedText === text}
            />
          ))
          : [1, 2, 3, 4, 5, 6].map((_, idx) => (
            <Skeleton
              key={idx}
              variant="rounded"
              width={180}
              height={96}
              style={{ borderRadius: "8px" }}
            />
          ))}
      </div>
    </Fragment>
  );
};

export default ValueCardsGrid;
