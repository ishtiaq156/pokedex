import React from "react";
import Image from "next/image";
import { getPokemonImageUrl, PokemonDetail } from "../../types/pokemon";

interface PokemonFormsProps {
  pokemon: PokemonDetail;
  selectedFormIndex: number;
  setSelectedFormIndex: (index: number) => void;
}

export default function PokemonForms({
  pokemon,
  selectedFormIndex,
  setSelectedFormIndex,
}: PokemonFormsProps) {
  if (!pokemon.forms || pokemon.forms.length === 0) return null;

  const getFontSizeClass = (name: string) => {
    if (name.length <= 6) return "text-xs";
    if (name.length <= 10) return "text-[10px]";
    return "text-[8px]";
  };

  const allForms = [null, ...pokemon.forms]; // null represents default form
  const rows = [];
  for (let i = 0; i < allForms.length; i += 5) {
    rows.push(allForms.slice(i, i + 5));
  }

  return (
    <div className="flex justify-center mb-6 px-6">
      <div className="flex flex-col gap-2 max-w-xs">
        {rows.map((row, rowIndex) => (
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
                    <span
                      className={`${getFontSizeClass(
                        form.name,
                      )} text-white font-semibold mt-1 text-center leading-tight max-w-12`}
                    >
                      {form.name.toUpperCase()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
