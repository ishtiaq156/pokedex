import { Region, getRegionProgress } from "../types/pokemon";
import { useEffect, useState } from "react";
import Image from "next/image";

interface RegionCardProps {
  region: Region;
  onClick: () => void;
}

export default function RegionCard({ region, onClick }: RegionCardProps) {
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const progress = getRegionProgress(region.startDex, region.endDex);

  useEffect(() => {
    if (!region.backgroundImage) return;

    const img = new window.Image();
    img.src = region.backgroundImage;
    const handleLoad = () => {
      setImageWidth(img.naturalWidth || null);
      setImageHeight(img.naturalHeight || null);
    };
    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
    }
    return () => {
      img.removeEventListener("load", handleLoad);
    };
  }, [region.backgroundImage]);

  const aspectRatio =
    imageWidth && imageHeight ? `${imageWidth}/${imageHeight}` : "512/158"; // fallback
  const maxWidth = imageWidth ? `${imageWidth}px` : undefined;
  const stripeBackground =
    "repeating-linear-gradient(135deg, #def6f8 0 48px, #dcf6f8 48px 96px, #daf6f8 96px 144px, #daf4f8 144px 192px)";

  const hasPlatinumBadge = [
    "kanto",
    "johto",
    "hoenn",
    "unova",
    "kalos",
    "unidentified",
  ].includes(region.id);

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-2 sm:p-4 text-black shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-101 active:scale-95 hover:brightness-105 active:brightness-95 relative w-full ${hasPlatinumBadge ? "border-shine-container" : "border-static"}`}
      style={{
        backgroundImage: `url('${region.backgroundImage}'), url('/pokedex/backdrop.png'), ${stripeBackground}`,
        backgroundSize: "contain, cover, cover",
        backgroundPosition: "right center, center, center",
        backgroundRepeat: "no-repeat, no-repeat, repeat",
        backgroundBlendMode: "normal, normal, overlay",
        aspectRatio,
        maxWidth,
      }}
    >
      <div className="relative z-10 pl-1 pr-4 pt-1 pb-1">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-lg text-[#0b8fbc] uppercase leading-tight">
          {region.name}
        </h3>

        {/* Progress Bar - only show if there are unreleased Pokemon */}
        <div className="mt-1 mb-0.5">
          {progress.unreleased > 0 ? (
            <div className="w-1/4 max-w-[25%] bg-white rounded-full h-2 overflow-hidden shadow-inner">
              <div
                className="h-full bg-[#0b8fbc] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          ) : (
            <p className="text-xs sm:text-sm font-medium text-[#0b8fbc] drop-shadow-lg">
              Complete!
            </p>
          )}
        </div>

        <p className="text-sm sm:text-base md:text-lg font-bold text-[#0b8fbc] drop-shadow-lg mb-1">
          {progress.released} / {progress.total}
        </p>
        <div className="mb-0.5">
          {[
            "kanto",
            "johto",
            "hoenn",
            "unova",
            "kalos",
            "unidentified",
          ].includes(region.id) && (
            <div className="w-7 h-7 flex items-center justify-start">
              <Image
                src={`/pokedex/badges/platinum/${region.id}.png`}
                alt={`${region.name} badge`}
                width={28}
                height={28}
                className="max-w-full max-h-full drop-shadow-lg object-contain"
                priority
              />
            </div>
          )}
          {["sinnoh", "alola", "galar", "hisui", "paldea"].includes(
            region.id,
          ) && (
            <div className="w-7 h-7 flex items-center justify-start">
              <Image
                src={`/pokedex/badges/gold/${region.id}.png`}
                alt={`${region.name} badge`}
                width={28}
                height={28}
                className="max-w-full max-h-full drop-shadow-lg object-contain"
                priority
              />
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .border-shine-container {
          position: relative;
          overflow: hidden;
        }

        .border-shine-container::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 6px;
          background: conic-gradient(
            from var(--angle),
            white 0%,
            white 70%,
            #ddd 80%,
            #ddd 90%,
            white 100%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: rotate 3s linear infinite alternate;
          pointer-events: none;
        }

        .border-static {
          position: relative;
          overflow: hidden;
        }

        .border-static::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 6px;
          background: white;
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes rotate {
          to {
            --angle: 360deg;
          }
        }
      `}</style>
    </div>
  );
}
