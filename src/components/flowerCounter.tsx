/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import React, { useState, useEffect, CSSProperties } from "react";
import { useGlobalRerender } from "../globalRendererContext";

export default function FlowerCounter() {
  const { rerenderToken } = useGlobalRerender();
  const [completedTodayCount, setCompletedTodayCount] = useState(0);
  const [flowerStyles, setFlowerStyles] = useState<CSSProperties[]>([]);

  useEffect(() => {
    // Fetch the initial count when the component mounts
    async function fetchCompletedCount() {
      const count = await window.api.getCompletedTodayCount();
      setCompletedTodayCount(count);
    }
    fetchCompletedCount();
  }, [rerenderToken]);

  useEffect(() => {
    const newFlowerCount = completedTodayCount - flowerStyles.length;
    if (newFlowerCount > 0) {
      const newStyles = Array.from({ length: newFlowerCount }).map(getRandomFlowerStyle);
      setFlowerStyles(prevStyles => [...prevStyles, ...newStyles]);
    } else if (newFlowerCount < 0) {
      // Remove flower styles if count has decreased
      setFlowerStyles(prevStyles => prevStyles.slice(0, completedTodayCount));
    }
  }, [completedTodayCount]);

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

  // Function to generate random flower style
  const getRandomFlowerStyle = (): CSSProperties => {
    return {
      height: `${5 + Math.random() * 5}rem`,
      bottom: `${0.5 + Math.random() * 3}rem`,
      left: `${15 + Math.random() * 65}%`,
      position: "absolute",
    };
  };

  return (
    <>
      <div className="flowerContainer">
        {completedTodayCount === 0 && <h3 className="no-flowers">get started!</h3>}
        {flowerStyles.map((style, index) => (
          <img
          key={index}
          src={flowerImages[index % flowerImages.length]}
          alt={`flower-${index}`}
          style={style}
          />
          ))}
      </div>
    </>
  );
}
