"use client";

import { useEffect, useRef, useState } from "react";

const ScanningAnimation = () => {
  const [horizontalPosition, setHorizontalPosition] = useState(0);
  const horizontalRef = useRef<number | undefined>(undefined);
  const horizontalSpeed = 0.3; // Much slower horizontal animation

  useEffect(() => {
    let isActive = true;

    // Start horizontal animation immediately
    const updateHorizontalPosition = () => {
      if (!isActive) return;

      setHorizontalPosition((prevPosition) => prevPosition + horizontalSpeed);

      horizontalRef.current = requestAnimationFrame(updateHorizontalPosition);
    };

    horizontalRef.current = requestAnimationFrame(updateHorizontalPosition);

    return () => {
      isActive = false;
      if (horizontalRef.current) {
        cancelAnimationFrame(horizontalRef.current);
      }
    };
  }, [horizontalSpeed]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{
        height: "100%",
        zIndex: -1, // Behind all content
        background: "linear-gradient(to bottom, #90f0f0, #548cb4)",
      }}
    >
      {/* Horizontal net pattern animation (continuous right-to-left) */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: "url(/pokedex/net_pattern.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "400px 100vh", // Keep horizontal pattern size reasonable while covering full height
          opacity: 0.15, // Subtle opacity for background effect
          backgroundPosition: `${horizontalPosition}px 0`,
        }}
      />
    </div>
  );
};

export default ScanningAnimation;
