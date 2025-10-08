import { Pokemon } from "../types/pokemon";
import Image from "next/image";
import { useState } from "react";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-3 flex flex-col items-center relative">
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-700 leading-none">
            {pokemon.dexNumber}
          </span>
        </div>
      )}
      <div className="w-20 h-20 mb-0 flex items-center justify-center relative">
        {!imageError && (
          <Image
            src={pokemon.imageUrl}
            alt={pokemon.name}
            width={80}
            height={80}
            className="object-contain"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      {!imageError && (
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            {pokemon.dexNumber}
          </p>
        </div>
      )}
    </div>
  );
}
