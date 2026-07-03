"use client";

import React, { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { getPokemonImageUrl, PokemonDetail } from "../../types/pokemon";
import Image from "next/image";
import ScanningAnimation from "../ScanningAnimation";
import { soundManager } from "../../utils/sound";
import { getEvolutionFamily } from "../../utils/evolution";
import PokemonHeader from "../pokemon/PokemonHeader";
import PokemonForms from "../pokemon/PokemonForms";
import PokemonInfo from "../pokemon/PokemonInfo";
import PokemonEvolution from "../pokemon/PokemonEvolution";
import PokemonAlternateForms from "../pokemon/PokemonAlternateForms";

interface PokemonDetailViewProps {
  pokemon: PokemonDetail;
}

export default function PokemonDetailView({ pokemon }: PokemonDetailViewProps) {
  const { dispatch, state } = useApp();
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [selectedFormIndex, setSelectedFormIndex] = useState<number>(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      navigateToNext();
    } else if (isRightSwipe) {
      navigateToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const navigateToNext = () => {
    if (state.allPokemon.length === 0) return;
    soundManager.markUserInteraction();
    dispatch({ type: "NAVIGATE_TO_NEXT_POKEMON" });
  };

  const navigateToPrevious = () => {
    if (state.allPokemon.length === 0) return;
    soundManager.markUserInteraction();
    dispatch({ type: "NAVIGATE_TO_PREVIOUS_POKEMON" });
  };

  const handleBackClick = () => {
    soundManager.playCancelSound();
    dispatch({ type: "NAVIGATE_TO_REGION", payload: state.currentRegion! });
  };

  const handlePokemonClick = (pokemonId: string) => {
    soundManager.markUserInteraction();
    const detailedPokemon = state.allPokemon.find(
      (p) => p.id.toString() === pokemonId,
    );
    if (detailedPokemon) {
      dispatch({ type: "NAVIGATE_TO_POKEMON", payload: detailedPokemon });
    }
  };

  const evolutionFamily = getEvolutionFamily(pokemon, state.allPokemon);
  const dexNumber = pokemon.id.toString().padStart(4, "0");

  // Get current form data
  const getCurrentFormData = () => {
    if (!pokemon) return null;
    if (
      !pokemon.forms ||
      pokemon.forms.length === 0 ||
      selectedFormIndex === 0
    ) {
      return {
        name: pokemon.name,
        types: pokemon.types,
        description: pokemon.description,
        imageUrl: getPokemonImageUrl(pokemon.id),
        category: pokemon.category,
      };
    }
    const selectedForm = pokemon.forms[selectedFormIndex - 1]; // -1 because index 0 is default, 1 is first form
    return {
      name: pokemon.name, // Always use base Pokemon name for main display
      types: selectedForm.types,
      description: selectedForm.description,
      imageUrl: selectedForm.imageUrl,
      category: selectedForm.category || pokemon.category,
    };
  };

  const currentFormData = getCurrentFormData();

  const handlePlayCry = () => {
    const fallbackCryUrl = `https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Sounds/Pokemon%20Cries/Addressable%20Assets/pm${pokemon.id}.cry.wav`;
    const cryUrl = pokemon.cry || fallbackCryUrl;
    soundManager.playPokemonCry(cryUrl);
  };

  return (
    <div
      className="min-h-screen pb-24 no-select smooth-scroll"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-md mx-auto">
        {/* Header with Pokemon Image */}
        <PokemonHeader
          pokemon={pokemon}
          currentFormData={currentFormData}
          dexNumber={dexNumber}
          handlePlayCry={handlePlayCry}
        />

        {/* Form Selector */}
        <PokemonForms
          pokemon={pokemon}
          selectedFormIndex={selectedFormIndex}
          setSelectedFormIndex={setSelectedFormIndex}
        />

        {/* Info Section */}
        <div className="p-6 min-h-[50vh]">
          <PokemonInfo pokemon={pokemon} currentFormData={currentFormData} />

          {/* Evolution Section */}
          {(evolutionFamily.length > 0 ||
            (pokemon.forms && pokemon.forms.length > 0) ||
            (pokemon.mega && pokemon.mega.length > 0) ||
            (pokemon.primal && pokemon.primal.length > 0) ||
            (pokemon.gigantamax && pokemon.gigantamax.length > 0)) && (
            <div>
              <PokemonEvolution
                evolutionFamily={evolutionFamily}
                handlePokemonClick={handlePokemonClick}
              />
              <PokemonAlternateForms
                pokemon={pokemon}
                handlePokemonClick={handlePokemonClick}
                failedImages={failedImages}
                setFailedImages={setFailedImages}
                allPokemon={state.allPokemon}
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating Close Button */}
      <button
        onClick={handleBackClick}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer"
        aria-label="Close and return to pokedex"
      >
        <Image
          src="/pokedex/close.png"
          alt="Close"
          width={64}
          height={64}
          className="w-16 h-16 drop-shadow-lg"
        />
      </button>

      {/* Desktop Navigation Arrows */}
      <button
        onClick={navigateToPrevious}
        className="hidden md:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center"
        aria-label="Previous Pokemon"
      >
        <span className="text-white text-2xl font-bold">‹</span>
      </button>

      <button
        onClick={navigateToNext}
        className="hidden md:flex fixed right-4 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full items-center justify-center"
        aria-label="Next Pokemon"
      >
        <span className="text-white text-2xl font-bold">›</span>
      </button>

      {/* Scanning Animation */}
      <ScanningAnimation />
    </div>
  );
}
