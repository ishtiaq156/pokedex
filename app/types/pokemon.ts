export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  dexNumber: string;
}

export interface Region {
  id: string;
  name: string;
  startDex: number;
  endDex: number;
  color: string;
}

export const REGIONS: Region[] = [
  {
    id: "kanto",
    name: "Kanto",
    startDex: 1,
    endDex: 151,
    color: "bg-red-500",
  },
  {
    id: "johto",
    name: "Johto",
    startDex: 152,
    endDex: 251,
    color: "bg-blue-500",
  },
  {
    id: "hoenn",
    name: "Hoenn",
    startDex: 252,
    endDex: 386,
    color: "bg-green-500",
  },
  {
    id: "sinnoh",
    name: "Sinnoh",
    startDex: 387,
    endDex: 493,
    color: "bg-purple-500",
  },
];

export function generatePokemonData(
  startDex: number,
  endDex: number,
): Pokemon[] {
  const pokemon: Pokemon[] = [];

  for (let i = startDex; i <= endDex; i++) {
    const dexNumber = i.toString().padStart(4, "0");
    const imageUrl = `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm${i}.icon.png`;

    pokemon.push({
      id: i,
      name: `Pokemon ${i}`, // We'll need to add actual names later
      imageUrl,
      dexNumber,
    });
  }

  return pokemon;
}
