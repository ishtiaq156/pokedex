import { Region } from "../types/pokemon";
import Image from "next/image";

interface RegionCardProps {
  region: Region;
  onClick: () => void;
}

export default function RegionCard({ region, onClick }: RegionCardProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-2 sm:p-4 text-black shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 relative overflow-hidden mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
      style={{
        backgroundImage: `url('${region.backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        aspectRatio: "512/158",
      }}
    >
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold relative z-10 drop-shadow-lg">
        {region.name}
      </h3>
    </div>
  );
}
