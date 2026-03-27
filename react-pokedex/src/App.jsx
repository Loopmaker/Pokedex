import { useEffect, useRef } from "react";
import SearchBar from "./components/SeachBar.jsx";
import TypeBadges from "./components/TypeBadges.jsx";
import StatBars from "./components/StatBars.jsx";
import Forms from "./components/Forms.jsx";
import EvolutionChain from "./components/EvolutionChain.jsx";
import LoadingOverlay from "./components/LoadingOverlay.jsx";
import { usePokemon } from "./hooks/usePokemon.js";

const App = () => {
  const {
    pokemon, speciesId, forms, baseName, activeForm,
    evoTree, evoSprites, loading, error,
    search, loadForm,
  } = usePokemon();

  const flashRef = useRef(null);

  // Flash on new Pokémon load
  useEffect(() => {
    if (!pokemon || !flashRef.current) return;
    const el = flashRef.current;
    el.style.opacity = 1;
    setTimeout(() => { el.style.opacity = 0; }, 100);
  }, [pokemon]);

  const weightKg = pokemon ? (pokemon.weight / 10).toFixed(1) : null;
  const heightM  = pokemon ? (pokemon.height / 10).toFixed(1) : null;

  return (
    <>
      <div className="container">
        <h1 className="title">POKÉDEX</h1>

        <SearchBar onSearch={search} />

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <div className="pokedex-screen">
          <LoadingOverlay visible={loading} />

          <h2 id="pokemon-name">
            {pokemon ? pokemon.name.toUpperCase() : "No Pokémon yet!"}
          </h2>

          {pokemon && (
            <>
              <img
                id="sprite"
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
              />

              <p className="stat">ID: <span>{speciesId ?? pokemon.id}</span></p>
              <p>Weight: {weightKg} kg</p>
              <p>Height: {heightM} m</p>

              <TypeBadges types={pokemon.types} />

              <Forms
                varieties={forms}
                baseName={baseName}
                activeForm={activeForm}
                onSelectForm={loadForm}
                speciesId={speciesId}
              />

              <StatBars stats={pokemon.stats} />

              <EvolutionChain
                tree={evoTree}
                sprites={evoSprites}
                currentName={activeForm || pokemon.name}
                onSelect={search}
              />
            </>
          )}
        </div>
      </div>

      <div ref={flashRef} id="flash" />
    </>
  );
};

export default App;
