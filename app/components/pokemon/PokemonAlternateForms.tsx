import React from "react";
import Image from "next/image";
import { getPokemonImageUrl, PokemonDetail } from "../../types/pokemon";

interface PokemonAlternateFormsProps {
  pokemon: PokemonDetail;
  handlePokemonClick: (pokemonId: string) => void;
  failedImages: Set<string>;
  setFailedImages: React.Dispatch<React.SetStateAction<Set<string>>>;
  allPokemon: PokemonDetail[];
}

const RegionalEvolutionChains = ({
  pokemon,
  regionName,
  handlePokemonClick,
  pokemonMap,
}: {
  pokemon: PokemonDetail;
  regionName: string;
  handlePokemonClick: (pokemonId: string) => void;
  pokemonMap: Map<number, PokemonDetail>;
}) => {
  const getRegionalFormImage = (pokemonId: number) => {
    try {
      const p = pokemonMap.get(pokemonId);
      if (p && p.forms) {
        const form = p.forms.find((f) => f.name === regionName);
        if (form && form.imageUrl) return form.imageUrl;
      }
    } catch {
      // Ignore
    }
    return getPokemonImageUrl(pokemonId);
  };

  const formsWithEvolutions = pokemon.forms?.filter(
    (form) =>
      form.name === regionName &&
      form.evolution_chain &&
      form.evolution_chain.length > 0,
  );

  if (!formsWithEvolutions || formsWithEvolutions.length === 0) return null;

  return (
    <div className="mt-16 pt-8">
      <h5 className="text-sm font-bold text-white mb-4 text-center uppercase">
        - {regionName} FORM -
      </h5>
      {formsWithEvolutions.map((form, formIndex) => (
        <div key={formIndex} className="mb-6">
          <div className="flex flex-wrap justify-center gap-6">
            {form.evolution_chain?.map((chain, chainIndex) => {
              if (chain.no_evolve) {
                const noEvolvePokemon = chain.no_evolve;
                return (
                  <div key={chainIndex} className="flex items-center gap-2">
                    <button
                      onClick={() => handlePokemonClick(noEvolvePokemon.id)}
                      className="text-center cursor-pointer hover:scale-105 transition-transform"
                    >
                      <div className="w-24 h-24 mb-0">
                        <Image
                          src={form.imageUrl}
                          alt={noEvolvePokemon.name}
                          width={96}
                          height={96}
                          className="object-contain mx-auto"
                        />
                      </div>
                      <p className="text-xs font-semibold text-white uppercase text-center">
                        {noEvolvePokemon.name}
                      </p>
                    </button>
                  </div>
                );
              }

              const fromPokemon = chain.from;
              const toPokemon = chain.to;
              const fromImageUrl = fromPokemon
                ? getRegionalFormImage(parseInt(fromPokemon.id))
                : "";
              const toImageUrl = toPokemon
                ? getRegionalFormImage(parseInt(toPokemon.id))
                : "";

              return (
                <div key={chainIndex} className="flex items-center gap-2">
                  {fromPokemon && (
                    <button
                      onClick={() => handlePokemonClick(fromPokemon.id)}
                      className="text-center cursor-pointer hover:scale-105 transition-transform"
                    >
                      <div className="w-24 h-24 mb-0">
                        <Image
                          src={fromImageUrl}
                          alt={fromPokemon.name}
                          width={96}
                          height={96}
                          className="object-contain mx-auto"
                        />
                      </div>
                      <p className="text-xs font-semibold text-white uppercase text-center">
                        {fromPokemon.name}
                      </p>
                    </button>
                  )}
                  {fromPokemon && toPokemon && (
                    <span className="text-2xl text-white font-bold">→</span>
                  )}
                  {toPokemon && (
                    <button
                      onClick={() => handlePokemonClick(toPokemon.id)}
                      className="text-center cursor-pointer hover:scale-105 transition-transform"
                    >
                      <div className="w-24 h-24 mb-0">
                        <Image
                          src={toImageUrl}
                          alt={toPokemon.name}
                          width={96}
                          height={96}
                          className="object-contain mx-auto"
                        />
                      </div>
                      <p className="text-xs font-semibold text-white uppercase text-center">
                        {toPokemon.name}
                      </p>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function PokemonAlternateForms({
  pokemon,
  handlePokemonClick,
  failedImages,
  setFailedImages,
  allPokemon,
}: PokemonAlternateFormsProps) {
  // Use a map to make ID lookups O(1) instead of O(N) when resolving evolution nodes
  const pokemonMap = React.useMemo(() => {
    const map = new Map<number, PokemonDetail>();
    for (const p of allPokemon) {
      map.set(p.id, p);
    }
    return map;
  }, [allPokemon]);

  return (
    <>
      <RegionalEvolutionChains
        pokemon={pokemon}
        regionName="Alolan"
        handlePokemonClick={handlePokemonClick}
        pokemonMap={pokemonMap}
      />
      <RegionalEvolutionChains
        pokemon={pokemon}
        regionName="Galarian"
        handlePokemonClick={handlePokemonClick}
        pokemonMap={pokemonMap}
      />

      {/* Mega Evolutions */}
      {pokemon.mega && pokemon.mega.length > 0 && (
        <div className="mt-16 pt-8">
          <h5 className="text-sm font-bold text-white mb-4 text-center">
            - MEGA EVOLUTION -
          </h5>
          <div className="flex flex-wrap justify-center gap-6">
            {pokemon.mega.map((mega, index) => (
              <div key={index} className="text-center">
                <div className="w-28 h-28 mb-2 mx-auto">
                  <Image
                    src={mega.imageUrl}
                    alt={mega.name}
                    width={112}
                    height={112}
                    className="object-contain mx-auto"
                  />
                </div>
                <p className="text-xs font-semibold text-white uppercase text-center">
                  {mega.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primal Evolutions */}
      {pokemon.primal && pokemon.primal.length > 0 && (
        <div className="mt-16 pt-8">
          <h5 className="text-sm font-bold text-white mb-4 text-center">
            - PRIMAL REVERSION -
          </h5>
          <div className="flex flex-wrap justify-center gap-6">
            {pokemon.primal.map((primal, index) => (
              <div key={index} className="text-center">
                <div className="w-28 h-28 mb-2 mx-auto">
                  <Image
                    src={primal.imageUrl}
                    alt={primal.name}
                    width={112}
                    height={112}
                    className="object-contain mx-auto"
                  />
                </div>
                <p className="text-xs font-semibold text-white uppercase text-center">
                  {primal.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gigantamax Evolutions */}
      {pokemon.gigantamax && pokemon.gigantamax.length > 0 && (
        <div className="mt-16 pt-8">
          <h5 className="text-sm font-bold text-white mb-4 text-center">
            - GIGANTAMAX -
          </h5>
          <div className="flex flex-wrap justify-center gap-6">
            {pokemon.gigantamax.map((gmax, index) => (
              <div key={index} className="text-center">
                <div className="w-28 h-28 mb-2 mx-auto flex items-center justify-center">
                  {failedImages.has(gmax.imageUrl) ? (
                    <span className="text-2xl font-bold text-white opacity-60">
                      ???
                    </span>
                  ) : (
                    <Image
                      src={gmax.imageUrl}
                      alt={gmax.name}
                      width={112}
                      height={112}
                      className="object-contain mx-auto"
                      onError={() =>
                        setFailedImages((prev) =>
                          new Set(prev).add(gmax.imageUrl),
                        )
                      }
                    />
                  )}
                </div>
                <p className="text-xs font-semibold text-white uppercase text-center">
                  {gmax.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
