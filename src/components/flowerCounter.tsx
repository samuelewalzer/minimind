import React, { useState, useEffect, CSSProperties } from "react";
import { useGlobalRerender } from "../globalRendererContext";

export default function flowerCounter() {
  const [completedTodayCount, setCompletedTodayCount] = useState(0);
  const { rerenderToken } = useGlobalRerender();

  useEffect(() => {
    // Fetch the initial count when the component mounts
    async function fetchCompletedCount() {
      const count = await window.api.getCompletedTodayCount();
      setCompletedTodayCount(count);
    }
    fetchCompletedCount();
  }, [rerenderToken]);

  const flowerImages = [
    require("../assets/flower_1.svg"),
    require("../assets/flower_2.svg"),
    require("../assets/flower_3.svg"),
    require("../assets/flower_4.svg"),
    require("../assets/flower_5.svg"),
    require("../assets/flower_6.svg"),
    require("../assets/flower_7.svg"),
    require("../assets/flower_8.svg"),
  ];

  const numberOfFlowers = completedTodayCount;
  const spacing = window.innerWidth / (numberOfFlowers + 1);

  const getRandomOffset = (maxOffset: number) => {
    // Generate a random value between -maxOffset and maxOffset
    return (Math.random() - 0.5) * 2 * maxOffset;
  };

  const getFlower = (index: number) => {
    const flowerNumber = Math.floor(Math.random() * 6) + 1;
    const leftPosition = spacing * (index + 1) + getRandomOffset(40); // Adding a random offset of up to ±40 pixels
    const imageUrl = flowerImages[flowerNumber - 1];
    // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
    const imageStyle: CSSProperties = {
      position: "fixed",
      bottom: "0px",
      left: `${leftPosition}px`,
      height: `${5 + Math.random() * 5}vh`,
    };
    return <img src={imageUrl} style={imageStyle} alt="Random Flower" />;
  };

  return (
    <div>
      <div>Number of tasks completed today: {completedTodayCount}</div>
      {Array.from({ length: numberOfFlowers }).map((_, index) => (
        <React.Fragment key={index}>{getFlower(index)}</React.Fragment>
      ))}
    </div>
  );
}
