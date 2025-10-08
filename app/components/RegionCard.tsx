import { Region } from "../types/pokemon";

interface RegionCardProps {
  region: Region;
  onClick: () => void;
}

export default function RegionCard({ region, onClick }: RegionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`${region.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105`}
    >
      <h3 className="text-2xl font-bold">{region.name}</h3>
    </div>
  );
}
