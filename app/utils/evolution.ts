import { PokemonDetail } from "../types/pokemon";

export function getEvolutionFamily(
  pokemon: PokemonDetail,
  allPokemon: PokemonDetail[],
) {
  if (!pokemon) return [];

  // Get all Pokémon IDs in the evolution chain
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
}
