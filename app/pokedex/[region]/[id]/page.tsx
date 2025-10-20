"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PokemonDetail } from "@/app/types/pokemon";
import { getPokemonImageUrl } from "@/app/types/pokemon";
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
  const [selectedFormIndex, setSelectedFormIndex] = useState<number>(0);

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

    // Get all Pokemon IDs in the evolution chain
    const allEvoIds = new Set<string>();
    allEvoIds.add(pokemon.id.toString());

    // Add all from/to IDs from evolution chain
    if (pokemon.evolution_chain) {
      pokemon.evolution_chain.forEach((evo) => {
        allEvoIds.add(evo.from.id);
        allEvoIds.add(evo.to.id);
      });
    }

    // Find the first Pokemon in the chain (the one that doesn't appear as 'to' in any evolution)
    const allFromIds = new Set<string>();
    const allToIds = new Set<string>();

    if (pokemon.evolution_chain) {
      pokemon.evolution_chain.forEach((evo) => {
        allFromIds.add(evo.from.id);
        allToIds.add(evo.to.id);
      });
    }

    let chainStartId = pokemon.id.toString();
    for (const id of allFromIds) {
      if (!allToIds.has(id)) {
        chainStartId = id;
        break;
      }
    }

    // Group evolutions by 'from' pokemon
    const evolutionGroups = new Map<string, { from: string; to: string[] }>();

    if (pokemon.evolution_chain) {
      pokemon.evolution_chain.forEach((evo) => {
        if (evo.from.id === evo.to.id) return;

        if (!evolutionGroups.has(evo.from.id)) {
          evolutionGroups.set(evo.from.id, {
            from: evo.from.id,
            to: [evo.to.id],
          });
        } else {
          evolutionGroups.get(evo.from.id)?.to.push(evo.to.id);
        }
      });
    }

    // Build the complete evolution chain starting
    // Check if current Pokemon has any regular (non-mega) evolutions
    const hasRegularEvolutions = pokemon.evolution_chain
      ? pokemon.evolution_chain.some(
          (evo) =>
            evo.from.id !== evo.to.id && // Exclude mega evolutions
            (evo.from.id === pokemon.id.toString() ||
              evo.to.id === pokemon.id.toString()),
        )
      : false;

    // Create evolution rows
    const evolutionRows: { ids: string[] }[] = [];

    // Add current pokemon as single row if it has no regular evolutions
    if (!hasRegularEvolutions) {
      evolutionRows.push({ ids: [pokemon.id.toString()] });
    }

    // Build evolution chains relevant to current Pokemon
    // Check if current Pokemon is the chain start
    const isChainStart = pokemon.id.toString() === chainStartId;

    if (isChainStart) {
      // When viewing chain start, build one complete chain and add branches
      let currentId: string | null = chainStartId;
      const branchPoints: { pokemonId: string; alternatives: string[] }[] = [];

      // First pass: build one complete chain and collect branch points
      while (currentId) {
        const nextEvolutions = evolutionGroups.get(currentId);
        if (!nextEvolutions) break;

        if (nextEvolutions.to.length === 1) {
          // Single evolution - continue building the chain
          const lastRow =
            evolutionRows.length > 0
              ? evolutionRows[evolutionRows.length - 1]
              : null;
          if (lastRow && lastRow.ids[lastRow.ids.length - 1] === currentId) {
            lastRow.ids.push(nextEvolutions.to[0]);
            currentId = nextEvolutions.to[0];
          } else {
            evolutionRows.push({ ids: [currentId, nextEvolutions.to[0]] });
            currentId = nextEvolutions.to[0];
          }
        } else {
          // Multiple evolutions - add the first one to continue the chain, collect others as branches
          const firstEvolution = nextEvolutions.to[0];
          const otherEvolutions = nextEvolutions.to.slice(1);

          const lastRow =
            evolutionRows.length > 0
              ? evolutionRows[evolutionRows.length - 1]
              : null;
          if (lastRow && lastRow.ids[lastRow.ids.length - 1] === currentId) {
            lastRow.ids.push(firstEvolution);
            currentId = firstEvolution;
          } else {
            evolutionRows.push({ ids: [currentId, firstEvolution] });
            currentId = firstEvolution;
          }

          // Collect the other evolutions as branches
          if (otherEvolutions.length > 0) {
            branchPoints.push({
              pokemonId: currentId,
              alternatives: otherEvolutions,
            });
          }
        }
      }

      // Second pass: add the collected branches
      branchPoints.forEach((branch) => {
        branch.alternatives.forEach((altId) => {
          evolutionRows.push({ ids: [branch.pokemonId, altId] });
        });
      });
    } else {
      // When viewing other Pokemon, show path to current plus branches from ancestors
      // Find the path from chain start to current Pokemon
      const pathToCurrent: string[] = [];
      let tracer = pokemon.id.toString();

      // Trace back to find the complete path
      while (true) {
        pathToCurrent.unshift(tracer);
        const evolvesFrom = pokemon.evolution_chain?.find(
          (evo) => evo.to.id === tracer,
        );
        if (!evolvesFrom) break;
        tracer = evolvesFrom.from.id;
      }

      // Start with the path to current Pokemon
      evolutionRows.push({ ids: [...pathToCurrent] });

      // Check if current Pokemon has evolutions
      const currentPokemonId = pathToCurrent[pathToCurrent.length - 1];
      const currentEvolutions = evolutionGroups.get(currentPokemonId);

      if (currentEvolutions && currentEvolutions.to.length > 0) {
        if (currentEvolutions.to.length === 1) {
          // Single evolution - continue the path
          evolutionRows[0].ids.push(currentEvolutions.to[0]);
        } else {
          // Multiple evolutions - continue with first one, show others as branches
          evolutionRows[0].ids.push(currentEvolutions.to[0]);
          const otherEvolutions = currentEvolutions.to.slice(1);
          otherEvolutions.forEach((altId) => {
            evolutionRows.push({ ids: [currentPokemonId, altId] });
          });
        }
      }

      // Show branches from ancestors that have multiple evolutions, but only if current Pokemon is not an end result
      for (let i = 0; i < pathToCurrent.length - 1; i++) {
        const ancestorId = pathToCurrent[i];
        const ancestorEvolutions = evolutionGroups.get(ancestorId);

        if (ancestorEvolutions && ancestorEvolutions.to.length > 1) {
          // Ancestor has multiple evolutions - show them as branches
          // But only if the current Pokemon is not one of those evolutions
          const currentIsEndOfBranch =
            ancestorEvolutions.to.includes(currentPokemonId);

          if (!currentIsEndOfBranch) {
            ancestorEvolutions.to.forEach((evoId) => {
              evolutionRows.push({ ids: [ancestorId, evoId] });
            });
          }
        }
      }
    }

    // Convert to display format
    const result: { id: string; name: string }[][] = [];

    evolutionRows.forEach((row) => {
      const chain = row.ids.map((id) => {
        const pokemon = allPokemon.find((p) => p.id.toString() === id);
        return pokemon ? { id, name: pokemon.name } : { id, name: "Unknown" };
      });
      result.push(chain);
    });

    return result;
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

  // Get current form data
  const getCurrentFormData = () => {
    if (!pokemon) return null;
    if (
      !pokemon.forms ||
      pokemon.forms.length === 0 ||
      selectedFormIndex === 0
    ) {
      return {
        name: pokemon.name,
        types: pokemon.types,
        description: pokemon.description,
        imageUrl: getPokemonImageUrl(pokemon.id),
        category: pokemon.category,
      };
    }
    const selectedForm = pokemon.forms[selectedFormIndex - 1]; // -1 because index 0 is default, 1 is first form
    return {
      name: pokemon.name, // Always use base Pokemon name for main display
      types: selectedForm.types,
      description: selectedForm.description,
      imageUrl: selectedForm.imageUrl,
      category: selectedForm.category || pokemon.category,
    };
  };

  const currentFormData = getCurrentFormData();

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
                src={
                  currentFormData?.imageUrl || getPokemonImageUrl(pokemon.id)
                }
                alt={currentFormData?.name || pokemon.name}
                width={256}
                height={256}
                className="object-contain"
              />
            </div>
          </div>

          {/* Dex Number and Name */}
          <div className="text-center text-white mb-4">
            <h2 className="text-3xl font-bold">
              {dexNumber}{" "}
              {(currentFormData?.name || pokemon.name).toUpperCase()}
            </h2>
          </div>

          {/* Form Selector */}
          {pokemon.forms && pokemon.forms.length > 0 && (
            <div className="flex justify-center mb-6">
              <div className="flex flex-col gap-2 max-w-xs">
                {/* Group forms into rows of 5 */}
                {(() => {
                  const allForms = [null, ...pokemon.forms]; // null represents default form
                  const rows = [];
                  for (let i = 0; i < allForms.length; i += 5) {
                    rows.push(allForms.slice(i, i + 5));
                  }
                  return rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-2">
                      {row.map((form, colIndex) => {
                        const globalIndex = rowIndex * 5 + colIndex;
                        const isDefault = form === null;
                        const formIndex = globalIndex; // 0 for default, 1+ for forms

                        return (
                          <div
                            key={isDefault ? "default" : form.name}
                            className="flex flex-col items-center"
                          >
                            <button
                              onClick={() => setSelectedFormIndex(formIndex)}
                              className={`w-16 h-16 rounded transition-all duration-200 ${
                                selectedFormIndex === formIndex
                                  ? "border-2 border-white"
                                  : "border border-opacity-70"
                              }`}
                              style={{
                                backgroundColor: "transparent",
                                borderColor:
                                  selectedFormIndex === formIndex
                                    ? "white"
                                    : "rgba(255, 255, 255, 0.3)",
                              }}
                              aria-label={
                                isDefault
                                  ? `Default ${pokemon.name} form`
                                  : `${form.name} form`
                              }
                            >
                              <div
                                className="w-full h-full rounded-sm overflow-hidden"
                                style={{ opacity: 1 }}
                              >
                                <Image
                                  src={
                                    isDefault
                                      ? getPokemonImageUrl(pokemon.id)
                                      : form.imageUrl
                                  }
                                  alt={isDefault ? pokemon.name : form.name}
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </button>
                            {!isDefault && (
                              <span className="text-xs text-white font-semibold mt-1 text-center leading-tight max-w-12">
                                {form.name.toUpperCase()}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
          <div className="flex justify-center gap-4 mb-0">
            {(currentFormData?.types || pokemon.types).map((type) => (
              <div key={type} className="flex flex-col items-center">
                <div className="w-10 h-10 mb-1">
                  <Image
                    src={`/types/${type.toLowerCase()}.png`}
                    alt={type}
                    width={40}
                    height={40}
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
            <h4 className="text-lg font-bold text-white mb-3">
              {currentFormData?.category || "SEED POKEMON"}
            </h4>
            <div className="flex gap-4">
              <div className="w-24 h-24 flex-shrink-0">
                <Image
                  src={
                    currentFormData?.imageUrl || getPokemonImageUrl(pokemon.id)
                  }
                  alt={currentFormData?.name || pokemon.name}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-white leading-relaxed">
                {currentFormData?.description || pokemon.description}
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
              <div className="space-y-4">
                {evolutionFamily.map((chain, chainIndex) => (
                  <div
                    key={chainIndex}
                    className="flex items-center justify-center"
                  >
                    {chain.length === 2 ? (
                      <>
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              router.push(`/pokedex/${regionId}/${chain[0].id}`)
                            }
                            className="text-center cursor-pointer hover:scale-105 transition-transform"
                          >
                            <div className="w-20 h-20 mb-1">
                              <Image
                                src={getPokemonImageUrl(parseInt(chain[0].id))}
                                alt={chain[0].name}
                                width={80}
                                height={80}
                                className="object-contain"
                              />
                            </div>
                            <p className="text-xs font-semibold text-white uppercase">
                              {chain[0].name}
                            </p>
                          </button>
                        </div>
                        <span className="text-2xl text-white font-bold mx-8">
                          ⟶
                        </span>
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              router.push(`/pokedex/${regionId}/${chain[1].id}`)
                            }
                            className="text-center cursor-pointer hover:scale-105 transition-transform"
                          >
                            <div className="w-20 h-20 mb-1">
                              <Image
                                src={getPokemonImageUrl(parseInt(chain[1].id))}
                                alt={chain[1].name}
                                width={80}
                                height={80}
                                className="object-contain"
                              />
                            </div>
                            <p className="text-xs font-semibold text-white uppercase">
                              {chain[1].name}
                            </p>
                          </button>
                        </div>
                      </>
                    ) : (
                      chain.map((evo, index) => {
                        const evoImageUrl = getPokemonImageUrl(
                          parseInt(evo.id),
                        );

                        return (
                          <div key={evo.id} className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                router.push(`/pokedex/${regionId}/${evo.id}`)
                              }
                              className="text-center cursor-pointer hover:scale-105 transition-transform"
                            >
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
                            </button>
                            {index < chain.length - 1 && (
                              <span className="text-2xl text-white font-bold">
                                →
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Close Button */}
      <button
        onClick={() => router.push(`/pokedex/${regionId}`)}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out hover:brightness-110 active:brightness-90 cursor-pointer"
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

      {/* Desktop Navigation Arrows */}
      <button
        onClick={navigateToPrevious}
        className="hidden md:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Previous Pokemon"
      >
        <span className="text-white text-2xl font-bold">‹</span>
      </button>

      <button
        onClick={navigateToNext}
        className="hidden md:flex fixed right-4 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Next Pokemon"
      >
        <span className="text-white text-2xl font-bold">›</span>
      </button>

      {/* Scanning Animation */}
      <ScanningAnimation />
    </div>
  );
}
