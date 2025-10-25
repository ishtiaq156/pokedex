"use client";

import React from "react";
import { useApp } from "../contexts/AppContext";

export default function LoadingScreen() {
  const { state } = useApp();
  const pageStripeBackground =
    "linear-gradient(135deg, " +
    "#baf0f0 0 7.69%, " +
    "#b8eef0 7.69% 15.38%, " +
    "#b6eef0 15.38% 23.08%, " +
    "#b4ebf0 23.08% 30.77%, " +
    "#b1ebf0 30.77% 38.46%, " +
    "#b0ebf0 38.46% 46.15%, " +
    "#b0e9f0 46.15% 53.85%, " +
    "#aee9f0 53.85% 61.54%, " +
    "#ace9f0 61.54% 69.23%, " +
    "#aae7f0 69.23% 76.92%, " +
    "#a8e7f0 76.92% 84.62%, " +
    "#a6e7f0 84.62% 92.31%, " +
    "#a6e6f0 92.31% 100%)";

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: pageStripeBackground,
      }}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-[#0b8fbc] mb-2">POKÉDEX</h1>
        <p className="text-lg text-[#0b8fbc]">Loading Pokémon data...</p>

        {/* Progress Bar */}
        <div className="w-64 mx-auto mt-4 mb-2">
          <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-[#0b8fbc] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${state.loadingProgress}%` }}
            />
          </div>
          <div className="text-sm text-[#0b8fbc] mt-1">
            {state.loadingProgress}%
          </div>
        </div>

        <div className="mt-4 text-sm text-[#0b8fbc] opacity-75">
          This may take a moment on first load
        </div>
      </div>
    </div>
  );
}
