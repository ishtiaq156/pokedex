"use client";

import React from "react";
import { useApp } from "../contexts/AppContext";
import HomeView from "./views/HomeView";
import RegionView from "./views/RegionView";
import PokemonDetailView from "./views/PokemonDetailView";
import LoadingScreen from "./LoadingScreen";

export default function App() {
  const { state } = useApp();

  if (state.loading) {
    return <LoadingScreen />;
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Smooth transition container */}
      <div className="relative w-full min-h-screen">
        {/* Home View */}
        {state.currentView === "home" && (
          <div className="absolute inset-0">
            <HomeView />
          </div>
        )}

        {/* Region View */}
        {state.currentView === "region" && state.currentRegion && (
          <div className="absolute inset-0">
            <RegionView region={state.currentRegion} />
          </div>
        )}

        {/* Pokemon Detail View */}
        {state.currentView === "pokemon" && state.currentPokemon && (
          <div className="absolute inset-0">
            <PokemonDetailView pokemon={state.currentPokemon} />
          </div>
        )}
      </div>
    </div>
  );
}
