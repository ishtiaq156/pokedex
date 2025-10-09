"use client";

import { useRouter } from "next/navigation";
import RegionCard from "./components/RegionCard";
import { REGIONS } from "./types/pokemon";

export default function Home() {
  const router = useRouter();

  const handleRegionClick = (regionId: string) => {
    router.push(`/pokedex/${regionId}`);
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
      className="min-h-screen"
      style={{
        backgroundImage: pageStripeBackground,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Pokédex
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            Choose a region to explore
          </p>
        </div>

        {/* Region Grid */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-4xl mx-auto px-4">
          {REGIONS.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              onClick={() => handleRegionClick(region.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-white/70 text-sm">Catch &apos;em all! 🎮</p>
        </div>
      </div>
    </div>
  );
}
