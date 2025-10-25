"use client";

import { useRouter } from "next/navigation";
import RegionCard from "./components/RegionCard";
import MusicControlButton from "./components/MusicControlButton";
import { REGIONS, UNRELEASED_POKEMON } from "./types/pokemon";
import { soundManager } from "./utils/sound";

export default function Home() {
  const router = useRouter();

  const handleRegionClick = (regionId: string) => {
    soundManager.markUserInteraction();
    router.push(`/pokedex/${regionId}`);
  };

  // Calculate total released Pokemon
  const totalPokemon = 1025;
  const totalReleased = totalPokemon - UNRELEASED_POKEMON.size;

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
      className="min-h-screen"
      style={{
        background: pageStripeBackground,
      }}
    >
      <div className="py-8 container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-center mb-0">
          <div
            className="w-full pl-2 sm:pl-4 flex justify-between items-center"
            style={{ maxWidth: "512px" }}
          >
            <h1 className="text-sm sm:text-base md:text-lg font-bold drop-shadow-lg text-[#0b8fbc]">
              POKÉDEX
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-bold drop-shadow-lg text-[#0b8fbc] pr-2 sm:pr-4">
              RELEASED: {totalReleased}
            </p>
          </div>
        </div>

        {/* Music Control Button */}
        <div className="flex justify-center mb-4">
          <MusicControlButton />
        </div>

        {/* Region Cards */}
        <div className="flex flex-col items-center gap-4">
          {REGIONS.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              onClick={() => handleRegionClick(region.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
