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

export default function PokemonAlternateForms({
  pokemon,
  handlePokemonClick,
  failedImages,
  setFailedImages,
  allPokemon,
}: PokemonAlternateFormsProps) {
  // Use state.allPokemon mapped to allPokemon internally
  const state = { allPokemon };

  return (
    <>
      {/* Alolan Form Evolution Chains */}
      {pokemon.forms &&
        pokemon.forms.some(
          (form) =>
            form.name === "Alolan" &&
            form.evolution_chain &&
            form.evolution_chain.length > 0,
        ) && (
          <div className="mt-16 pt-8">
            <h5 className="text-sm font-bold text-white mb-4 text-center">
              - ALOLAN FORM -
            </h5>
            {pokemon.forms
              .filter(
                (form) =>
                  form.name === "Alolan" &&
                  form.evolution_chain &&
                  form.evolution_chain.length > 0,
              )
              .map((form, formIndex: number) => (
                <div key={formIndex} className="mb-6">
                  <div className="flex flex-wrap justify-center gap-6">
                    {form.evolution_chain?.map((chain, chainIndex: number) => {
                      // Handle no_evolve case (single Pokemon)
                      if (chain.no_evolve) {
                        const noEvolvePokemon = chain.no_evolve;
                        return (
                          <div
                            key={chainIndex}
                            className="flex items-center gap-2"
                          >
                            <button
                              onClick={() =>
                                handlePokemonClick(noEvolvePokemon.id)
                              }
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

                      // Handle regular evolution chain (from -> to)
                      // For Alolan forms, we need to find the Alolan form image for both from and to Pokemon

                      // Helper function to get Alolan form image for any Pokemon
                      const getAlolanFormImage = (pokemonId: number) => {
                        try {
                          const pokemonWithAlolanForm = state.allPokemon.find(
                            (p) =>
                              p.id === pokemonId &&
                              p.forms &&
                              p.forms.some((f) => f.name === "Alolan"),
                          );

                          if (
                            pokemonWithAlolanForm &&
                            pokemonWithAlolanForm.forms
                          ) {
                            const alolanForm = pokemonWithAlolanForm.forms.find(
                              (f) => f.name === "Alolan",
                            );
                            if (alolanForm && alolanForm.imageUrl) {
                              return alolanForm.imageUrl;
                            }
                          }
                        } catch {
                          // Fallback to regular image if Alolan form not found
                        }
                        return getPokemonImageUrl(pokemonId);
                      };

                      // Use Alolan form images for both from and to Pokemon
                      const fromPokemon = chain.from;
                      const toPokemon = chain.to;
                      const fromImageUrl = fromPokemon
                        ? getAlolanFormImage(parseInt(fromPokemon.id))
                        : "";
                      const toImageUrl = toPokemon
                        ? getAlolanFormImage(parseInt(toPokemon.id))
                        : "";

                      return (
                        <div
                          key={chainIndex}
                          className="flex items-center gap-2"
                        >
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
                            <span className="text-2xl text-white font-bold">
                              →
                            </span>
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
        )}

      {/* Galarian Form Evolution Chains */}
      {pokemon.forms &&
        pokemon.forms.some(
          (form) =>
            form.name === "Galarian" &&
            form.evolution_chain &&
            form.evolution_chain.length > 0,
        ) && (
          <div className="mt-16 pt-8">
            <h5 className="text-sm font-bold text-white mb-4 text-center">
              - GALARIAN FORM -
            </h5>
            {pokemon.forms
              .filter(
                (form) =>
                  form.name === "Galarian" &&
                  form.evolution_chain &&
                  form.evolution_chain.length > 0,
              )
              .map((form, formIndex: number) => (
                <div key={formIndex} className="mb-6">
                  <div className="flex flex-wrap justify-center gap-6">
                    {form.evolution_chain?.map((chain, chainIndex: number) => {
                      // Handle no_evolve case (single Pokemon)
                      if (chain.no_evolve) {
                        const noEvolvePokemon = chain.no_evolve;
                        return (
                          <div
                            key={chainIndex}
                            className="flex items-center gap-2"
                          >
                            <button
                              onClick={() =>
                                handlePokemonClick(noEvolvePokemon.id)
                              }
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

                      // Handle regular evolution chain (from -> to)
                      // For Galarian forms, we need to find the Galarian form image for both from and to Pokemon

                      // Helper function to get Galarian form image for any Pokemon
                      const getGalarianFormImage = (pokemonId: number) => {
                        try {
                          const pokemonWithGalarianForm = state.allPokemon.find(
                            (p) =>
                              p.id === pokemonId &&
                              p.forms &&
                              p.forms.some((f) => f.name === "Galarian"),
                          );

                          if (
                            pokemonWithGalarianForm &&
                            pokemonWithGalarianForm.forms
                          ) {
                            const galarianForm =
                              pokemonWithGalarianForm.forms.find(
                                (f) => f.name === "Galarian",
                              );
                            if (galarianForm && galarianForm.imageUrl) {
                              return galarianForm.imageUrl;
                            }
                          }
                        } catch {
                          // Fallback to regular image if Galarian form not found
                        }
                        return getPokemonImageUrl(pokemonId);
                      };

                      // Use Galarian form images for both from and to Pokemon
                      const fromPokemon = chain.from;
                      const toPokemon = chain.to;
                      const fromImageUrl = fromPokemon
                        ? getGalarianFormImage(parseInt(fromPokemon.id))
                        : "";
                      const toImageUrl = toPokemon
                        ? getGalarianFormImage(parseInt(toPokemon.id))
                        : "";

                      return (
                        <div
                          key={chainIndex}
                          className="flex items-center gap-2"
                        >
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
                            <span className="text-2xl text-white font-bold">
                              →
                            </span>
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
        )}

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
