"use client";

import { useEffect } from "react";
import { soundManager } from "../utils/sound";

export default function SoundInitializer() {
  useEffect(() => {
    // Initialize background music when component mounts
    soundManager.initializeBackgroundMusic();

    // Try to start background music immediately (will be queued if no user interaction)
    soundManager.startBackgroundMusic();

    // Add global event listeners for user interaction
    const handleUserInteraction = () => {
      soundManager.markUserInteraction();
      // Remove listeners after first interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    // Listen for various user interactions
    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });
    document.addEventListener("keydown", handleUserInteraction, { once: true });

    return () => {
      // Cleanup listeners
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  return null; // This component doesn't render anything
}
