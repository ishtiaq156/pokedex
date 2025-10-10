"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PokemonCard from "../../components/PokemonCard";
import { Pokemon, REGIONS } from "../../types/pokemon";
import { generatePokemonData } from "../../types/pokemon";

export default function PokedexPage() {
  const params = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  const regionId = params.region as string;
  const region = REGIONS.find((r) => r.id === regionId);

  useEffect(() => {
    if (region) {
      const pokemonData = generatePokemonData(region.startDex, region.endDex);
      setPokemon(pokemonData);
      setLoading(false);
    }
  }, [region]);

  if (!region) {
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
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: pageStripeBackground,
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Region not found
          </h1>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
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
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: pageStripeBackground,
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

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
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-800">{region.name}</h1>
          </div>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-1">
          {pokemon.map((poke) => (
            <PokemonCard key={poke.id} pokemon={poke} />
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Showing {pokemon.length} Pokémon from {region.name}
          </p>
        </div>
      </div>

      {/* Floating Close Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 hover:scale-110 transition-transform duration-200 ease-in-out"
        aria-label="Close and return to home"
      >
        <img
          src="/pokedex/close.png"
          alt="Close"
          className="w-16 h-16 drop-shadow-lg"
        />
      </button>
    </div>
  );
}
