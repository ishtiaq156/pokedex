"use client";

import { useEffect, useRef, useState } from "react";

const ScanningAnimation = () => {
  // Horizontal net animation (unchanged)
  const [horizontalPosition, setHorizontalPosition] = useState(0);
  const horizontalRef = useRef<number | undefined>(undefined);
  const horizontalSpeed = 0.3;

  // Scanning bar animation
  const [scanningPosition, setScanningPosition] = useState(100);
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [currentPatternStep, setCurrentPatternStep] = useState(0);
  const scanningRef = useRef<number | null>(null);

  useEffect(() => {
    let isActive = true;

    // Horizontal animation (unchanged)
    const updateHorizontalPosition = () => {
      if (!isActive) return;
      setHorizontalPosition((prev) => prev + horizontalSpeed);
      horizontalRef.current = requestAnimationFrame(updateHorizontalPosition);
    };
    horizontalRef.current = requestAnimationFrame(updateHorizontalPosition);

    // Scanning bar animation
    const updateScanningPosition = () => {
      if (!isActive || !isScanningActive) return;

      setScanningPosition((prev) => {
        // Move in current direction
        const newPosition = direction === "up" ? prev - 1 : prev + 1;

        // Check if reached boundary
        const reachedBoundary =
          direction === "up" ? newPosition <= 0 : newPosition >= 100;

        if (reachedBoundary) {
          setIsScanningActive(false);

          // Wait 2 seconds before next movement
          setTimeout(() => {
            setCurrentPatternStep((prevStep) => {
              const nextStep = (prevStep + 1) % 6;

              // Set direction for next step
              setDirection(nextStep === 2 || nextStep === 5 ? "down" : "up");

              // Reset position for next direction
              setScanningPosition(nextStep === 2 || nextStep === 5 ? 0 : 100);

              setIsScanningActive(true);
              return nextStep;
            });
          }, 2000);

          return direction === "up" ? 0 : 100;
        }

        return newPosition;
      });

      scanningRef.current = requestAnimationFrame(updateScanningPosition);
    };

    scanningRef.current = requestAnimationFrame(updateScanningPosition);

    return () => {
      isActive = false;
      if (horizontalRef.current) cancelAnimationFrame(horizontalRef.current);
      if (scanningRef.current) cancelAnimationFrame(scanningRef.current);
    };
  }, [isScanningActive, direction]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{
        height: "100%",
        zIndex: -1,
        background: "linear-gradient(to bottom, #90f0f0, #548cb4)",
      }}
    >
      {/* Horizontal net pattern animation */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: "url(/pokedex/net_pattern.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "400px 100vh",
          opacity: 0.15,
          backgroundPosition: `${horizontalPosition}px 0`,
        }}
      />

      {/* Main scanning bar */}
      <div
        className="absolute left-0 w-full"
        style={{
          height: "4px",
          top: `${scanningPosition}%`,
          background: "rgba(255, 255, 255, 0.4)",
          boxShadow: "0 0 12px 4px rgba(255, 255, 255, 0.3)",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
};

export default ScanningAnimation;
