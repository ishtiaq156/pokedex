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
      <div className="py-8 container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div
            className="w-full pl-2 sm:pl-4 flex justify-between items-center"
            style={{ maxWidth: "512px" }}
          >
            <h1 className="text-sm sm:text-base md:text-lg font-bold drop-shadow-lg text-[#0b8fbc]">
              POKÉDEX
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-bold drop-shadow-lg text-[#0b8fbc] pr-2 sm:pr-4">
              RELEASED: 1025
            </p>
          </div>
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
