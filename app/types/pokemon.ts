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
  backgroundImage: string;
}

export const REGIONS: Region[] = [
  {
    id: "kanto",
    name: "Kanto",
    startDex: 1,
    endDex: 151,
    backgroundImage: "/kanto_starters.png",
  },
  {
    id: "johto",
    name: "Johto",
    startDex: 152,
    endDex: 251,
    backgroundImage: "/jhoto_starters.png",
  },
  {
    id: "hoenn",
    name: "Hoenn",
    startDex: 252,
    endDex: 386,
    backgroundImage: "/hoenn_starters.png",
  },
  {
    id: "sinnoh",
    name: "Sinnoh",
    startDex: 387,
    endDex: 493,
    backgroundImage: "/sinnoh_starters.png",
  },
  {
    id: "unova",
    name: "Unova",
    startDex: 494,
    endDex: 649,
    backgroundImage: "/unova_starters.png",
  },
  {
    id: "kalos",
    name: "Kalos",
    startDex: 650,
    endDex: 721,
    backgroundImage: "/kalos_starters.png",
  },
  {
    id: "alola",
    name: "Alola",
    startDex: 722,
    endDex: 807,
    backgroundImage: "/alola_starters.png",
  },
  {
    id: "galar",
    name: "Galar",
    startDex: 810,
    endDex: 898,
    backgroundImage: "/galar_starters.png",
  },
  {
    id: "hisui",
    name: "Hisui",
    startDex: 899,
    endDex: 905,
    backgroundImage: "/hisui_starters.png",
  },
  {
    id: "paldea",
    name: "Paldea",
    startDex: 906,
    endDex: 1025,
    backgroundImage: "/paldea_starters.png",
  },
  {
    id: "unidentified",
    name: "Unidentified",
    startDex: 808,
    endDex: 809,
    backgroundImage: "/unidentified_meltan.png",
  },
];

const POKEMON_FORM_EXCEPTIONS: Record<number, string> = {
  201: "pokemon_icon_201_16.png", // Unown - '?' form
  327: "pokemon_icon_327_00.png", // Spinda - default form
};

export function generatePokemonData(
  startDex: number,
  endDex: number,
): Pokemon[] {
  const pokemon: Pokemon[] = [];

  for (let i = startDex; i <= endDex; i++) {
    const dexNumber = i.toString().padStart(4, "0");

    // Check if this Pokemon has a form exception
    const imageUrl = POKEMON_FORM_EXCEPTIONS[i]
      ? `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/${POKEMON_FORM_EXCEPTIONS[i]}`
      : `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm${i}.icon.png`;

    pokemon.push({
      id: i,
      name: `Pokemon ${i}`, // We'll need to add actual names later
      imageUrl,
      dexNumber,
    });
  }

  return pokemon;
}
