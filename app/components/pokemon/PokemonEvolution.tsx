import React from "react";
import Image from "next/image";
import { getPokemonImageUrl } from "../../types/pokemon";

interface PokemonEvolutionProps {
  evolutionFamily: { id: string; name: string }[][];
  handlePokemonClick: (pokemonId: string) => void;
}

export default function PokemonEvolution({
  evolutionFamily,
  handlePokemonClick,
}: PokemonEvolutionProps) {
  if (!evolutionFamily || evolutionFamily.length === 0) return null;

  return (
    <div>
      <hr className="border-t border-white opacity-45 mb-4" />
      <h4 className="text-lg font-bold text-white mb-3 text-center">
        EVOLUTION
      </h4>
      <div className="space-y-4">
        {evolutionFamily.map((chain, chainIndex) => (
          <div key={chainIndex} className="flex items-center justify-center">
            {chain.length === 2 ? (
              <>
                <div className="flex items-center">
                  <button
                    onClick={() => handlePokemonClick(chain[0].id)}
                    className="text-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="w-24 h-24 mb-0">
                      <Image
                        src={getPokemonImageUrl(parseInt(chain[0].id))}
                        alt={chain[0].name}
                        width={96}
                        height={96}
                        className="object-contain mx-auto"
                      />
                    </div>
                    <p className="text-xs font-semibold text-white uppercase text-center">
                      {chain[0].name}
                    </p>
                  </button>
                </div>
                <span className="text-2xl text-white font-bold mx-8">⟶</span>
                <div className="flex items-center">
                  <button
                    onClick={() => handlePokemonClick(chain[1].id)}
                    className="text-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="w-24 h-24 mb-0">
                      <Image
                        src={getPokemonImageUrl(parseInt(chain[1].id))}
                        alt={chain[1].name}
                        width={96}
                        height={96}
                        className="object-contain mx-auto"
                      />
                    </div>
                    <p className="text-xs font-semibold text-white uppercase text-center">
                      {chain[1].name}
                    </p>
                  </button>
                </div>
              </>
            ) : (
              chain.map((evo, index) => {
                const evoImageUrl = getPokemonImageUrl(parseInt(evo.id));

                return (
                  <div key={evo.id} className="flex items-center gap-2">
                    <button
                      onClick={() => handlePokemonClick(evo.id)}
                      className="text-center cursor-pointer hover:scale-105 transition-transform"
                    >
                      <div className="w-24 h-24 mb-0">
                        <Image
                          src={evoImageUrl}
                          alt={evo.name}
                          width={96}
                          height={96}
                          className="object-contain mx-auto"
                        />
                      </div>
                      <p className="text-xs font-semibold text-white uppercase text-center">
                        {evo.name}
                      </p>
                    </button>
                    {index < chain.length - 1 && (
                      <span className="text-2xl text-white font-bold">→</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
