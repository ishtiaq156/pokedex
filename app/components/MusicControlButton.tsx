"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { soundManager } from "../utils/sound";

export default function MusicControlButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const prevIsPlayingRef = useRef(false);

  useEffect(() => {
    // Set up interval to check music state
    const interval = setInterval(() => {
      const currentState = soundManager.isBackgroundMusicActive();
      if (currentState !== prevIsPlayingRef.current) {
        setIsPlaying(currentState);
        prevIsPlayingRef.current = currentState;
      }
    }, 100); // Check every 100ms for responsive updates

    // Set initial state after a microtask to avoid synchronous setState
    const setInitialState = () => {
      const initialState = soundManager.isBackgroundMusicActive();
      setIsPlaying(initialState);
      prevIsPlayingRef.current = initialState;
    };

    // Use setTimeout to defer the initial state setting
    const timeoutId = setTimeout(setInitialState, 0);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleClick = () => {
    soundManager.markUserInteraction();
    soundManager.toggleBackgroundMusic();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110 active:scale-95"
      aria-label={
        isPlaying ? "Stop background music" : "Start background music"
      }
    >
      <div className="w-6 h-6 relative">
        {isPlaying ? (
          <Image
            src="/music.gif"
            alt="Music playing"
            width={24}
            height={24}
            className="object-contain"
          />
        ) : (
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#0b8fbc]"
            >
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
