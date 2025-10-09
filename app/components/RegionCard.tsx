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
      className="rounded-2xl p-2 sm:p-4 text-black shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 relative overflow-hidden mx-auto w-full"
      style={{
        backgroundImage: `url('${region.backgroundImage}'), ${stripeBackground}, url('/backdrop.png')`,
        backgroundSize: "contain, cover, cover",
        backgroundPosition: "center, center, center",
        backgroundRepeat: "no-repeat, repeat, no-repeat",
        backgroundBlendMode: "normal, overlay, normal",
        aspectRatio,
        maxWidth,
      }}
    >
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold relative z-10 drop-shadow-lg">
        {region.name}
      </h3>
    </div>
  );
}
