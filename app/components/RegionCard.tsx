import { Region } from "../types/pokemon";
import { useEffect, useState } from "react";

interface RegionCardProps {
  region: Region;
  onClick: () => void;
}

export default function RegionCard({ region, onClick }: RegionCardProps) {
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);

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

  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-2 sm:p-4 text-black shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 relative w-full border-shine-container"
      style={{
        backgroundImage: `url('${region.backgroundImage}'), url('/backdrop.png'), ${stripeBackground}`,
        backgroundSize: "contain, cover, cover",
        backgroundPosition: "center, center, center",
        backgroundRepeat: "no-repeat, no-repeat, repeat",
        backgroundBlendMode: "normal, normal, overlay",
        aspectRatio,
        maxWidth,
      }}
    >
      <div className="relative z-10 px-4 py-2">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold drop-shadow-lg text-[#0b8fbc] uppercase">
          {region.name}
        </h3>
        <p className="text-sm sm:text-base md:text-lg font-semibold text-[#0b8fbc] drop-shadow-lg">
          {region.startDex} / {region.endDex}
        </p>
        {["kanto", "johto", "hoenn", "unova"].includes(region.id) && (
          <img
            src={`/pokedex/${region.id}.png`}
            alt={`${region.name} badge`}
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mt-2 drop-shadow-lg object-contain"
          />
        )}
      </div>
      <style jsx>{`
        .border-shine-container {
          box-shadow:
            inset 0 0 0 10px #ffffff,
            0 0 20px rgba(255, 255, 255, 0.3);
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
