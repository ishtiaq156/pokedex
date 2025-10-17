"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PokemonDetail } from "@/app/types/pokemon";
import Image from "next/image";
import ScanningAnimation from "../../../components/ScanningAnimation";

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [allPokemon, setAllPokemon] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const regionId = params.region as string;
  const pokemonId = parseInt(params.id as string);

  // Load Pokemon details
  useEffect(() => {
    fetch("/data/pokemon-details.json")
      .then((res) => res.json())
      .then((data: PokemonDetail[]) => {
        setAllPokemon(data);
        const currentPokemon = data.find((p) => p.id === pokemonId);
        if (currentPokemon) {
          setPokemon(currentPokemon);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Pokemon details:", err);
        setLoading(false);
      });
  }, [pokemonId]);

  // Get unique evolution family (excluding mega evolutions)
  const getEvolutionFamily = () => {
    if (!pokemon) return [];

    const family = new Map<string, string>();
    family.set(pokemon.id.toString(), pokemon.name);

    if (pokemon.evolution_chain) {
      pokemon.evolution_chain.forEach((evo) => {
        if (evo.from.id === evo.to.id) return;
        family.set(evo.from.id, evo.from.name);
        family.set(evo.to.id, evo.to.name);
      });
    }

    return Array.from(family.entries())
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([id, name]) => ({ id, name }));
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      navigateToNext();
    } else if (isRightSwipe) {
      navigateToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const navigateToNext = () => {
    if (allPokemon.length === 0) return;
    const currentIndex = allPokemon.findIndex((p) => p.id === pokemonId);
    if (currentIndex < allPokemon.length - 1) {
      const nextPokemon = allPokemon[currentIndex + 1];
      router.push(`/pokedex/${regionId}/${nextPokemon.id}`);
    }
  };

  const navigateToPrevious = () => {
    if (allPokemon.length === 0) return;
    const currentIndex = allPokemon.findIndex((p) => p.id === pokemonId);
    if (currentIndex > 0) {
      const prevPokemon = allPokemon[currentIndex - 1];
      router.push(`/pokedex/${regionId}/${prevPokemon.id}`);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom, #90f0f0, #548cb4)",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom, #90f0f0, #548cb4)",
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Pokémon not found
          </h1>
          <button
            onClick={() => router.push(`/pokedex/${regionId}`)}
            className="bg-white text-blue-500 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Back to Pokédex
          </button>
        </div>
      </div>
    );
  }

  const evolutionFamily = getEvolutionFamily();
  const dexNumber = pokemon.id.toString().padStart(4, "0");
  const imageUrl = `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm${pokemon.id}.icon.png`;

  return (
    <div
      className="min-h-screen overflow-y-auto pb-24 md:pb-0"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-md mx-auto">
        {/* Header with Pokemon Image */}
        <div className="p-6 pt-8">
          <div className="flex justify-center mb-4">
            <div className="w-64 h-64 relative">
              <Image
                src={imageUrl}
                alt={pokemon.name}
                width={256}
                height={256}
                className="object-contain"
              />
            </div>
          </div>

          {/* Dex Number and Name */}
          <div className="text-center text-white mb-4">
            <h2 className="text-3xl font-bold">
              {dexNumber} {pokemon.name.toUpperCase()}
            </h2>
          </div>

          {/* Types */}
          <div className="flex justify-center gap-4 mb-6">
            {pokemon.types.map((type) => (
              <div key={type} className="flex flex-col items-center">
                <div className="w-12 h-12 mb-1">
                  <Image
                    src={`/types/${type.toLowerCase()}.png`}
                    alt={type}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <span className="text-white font-semibold text-sm">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6 min-h-[50vh]">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            INFO
          </h3>
          <div className="relative mb-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-0.5 w-20 h-1 bg-white opacity-80 rounded-full"></div>
            <hr className="border-t border-white opacity-45" />
          </div>

          {/* Category and Description */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-white mb-3">SEED POKEMON</h4>
            <div className="flex gap-4">
              <div className="w-24 h-24 flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={pokemon.name}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-white leading-relaxed">
                {pokemon.description}
              </p>
            </div>
          </div>

          {/* Evolution Section */}
          {evolutionFamily.length > 0 && (
            <div>
              <hr className="border-t border-white opacity-45 mb-4" />
              <h4 className="text-lg font-bold text-white mb-3 text-center">
                EVOLUTION
              </h4>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {evolutionFamily.map((evo, index) => {
                  const evoImageUrl = `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm${evo.id}.icon.png`;

                  return (
                    <div key={evo.id} className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="w-20 h-20 mb-1">
                          <Image
                            src={evoImageUrl}
                            alt={evo.name}
                            width={80}
                            height={80}
                            className="object-contain"
                          />
                        </div>
                        <p className="text-xs font-semibold text-white uppercase">
                          {evo.name}
                        </p>
                      </div>
                      {index < evolutionFamily.length - 1 && (
                        <span className="text-2xl text-white font-bold">→</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Close Button */}
      <button
        onClick={() => router.push(`/pokedex/${regionId}`)}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out hover:brightness-110 active:brightness-90"
        aria-label="Close and return to pokedex"
      >
        <Image
          src="/pokedex/close.png"
          alt="Close"
          width={64}
          height={64}
          className="w-16 h-16 drop-shadow-lg"
        />
      </button>

      {/* Scanning Animation */}
      <ScanningAnimation />
    </div>
  );
}
