"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PokemonCard from "../../components/PokemonCard";
import { Pokemon, REGIONS, getRegionProgress } from "../../types/pokemon";
import { generatePokemonData } from "../../types/pokemon";
import Image from "next/image";

export default function PokedexPage() {
  const params = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  const regionId = params.region as string;
  const region = REGIONS.find((r) => r.id === regionId);
  const progress = region
    ? getRegionProgress(region.startDex, region.endDex)
    : null;

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
      <div
        className="sticky top-0 z-10 py-1"
        style={{
          backgroundImage: pageStripeBackground,
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      >
        <div className="container mx-auto px-4 flex justify-center">
          <div
            className="rounded-lg px-3 py-1.5 w-full"
            style={{ backgroundColor: "#e8fafc", maxWidth: "512px" }}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Region Name - Left */}
              <h1
                className="text-xl font-semibold uppercase"
                style={{ color: "#0b8fbc" }}
              >
                {region.name}
              </h1>

              {/* Released Stats - Center */}
              <div
                className="px-4 py-1 rounded-full text-white text-base font-semibold"
                style={{ backgroundColor: "#0b8fbc" }}
              >
                {progress?.released} / {progress?.total}
              </div>

              {/* Region Badge - Right */}
              {region.id !== "unidentified" ? (
                <Image
                  src={`/pokedex/badges/dex/${region.id}.png`}
                  alt={`${region.name} badge`}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-10 h-10" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="container mx-auto px-4 py-6 flex justify-center">
        <div
          className="grid grid-cols-4 gap-1 w-full"
          style={{ maxWidth: "512px" }}
        >
          {pokemon.map((poke) => (
            <PokemonCard key={poke.id} pokemon={poke} />
          ))}
        </div>
      </div>

      {/* Floating Close Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 hover:scale-110 transition-transform duration-200 ease-in-out"
        aria-label="Close and return to home"
      >
        <Image
          src="/pokedex/close.png"
          alt="Close"
          width={64}
          height={64}
          className="w-16 h-16 drop-shadow-lg"
          unoptimized
        />
      </button>
    </div>
  );
}
