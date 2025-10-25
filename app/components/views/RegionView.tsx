"use client";

import React, { useMemo } from "react";
import { useApp } from "../../contexts/AppContext";
import PokemonCard from "../PokemonCard";
import {
  generatePokemonData,
  getRegionProgress,
  Region,
} from "../../types/pokemon";
import Image from "next/image";
import { soundManager } from "../../utils/sound";

interface RegionViewProps {
  region: Region;
}

export default function RegionView({ region }: RegionViewProps) {
  const { dispatch, state } = useApp();

  // Generate Pokemon data for this region
  const pokemon = useMemo(() => {
    return generatePokemonData(region.startDex, region.endDex).map((poke) => {
      // Update with real names from loaded data
      const realPokemon = state.allPokemonBasic.find((p) => p.id === poke.id);
      if (realPokemon) {
        return {
          ...poke,
          name: realPokemon.name,
          isReleased: realPokemon.isReleased,
        };
      }
      return poke;
    });
  }, [region, state.allPokemonBasic]);

  const progress = getRegionProgress(region.startDex, region.endDex);

  const handlePokemonClick = (poke: { id: number }) => {
    soundManager.markUserInteraction();
    // Find the detailed Pokemon data
    const detailedPokemon = state.allPokemon.find((p) => p.id === poke.id);
    if (detailedPokemon) {
      dispatch({ type: "NAVIGATE_TO_POKEMON", payload: detailedPokemon });
    }
  };

  const handleBackClick = () => {
    soundManager.markUserInteraction();
    dispatch({ type: "NAVIGATE_TO_HOME" });
  };

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
      className="min-h-screen pb-24"
      style={{
        background: pageStripeBackground,
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 py-1"
        style={{
          background: pageStripeBackground,
        }}
      >
        <div className="container mx-auto px-4 flex justify-center">
          <div
            className="rounded-lg px-3 py-1.5 w-full"
            style={{ backgroundColor: "#e8fafc", maxWidth: "512px" }}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Region Name - Left */}
              <h1
                className="text-xl font-semibold uppercase"
                style={{ color: "#0b8fbc" }}
              >
                {region.name}
              </h1>

              {/* Released Stats - Center */}
              <div
                className="px-4 py-1 rounded-full text-white text-base font-semibold"
                style={{ backgroundColor: "#0b8fbc" }}
              >
                {progress?.released} / {progress?.total}
              </div>

              {/* Region Badge - Right */}
              {region.id !== "unidentified" ? (
                <Image
                  src={`/pokedex/badges/dex/${region.id}.png`}
                  alt={`${region.name} badge`}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div className="w-10 h-10" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="container mx-auto px-4 py-6 flex justify-center">
        <div
          className="grid grid-cols-4 gap-1 w-full"
          style={{ maxWidth: "512px" }}
        >
          {pokemon.map((poke) => (
            <PokemonCard
              key={poke.id}
              pokemon={poke}
              onClick={() => handlePokemonClick(poke)}
            />
          ))}
        </div>
      </div>

      {/* Floating Close Button */}
      <button
        onClick={handleBackClick}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer"
        aria-label="Close and return to home"
      >
        <Image
          src="/pokedex/close.png"
          alt="Close"
          width={64}
          height={64}
          className="w-16 h-16 drop-shadow-lg"
        />
      </button>
    </div>
  );
}
