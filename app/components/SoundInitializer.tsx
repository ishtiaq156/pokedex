"use client";

import { useEffect } from "react";
import { soundManager } from "../utils/sound";

export default function SoundInitializer() {
  useEffect(() => {
    // Initialize background music when component mounts
    soundManager.initializeBackgroundMusic();

    // Start background music after a short delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      soundManager.startBackgroundMusic();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null; // This component doesn't render anything
}
