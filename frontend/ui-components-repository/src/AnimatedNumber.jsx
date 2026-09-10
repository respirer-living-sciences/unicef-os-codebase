import React from "react";
import { useSpring, animated } from "@react-spring/web";

import { useEffect, useRef } from "react";

const AnimatedNumber = ({ number, precision = 1 }) => {
  const previous = useRef(number);

  const { val } = useSpring({
    from: { val: previous.current },
    to: { val: number },
    config: { tension: 60, friction: 20 },
    onRest: () => {
      previous.current = number;
    },
  });

  return (
    <animated.span>{val.to((v) => Number(v).toFixed(precision))}</animated.span>
  );
};

export default AnimatedNumber;
