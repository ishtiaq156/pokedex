import { Pokemon } from "../types/pokemon";
import Image from "next/image";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-2 flex flex-col items-center">
      <div className="w-16 h-16 mb-1 flex items-center justify-center relative">
        <Image
          src={pokemon.imageUrl}
          alt={pokemon.name}
          width={64}
          height={64}
          className="object-contain"
          onError={(e) => {
            // Fallback for missing images
            const target = e.target as HTMLImageElement;
            target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMzNi40MTgzIDIwIDQwIDIzLjU4MTcgNDAgMjhDNDAgMzIuNDE4MyAzNi40MTgzIDM2IDMyIDM2QzI3LjU4MTcgMzYgMjQgMzIuNDE4MyAyNCAyOEMyNCAyMy41ODE3IDI3LjU4MTcgMjAgMzIgMjBaIiBmaWxsPSIjOUI5QkE1Ii8+CjxwYXRoIGQ9Ik0zMiA0MEMzNi40MTgzIDQwIDQwIDQzLjU4MTcgNDAgNDhDNDAgNTIuNDE4MyAzNi40MTgzIDU2IDMyIDU2QzI3LjU4MTcgNTYgMjQgNTIuNDE4MyAyNCA0OEMyNCA0My41ODE3IDI3LjU4MTcgNDAgMzIgNDBaIiBmaWxsPSIjOUI5QkE1Ii8+Cjwvc3ZnPgo=";
          }}
        />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-gray-700">
          {pokemon.dexNumber}
        </p>
      </div>
    </div>
  );
}
