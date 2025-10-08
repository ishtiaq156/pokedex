"use client";

import { useRouter } from "next/navigation";
import RegionCard from "./components/RegionCard";
import { REGIONS } from "./types/pokemon";

export default function Home() {
  const router = useRouter();

  const handleRegionClick = (regionId: string) => {
    router.push(`/pokedex/${regionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
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
