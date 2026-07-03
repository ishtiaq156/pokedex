import React from "react";
import Image from "next/image";
import { getPokemonImageUrl, PokemonDetail } from "../../types/pokemon";

interface FormData {
  name: string;
  types: string[];
  description: string;
  imageUrl: string;
  category: string;
}

interface PokemonHeaderProps {
  pokemon: PokemonDetail;
  currentFormData: FormData | null;
  dexNumber: string;
  handlePlayCry: () => void;
}

export default function PokemonHeader({
  pokemon,
  currentFormData,
  dexNumber,
  handlePlayCry,
}: PokemonHeaderProps) {
  return (
    <div className="p-6 pt-8 pb-0">
      <div className="flex justify-center mb-0">
        <button
          type="button"
          onClick={handlePlayCry}
          className="w-64 h-64 relative cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 rounded-full"
          aria-label={`Play ${currentFormData?.name || pokemon.name} cry`}
          style={{ background: "transparent" }}
        >
          <Image
            src={currentFormData?.imageUrl || getPokemonImageUrl(pokemon.id)}
            alt={currentFormData?.name || pokemon.name}
            width={256}
            height={256}
            className="object-contain mx-auto"
          />
        </button>
      </div>

      {/* Dex Number and Name */}
      <div className="text-center text-white mb-4">
        <h2 className="text-3xl font-bold">
          {dexNumber} {(currentFormData?.name || pokemon.name).toUpperCase()}
        </h2>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        {(currentFormData?.types || pokemon.types).map((type: string) => (
          <div key={type} className="flex flex-col items-center">
            <div className="w-10 h-10 mb-1">
              <Image
                src={`/types/${type.toLowerCase()}.png`}
                alt={type}
                width={40}
                height={40}
                className="object-contain mx-auto"
              />
            </div>
            <span className="text-white font-semibold text-sm">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
