import { Pokemon } from "../types/pokemon";
import Image from "next/image";
import { useState, useEffect } from "react";
import { soundManager } from "../utils/sound";

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: () => void;
}

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    soundManager.playClickSound();
    if (onClick) {
      onClick();
    }
  };

  useEffect(() => {
    const img = new globalThis.Image();
    img.src = pokemon.imageUrl;
    img.onload = () => setImageLoaded(true);
  }, [pokemon.imageUrl]);

  const cardStripeBackground =
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
      className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-3 md:p-4 flex flex-col items-center relative border border-white cursor-pointer"
      style={{
        backgroundImage: cardStripeBackground,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        opacity: pokemon.isReleased ? 1 : 0.5,
        aspectRatio: "3/4",
      }}
      onClick={handleClick}
    >
      {/* Unreleased Badge */}
      {!pokemon.isReleased && (
        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs md:text-sm font-bold px-1.5 py-0.5 rounded-full shadow-md z-10">
          TBA
        </div>
      )}

      {imageLoaded ? (
        <>
          <div className="w-24 h-24 md:w-28 md:h-28 mb-0 flex items-center justify-center relative">
            <Image
              src={pokemon.imageUrl}
              alt={pokemon.name}
              width={112}
              height={112}
              className="object-contain"
              style={{
                filter: pokemon.isReleased ? "none" : "grayscale(100%)",
              }}
            />
          </div>
          <div className="text-center -mb-2">
            <p className="text-lg md:text-xl font-semibold text-[#0b8fbc]">
              {pokemon.dexNumber}
            </p>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg md:text-xl font-semibold leading-none text-[#0b8fbc]">
            {pokemon.dexNumber}
          </span>
        </div>
      )}
    </div>
  );
}
