"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  Pokemon,
  PokemonDetail,
  Region,
  UNRELEASED_POKEMON,
} from "../types/pokemon";
import { imagePreloader } from "../utils/imagePreloader";

// App state interface
interface AppState {
  currentView: "home" | "region" | "pokemon";
  currentRegion: Region | null;
  currentPokemon: PokemonDetail | null;
  allPokemon: PokemonDetail[];
  allPokemonBasic: Pokemon[];
  loading: boolean;
  loadingProgress: number;
  error: string | null;
}

// Action types
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_LOADING_PROGRESS"; payload: number }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ALL_POKEMON"; payload: PokemonDetail[] }
  | { type: "SET_ALL_POKEMON_BASIC"; payload: Pokemon[] }
  | { type: "NAVIGATE_TO_REGION"; payload: Region }
  | { type: "NAVIGATE_TO_POKEMON"; payload: PokemonDetail }
  | { type: "NAVIGATE_TO_HOME" }
  | { type: "NAVIGATE_TO_PREVIOUS_POKEMON" }
  | { type: "NAVIGATE_TO_NEXT_POKEMON" };

// Initial state
const initialState: AppState = {
  currentView: "home",
  currentRegion: null,
  currentPokemon: null,
  allPokemon: [],
  allPokemonBasic: [],
  loading: true,
  loadingProgress: 0,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_LOADING_PROGRESS":
      return { ...state, loadingProgress: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_ALL_POKEMON":
      return { ...state, allPokemon: action.payload, loading: false };

    case "SET_ALL_POKEMON_BASIC":
      return { ...state, allPokemonBasic: action.payload };

    case "NAVIGATE_TO_REGION":
      return {
        ...state,
        currentView: "region",
        currentRegion: action.payload,
        currentPokemon: null,
      };

    case "NAVIGATE_TO_POKEMON":
      return {
        ...state,
        currentView: "pokemon",
        currentPokemon: action.payload,
      };

    case "NAVIGATE_TO_HOME":
      return {
        ...state,
        currentView: "home",
        currentRegion: null,
        currentPokemon: null,
      };

    case "NAVIGATE_TO_PREVIOUS_POKEMON": {
      if (!state.currentPokemon || state.allPokemon.length === 0) return state;

      const currentPokemon = state.currentPokemon;
      const currentIndex = state.allPokemon.findIndex(
        (p) => p.id === currentPokemon.id,
      );
      if (currentIndex > 0) {
        const prevPokemon = state.allPokemon[currentIndex - 1];
        return {
          ...state,
          currentPokemon: prevPokemon,
        };
      }
      return state;
    }

    case "NAVIGATE_TO_NEXT_POKEMON": {
      if (!state.currentPokemon || state.allPokemon.length === 0) return state;

      const currentPokemon = state.currentPokemon;
      const nextIndex = state.allPokemon.findIndex(
        (p) => p.id === currentPokemon.id,
      );
      if (nextIndex < state.allPokemon.length - 1) {
        const nextPokemon = state.allPokemon[nextIndex + 1];
        return {
          ...state,
          currentPokemon: nextPokemon,
        };
      }
      return state;
    }

    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load all Pokemon data on app start
  useEffect(() => {
    const loadAllData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_LOADING_PROGRESS", payload: 10 });

        // Try to load Pokemon details with offline fallback
        let pokemonDetails: PokemonDetail[] = [];
        try {
          const response = await fetch("/data/pokemon-details.json");
          if (!response.ok) throw new Error("Failed to load Pokemon data");
          pokemonDetails = await response.json();
        } catch {
          // Try to load from cache if network fails
          const cache = await caches.open("pokemon-data-v2");
          const cachedResponse = await cache.match(
            "/data/pokemon-details.json",
          );
          if (cachedResponse) {
            pokemonDetails = await cachedResponse.json();
          } else {
            throw new Error("No cached data available");
          }
        }

        dispatch({ type: "SET_ALL_POKEMON", payload: pokemonDetails });
        dispatch({ type: "SET_LOADING_PROGRESS", payload: 30 });

        // Generate basic Pokemon data for regions
        const allBasicPokemon: Pokemon[] = [];
        for (let i = 1; i <= 1025; i++) {
          allBasicPokemon.push({
            id: i,
            name: `Pokemon ${i}`, // Will be updated with real names from details
            imageUrl: `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm${i}.icon.png`,
            dexNumber: i.toString().padStart(4, "0"),
            isReleased: !UNRELEASED_POKEMON.has(i),
          });
        }

        dispatch({ type: "SET_LOADING_PROGRESS", payload: 50 });

        // Update names from details
        pokemonDetails.forEach((detail) => {
          const basicPokemon = allBasicPokemon.find((p) => p.id === detail.id);
          if (basicPokemon) {
            basicPokemon.name = detail.name;
          }
        });

        dispatch({ type: "SET_ALL_POKEMON_BASIC", payload: allBasicPokemon });
        dispatch({ type: "SET_LOADING_PROGRESS", payload: 70 });

        // Preload images in the background (don't wait for this)
        const imageUrls = allBasicPokemon.map((p) => p.imageUrl);
        imagePreloader.preloadImages(imageUrls).catch(console.warn);

        dispatch({ type: "SET_LOADING_PROGRESS", payload: 100 });
        dispatch({ type: "SET_LOADING", payload: false });
      } catch (error) {
        console.error("Failed to load Pokemon data:", error);
        dispatch({
          type: "SET_ERROR",
          payload:
            "Failed to load Pokemon data. Please check your internet connection.",
        });
      }
    };

    loadAllData();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
