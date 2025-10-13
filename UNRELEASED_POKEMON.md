# Unreleased Pokémon Management

This document explains how to manage unreleased Pokémon in the Pokédex app.

## Current Unreleased Pokémon

As of the current implementation, the following Pokémon are marked as unreleased in Pokémon GO:

### Sinnoh Region

- **#489 - Phione**
- **#490 - Manaphy**
- **#493 - Arceus**

## How to Update

When Pokémon are released or new unreleased Pokémon are identified, update the `UNRELEASED_POKEMON` set in `/app/types/pokemon.ts`:

```typescript
export const UNRELEASED_POKEMON: Set<number> = new Set([
  // Sinnoh region unreleased
  489, // Phione
  490, // Manaphy
  493, // Arceus

  // Add new unreleased Pokemon here
  // Example:
  // 1026, // New Pokemon Name
]);
```

## Features Implemented

### 1. Visual Indicators on Pokémon Cards

- **Grayscale filter**: Unreleased Pokémon appear in grayscale
- **Reduced opacity**: Cards have 50% opacity
- **TBA badge**: Red badge in top-right corner showing "TBA" (To Be Announced)

### 2. Region Progress Bar

- Shows on region cards when there are unreleased Pokémon
- Displays: `X/Y Released (Z%)`
- Green progress bar indicates completion percentage

### 3. Updated Header Count

- Main page header shows: `RELEASED: X/1025`
- Dynamically calculates based on unreleased count

## Data Structure

### Pokemon Interface

```typescript
export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  dexNumber: string;
  isReleased: boolean; // NEW: Tracks release status
}
```

### RegionProgress Interface

```typescript
export interface RegionProgress {
  total: number; // Total Pokémon in region
  released: number; // Released Pokémon count
  unreleased: number; // Unreleased Pokémon count
  percentage: number; // Release percentage (0-100)
}
```

## Helper Functions

### `getRegionProgress(startDex: number, endDex: number): RegionProgress`

Calculates release statistics for a given region based on dex number range.

## Maintenance Tips

1. **Regular Updates**: Check Pokémon GO releases and update the `UNRELEASED_POKEMON` set accordingly
2. **Remove Released**: When a Pokémon is released, simply remove its number from the set
3. **Add New**: When new Pokémon are added to the game files but not released, add them to the set
4. **Comments**: Always add comments with the Pokémon name for easier management

## Example Update Workflow

When Phione (#489) is released:

1. Open `/app/types/pokemon.ts`
2. Find the `UNRELEASED_POKEMON` set
3. Remove the line: `489, // Phione`
4. Save the file
5. The app will automatically update all displays
