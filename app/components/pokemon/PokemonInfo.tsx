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

interface PokemonInfoProps {
  pokemon: PokemonDetail;
  currentFormData: FormData | null;
}

export default function PokemonInfo({
  pokemon,
  currentFormData,
}: PokemonInfoProps) {
  return (
    <>
      <h3 className="text-xl font-bold text-white mb-4 text-center">INFO</h3>
      <div className="relative mb-4">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-0.5 w-20 h-1 bg-white opacity-80 rounded-full"></div>
        <hr className="border-t border-white opacity-45" />
      </div>

      {/* Category and Description */}
      <div className="mb-6">
        <h4 className="text-lg font-bold text-white mb-3">
          {currentFormData?.category || "POKEMON"}
        </h4>
        <div className="flex gap-4">
          <div className="w-28 h-28 flex-shrink-0">
            <Image
              src={currentFormData?.imageUrl || getPokemonImageUrl(pokemon.id)}
              alt={currentFormData?.name || pokemon.name}
              width={112}
              height={112}
              className="object-contain mx-auto"
            />
          </div>
          <p className="text-sm text-white font-medium leading-relaxed">
            {currentFormData?.description || pokemon.description}
          </p>
        </div>
      </div>
    </>
  );
}
