export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  dexNumber: string;
  isReleased: boolean;
}

export interface Region {
  id: string;
  name: string;
  startDex: number;
  endDex: number;
  backgroundImage: string;
}

export interface RegionProgress {
  total: number;
  released: number;
  unreleased: number;
  percentage: number;
}

export interface EvolutionNode {
  id: string;
  name: string;
}

export interface EvolutionChain {
  from: EvolutionNode;
  to: EvolutionNode;
  requirements: string[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  description: string;
  evolution_chain: EvolutionChain[];
}

export const REGIONS: Region[] = [
  {
    id: "kanto",
    name: "Kanto",
    startDex: 1,
    endDex: 151,
    backgroundImage: "/pokedex/starters/kanto.png",
  },
  {
    id: "johto",
    name: "Johto",
    startDex: 152,
    endDex: 251,
    backgroundImage: "/pokedex/starters/johto.png",
  },
  {
    id: "hoenn",
    name: "Hoenn",
    startDex: 252,
    endDex: 386,
    backgroundImage: "/pokedex/starters/hoenn.png",
  },
  {
    id: "sinnoh",
    name: "Sinnoh",
    startDex: 387,
    endDex: 493,
    backgroundImage: "/pokedex/starters/sinnoh.png",
  },
  {
    id: "unova",
    name: "Unova",
    startDex: 494,
    endDex: 649,
    backgroundImage: "/pokedex/starters/unova.png",
  },
  {
    id: "kalos",
    name: "Kalos",
    startDex: 650,
    endDex: 721,
    backgroundImage: "/pokedex/starters/kalos.png",
  },
  {
    id: "alola",
    name: "Alola",
    startDex: 722,
    endDex: 807,
    backgroundImage: "/pokedex/starters/alola.png",
  },
  {
    id: "galar",
    name: "Galar",
    startDex: 810,
    endDex: 898,
    backgroundImage: "/pokedex/starters/galar.png",
  },
  {
    id: "hisui",
    name: "Hisui",
    startDex: 899,
    endDex: 905,
    backgroundImage: "/pokedex/starters/hisui.png",
  },
  {
    id: "paldea",
    name: "Paldea",
    startDex: 906,
    endDex: 1025,
    backgroundImage: "/pokedex/starters/paldea.png",
  },
  {
    id: "unidentified",
    name: "Unidentified",
    startDex: 808,
    endDex: 809,
    backgroundImage: "/pokedex/starters/unidentified.png",
  },
];

// Type 1: Pokemon that use root directory with pokemon_icon_XXX_YY.png format
const POKEMON_ROOT_EXCEPTIONS: Record<number, string> = {
  201: "pokemon_icon_201_16.png", // Unown - 'F' form
  327: "pokemon_icon_327_00.png", // Spinda - default form
  412: "pokemon_icon_412_11.png", // Burmy - Plant Cloak
  413: "pokemon_icon_413_11.png", // Wormadam - Plant Cloak
  421: "pokemon_icon_421_11.png", // Cherrim - Overcast Form
  422: "pokemon_icon_422_11.png", // Shellos - West Sea
  423: "pokemon_icon_423_11.png", // Gastrodon - West Sea
  550: "pokemon_icon_550_11.png", // Basculin - Red-Striped
  555: "pokemon_icon_555_11.png", // Darmanitan - Standard Mode
  585: "pokemon_icon_585_11.png", // Deerling - Spring Form
  586: "pokemon_icon_586_11.png", // Sawsbuck - Spring Form
  641: "pokemon_icon_641_11.png", // Tornadus - Incarnate Form
  642: "pokemon_icon_642_11.png", // Thundurus - Incarnate Form
  645: "pokemon_icon_645_11.png", // Landorus - Incarnate Form
  646: "pokemon_icon_646_11.png", // Kyurem - Normal Form
  647: "pokemon_icon_647_11.png", // Keldeo - Ordinary Form
  649: "pokemon_icon_649_11.png", // Genesect - Normal Drive
};

// Unreleased Pokemon in Pokemon GO (as of current date)
// This list should be updated as new Pokemon are released
export const UNRELEASED_POKEMON: Set<number> = new Set([
  // Sinnoh region unreleased
  489, // Phione
  490, // Manaphy
  493, // Arceus

  // Alola region unreleased
  746, // Wishiwashi
  771, // Pyukumuku
  772, // Type: Null
  773, // Silvally
  774, // Minior
  778, // Mimikyu
  801, // Magearna
  807, // Zeraora

  // Hisui region unreleased
  902, // Basculegion

  // Galar region unreleased
  824, // Blipbug
  825, // Dottler
  826, // Orbeetle
  833, // Chewtle
  834, // Drednaw
  837, // Rolycoly
  838, // Carkol
  839, // Coalossal
  843, // Silicobra
  844, // Sandaconda
  845, // Cramorant
  846, // Arrokuda
  847, // Barraskewda
  852, // Clobbopus
  853, // Grapploct
  859, // Impidimp
  860, // Morgrem
  861, // Grimmsnarl
  868, // Milcery
  869, // Alcremie
  871, // Pincurchin
  875, // Eiscue
  878, // Cufant
  879, // Copperajah
  880, // Dracozolt
  881, // Arctozolt
  882, // Dracovish
  883, // Arctovish
  896, // Glastrier
  897, // Spectrier
  898, // Calyrex

  // Paldea region unreleased
  917, // Tarountula
  918, // Spidops
  931, // Squawkabilly
  932, // Nacli
  933, // Naclstack
  934, // Garganacl
  940, // Wattrel
  941, // Kilowattrel
  942, // Maschiff
  943, // Mabosstiff
  946, // Bramblin
  947, // Brambleghast
  950, // Klawf
  951, // Capsakid
  952, // Scovillain
  953, // Rellor
  954, // Rabsca
  955, // Flittle
  956, // Espathra
  963, // Finizen
  964, // Palafin
  967, // Cyclizar
  968, // Orthworm
  969, // Glimmet
  970, // Glimmora
  973, // Flamigo
  976, // Veluza
  981, // Farigiraf
  984, // Great Tusk
  985, // Scream Tail
  986, // Brute Bonnet
  987, // Flutter Mane
  988, // Slither Wing
  989, // Sandy Shocks
  990, // Iron Treads
  991, // Iron Bundle
  992, // Iron Hands
  993, // Iron Jugulis
  994, // Iron Moth
  995, // Iron Thorns
  1001, // Wo-Chien
  1002, // Chien-Pao
  1003, // Ting-Lu
  1004, // Chi-Yu
  1005, // Roaring Moon
  1006, // Iron Valiant
  1007, // Koraidon
  1008, // Miraidon
  1009, // Walking Wake
  1010, // Iron Leaves
  1012, // Poltchageist
  1013, // Sinistcha
  1014, // Okidogi
  1015, // Munkidori
  1016, // Fezandipiti
  1017, // Ogerpon
  1018, // Archaludon
  1020, // Gouging Fire
  1021, // Raging Bolt
  1022, // Iron Boulder
  1023, // Iron Crown
  1024, // Terapagos
  1025, // Pecharunt
]);

// Type 2: Pokemon that use Addressable Assets directory with pmXXX.fFORMNAME.icon.png format
const POKEMON_ADDRESSABLE_EXCEPTIONS: Record<number, string> = {
  487: "pm487.fALTERED.icon.png", // Giratina - Altered Form
  666: "pm666.fARCHIPELAGO.icon.png", // Vivillon - Archipelago pattern
  669: "pm669.fRED.icon.png", // Flabébé - Red Flower
  670: "pm670.fRED.icon.png", // Floette - Red Flower
  671: "pm671.fRED.icon.png", // Florges - Red Flower
  676: "pm676.fNATURAL.icon.png", // Furfrou - Natural Form
  681: "pm681.fSHIELD.icon.png", // Aegislash - Shield Forme
  718: "pm718.fCOMPLETE_TEN_PERCENT.icon.png", // Zygarde - 10% Form
  741: "pm741.fBAILE.icon.png", // Oricorio - Baile Style
  745: "pm745.fMIDDAY.icon.png", // Lycanroc - Midday Form
  849: "pm849.fLOW_KEY.icon.png", // Toxtricity - Low Key Form
  876: "pm876.fMALE.icon.png", // Indeedee - Male
  905: "pm905.fINCARNATE.icon.png", // Enamorus - Incarnate Form
  925: "pm925.fFAMILY_OF_FOUR.icon.png", // Maushold - Family of Four
  978: "pm978.fCURLY.icon.png", // Tatsugiri - Curly Form
  982: "pm982.fTWO.icon.png", // Dudunsparce - Two-Segment Form
};

export function getPokemonImageUrl(pokemonId: number): string {
  // Check if this Pokemon has a form exception
  if (POKEMON_ROOT_EXCEPTIONS[pokemonId]) {
    // Type 1: Root directory exceptions
    return `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/${POKEMON_ROOT_EXCEPTIONS[pokemonId]}`;
  } else if (POKEMON_ADDRESSABLE_EXCEPTIONS[pokemonId]) {
    // Type 2: Addressable Assets directory exceptions
    return `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/${POKEMON_ADDRESSABLE_EXCEPTIONS[pokemonId]}`;
  } else {
    // Default: Standard Addressable Assets format
    return `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm${pokemonId}.icon.png`;
  }
}

export function generatePokemonData(
  startDex: number,
  endDex: number,
): Pokemon[] {
  const pokemon: Pokemon[] = [];

  for (let i = startDex; i <= endDex; i++) {
    const dexNumber = i.toString().padStart(4, "0");

    pokemon.push({
      id: i,
      name: `Pokemon ${i}`, // We'll need to add actual names later
      imageUrl: getPokemonImageUrl(i),
      dexNumber,
      isReleased: !UNRELEASED_POKEMON.has(i),
    });
  }

  return pokemon;
}

// Calculate region progress based on released Pokemon
export function getRegionProgress(
  startDex: number,
  endDex: number,
): RegionProgress {
  const total = endDex - startDex + 1;
  let unreleased = 0;

  for (let i = startDex; i <= endDex; i++) {
    if (UNRELEASED_POKEMON.has(i)) {
      unreleased++;
    }
  }

  const released = total - unreleased;
  const percentage = Math.round((released / total) * 100);

  return {
    total,
    released,
    unreleased,
    percentage,
  };
}
