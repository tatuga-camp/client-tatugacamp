import React from "react";
import { useSpring, animated } from "react-spring";
function NumberAnimated({ n }: { n: number }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: {
      mass: 1,
      tension: 20,
      friction: 10,
    },
  });
  const formattedNumber = number.to((n: number) =>
    Number(n.toFixed(0)).toLocaleString()
  );

  return <animated.div>{formattedNumber}</animated.div>;
}

export default NumberAnimated;
