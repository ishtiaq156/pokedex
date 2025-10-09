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

// Type 2: Pokemon that use Addressable Assets directory with pmXXX.fFORMNAME.icon.png format
const POKEMON_ADDRESSABLE_EXCEPTIONS: Record<number, string> = {
  666: "pm666.fARCHIPELAGO.icon.png", // Vivillon - Archipelago pattern
  669: "pm669.fRED.icon.png", // Flabébé - Red Flower
  670: "pm670.fRED.icon.png", // Floette - Red Flower
  671: "pm671.fRED.icon.png", // Florges - Red Flower
  676: "pm676.fNATURAL.icon.png", // Furfrou - Natural Form
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

export function generatePokemonData(
  startDex: number,
  endDex: number,
): Pokemon[] {
  const pokemon: Pokemon[] = [];

  for (let i = startDex; i <= endDex; i++) {
    const dexNumber = i.toString().padStart(4, "0");

    // Check if this Pokemon has a form exception
    let imageUrl: string;

    if (POKEMON_ROOT_EXCEPTIONS[i]) {
      // Type 1: Root directory exceptions
      imageUrl = `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/${POKEMON_ROOT_EXCEPTIONS[i]}`;
    } else if (POKEMON_ADDRESSABLE_EXCEPTIONS[i]) {
      // Type 2: Addressable Assets directory exceptions
      imageUrl = `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/${POKEMON_ADDRESSABLE_EXCEPTIONS[i]}`;
    } else {
      // Default: Standard Addressable Assets format
      imageUrl = `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm${i}.icon.png`;
    }

    pokemon.push({
      id: i,
      name: `Pokemon ${i}`, // We'll need to add actual names later
      imageUrl,
      dexNumber,
    });
  }

  return pokemon;
}
